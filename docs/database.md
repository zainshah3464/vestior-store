# Database Design

> **Audience:** Engineers extending the schema, writing migrations, or debugging data issues.
>
> **Scope:** Every table, RPC, and collection with relationships and design rationale.

---

## Table of Contents

- [Overview](#overview)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Supabase Tables](#supabase-tables)
- [Supabase RPCs](#supabase-rpcs)
- [MongoDB Collections](#mongodb-collections)
- [Migration Workflow](#migration-workflow)
- [Data Integrity Rules](#data-integrity-rules)
- [Index Strategy](#index-strategy)
- [Backup & Retention](#backup--retention)

---

## Overview

VESTIOR uses **two databases** with clearly separated responsibilities:

| Database | Owns | Access Pattern |
|----------|------|----------------|
| **Supabase (PostgreSQL)** | Products, orders, users, reviews, wishlists, coupons | ACID transactions, RLS, low-volume |
| **MongoDB Atlas** | Events, email logs, payments, audit, carts | Append-only, high-volume, analytics |

Plus **Upstash Redis** for ephemeral state (rate limits, idempotency, cache).

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
        text payment_provider
        text payment_intent_id
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
        int4 usage_limit
        int4 per_user_limit
        int4 times_used
        bool is_active
    }
    coupon_redemptions {
        uuid id PK
        uuid coupon_id FK
        uuid user_id FK
        uuid order_id FK
        numeric discount_amount
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
- `idx_products_name_trgm` — Trigram GIN for `ILIKE '%q%'` search

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
| `items` | `jsonb` | Snapshot of items at order time |
| `address` | `jsonb` | Shipping address snapshot |
| `subtotal` | `int4` | |
| `shipping` | `int4` | |
| `discount_amount` | `numeric` | Coupon discount |
| `coupon_code` | `text` | Applied coupon code |
| `total` | `int4` | = subtotal + shipping − discount |
| `status` | `text` | `pending`/`processing`/`shipped`/`delivered`/`cancelled` |
| `payment_status` | `text` | `pending`/`completed`/`failed`/`refunded` |
| `payment_method` | `text` | `cod`/`stripe` |
| `payment_provider` | `text` | Same as method (extensible) |
| `payment_intent_id` | `text` | Stripe PI ID |
| `payment_metadata` | `jsonb` | Full Stripe payload |
| `paid_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

**Why denormalize `user_email`?** Admin order list filters/sorts by email. Joining `profiles` for every row is slower.

**Why JSON `items` AND `order_items` table?** JSON is a snapshot (immutable); table is for querying/joins. Both serve different needs.

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
| `address_line1` | `text` | |
| `address_line2` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `pincode` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Auto-creation:** `handle_new_user()` trigger fires on `auth.users` INSERT.

**RLS policies:**
- Users read own profile OR admin
- Users insert own profile (trigger runs as service_role — bypasses)
- Users update own profile OR admin
- Only admins delete

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

**Auto-update:** `set_reviews_updated_at` trigger on UPDATE.

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

**Auto-update:** `set_coupons_updated_at` trigger.

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

## Supabase RPCs

### RPC Categories

**Atomic mutations:**
- `place_order_atomic` — Order + stock deduction with `FOR UPDATE` locks
- `redeem_coupon_atomic` — Coupon redemption with lock

**Read-only aggregations:**
- `get_dashboard_stats` — Admin dashboard (single row response)
- `get_product_review_stats` — One product's review aggregates
- `get_products_review_stats` — Batch for multiple products
- `validate_coupon` — Coupon validity check

**Helper:**
- `is_admin()` — RLS-safe role check

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
  event_type: string,
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

---

### `email_logs`

Every email attempted.

**Document shape:**

```typescript
{
  _id: ObjectId,
  user_id: string | null,
  email: string,
  template: string,
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'opened' | 'bounced',
  provider_message_id: string | null,
  error: string | null,
  metadata: Record<string, unknown>,
  created_at: Date,
  updated_at: Date,
}
```

**Indexes:**
- `{ email: 1, created_at: -1 }`
- `{ status: 1, created_at: -1 }`

**Lifecycle:**

```
queued → sent (via QStash job) → delivered (via Resend webhook)
                              → opened (tracking pixel)
queued → failed (on SMTP error, up to 3 retries)
```

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
- `{ provider_txn_id: 1 }` UNIQUE
- `{ order_id: 1 }`

**Why `webhook_events` array?** Full audit trail for debugging. If Stripe claims a webhook fired and we disagree, we have the raw payload.

---

### `audit_logs`

Admin actions timeline.

**Document shape:**

```typescript
{
  _id: ObjectId,
  actor_id: string,
  actor_email: string,
  action: string,        // 'order.refund', 'coupon.create', 'product.update', etc.
  target_type: string,
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

---

## Migration Workflow

### Adding a Migration

1. **Create file:** `supabase/migrations/YYYYMMDD_description.sql`
2. **Write idempotent SQL** — use `IF NOT EXISTS`, `DROP POLICY IF EXISTS` etc.
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

### Constraints enforced at the app

| Rule | Where |
|------|-------|
| Max 50 quantity per item | Zod in `placeOrder` |
| Max 30 distinct items | Zod in `placeOrder` |
| Comment length 10-2000 | Zod in `submitReview` |
| Coupon code format | Zod in `createCoupon` |
| Address required fields | Zod in `placeOrder` |

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

Redis is ephemeral. **No backup needed.** Rate limits reset, caches rebuild, idempotency keys expire.

If you need durable Redis: upgrade to Upstash Pro with persistence, but this changes the operational model (need to manage replica failures).

### Data Retention Summary

| Data | Where | Retained |
|------|-------|----------|
| Orders | Supabase | Forever |
| Products | Supabase | Forever (soft-delete via `is_active`) |
| Users | Supabase | Forever (cascade on auth delete) |
| Reviews | Supabase | Forever |
| Events | MongoDB | 90 days (TTL) |
| Email logs | MongoDB | Forever |
| Payment txns | MongoDB | Forever |
| Audit logs | MongoDB | Forever |
| Cart snapshots | MongoDB | Forever (recovered carts can be pruned) |
| Rate limits | Redis | Expire per window |
| Idempotency | Redis | 24 hours |

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [API Reference](./api-reference.md)
- [Supabase docs](https://supabase.com/docs/guides/database)
- [MongoDB schema design best practices](https://www.mongodb.com/docs/manual/data-modeling/)

---

<p align="center">
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```