# Database Design (v3.2)

> **Audience:** Engineers extending the schema, writing migrations, or debugging data issues.
>
> **Scope:** Every table, RPC, and collection with relationships and design rationale.
>
> **Version:** This document reflects **v3.2.0** (Editorial redesign + PDF export + cron hardening).

---

## Table of Contents

- [Overview](#overview)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Supabase Tables](#supabase-tables)
- [Supabase RPCs](#supabase-rpcs)
- [Supabase Triggers](#supabase-triggers)
- [MongoDB Collections](#mongodb-collections)
- [Redis Keys](#redis-keys)
- [Migration Workflow](#migration-workflow)
- [Data Integrity Rules](#data-integrity-rules)
- [Index Strategy](#index-strategy)
- [Backup & Retention](#backup--retention)
- [What's New in v3.2](#whats-new-in-v32)
- [Further Reading](#further-reading)

---

## Overview

VESTIOR uses **two databases** with clearly separated responsibilities:

| Database | Owns | Access Pattern |
|----------|------|----------------|
| **Supabase (PostgreSQL)** | Products, orders, users, reviews, wishlists, coupons | ACID transactions, RLS, low-volume |
| **MongoDB Atlas** | Events, sessions, email logs, payments, audit, carts | Append-only, high-volume, analytics |

Plus **Upstash Redis** for ephemeral state (rate limits, idempotency, cache, cron throttles).

See [Architecture → Dual-Database Rationale](./architecture.md#dual-database-rationale) for why.

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    auth_users ||--o| profiles : "1:1"
    auth_users ||--o{ orders : "1:N"
    auth_users ||--o{ product_reviews : "1:N"
    auth_users ||--o{ wishlists : "1:N"
    auth_users ||--o{ coupon_redemptions : "1:N"
    products ||--o{ order_items : "1:N"
    products ||--o{ product_reviews : "1:N"
    products ||--o{ wishlists : "1:N"
    orders ||--o{ order_items : "1:N"
    orders ||--o{ coupon_redemptions : "1:1"
    coupons ||--o{ coupon_redemptions : "1:N"

    auth_users {
        uuid id PK
        text email
        timestamptz created_at
    }
    profiles {
        uuid id PK_FK
        text full_name
        text email
        text phone
        text role
        bool is_super_admin
        timestamptz last_login_at
        timestamptz welcome_back_sent_at
        text address_line1
        text city
        text state
        text pincode
    }
    products {
        uuid id PK
        text name
        text description
        numeric price
        numeric compare_at_price
        text category
        text category_main
        int4 stock
        bool is_active
        bool is_new_arrival
        bool is_featured
        text images
    }
    orders {
        uuid id PK
        uuid user_id FK
        text user_email
        jsonb items
        jsonb address
        int4 subtotal
        int4 shipping
        numeric discount_amount
        text coupon_code
        int4 total
        text status
        text payment_status
        text payment_method
        text payment_provider
        text payment_intent_id
        jsonb payment_metadata
        timestamptz paid_at
    }
    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        text product_name
        int4 quantity
        numeric price
    }
    product_reviews {
        uuid id PK
        uuid product_id FK
        uuid user_id FK
        text user_name
        int4 rating
        text title
        text comment
        text status
        bool is_verified_purchase
        int4 helpful_count
    }
    wishlists {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
    }
    coupons {
        uuid id PK
        text code
        text discount_type
        numeric discount_value
        numeric min_order_amount
        numeric max_discount_amount
        int4 usage_limit
        int4 per_user_limit
        int4 times_used
        timestamptz valid_from
        timestamptz valid_until
        bool is_active
    }
    coupon_redemptions {
        uuid id PK
        uuid coupon_id FK
        uuid user_id FK
        uuid order_id FK
        numeric discount_amount
    }
    _role_normalization_backup {
        uuid id PK
        text email
        text old_role
        text new_role
        timestamptz migrated_at
    }
```

---

## Supabase Tables

### `products`

Catalog of items for sale.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | |
| `description` | `text` | | |
| `price` | `numeric` | NOT NULL | In PKR |
| `compare_at_price` | `numeric` | | For discount display |
| `category` | `text` | | Sub-category ("Classic Fit") |
| `category_main` | `text` | | Main category ("Suits") |
| `stock` | `int4` | DEFAULT 0 | Decremented atomically on order |
| `is_active` | `bool` | DEFAULT true | Storefront visibility |
| `is_new_arrival` | `bool` | DEFAULT false | Badge |
| `is_featured` | `bool` | DEFAULT false | Homepage highlight |
| `images` | `text` | DEFAULT '[]' | JSON array of URLs |
| `created_at` | `timestamptz` | DEFAULT now() | |
| `updated_at` | `timestamptz` | DEFAULT now() | |

**RLS policies:**
- Anyone reads `is_active = true`
- Admins read all
- Admins insert/update/delete

**Indexes:**
- `idx_products_active_featured_created` — Partial: `WHERE is_active AND is_featured`, ORDER BY created_at DESC
- `idx_products_active_new_arrival_created` — Similar
- `idx_products_category_active_created` — For category pages
- `idx_products_active_created` — General listing
- `idx_products_name_trgm` — Trigram GIN for `ILIKE '%q%'` search
- `idx_products_active` — Admin filter

**Design notes:**
- `images` is `text` (JSON string) not `jsonb`. Historical reason — Postgres array literals `{...}` were used early on, and `parseProductImages` handles both. Migration to `jsonb` is on the roadmap but not urgent.
- No `avg_rating` column. Computed on demand via RPC.

---

### `orders`

Order headers. Denormalizes `user_email` for query speed.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id`, `ON DELETE CASCADE` |
| `user_email` | `text` | Denormalized for admin queries |
| `items` | `jsonb` | **Immutable snapshot** of items at order time |
| `address` | `jsonb` | **Immutable snapshot** of shipping address |
| `subtotal` | `int4` | |
| `shipping` | `int4` | |
| `discount_amount` | `numeric` | Coupon discount |
| `coupon_code` | `text` | Applied coupon code |
| `total` | `int4` | = subtotal + shipping − discount |
| `status` | `text` | `pending`/`processing`/`shipped`/`delivered`/`cancelled` |
| `payment_status` | `text` | `pending`/`completed`/`failed`/`refunded` |
| `payment_method` | `text` | `cod`/`stripe` (legacy) |
| `payment_provider` | `text` | `cod`/`stripe`/`paypal` (extensible) |
| `payment_intent_id` | `text` | Stripe PI ID |
| `payment_metadata` | `jsonb` | Full Stripe payload |
| `paid_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

**Why denormalize `user_email`?** Admin order list filters/sorts by email. Joining `profiles` for every row is slower.

**Why JSON `items` AND `order_items` table?** JSON is a snapshot (immutable); table is for querying/joins. Both serve different needs.

**Immutability guard:** A `BEFORE UPDATE` trigger (`trg_orders_snapshot_immutable`) prevents modification of `items` or `address` after INSERT. See [Supabase Triggers](#supabase-triggers).

**RLS policies:**
- Users read own orders (`user_id = auth.uid()`) OR admin
- Users insert own orders only
- Only admins update (status changes)
- Only admins delete

**Indexes:**
- `idx_orders_user_created` — For `/orders`
- `idx_orders_status_created` — For admin filter
- `idx_orders_created` — For admin sort
- `idx_orders_created_range` — For date-range queries
- `idx_orders_payment_provider` — For payments dashboard
- `idx_orders_payment_status` — Partial: `WHERE payment_status != 'completed'`

**v3.2 note:** No schema changes. The `order_placed` tracking event is now emitted on both COD and Stripe success paths (see `placeOrder` and `confirmPayment`), but this is a MongoDB event, not a schema change.

---

### `order_items`

Line items. Denormalizes product name + price at order time.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `order_id` | `uuid` | FK → `orders`, `ON DELETE CASCADE` |
| `product_id` | `uuid` | FK → `products` |
| `product_name` | `text` | Snapshot |
| `quantity` | `int4` | |
| `price` | `numeric` | Snapshot (price at order time) |
| `created_at` | `timestamptz` | |

**Why denormalize?** If a product's name or price changes later, historical orders must remain accurate.

**RLS policies:**
- Users read items for own orders OR admin
- Users insert items for own orders only
- Only admins update/delete

**Indexes:**
- `idx_order_items_order` — Join by order
- `idx_order_items_product` — Reverse lookup

**Realtime:** ✅ Enabled (v3.2 — for real-time item updates on the customer order detail page).

---

### `profiles`

Extends `auth.users` with app-specific fields.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, FK → `auth.users.id`, `ON DELETE CASCADE` |
| `full_name` | `text` | |
| `email` | `text` | UNIQUE, denormalized from `auth.users` |
| `phone` | `text` | |
| `role` | `text` | DEFAULT 'customer', CHECK `IN ('customer', 'admin')` |
| `is_super_admin` | `bool` | DEFAULT false — can change roles |
| `address_line1` | `text` | |
| `address_line2` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `pincode` | `text` | |
| `last_login_at` | `timestamptz` | Last successful login |
| `welcome_back_sent_at` | `timestamptz` | Throttle for welcome-back emails |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Auto-creation:** `handle_new_user()` trigger fires on `auth.users` INSERT.

**RLS policies:**
- Users read own profile OR admin
- Users insert own profile (trigger runs as service_role — bypasses)
- Users update own profile OR admin
- Only admins delete

**Indexes:**
- `idx_profiles_created` — Admin user list sort
- `idx_profiles_last_login` — Partial: `(last_login_at DESC NULLS LAST)` for inactivity queries

**Role normalization:** Legacy `role = 'user'` values are migrated to `'customer'` via `20261016_normalize_user_roles.sql`. A backup table (`_role_normalization_backup`) preserves old values. See [Migration Workflow](#migration-workflow).

---

### `product_reviews`

Customer reviews with moderation workflow.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `product_id` | `uuid` | FK → `products`, `ON DELETE CASCADE` |
| `user_id` | `uuid` | FK → `auth.users`, `ON DELETE CASCADE` |
| `user_name` | `text` | Snapshot |
| `user_email` | `text` | Snapshot |
| `rating` | `int4` | CHECK 1–5 |
| `title` | `text` | Optional |
| `comment` | `text` | |
| `status` | `text` | `pending`/`approved`/`rejected` |
| `is_verified_purchase` | `bool` | |
| `helpful_count` | `int4` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**UNIQUE constraint:** `(product_id, user_id)` — one review per user per product.

**RLS policies:**
- Anyone reads `status = 'approved'`
- Users read own (any status)
- Admins read all
- Users insert own with `status = 'pending'`
- Users update own with `status = 'pending'` (reset on edit)
- Admins update/delete any

**Triggers:** `trg_product_reviews_updated_at` (auto-update `updated_at` on UPDATE).

**Indexes:**
- `idx_reviews_product_approved` — Partial: `WHERE status = 'approved'`
- `idx_reviews_status` — For admin moderation
- `idx_reviews_user` — For "my reviews"

---

### `wishlists`

User-to-product favorites.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users`, `ON DELETE CASCADE` |
| `product_id` | `uuid` | FK → `products`, `ON DELETE CASCADE` |
| `created_at` | `timestamptz` | |

**UNIQUE constraint:** `(user_id, product_id)`.

**RLS policies:**
- Users read/insert/delete own
- (No admin read-all — can be added if needed)

**Indexes:**
- `idx_wishlists_user` — For user's wishlist page
- `idx_wishlists_product` — For "how many users wishlisted this?"

---

### `coupons`

Discount codes with all constraint types.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `code` | `text` | UNIQUE |
| `description` | `text` | |
| `discount_type` | `text` | CHECK `IN ('percent', 'fixed')` |
| `discount_value` | `numeric` | > 0 |
| `min_order_amount` | `numeric` | DEFAULT 0 |
| `max_discount_amount` | `numeric` | NULL = no cap |
| `usage_limit` | `int4` | NULL = unlimited |
| `per_user_limit` | `int4` | DEFAULT 1 |
| `times_used` | `int4` | DEFAULT 0 |
| `valid_from` | `timestamptz` | DEFAULT now() |
| `valid_until` | `timestamptz` | NULL = no expiry |
| `is_active` | `bool` | DEFAULT true |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**RLS policies:**
- Anyone reads `is_active = true` (for client-side validation UX)
- Admins manage all

**Indexes:**
- `idx_coupons_code_active` — Partial: `WHERE is_active = true`
- `idx_coupons_active_until` — `(is_active, valid_until)`

**Triggers:** `trg_coupons_updated_at` (auto-update `updated_at`).

---

### `coupon_redemptions`

Tracking table for coupon usage.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `coupon_id` | `uuid` | FK → `coupons`, `ON DELETE CASCADE` |
| `user_id` | `uuid` | FK → `auth.users`, `ON DELETE CASCADE` |
| `order_id` | `uuid` | FK → `orders`, `ON DELETE CASCADE` |
| `discount_amount` | `numeric` | Actual discount applied |
| `created_at` | `timestamptz` | |

**UNIQUE constraint:** `(coupon_id, order_id)` — prevents double-redemption on same order.

**RLS policies:**
- Users read own
- Admins read all

**Indexes:**
- `idx_redemptions_user` — `(user_id, coupon_id)` — for per-user limit checks
- `idx_redemptions_coupon` — For usage stats

---

### `_role_normalization_backup`

Backup table created by the `20261016_normalize_user_roles.sql` migration. Preserves old role values so the migration is reversible.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK (matches `profiles.id`) |
| `email` | `text` | Snapshot of profile email at migration time |
| `old_role` | `text` | Original role value (`'user'`, `'member'`, `'guest'`, `''`, or `'<<NULL>>'`) |
| `new_role` | `text` | DEFAULT 'customer' — what it was changed to |
| `migrated_at` | `timestamptz` | DEFAULT now() |

**Why?** Without a backup, `UPDATE ... SET role = 'customer'` is irreversible. If the migration is wrong (e.g., a future role should have been preserved), an admin can revert:

```sql
UPDATE public.profiles p
SET role = b.old_role
FROM public._role_normalization_backup b
WHERE p.id = b.id;
```

**Access:** No RLS policies. Only accessible via service-role key (migrations + manual recovery). Not exposed to app code.

**Retention:** Indefinitely. Small table — one row per migrated profile.

---

## Supabase RPCs

### RPC Categories

**Atomic mutations:**
- `place_order_atomic` (v2) — Order + stock + coupon + provider in **one transaction**
- `redeem_coupon_atomic` — Coupon redemption with lock (kept for backward compat)
- `admin_change_user_role` — Super-admin role change with internal authorization

**Read-only aggregations:**
- `get_dashboard_stats` — Admin dashboard (single row response)
- `get_product_review_stats` — One product's review aggregates
- `get_products_review_stats` — Batch for multiple products
- `validate_coupon` — Coupon validity check
- `get_sales_report` — Sales analytics over date range
- `get_product_sales_stats` — Product-level sales analytics

**Helper:**
- `is_admin()` — RLS-safe role check

### `place_order_atomic` (v2)

**Signature:**
```sql
place_order_atomic(
  p_user_id        uuid,
  p_user_email     text,
  p_items          jsonb,
  p_address        jsonb,
  p_coupon_code    text DEFAULT NULL,
  p_payment_method text DEFAULT 'cod'
) RETURNS jsonb
```

**What it does (in one transaction):**
1. Lock products by `id ASC` (deadlock-safe ordering)
2. Verify stock, decrement atomically
3. Lock coupon row (if provided), re-validate, increment usage
4. Insert order with `coupon_code`, `discount_amount`, `payment_provider`
5. Insert `order_items`
6. Insert `coupon_redemptions` (if coupon applied)
7. Return `{ order_id, subtotal, shipping, discount_amount, coupon_code, total }`

**Why v2?** The v1 RPC only handled stock + order. Coupon redemption and provider tagging were separate operations — a failure between them left inconsistent state (coupon consumed, discount missing, etc.). v2 makes everything atomic.

**Failure policy:** If the coupon is invalid for any reason (expired, used up, min order not met), the order still succeeds **without** the discount. Only hard DB errors abort the transaction.

**Security:** `SECURITY DEFINER`, `SET search_path = public, pg_temp`, `REVOKE ALL ... FROM PUBLIC`, `GRANT EXECUTE ... TO service_role`.

### `admin_change_user_role`

**Signature:**
```sql
admin_change_user_role(
  p_target_user_id uuid,
  p_new_role       text
) RETURNS jsonb
```

**What it does:**
1. Verify `auth.uid()` is a super admin (inside Postgres — cannot be spoofed)
2. Verify target is not the caller (can't demote self)
3. Verify target is not another super admin
4. Update `profiles.role`

**Why inside Postgres?** JS-side check is a fast-fail optimization. The authoritative check happens in the RPC. Even if a JS bypass existed, the RPC would reject.

### `get_sales_report`

**Signature:**
```sql
get_sales_report(
  p_from_date timestamptz DEFAULT NULL,
  p_to_date   timestamptz DEFAULT NULL
) RETURNS jsonb
```

**What it returns:**
```json
{
  "totals": { "total_orders", "total_revenue", "avg_order_value" },
  "by_status": { "pending": 5, "delivered": 42, ... },
  "by_provider": [{ "provider": "stripe", "order_count", "revenue" }],
  "by_category": [{ "category": "Suits", "revenue", "units_sold", "order_count" }],
  "top_products": [{ "id", "name", "units_sold", "revenue", "order_count" }],
  "daily_series": [{ "day", "revenue", "order_count" }]
}
```

**Revenue filter:** Only `shipped` and `delivered` orders count toward revenue. Pending/cancelled orders are excluded.

**Category aggregation:** Joins `order_items` → `products` to group by `category_main`.

**v3.2 note:** The reports page that consumes this RPC was redesigned with editorial styling (trend badges, animated charts). No RPC signature changes.

### `get_product_sales_stats`

**Signature:**
```sql
get_product_sales_stats(p_limit INTEGER DEFAULT 20) RETURNS jsonb
```

**What it returns:**
- `top_products` — per-product units sold, revenue, order count, avg unit price
- `by_category` — same metrics grouped by `category_main`
- `global` — total units, total revenue, avg units per order

**Used by:** `src/lib/analytics/product-queries.ts` → `ProductAnalytics` admin dashboard component.

**v3.2 note:** The ProductAnalytics component was enhanced with sortable columns, abandoned filter chip, and color-coded conversion rate pills. No RPC changes.

### Writing New RPCs

**Template:**

```sql
CREATE OR REPLACE FUNCTION public.my_rpc(
  p_param1 UUID,
  p_param2 TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER           -- Only if you need to bypass RLS
STABLE                     -- Only if read-only
SET search_path = public, pg_temp  -- Prevent search path hijack
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Your logic here
  SELECT jsonb_build_object(...) INTO v_result;
  RETURN v_result;
END;
$$;

-- Lock down access
REVOKE ALL ON FUNCTION public.my_rpc(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_rpc(UUID, TEXT) TO authenticated;
```

**Rules:**
- Always `SET search_path`
- `SECURITY DEFINER` only when necessary (RLS is the safer default)
- `STABLE` for read-only queries (allows Postgres to optimize)
- `VOLATILE` (default) for writes
- Revoke from PUBLIC, grant to specific roles
- **For mutations:** grant only to `service_role` (called from Server Actions)

---

## Supabase Triggers

### `trg_orders_snapshot_immutable`

**Purpose:** Prevent modification of `orders.items` and `orders.address` after INSERT.

**Function:**
```sql
CREATE OR REPLACE FUNCTION public.prevent_order_snapshot_update()
RETURNS trigger AS $$
BEGIN
  IF NEW.items IS DISTINCT FROM OLD.items THEN
    RAISE EXCEPTION 'orders.items is an immutable snapshot (order %)', OLD.id
      USING ERRCODE = '22023';
  END IF;

  IF NEW.address IS DISTINCT FROM OLD.address THEN
    RAISE EXCEPTION 'orders.address is an immutable snapshot (order %)', OLD.id
      USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Trigger:**
```sql
CREATE TRIGGER trg_orders_snapshot_immutable
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  WHEN (
    OLD.items   IS DISTINCT FROM NEW.items
    OR
    OLD.address IS DISTINCT FROM NEW.address
  )
  EXECUTE FUNCTION public.prevent_order_snapshot_update();
```

**Why the `WHEN` clause?** Without it, the trigger fires on every order UPDATE (status changes, payment updates). The `WHEN` clause restricts firing to only the cases where the snapshot actually changed. **Zero overhead on normal updates.**

**Escape hatch for migrations:**
```sql
ALTER TABLE public.orders DISABLE TRIGGER trg_orders_snapshot_immutable;
-- ... make changes ...
ALTER TABLE public.orders ENABLE TRIGGER trg_orders_snapshot_immutable;
```

This makes the change deliberate and auditable.

### `trg_product_reviews_updated_at`

Auto-updates `updated_at` on review UPDATE. Standard pattern.

### `trg_coupons_updated_at`

Auto-updates `updated_at` on coupon UPDATE. Standard pattern.

---

## MongoDB Collections

### `events`

User behavior tracking.

**Document shape:**

```typescript
{
  _id: ObjectId,
  user_id: string | null,
  session_id: string,
  event_type: 'page_view' | 'product_view' | 'add_to_cart' | ... ,
  properties: Record<string, unknown>,
  ip_hash: string,
  country: string | null,
  city: string | null,
  device: { type: string, os: string, browser: string },
  referrer: string | null,
  path: string,
  timestamp: Date,
}
```

**Indexes:**
- `{ timestamp: -1 }` with TTL 7,776,000s (90 days)
- `{ session_id: 1 }`
- `{ user_id: 1, timestamp: -1 }`
- `{ event_type: 1, timestamp: -1 }`

**Sample aggregation (funnel):**

```javascript
db.events.aggregate([
  { $match: { timestamp: { $gte: since } } },
  { $group: {
    _id: '$session_id',
    events: { $addToSet: '$event_type' }
  }},
  { $project: {
    visited: { $in: ['page_view', '$events'] },
    viewedProduct: { $in: ['product_view', '$events'] },
    addedToCart: { $in: ['add_to_cart', '$events'] },
    ordered: { $in: ['order_placed', '$events'] }
  }},
  { $group: {
    _id: null,
    total: { $sum: 1 },
    visited: { $sum: { $cond: ['$visited', 1, 0] } },
    // ...
  }}
])
```

**v3.2 note:** The `order_placed` event is now emitted on both COD and Stripe success paths. Previously, only COD tracked the event — Stripe orders were invisible in product analytics. No schema changes.

---

### `sessions`

Visitor session documents. One document per browser tab session.

**Document shape:**

```typescript
{
  _id: ObjectId,
  session_id: string,              // Random UUID from client cookie
  user_id: string | null,          // null for guests
  user_email: string | null,
  user_name: string | null,
  visitor_type: 'guest' | 'new' | 'returning' | 'admin',
  ip_hash: string,                 // SHA-256(salt + IP)
  country: string | null,          // From Vercel headers
  city: string | null,
  device: { type, os, browser },
  referrer: string | null,
  referrer_source: string,         // Classified: 'google'|'instagram'|'direct'|...
  first_seen_at: Date,
  last_seen_at: Date,
  duration_ms: number,
  page_view_count: number,
  product_view_count: number,
  cart_add_count: number,
  order_count: number,
  revenue: number,
  paths_visited: string[],         // Unique paths this session
  products_viewed: string[],       // Unique product IDs
  orders_placed: string[],         // Order IDs
  ended_with: 'order' | 'abandon' | 'bounce' | null,
}
```

**Indexes:**
- `{ session_id: 1 }` UNIQUE
- `{ user_id: 1, last_seen_at: -1 }` sparse
- `{ ip_hash: 1, last_seen_at: -1 }`
- `{ visitor_type: 1, last_seen_at: -1 }`
- `{ last_seen_at: 1 }` with TTL 7,776,000s (90 days)

**Upsert pattern:** Every track batch does an upsert:

```javascript
db.sessions.updateOne(
  { session_id: input.sessionId },
  {
    $set: {
      user_id, user_email, user_name, visitor_type,
      ip_hash, country, city, device, referrer, referrer_source,
      last_seen_at: now, duration_ms, page_view_count,
      product_view_count, cart_add_count, order_count, revenue,
      paths_visited, products_viewed, orders_placed, ended_with,
    },
    $setOnInsert: {
      session_id: input.sessionId,
      first_seen_at: now,
    },
  },
  { upsert: true }
)
```

**`ended_with` heuristic:**
- `order` — if `order_count > 0`
- `abandon` — if `duration_ms >= 30_000`
- `bounce` — otherwise

**Used by:**
- `/admin/visitors` — session list with filters
- `/admin/sessions?id=X` — drill-down
- `/admin/users/[id]/activity` — timeline per user
- `LiveUsersWidget` — auto-refresh every 30s
- `NewVsReturningChart` — chart over 30 days

**TTL index note:** MongoDB rejects creating a TTL index with the same keys but different options. Our `ensureSessionIndexes()` uses `tryIndex` with a try/catch that ignores error code 85 (`IndexOptionsConflict`). This makes index creation idempotent.

---

### `email_logs`

Every email attempted.

**Document shape:**

```typescript
{
  _id: ObjectId,
  user_id: string | null,
  email: string,
  template: string,        // 'welcome'|'order-placed'|'payment-confirmed'|...
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'opened' | 'bounced',
  provider_message_id: string | null,
  error: string | null,
  metadata: Record<string, unknown>,  // Template data snapshot
  created_at: Date,
  updated_at: Date,
}
```

**Indexes:**
- `{ email: 1, created_at: -1 }`
- `{ status: 1, created_at: -1 }`
- `{ template: 1, created_at: -1 }`

**Lifecycle:**

```
queued → sent (via QStash job) → delivered (via Resend webhook)
                              → opened (tracking pixel)
queued → failed (on SMTP error, up to 3 retries)
queued → failed (if QStash publish throws — v3.1 fix)
```

**v3.1 fix:** If `qstash.publishJSON` throws (network error, invalid URL, token expired), the log is updated to `status: 'failed'` with the error message. Previously it stayed `queued` forever.

**v3.2 note:** All 10 templates redesigned (editorial style). No schema changes — the `template` field just maps to new `.tsx` files.

---

### `payment_transactions`

Payment audit trail.

**Document shape:**

```typescript
{
  _id: ObjectId,
  order_id: string,
  user_id: string | null,
  provider: 'cod' | 'stripe' | 'paypal',
  provider_txn_id: string,
  amount: number,
  currency: string,
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'refunded',
  method: string | null,
  card_last4?: string | null,
  card_brand?: string | null,
  webhook_events: Array<{
    event: string,
    at: Date,
    raw: unknown
  }>,
  created_at: Date,
  updated_at: Date,
}
```

**Indexes:**
- `{ provider_txn_id: 1 }` UNIQUE — prevents duplicate records
- `{ order_id: 1 }`

**Why `webhook_events` array?** Full audit trail for debugging. If Stripe claims a webhook fired and we disagree, we have the raw payload.

**Duplicate guard:** Before inserting, we check if a document with the same `provider_txn_id` exists. This handles the race between client-side `confirmPayment` and the webhook.

---

### `audit_logs`

Admin actions timeline.

**Document shape:**

```typescript
{
  _id: ObjectId,
  actor_id: string,
  actor_email: string,
  action: string,        // 'order.refund'|'coupon.create'|'user.change_role'|...
  target_type: string,   // 'order'|'coupon'|'product'|'user'|'review'
  target_id: string,
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
  ip_hash: string | null,
  metadata: Record<string, unknown>,
  timestamp: Date,
}
```

**Indexes:**
- `{ timestamp: -1 }`
- `{ actor_id: 1, timestamp: -1 }`
- `{ target_type: 1, target_id: 1 }`
- `{ action: 1, timestamp: -1 }`

**No TTL** — kept indefinitely for compliance.

**Actions logged:**
`payment.refund`, `coupon.create`, `coupon.update`, `coupon.delete`, `user.change_role`, `product.create`, `product.update`, `product.delete`, `review.approved`, `review.rejected`, `review.delete`.

**v3.2 note:** The `/admin/audit` page was redesigned with editorial style. No schema changes.

---

### `cart_snapshots`

Abandoned cart recovery state.

**Document shape:**

```typescript
{
  _id: ObjectId,
  user_id: string,
  user_email: string,
  user_name: string,
  items: Array<{
    id: string,
    name: string,
    price: number,
    quantity: number,
    image: string | null,
    size?: string | null
  }>,
  subtotal: number,
  item_count: number,
  recovery_token: string,
  recovery_email_sent_at: Date | null,
  recovery_email_count: number,
  last_reminder_at: Date | null,
  recovered_at: Date | null,
  recovered_order_id: string | null,
  offered_coupon_code: string | null,
  created_at: Date,
  updated_at: Date,
}
```

**Indexes:**
- `{ user_id: 1 }` UNIQUE
- `{ recovery_token: 1 }` UNIQUE
- `{ updated_at: -1 }`
- `{ recovered_at: 1, last_reminder_at: 1 }` sparse

**Query for cron:**

```javascript
db.cart_snapshots.find({
  item_count: { $gt: 0 },
  recovered_at: null,
  updated_at: { $lte: twoHoursAgo },
  recovery_email_count: { $lt: 3 },
  $or: [
    { last_reminder_at: null },
    { last_reminder_at: { $lte: sevenDaysAgo } }
  ]
})
```

**Lifecycle:**
1. Client syncs cart on change (debounced 2s)
2. If cart becomes empty → document deleted
3. Cron runs hourly → finds eligible carts → sends recovery email + 5% coupon
4. Order placed → `markCartRecovered` sets `recovered_at`, `recovered_order_id`

**v3.2 fix:** The cron parameter order (`findAbandonedCarts(minAgeHours, maxReminders, limit)`) was corrected. Previously, args were passed in the wrong order, silently limiting reminders. Also, throttle is now set **only on success**, so failed runs auto-retry on the next tick. No schema changes.

---

### `analytics_daily`

Pre-aggregated metrics (cron-generated).

**Document shape:**

```typescript
{
  _id: ObjectId,
  date: string,          // 'YYYY-MM-DD'
  metrics: {
    page_views: number,
    unique_visitors: number,
    sessions: number,
    orders_placed: number,
    revenue: number,
    conversion_rate: number,
  },
  breakdown: {
    by_device: Record<string, number>,
    by_country: Record<string, number>,
    by_referrer: Record<string, number>,
  },
  created_at: Date,
}
```

**Indexes:**
- `{ date: 1 }` UNIQUE

**Status:** Reserved for future optimization. Current analytics queries MongoDB `events` and `sessions` collections directly.

---

## Redis Keys

Redis (Upstash) stores ephemeral state. No schema, but the **key naming conventions** matter for debugging and operational clarity.

### Rate limit keys

```
rl:{tier}:{clientKey}
```

| Example | Purpose |
|---------|---------|
| `rl:auth:ip:203.0.113.42` | Auth tier, per-IP |
| `rl:admin:user:550e8400-...` | Admin tier, per-user |
| `rl:chat:ip:203.0.113.42` | Chat tier, per-IP |
| `rl:track:ip:203.0.113.42` | Track tier, per-IP |

**TTL:** Matches the sliding window (1 minute for most tiers).

**Fail-open:** If Redis is down, requests are allowed through. Rate limiting is defense-in-depth, not a hard requirement.

### Idempotency keys

```
idem:{scope}:{key}          → lock (24h TTL)
idem:result:{scope}:{key}   → cached result (24h TTL)
```

| Scope | Key | Used by |
|-------|-----|---------|
| `stripe-webhook` | `event.id` | Webhook handler |
| `stripe-confirm` | `paymentIntentId` | Client-side confirmPayment |
| `order-placed-email` | `orderId` | Email queue |

**Release:** Atomic Lua script (compare-and-delete). See [Security → Idempotency](./security.md#idempotency).

### Cron throttle keys

```
throttle:cron:abandoned-carts    → timestamp (epoch ms)
throttle:alert:low-stock         → timestamp (epoch ms)
```

**v3.2 change:** Throttle is set **only on real success**. If `queueEmail` fails, the throttle is NOT set → next cron tick retries automatically.

**Debugging:** To force a cron to run immediately:
```bash
DEL throttle:cron:abandoned-carts
DEL throttle:alert:low-stock
```

### Cache keys (informational)

No active caching in v3.2. Reserved for future product query caching.

**Retention:** All keys expire per their TTL. Redis is ephemeral — no backup needed.

---

## Migration Workflow

### Migration Files

Current migrations in `supabase/migrations/` (in order):

| # | File | Purpose |
|---|------|---------|
| 1 | `20261003_fix_rls_policies.sql` | RLS on all tables + `is_admin()` helper |
| 2 | `20261004_add_indexes.sql` | Performance indexes on hot paths |
| 3 | `20261004_dashboard_stats.sql` | `get_dashboard_stats()` RPC |
| 4 | `20261005_add_payment_fields.sql` | Payment columns on `orders` |
| 5 | `20261011_add_product_reviews.sql` | Reviews table + RPC + RLS |
| 6 | `20261012_add_wishlists.sql` | Wishlist table + RLS |
| 7 | `20261013_add_coupons.sql` | Coupons + redemptions + RPCs |
| 8 | `20261014_add_last_login.sql` | Login tracking columns on `profiles` |
| 9 | `20261015_add_super_admin.sql` | `is_super_admin` column + `admin_change_user_role` RPC |
| 10 | `20261016_normalize_user_roles.sql` | Role whitelist + backup table + CHECK constraint |
| 11 | `20261017_sales_report_rpc.sql` | `get_sales_report` RPC |
| 12 | `20261018_product_analytics_rpc.sql` | `get_product_sales_stats` RPC |
| 13 | `20261019_place_order_atomic_v2.sql` | Enhanced `place_order_atomic` (coupon + provider in one transaction) |

**v3.2 note:** No new migrations were required for v3.2. The release was focused on UI/UX redesign, PDF print export, and bug fixes — none of which changed the database schema.

### Adding a Migration

1. **Create file:** `supabase/migrations/YYYYMMDD_description.sql`
2. **Write idempotent SQL** — use `IF NOT EXISTS`, `DROP POLICY IF EXISTS`, `DO $$ ... $$` blocks
3. **Test in dev Supabase** — run in SQL Editor
4. **Verify RLS** — check `pg_policies`
5. **Run in production** — same file
6. **Commit** — file lands in repo

### Migration Principles

**Always idempotent:**
```sql
CREATE TABLE IF NOT EXISTS public.new_table (...);
ALTER TABLE public.existing ADD COLUMN IF NOT EXISTS new_col TEXT;
DROP POLICY IF EXISTS "Old policy" ON public.existing;
CREATE POLICY "Old policy" ...;
```

**Never destructive without backup:**
```sql
-- BAD
DROP TABLE public.important_data;

-- GOOD
-- 1. Backup first (Supabase automatic on Pro)
-- 2. Rename instead of drop
ALTER TABLE public.important_data RENAME TO important_data_deprecated;
```

**Atomic multi-step mutations use `DO` blocks:**
```sql
DO $$
DECLARE
  v_affected int;
BEGIN
  -- Backup
  INSERT INTO backup_table SELECT ... ON CONFLICT DO NOTHING;

  -- Mutate
  UPDATE public.profiles SET ... ;
  GET DIAGNOSTICS v_affected = ROW_COUNT;
  RAISE NOTICE 'Affected % rows', v_affected;

  -- Sanity check — abort if state is invalid
  IF EXISTS (SELECT 1 FROM profiles WHERE role NOT IN ('customer', 'admin')) THEN
    RAISE EXCEPTION 'Unexpected role value';
  END IF;
END;
$$;
```

**Always revoke from PUBLIC:**
```sql
REVOKE ALL ON FUNCTION public.my_function() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_function() TO authenticated;
```

**Always SET search_path in functions:**
```sql
SET search_path = public, pg_temp
```

### Rolling Back

Migrations are **not auto-reversible**. To roll back:

1. Write a new migration that undoes the change
2. Test in dev first
3. Apply to production

Example — rollback of a table add:

```sql
DROP TABLE IF EXISTS public.added_table CASCADE;
ALTER TABLE public.existing DROP COLUMN IF EXISTS added_column;
```

**Never drop in production without a backup.**

**Reversible migrations (with backup tables):**

Role normalization can be reverted:

```sql
UPDATE public.profiles p
SET role = b.old_role
FROM public._role_normalization_backup b
WHERE p.id = b.id;
```

---

## Data Integrity Rules

### Constraints enforced at the DB

| Rule | Mechanism |
|------|-----------|
| One review per user per product | `UNIQUE (product_id, user_id)` |
| One wishlist entry per user per product | `UNIQUE (user_id, product_id)` |
| No negative stock | Application logic (`FOR UPDATE` + check) |
| No double coupon redemption on same order | `UNIQUE (coupon_id, order_id)` |
| Rating 1-5 | `CHECK (rating >= 1 AND rating <= 5)` |
| Discount value positive | `CHECK (discount_value > 0)` |
| Valid coupon type | `CHECK (discount_type IN ('percent', 'fixed'))` |
| Valid user role | `CHECK (role IN ('customer', 'admin'))` |
| Valid payment provider | `CHECK (payment_provider IN ('cod', 'stripe', 'paypal'))` |
| Immutable order items/address | Trigger `trg_orders_snapshot_immutable` |
| Print export row cap | Application logic (10,000 rows, v3.2) |

### Constraints enforced at the app

| Rule | Where |
|------|-------|
| Max 50 quantity per item | Zod in `placeOrder` |
| Max 30 distinct items | Zod in `placeOrder` |
| Comment length 10-2000 | Zod in `submitReview` |
| Coupon code format | Zod in `createCoupon` |
| Address required fields | Zod in `placeOrder` |
| Chat message length 2000 | Zod in `/api/chat` |
| Chat message count ≤ 20 | Zod in `/api/chat` |
| Chat role ∈ {user, assistant} | Zod in `/api/chat` |
| Print route type whitelist | Server Component in `[type]/page.tsx` (v3.2) |

### Application vs DB constraints

**Philosophy:** Prefer DB constraints for *invariants* (things that must never be false). Prefer app validation for *UX rules* (things that help users but don't break the system if violated).

Example: A review without a title is fine (DB allows NULL). But a review with a rating of 6 is a data integrity violation (DB blocks it).

---

## Index Strategy

### Index Types

**B-tree** (default) — For equality and range queries:
```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
```

**Partial** — For filtered queries:
```sql
CREATE INDEX idx_products_active ON products (is_active) WHERE is_active = true;
```

**GIN + Trigram** — For `ILIKE '%q%'` search:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
```

**TTL** (MongoDB) — Auto-delete after duration:
```javascript
db.events.createIndex({ timestamp: -1 }, { expireAfterSeconds: 7776000 })
db.sessions.createIndex({ last_seen_at: 1 }, { expireAfterSeconds: 7776000 })
```

### Index Design Principles

1. **Match the query, not the table.** Index `(user_id, created_at DESC)` for "user's orders sorted by date" — not just `(user_id)`.
2. **Partial indexes are small and fast.** `WHERE is_active = true` filter matches most queries.
3. **Composite order matters.** `(a, b)` supports `WHERE a = ?` and `WHERE a = ? AND b = ?`, but not `WHERE b = ?`.
4. **Don't over-index.** Every index slows down INSERT/UPDATE. Aim for one index per distinct query pattern.

### Current Indexes

**Products:**
- `idx_products_active_featured_created`
- `idx_products_active_new_arrival_created`
- `idx_products_category_active_created`
- `idx_products_active_created`
- `idx_products_name_trgm` (GIN)
- `idx_products_active`

**Orders:**
- `idx_orders_user_created`
- `idx_orders_status_created`
- `idx_orders_created`
- `idx_orders_created_range`
- `idx_orders_payment_provider`
- `idx_orders_payment_status`

**Order items:**
- `idx_order_items_order`
- `idx_order_items_product`

**Profiles:**
- `idx_profiles_created` (created_at DESC)
- `idx_profiles_last_login` (last_login_at DESC NULLS LAST)

**Reviews:**
- `idx_reviews_product_approved`
- `idx_reviews_status`
- `idx_reviews_user`

**Coupons:**
- `idx_coupons_code_active`
- `idx_coupons_active_until`

**Redemptions:**
- `idx_redemptions_user`
- `idx_redemptions_coupon`

### MongoDB Indexes

**`events`:**
- `{ timestamp: -1 }` (TTL 90d)
- `{ session_id: 1 }`
- `{ user_id: 1, timestamp: -1 }`
- `{ event_type: 1, timestamp: -1 }`

**`sessions`:**
- `{ session_id: 1 }` UNIQUE
- `{ user_id: 1, last_seen_at: -1 }` sparse
- `{ ip_hash: 1, last_seen_at: -1 }`
- `{ visitor_type: 1, last_seen_at: -1 }`
- `{ last_seen_at: 1 }` (TTL 90d)

**`email_logs`:**
- `{ email: 1, created_at: -1 }`
- `{ status: 1, created_at: -1 }`
- `{ template: 1, created_at: -1 }`

**`payment_transactions`:**
- `{ provider_txn_id: 1 }` UNIQUE
- `{ order_id: 1 }`

**`audit_logs`:**
- `{ timestamp: -1 }`
- `{ actor_id: 1, timestamp: -1 }`
- `{ target_type: 1, target_id: 1 }`
- `{ action: 1, timestamp: -1 }`

**`cart_snapshots`:**
- `{ user_id: 1 }` UNIQUE
- `{ recovery_token: 1 }` UNIQUE
- `{ updated_at: -1 }`
- `{ recovered_at: 1, last_reminder_at: 1 }` sparse

---

## Backup & Retention

### Supabase

| Tier | Backups | Retention |
|------|---------|-----------|
| Free | Daily | 7 days |
| Pro | Daily + PITR | 30 days |
| Team | Daily + PITR | 30 days |

**Recommendation:** Upgrade to Pro before launching to real customers.

**Manual export:** `pg_dump` via Supabase CLI:
```bash
supabase db dump --db-url $DATABASE_URL > backup.sql
```

### MongoDB Atlas

| Tier | Backups | Retention |
|------|---------|-----------|
| M0 (free) | None | N/A |
| M2 | Daily snapshot | 2 days |
| M10+ | Continuous | 7+ days |

**Recommendation for M0:** Set up a `mongodump` cron if data is critical.

### Redis (Upstash)

Redis is ephemeral. **No backup needed.** Rate limits reset, caches rebuild, idempotency keys expire, cron throttles reset.

If you need durable Redis: upgrade to Upstash Pro with persistence, but this changes the operational model (need to manage replica failures).

### Data Retention Summary

| Data | Where | Retained |
|------|-------|----------|
| Orders | Supabase | Forever |
| Products | Supabase | Forever (soft-delete via `is_active`) |
| Users | Supabase | Forever (cascade on auth delete) |
| Reviews | Supabase | Forever |
| Coupons | Supabase | Forever |
| Coupon redemptions | Supabase | Forever |
| Role normalization backup | Supabase | Indefinitely |
| Events | MongoDB | 90 days (TTL) |
| Sessions | MongoDB | 90 days (TTL) |
| Email logs | MongoDB | Forever |
| Payment txns | MongoDB | Forever |
| Audit logs | MongoDB | Forever |
| Cart snapshots | MongoDB | Forever (recovered carts can be pruned) |
| Rate limits | Redis | Expire per window |
| Idempotency | Redis | 24 hours |
| Cron throttles | Redis | Per-throttle window (12h / 50min) |

### Compliance Notes

- **IP hashing:** Raw IPs are never stored. All references use SHA-256 + salt.
- **PII deletion:** Deleting a user cascades through `profiles`, `orders`, `reviews`, `wishlists`, `coupon_redemptions`. MongoDB entries (events, sessions) retain `user_id` but the reference becomes dangling. Audit logs preserve the historical record.
- **Right to export:** A user's data lives across Supabase (`profiles`, `orders`) and MongoDB (`events`, `sessions`, `cart_snapshots`). A full export would query all of these by `user_id`.
- **Print exports (v3.2):** PDF print views render server-side but are **never persisted**. No files stored in S3, Cloudinary, or any storage. Browser handles the print/cache lifecycle.

---

## What's New in v3.2

This section documents v3.2-specific database changes. **TL;DR: No schema changes required.**

### No New Migrations

v3.2 was a **UI/UX + reliability release**, not a schema release. No new tables, columns, or indexes.

### Database-Relevant Fixes

| Fix | Impact | Where |
|-----|--------|-------|
| **Cron param order** | Correct `findAbandonedCarts(minAgeHours, maxReminders, limit)` — was silently limiting reminders | `src/lib/carts/queries.ts` |
| **Cron throttle-on-success** | Throttle key only set after `queueEmail` succeeds. Failed runs auto-retry. | Cron endpoints |
| **Email queue hardening** | `qstash.publishJSON` failure marks log as `failed` (was stuck `queued` forever) | `src/lib/email/queue.ts` |
| **`order_placed` event** | Now fires on both COD and Stripe success paths | `placeOrder`, `confirmPayment` |
| **`token_hash` auth flow** | Password reset creates a session (was losing it) | `/auth/callback` |

### Database-Relevant Non-Changes

| Feature | Why No DB Change |
|---------|------------------|
| **Editorial UI redesign** | Pure presentation. 120 files changed, but no schema impact. |
| **PDF print export** | Server Component reads existing data. No new tables. 10K row cap enforced in app code. |
| **Email template redesign** | `.tsx` files only. No `email_logs` schema changes. |
| **Admin notifications redesign** | Client-side component. No DB. |
| **Screenshot reorganization** | `public/images/` structure. No DB. |

### Redis Key Additions

v3.2 introduced two new **throttle keys**:

```
throttle:cron:abandoned-carts
throttle:alert:low-stock
```

Both store epoch-ms timestamps. Both use the success-only write pattern.

**Debug commands:**
```bash
DEL throttle:cron:abandoned-carts
DEL throttle:alert:low-stock
```

### Index Additions

None.

### Constraint Additions

None.

### Realtime Additions

`order_items` table was added to the `supabase_realtime` publication for real-time item updates on customer order detail pages.

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
```

---

## Further Reading

- [Architecture Deep Dive](./architecture.md) — Includes PDF Print Export Pipeline + Editorial Design System
- [Security Deep Dive](./security.md) — Includes Print Route Security + Cron Job Security
- [API Reference](./api-reference.md) — Includes Print Routes section
- [Features](./features.md) — Feature-level documentation
- [Supabase docs](https://supabase.com/docs/guides/database)
- [MongoDB schema design best practices](https://www.mongodb.com/docs/manual/data-modeling/)
- [Postgres explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [MongoDB TTL indexes](https://www.mongodb.com/docs/manual/core/index-ttl/)
- [Redis Lua scripting](https://redis.io/docs/manual/programmability/eval-intro/)

---

<p align="center">
  <em>Last updated: 2026-10-16 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>

---