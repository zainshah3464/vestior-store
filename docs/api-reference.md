# API Reference

> **Audience:** Engineers integrating with VESTIOR, or extending it.
>
> **Structure:** Server Actions, RPC functions, and API routes with full signatures, examples, and error contracts.
>
> **Version:** This document reflects **v3.2.0** (Editorial redesign + PDF export + cron hardening).

---

## Table of Contents

- [Conventions](#conventions)
- [Server Actions](#server-actions)
  - [placeOrder](#placeorder)
  - [confirmPayment](#confirmpayment)
  - [updateOrderStatus](#updateorderstatus)
  - [refundPayment](#refundpayment)
  - [resendOrderEmail](#resendorderemail)
  - [changeUserRole](#changeuserrole)
  - [Review Actions](#review-actions)
  - [Coupon Actions](#coupon-actions)
  - [Wishlist Actions](#wishlist-actions)
- [Supabase RPCs](#supabase-rpcs)
  - [place_order_atomic (v2)](#place_order_atomic-v2)
  - [redeem_coupon_atomic](#redeem_coupon_atomic)
  - [validate_coupon](#validate_coupon)
  - [admin_change_user_role](#admin_change_user_role)
  - [get_dashboard_stats](#get_dashboard_stats)
  - [get_sales_report](#get_sales_report)
  - [get_product_sales_stats](#get_product_sales_stats)
  - [get_product_review_stats](#get_product_review_stats)
  - [get_products_review_stats](#get_products_review_stats)
  - [is_admin](#is_admin)
- [REST API Routes](#rest-api-routes)
  - [POST /api/chat](#post-apichat)
  - [POST /api/track](#post-apitrack)
  - [POST /api/cart/sync](#post-apicartsync)
  - [GET /api/cart/recover](#get-apicartrecover)
  - [GET /api/wishlist/ids](#get-apiwishlistids)
  - [GET /api/recommendations/recently-viewed](#get-apirecommendationsrecently-viewed)
  - [POST /api/auth/login-success](#post-apiauthlogin-success)
  - [POST /api/auth/welcome](#post-apiauthwelcome)
  - [GET /api/admin/export](#get-apiadminexport)
  - [GET /api/admin/live-users](#get-apiadminlive-users)
  - [GET /api/admin/payment-detail](#get-apiadminpayment-detail)
  - [POST /api/webhooks/stripe](#post-apiwebhooksstripe)
  - [POST /api/jobs/send-email](#post-apijobssend-email)
  - [GET /api/cron/daily](#get-apicrondaily)
  - [GET /api/cron/low-stock-alert](#get-apicronlow-stock-alert)
  - [GET /api/cron/abandoned-carts](#get-apicronabandoned-carts)
  - [GET /api/cron/keep-alive](#get-apicronkeep-alive)
- [Print Routes (NEW v3.2)](#print-routes-new-v32)
  - [GET /admin/exports/print/[type]](#get-adminexportsprinttype)
- [Error Codes](#error-codes)

---

## Conventions

### Server Actions

Server Actions are called like functions but are HTTP POST endpoints. They:

- Are `'use server'` at the top of the file
- Run on the server
- Validate inputs with Zod
- Re-authenticate on every call
- Throw errors (which surface as toasts on the client)

**Example client usage:**
```typescript
try {
  const result = await placeOrder(items, address, 'cod', null)
  toast.success('Order placed')
} catch (err) {
  toast.error(err instanceof Error ? err.message : 'Failed')
}
```

### RPCs

Postgres functions callable via `supabase.rpc(name, params)`. They:

- Run inside a transaction
- Use `FOR UPDATE` locks where needed
- Return JSONB for complex responses
- Are `SECURITY DEFINER` when they need elevated privileges

**Example:**
```typescript
const { data, error } = await supabaseAdmin.rpc('place_order_atomic', {
  p_user_id: user.id,
  p_user_email: user.email,
  p_items: [{ product_id: '...', quantity: 1 }],
  p_address: { ... },
  p_coupon_code: 'WELCOME10',
  p_payment_method: 'stripe',
})
```

### REST API Routes

Next.js route handlers under `src/app/api/`. They:

- Use standard HTTP methods (GET, POST, PUT, DELETE)
- Return JSON with proper status codes
- Support `Authorization` header where required

### Print Routes (v3.2)

Server Components under `src/app/admin/exports/print/`. They:

- Render full-page HTML (no client JS except print button)
- Verify admin session server-side before rendering
- Use print-optimized CSS (`@media print`)
- Leverage browser's native "Print → Save as PDF"
- Zero external dependencies

---

## Server Actions

### placeOrder

**File:** `src/actions/placeOrder.ts`

Creates an order atomically. Everything happens in **one Postgres transaction** (v2): stock lock + coupon validation/redemption + provider tagging + order + items + redemption record.

**Signature:**

```typescript
async function placeOrder(
  items: CartItemInput[],
  address: AddressInput,
  paymentMethod?: 'cod' | 'stripe' | 'paypal',
  couponCode?: string | null
): Promise<PlaceOrderResult>
```

**Inputs:**

```typescript
interface CartItemInput {
  product_id: string    // UUID
  quantity: number      // 1-50
}

interface AddressInput {
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

type PaymentMethod = 'cod' | 'stripe' | 'paypal'
```

**Output:**

```typescript
interface PlaceOrderResult {
  success: true
  orderId: string
  subtotal: number
  shipping: number
  discountAmount: number
  couponCode: string | null
  total: number
  clientSecret?: string         // Only for Stripe
  paymentIntentId?: string      // Only for Stripe
  paymentProvider: 'cod' | 'stripe' | 'paypal'
}
```

**Errors:**

| Message | Cause |
|---------|-------|
| `Cart is empty` | `items.length === 0` |
| `Invalid product ID in cart` | Malformed product_id |
| `Invalid quantity (must be 1–50)` | Quantity out of bounds |
| `Address field "X" is required` | Missing address field |
| `You must be logged in to place an order` | No session |
| `Insufficient stock for product X` | RPC rejection |
| `Coupon usage limit reached` | Non-fatal — order proceeds without discount |

**Example:**

```typescript
const result = await placeOrder(
  [{ product_id: '550e8400-...', quantity: 2 }],
  {
    full_name: 'Zain Shah',
    phone: '+92 300 1234567',
    line1: '123 Main St',
    city: 'Karachi',
    state: 'Sindh',
    pincode: '75500',
  },
  'stripe',
  'WELCOME10'
)

// → {
//   success: true,
//   orderId: '0cc6c3f0-...',
//   subtotal: 3998,
//   shipping: 100,
//   discountAmount: 400,
//   couponCode: 'WELCOME10',
//   total: 3698,
//   clientSecret: 'pi_3UN..._secret_...',
//   paymentIntentId: 'pi_3UN...',
//   paymentProvider: 'stripe'
// }
```

**Atomicity (v3.1+):** In v1, order creation, coupon redemption, and provider tagging were **3 separate operations**. Any failure left inconsistent state. In v2, all four concerns live in **one transaction** — if any step fails, everything rolls back. No retry logic, no compensating RPC.

**Side effects:**
- Inserts into `orders`, `order_items`, `coupon_redemptions` (if coupon)
- Decrements `products.stock`
- Increments `coupons.times_used` (if coupon)
- Queues `order-placed` email
- Marks MongoDB cart snapshot as recovered
- Revalidates `/orders`, `/admin/orders`, `/admin`, `/products`, `/`

**v3.2 fix:** The `order_placed` tracking event is now emitted on **both COD and Stripe success paths** (see `/api/track`). Previously, only COD tracked the event. Stripe orders were invisible in product analytics.

---

### confirmPayment

**File:** `src/actions/confirmPayment.ts`

Confirms a Stripe payment after Elements succeeds. Idempotent (safe to retry).

**Signature:**

```typescript
async function confirmPayment(
  orderId: string,
  paymentIntentId: string
): Promise<{ success: true; alreadyPaid: boolean }>
```

**Errors:**

| Message | Cause |
|---------|-------|
| `Missing orderId or paymentIntentId` | Empty args |
| `Unauthorized` | No session |
| `Order not found` | Invalid order ID |
| `Forbidden` | Order belongs to another user |
| `Payment intent mismatch` | Intent ID doesn't match order |
| `Payment not completed (status: X)` | Stripe says not succeeded |

**Idempotency:** Uses `withIdempotency({ scope: 'stripe-confirm', key: intentId })`. If webhook already marked it paid, this returns `{ alreadyPaid: true }` without side effects.

**Note:** Uses `retrievePayment()` (not `capturePayment()`). Stripe auto-captures on success — calling `capture()` after would throw `payment_intent_unexpected_state`.

**Example:**

```typescript
const { alreadyPaid } = await confirmPayment(
  '0cc6c3f0-...',
  'pi_3UN9j3BKb8hmG9Rn2tp4eTkC'
)
```

**v3.2 note:** This action emits the `order_placed` tracking event on success (matching the COD path). Previously the Stripe path was missing the tracking call.

---

### updateOrderStatus

**File:** `src/actions/updateOrderStatus.ts`

Admin-only order status transition. Sends status email to customer.

**Signature:**

```typescript
async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ success: true }>
```

**Allowed statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Emails triggered:**
- `shipped` → `order-shipped` email
- `delivered` → `order-delivered` email
- `cancelled` → `order-cancelled` email

**Errors:**

| Message | Cause |
|---------|-------|
| `Invalid order ID` | Empty or wrong type |
| `Invalid status: X` | Not in allowed list |
| `Unauthorized: Not logged in` | No session |
| `Forbidden: Admin access required` | Non-admin user |

**v3.2 note:** All status emails use the new editorial templates (see `docs/features.md` → Email Templates).

---

### refundPayment

**File:** `src/actions/refundPayment.ts`

Admin-only refund. For Stripe orders, calls Stripe API. For COD, marks order refunded.

**Signature:**

```typescript
async function refundPayment(
  orderId: string,
  reason?: string
): Promise<{ success: true; refundId?: string }>
```

**Errors:**

| Message | Cause |
|---------|-------|
| `Missing orderId` | Empty |
| `Unauthorized` | No session |
| `Forbidden: Admin access required` | Non-admin |
| `Order not found` | Invalid order |
| `Cannot refund order with payment status "X"` | Order not completed |
| `Missing Stripe payment intent ID` | Data integrity issue |

**Idempotency:** Refunding an already-refunded order returns `{ success: true }` with no-op.

**Side effects:**
- Calls Stripe `refunds.create`
- Updates `orders.payment_status = 'refunded'`
- Updates `orders.status = 'cancelled'`
- Appends `admin.refund` event to MongoDB `payment_transactions`
- Writes to `audit_logs`
- Revalidates admin + customer routes

---

### resendOrderEmail

**File:** `src/actions/resendOrderEmail.ts`

Admin-only manual email resend.

**Signature:**

```typescript
async function resendOrderEmail(
  orderId: string,
  template: 'order-placed' | 'order-shipped' | 'order-delivered'
): Promise<{ success: true }>
```

**v3.1 fixes:**
- Uses `payment_provider` (not legacy `payment_method`)
- Passes `discount_amount` and `coupon_code` to the email template
- Email now displays discount line correctly

**v3.2 note:** Emails now use the new editorial templates.

---

### changeUserRole

**File:** `src/actions/admin-management.ts`

**Super-admin only.** Promotes/demotes a user. Calls `admin_change_user_role` RPC.

**Signature:**

```typescript
async function changeUserRole(
  userId: string,
  newRole: 'admin' | 'customer'
): Promise<{ success: true }>
```

**Rules (enforced inside Postgres via RPC):**
- Caller must be super admin
- Cannot demote self
- Cannot demote another super admin
- Cannot change role to invalid value

**Errors:**

| Message | Cause |
|---------|-------|
| `Unauthorized` | No session |
| `Forbidden: Super admin access required` | Caller is admin but not super |
| `Target user not found` | Invalid user ID |
| `Failed to change role` | RPC rejection |

---

### Review Actions

**File:** `src/actions/reviews.ts`

#### submitReview

Create or update a review. Resets to `pending` on every submit (even edits).

```typescript
async function submitReview(input: {
  productId: string
  rating: number       // 1-5
  title?: string       // max 100 chars
  comment: string      // 10-2000 chars
}): Promise<{ success: true; isVerifiedPurchase: boolean }>
```

**Side effects:**
- Inserts or updates `product_reviews`
- Auto-detects verified purchase (user has order with status in `delivered`/`shipped`/`processing`)
- Revalidates product page + admin reviews

#### updateReviewStatus

Admin-only moderation.

```typescript
async function updateReviewStatus(
  reviewId: string,
  status: 'approved' | 'rejected'
): Promise<{ success: true }>
```

#### deleteReview

Admin-only permanent deletion.

```typescript
async function deleteReview(reviewId: string): Promise<{ success: true }>
```

---

### Coupon Actions

**File:** `src/actions/coupons.ts`

#### validateCoupon

Check if a coupon is valid for the current user and subtotal. Does not mutate.

```typescript
async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation>

interface CouponValidation {
  valid: boolean
  couponId?: string
  code?: string
  description?: string | null
  discountType?: 'percent' | 'fixed'
  discountValue?: number
  discountAmount?: number
  message?: string
  error?: string
}
```

#### createCoupon

Admin-only.

```typescript
async function createCoupon(input: {
  code: string               // 3-40 chars, uppercase alphanumeric + _ -
  description?: string
  discount_type: 'percent' | 'fixed'
  discount_value: number     // positive
  min_order_amount?: number
  max_discount_amount?: number | null
  usage_limit?: number | null
  per_user_limit?: number
  valid_until?: string | null  // ISO date
  is_active?: boolean
}): Promise<{ success: true; id: string }>
```

#### updateCoupon / deleteCoupon / toggleCouponActive

Same auth requirements. See source for exact signatures.

---

### Wishlist Actions

**File:** `src/actions/wishlist.ts`

#### toggleWishlist

Add if missing, remove if present.

```typescript
async function toggleWishlist(
  productId: string
): Promise<{ inWishlist: boolean }>
```

#### mergeWishlist

Merge guest wishlist (from localStorage) into DB. Idempotent.

```typescript
async function mergeWishlist(
  productIds: string[]
): Promise<{ count: number }>
```

**Cap:** Max 200 IDs per call.

---

## Supabase RPCs

### place_order_atomic (v2)

**Purpose:** Atomic order creation with stock deduction, coupon redemption, and payment provider tagging — **all in one transaction**.

**Signature:**

```sql
place_order_atomic(
  p_user_id        UUID,
  p_user_email     TEXT,
  p_items          JSONB,           -- [{ product_id, quantity }, ...]
  p_address        JSONB,           -- { full_name, phone, line1, city, state, pincode, ... }
  p_coupon_code    TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'cod'
) RETURNS jsonb
```

**Returns:**

```json
{
  "order_id": "0cc6c3f0-...",
  "subtotal": 3998,
  "shipping": 100,
  "discount_amount": 400,
  "coupon_code": "WELCOME10",
  "total": 3698
}
```

**What it does (in one transaction):**
1. Lock products by `id ASC` (deadlock-safe ordering)
2. Verify stock, decrement atomically
3. If `p_coupon_code` set:
   - Lock coupon row (`FOR UPDATE`)
   - Re-validate expiry, usage_limit, per_user_limit, min_order
   - If valid: increment `times_used`
4. Insert order with `coupon_code`, `discount_amount`, `payment_method`, `payment_provider`
5. Insert `order_items`
6. If coupon applied: insert `coupon_redemptions` record
7. Return summary

**Guarantees:**
- **All-or-nothing** — if any step fails, entire transaction rolls back
- **Oversell impossible** — `FOR UPDATE` serializes stock access
- **Deadlock-free** — canonical lock ordering by `product_id ASC`
- **No partial state** — coupon + order + provider are atomic

**Failure policy:** If coupon is invalid for any reason (expired, used up, min order not met), the **order still succeeds without the discount**. Only hard DB errors abort.

**Security:** `SECURITY DEFINER`, `SET search_path = public, pg_temp`, `REVOKE ALL FROM PUBLIC`, `GRANT EXECUTE TO service_role`.

**Example:**

```typescript
const { data } = await supabaseAdmin.rpc('place_order_atomic', {
  p_user_id: user.id,
  p_user_email: user.email,
  p_items: [{ product_id: '550e8400-...', quantity: 2 }],
  p_address: {
    full_name: 'Zain', phone: '...', line1: '...',
    city: 'Karachi', state: 'Sindh', pincode: '75500',
  },
  p_coupon_code: 'WELCOME10',
  p_payment_method: 'stripe',
})
```

**Correctness proof:** 10 parallel orders, stock = 5 → exactly 5 succeed. 20 parallel coupon redemptions, `usage_limit = 3` → exactly 3 succeed with discount.

---

### redeem_coupon_atomic

**Purpose:** Standalone atomic coupon redemption (kept for backward compatibility).

**Signature:**

```sql
redeem_coupon_atomic(
  p_code TEXT,
  p_user_id UUID,
  p_order_id UUID,
  p_subtotal NUMERIC
) RETURNS jsonb
```

**Note:** In v3.1+, this RPC is **no longer used by `placeOrder`**. Coupon redemption happens inside `place_order_atomic` v2. This function remains for backward compatibility with external callers.

---

### validate_coupon

**Purpose:** Read-only coupon validation.

**Signature:**

```sql
validate_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_subtotal NUMERIC
) RETURNS jsonb
```

**Returns:**

```json
{
  "valid": true,
  "coupon_id": "...",
  "code": "WELCOME10",
  "description": "10% off for new customers",
  "discount_type": "percent",
  "discount_value": 10,
  "discount_amount": 400,
  "message": "Coupon applied"
}
```

Or on failure:

```json
{ "valid": false, "error": "Coupon usage limit reached" }
```

**Checks:**
1. Coupon exists + `is_active = true`
2. `valid_from <= now()`
3. `valid_until IS NULL OR valid_until > now()`
4. `times_used < usage_limit` (if limit set)
5. `subtotal >= min_order_amount`
6. User's redemptions < `per_user_limit`

**Discount calculation:**
- Percent: `subtotal * value / 100`, capped at `max_discount_amount` if set
- Fixed: `value`
- Capped at `subtotal` (never negative total)
- Rounded to whole number

---

### admin_change_user_role

**Purpose:** Change a user's role. Super-admin only. Authorization enforced **inside Postgres**.

**Signature:**

```sql
admin_change_user_role(
  p_target_user_id UUID,
  p_new_role       TEXT
) RETURNS jsonb
```

**Returns:**

```json
{ "success": true, "user_id": "...", "new_role": "admin" }
```

**Rules:**
1. Caller (`auth.uid()`) must be super admin
2. Target must not be self (can't demote self)
3. Target must not be another super admin
4. `p_new_role` must be `'admin'` or `'customer'`

**Why inside Postgres?** The JS check in `changeUserRole` is a fast-fail optimization. The authoritative check is here. Even if a JS bypass existed, this RPC would reject.

---

### get_dashboard_stats

**Purpose:** Single-query admin aggregation.

**Signature:**

```sql
get_dashboard_stats() RETURNS jsonb
```

**Returns:**

```json
{
  "product_count": 42,
  "order_count": 187,
  "user_count": 231,
  "total_revenue": 542000,
  "status_counts": {
    "pending": 12,
    "processing": 8,
    "shipped": 15,
    "delivered": 148,
    "cancelled": 4
  }
}
```

**Performance:** Transfers 1 row instead of 10,000.

---

### get_sales_report

**Purpose:** Sales analytics over a date range. Used by `/admin/reports`.

**Signature:**

```sql
get_sales_report(
  p_from_date TIMESTAMPTZ DEFAULT NULL,
  p_to_date   TIMESTAMPTZ DEFAULT NULL
) RETURNS jsonb
```

**Returns:**

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

**Revenue filter:** Only `shipped` and `delivered` orders count.

**Date range:** `NULL` on either side means "no bound on that side".

**v3.2 note:** Reports page now uses the editorial redesign (trend badges, animated charts, status grid).

---

### get_product_sales_stats

**Purpose:** Product-level sales analytics. Used by `/admin/analytics`.

**Signature:**

```sql
get_product_sales_stats(p_limit INTEGER DEFAULT 20) RETURNS jsonb
```

**Returns:**

```json
{
  "top_products": [
    {
      "id": "...",
      "name": "Charcoal Overcoat",
      "units_sold": 47,
      "revenue": 892653,
      "order_count": 45,
      "avg_unit_price": 18992.61
    }
  ],
  "by_category": [
    { "category": "Coats", "units_sold": 47, "revenue": 892653, "order_count": 45 }
  ],
  "global": {
    "total_units_sold": 312,
    "total_revenue": 4521000,
    "total_orders_with_items": 187,
    "avg_units_per_order": 1.67
  }
}
```

**Merged with:** MongoDB `events` (views, cart adds) in `getProductPerformance()` for the abandoned flag and conversion rate.

**v3.2 note:** ProductAnalytics component now has sortable columns, abandoned filter chip, and color-coded conversion rate pills.

---

### get_product_review_stats

**Purpose:** Aggregate review stats for one product.

**Signature:**

```sql
get_product_review_stats(p_product_id UUID) RETURNS jsonb
```

**Returns:**

```json
{
  "average_rating": 4.5,
  "total_count": 24,
  "breakdown": { "5": 15, "4": 6, "3": 2, "2": 1, "1": 0 }
}
```

**Only counts `status = 'approved'`.**

---

### get_products_review_stats

**Purpose:** Batch review stats for multiple products.

**Signature:**

```sql
get_products_review_stats(p_product_ids UUID[]) RETURNS jsonb
```

**Returns:**

```json
{
  "550e8400-...": { "average_rating": 4.5, "total_count": 24 },
  "660e8400-...": { "average_rating": 5.0, "total_count": 3 }
}
```

**Use case:** Product grid needs ratings for 40 products. One call instead of 40.

---

### is_admin

**Purpose:** RLS-safe role check. Used in every policy that needs admin-only access.

**Signature:**

```sql
is_admin() RETURNS boolean
```

**Why `SECURITY DEFINER`?** Reads `profiles`, which itself has RLS. Without it, the function would recurse infinitely.

**Why `STABLE`?** Postgres caches the result within a single query.

**Why `SET search_path`?** Prevents search-path hijacking.

---

## REST API Routes

### POST /api/chat

**Purpose:** Streaming AI chatbot with tool calling.

**Auth:** None (public, rate-limited)

**Rate limit:** 20 messages/minute per IP

**Body:**

```json
{
  "messages": [
    { "role": "user", "content": "Do you have navy suits under 25000?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "Show me the cheapest" }
  ]
}
```

**Constraints:**
- Max 20 messages per request
- Max 2,000 chars per message
- Only `user` and `assistant` roles allowed (no `system`)

**Response:** Server-Sent Events (text/plain stream)

**Tools available:**
- `searchProducts({ query?, category?, minPrice?, maxPrice? })`
- `getProductById({ id })`
- `getCategories({})`
- `getMyOrders({ limit? })` — requires auth

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid JSON or payload shape |
| 429 | Rate limit exceeded |
| 503 | `GROQ_API_KEY` not configured |
| 500 | Groq API error |

---

### POST /api/track

**Purpose:** Event ingestion endpoint for the tracking SDK.

**Auth:** None (public, rate-limited)

**Rate limit:** 100 events/minute per IP

**Body:**

```json
{
  "sessionId": "uuid-v4",
  "events": [
    {
      "event": "product_view",
      "properties": { "productId": "...", "price": 1999 }
    }
  ]
}
```

**Constraints:**
- Max 20 events per call
- Event names: allowlist enforced
- Properties: any JSON

**Response:**

```json
{ "received": 1 }
```

**Side effects:**
- Server-side IP hashing (SHA-256 + salt)
- User-Agent parsing → `{ type, os, browser }`
- Upserts MongoDB `sessions` document (visitor classification, aggregate stats)
- Bulk inserts MongoDB `events` with `ordered: false`

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid JSON or payload shape |
| 429 | Rate limit exceeded |
| 500 | MongoDB storage failure |

**v3.2 note:** The `order_placed` event is now emitted on both COD and Stripe success paths (see `placeOrder` and `confirmPayment`).

---

### POST /api/cart/sync

**Purpose:** Silent cart snapshot for abandoned-cart recovery.

**Auth:** Required (returns 200 with `ok: false` if not logged in — no error leak)

**Body:**

```json
{
  "items": [
    { "id": "...", "name": "...", "price": 1999, "quantity": 1, "image": "...", "size": "L" }
  ]
}
```

**Response:**

```json
{ "ok": true }
```

**Side effects:**
- Upserts MongoDB `cart_snapshots` (keyed on `user_id`)
- Deletes snapshot if cart is empty
- Ensures indexes on first call

---

### GET /api/cart/recover

**Purpose:** Restore cart from recovery email link.

**Query:**

```
?token=<recovery-token>
```

**Response:**

```json
{
  "items": [
    {
      "id": "...",
      "name": "...",
      "price": 1999,
      "quantity": 1,
      "images": ["..."],
      "stock": 999,
      "size": "L"
    }
  ]
}
```

**Notes:**
- Returns empty `items` if token invalid or already recovered
- Never 404s — always returns 200 with `items: []`

---

### GET /api/wishlist/ids

**Purpose:** Fetch wishlist product IDs for client-side "in wishlist" checks.

**Auth:** Required (returns `{ ids: [] }` if not logged in)

**Response:**

```json
{ "ids": ["550e8400-...", "660e8400-..."] }
```

---

### GET /api/recommendations/recently-viewed

**Purpose:** Fetch product details for recently-viewed IDs.

**Query:**

```
?ids=uuid1,uuid2,uuid3
```

**Response:**

```json
{
  "products": [
    {
      "id": "...",
      "name": "...",
      "price": 1999,
      "compare_at_price": 2499,
      "images": ["..."],
      "stock": 10,
      "is_new_arrival": true,
      "category_main": "Suits"
    }
  ]
}
```

**Cap:** Max 12 IDs per request.

---

### POST /api/auth/login-success

**Purpose:** Called after successful login. Records timestamp + optionally sends welcome-back email.

**Auth:** Session required

**Rules:**
- First login ever → record only, no email
- Admin users → skip email
- Sent in last 7 days → skip email
- Otherwise → queue welcome-back email

**Response:**

```json
{ "ok": true, "isFirstLogin": false, "emailSent": true }
```

**Side effects:**
- Updates `profiles.last_login_at`
- If email sent: updates `profiles.welcome_back_sent_at`

**v3.1 fix:** Throttle marker only set if `queueEmail` returned a valid `logId`. On QStash failure, the marker isn't set — user gets another chance next login.

**v3.2 note:** Welcome-back email now uses the new editorial template (violet accent).

---

### POST /api/auth/welcome

**Purpose:** Queue a welcome email after signup.

**Auth:** None (rate-limited)

**Body:**

```json
{
  "email": "user@example.com",
  "fullName": "Zain Shah",
  "userId": "550e8400-..."     // optional
}
```

**Response:**

```json
{ "success": true }
```

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid JSON or shape |
| 429 | Rate limit exceeded |

**v3.2 note:** Welcome email now uses the new editorial template (blue accent).

---

### GET /api/admin/export

**Purpose:** CSV export for admin.

**Auth:** Admin session required

**Query params:**

| Param | Values | Default |
|-------|--------|---------|
| `type` | `orders` \| `payments` \| `emails` \| `users` \| `audit` | required |
| `fromDate` | ISO date | none |
| `toDate` | ISO date | none |
| `status` | status string | none |
| `provider` | `cod` \| `stripe` | none |

**Response:**

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="orders_2026-10-14_15-30-00.csv"

order_id,created_at,customer_email,status,payment_status,...
```

**Limit:** 10,000 rows per export. UTF-8 BOM for Excel compatibility.

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid type |
| 401 | No session |
| 403 | Not admin |
| 500 | DB error |

**v3.2 note:** For PDF print views, see [Print Routes](#print-routes-new-v32) below.

---

### GET /api/admin/live-users

**Purpose:** Live sessions (active in last 5 minutes). Used by the dashboard Live Users widget.

**Auth:** Admin session required

**Response:**

```json
{
  "sessions": [
    {
      "session_id": "...",
      "user_email": "user@example.com",
      "user_name": "Zain Shah",
      "visitor_type": "returning",
      "device": { "type": "mobile", "os": "iOS", "browser": "Safari" },
      "page_view_count": 12,
      "product_view_count": 5,
      "last_seen_at": "2026-10-14T15:30:00.000Z"
    }
  ]
}
```

**Errors:**

| Status | Cause |
|--------|-------|
| 401 | No session |
| 403 | Not admin |

---

### GET /api/admin/payment-detail

**Purpose:** Fetch payment transaction details from MongoDB.

**Auth:** Admin session required

**Query:**

```
?orderId=<uuid>
```

**Response:**

```json
{
  "orderId": "...",
  "mongoDoc": {
    "provider": "stripe",
    "provider_txn_id": "pi_...",
    "amount": 369800,
    "currency": "pkr",
    "status": "succeeded",
    "method": "card",
    "webhook_events": [
      { "event": "payment_intent.succeeded", "at": "2026-10-14T15:30:00.000Z", "raw": {...} }
    ],
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Errors:**

| Status | Cause |
|--------|-------|
| 401 | No session |
| 403 | Not admin |
| 400 | Missing orderId |

---

### POST /api/webhooks/stripe

**Purpose:** Stripe event handler.

**Auth:** Signature verification via `STRIPE_WEBHOOK_SECRET`

**Header:** `stripe-signature`

**Body:** Raw Stripe event JSON

**Handled events:**
- `payment_intent.succeeded` — Marks order paid, logs transaction, sends email (only if not already completed)
- `payment_intent.payment_failed` — Marks order failed, logs, sends email
- `charge.refunded` — Marks order refunded, logs

**Idempotency:** Each event ID processed at most once (Redis SETNX with atomic Lua release, 24h TTL).

**v3.1 fix:** Before queueing `payment-confirmed` email, checks `orders.payment_status`. If already `completed` (client-side `confirmPayment` won the race), skips the email — no more duplicates.

**v3.2 note:** All emails sent by the webhook use the new editorial templates.

**Response:** Always 200 on success (even if duplicate) so Stripe stops retrying.

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Missing signature or invalid |
| 500 | Handler threw (triggers Stripe retry) |

---

### POST /api/jobs/send-email

**Purpose:** QStash job handler for email delivery.

**Auth:** QStash signature verification

**Header:** `upstash-signature`

**Body:**

```json
{
  "logId": "mongo-object-id",
  "template": "order-placed",
  "to": "user@example.com",
  "userId": "...",
  "data": { ... }
}
```

**Behavior:**
1. Verify QStash signature
2. Render React Email template (editorial style in v3.2)
3. Send via Gmail SMTP
4. Update MongoDB `email_logs` with `status: 'sent'` + `provider_message_id`

**Retries:** Returns 500 on failure → QStash retries up to 3x with backoff.

**Render errors:** Returns 200 (don't retry — deterministic failure).

**v3.2 note:** All 10 templates redesigned with theme-matched editorial style. Same rendering pipeline, new visual output.

---

### GET /api/cron/daily

**Purpose:** Combined daily cron (Vercel Hobby compatible).

**Auth:** `Authorization: Bearer ${CRON_SECRET}`

**Behavior:**
1. Runs low-stock alert (throttled 12h)
2. Runs abandoned-cart recovery (throttled 50min)

**Response:**

```json
{
  "success": true,
  "timestamp": "2026-10-16T09:00:00.000Z",
  "lowStock": { "sent": true, "count": 3 },
  "abandonedCarts": { "processed": 5, "sent": 5, "failed": 0 }
}
```

**Throttled response:**

```json
{
  "success": true,
  "timestamp": "2026-10-16T09:11:52.066Z",
  "lowStock": { "httpStatus": 200, "skipped": true, "reason": "throttled", "minutesSince": 11 },
  "abandonedCarts": { "httpStatus": 200, "skipped": true, "reason": "throttled", "minutesSince": 11 }
}
```

**v3.2 fixes:**
- **Throttle on success only** — If `queueEmail` fails, the throttle key is **not** set. Next scheduled run retries automatically. Previously, a failed run still set the throttle — the alert never fired.
- **Param order fixed** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — was passing args wrong, silently limiting reminders.

**Individual cron endpoints** also exist:
- `GET /api/cron/low-stock-alert`
- `GET /api/cron/abandoned-carts`

---

### GET /api/cron/low-stock-alert

**Purpose:** Send admin alert when products fall below stock threshold.

**Auth:** `Authorization: Bearer ${CRON_SECRET}`

**Throttle:** 12 hours (only set on real success — v3.2 fix)

**Behavior:**
1. Check throttle key `throttle:alert:low-stock`
2. If throttled → return `{ skipped: true, reason: 'throttled', minutesSince: N }`
3. Query products with `stock > 0 AND stock < 10`
4. Queue `low-stock-alert` email to `ADMIN_EMAIL`
5. If queue succeeds → set throttle key
6. If queue fails → **do not set throttle** (retry next run)

**Response:**

```json
{
  "sent": true,
  "count": 4,
  "logId": "mongo-object-id"
}
```

**Errors:**

| Status | Cause |
|--------|-------|
| 401 | Missing or invalid CRON_SECRET |
| 500 | `ADMIN_EMAIL` missing or queue failed |

---

### GET /api/cron/abandoned-carts

**Purpose:** Send recovery emails for carts abandoned ≥2 hours.

**Auth:** `Authorization: Bearer ${CRON_SECRET}`

**Throttle:** 50 minutes (only set on real success — v3.2 fix)

**Behavior:**
1. Check throttle key `throttle:cron:abandoned-carts`
2. If throttled → return `{ skipped: true, reason: 'throttled', minutesSince: N }`
3. `ensureCartIndexes()` — idempotent
4. `findAbandonedCarts(minAgeHours=2, maxReminders=3, limit=100)` — **v3.2 fixed param order**
5. For each cart:
   - Generate/lookup 5%-off coupon (idempotent)
   - Queue `abandoned-cart` email
   - If queued successfully → `markReminderSent(cartId, couponCode)`
   - If queue failed → **do not mark as sent** (retry next run)
6. If all succeeded → set throttle key

**Response:**

```json
{
  "processed": 1,
  "sent": 1,
  "failed": 0
}
```

**Partial failure response:**

```json
{
  "processed": 5,
  "sent": 3,
  "failed": 2,
  "errors": [
    "user1@example.com: queue failed",
    "user2@example.com: queue failed"
  ]
}
```

**Criteria for eligible carts:**
- `item_count > 0`
- `recovered_at: null`
- `updated_at <= now - 2 hours`
- `recovery_email_count < 3`
- Never reminded OR last reminder > 7 days ago

---

### GET /api/cron/keep-alive

**Purpose:** Prevents free-tier databases from pausing due to inactivity.

**Auth:** `Authorization: Bearer ${CRON_SECRET}`

**Behavior:**
1. Ping Supabase (products count)
2. Ping MongoDB (events estimated count)
3. Return latency for both

**Response:**

```json
{
  "timestamp": "2026-10-16T00:00:00.000Z",
  "supabase": { "ok": true, "latencyMs": 45, "error": null },
  "mongodb": { "ok": true, "latencyMs": 120, "error": null }
}
```

**Triggered by:** GitHub Actions `keep-alive.yml` (twice daily).

**Why:** Supabase Free pauses after 7 days of inactivity. MongoDB M0 pauses after 60 days.

---

## Print Routes (NEW v3.2)

### GET /admin/exports/print/[type]

**Purpose:** Print-optimized PDF-ready views for all 5 export types. **Zero external dependencies** — uses browser's native "Print → Save as PDF".

**Type:** Server Component (not a JSON API — renders HTML)

**Auth:** Admin session required (verified server-side; redirects to `/` if not admin)

**Path params:**

| Param | Values |
|-------|--------|
| `type` | `orders` \| `payments` \| `emails` \| `users` \| `audit` |

**Query params (all optional, filter-aware):**

| Param | Values |
|-------|--------|
| `fromDate` | ISO date |
| `toDate` | ISO date |
| `status` | status string |
| `provider` | `cod` \| `stripe` |

**Response:** HTML document rendered with print CSS:

```css
@page { size: A4 landscape; margin: 10mm }
@media print {
  body > * { visibility: hidden }
  #export-print-area, #export-print-area * { visibility: visible }
  thead { display: table-header-group }
  tr { page-break-inside: avoid }
}
```

**Behavior:**
1. Verify admin session server-side
2. Parse filters from URL params
3. Fetch filtered data via `getOrdersForExport` / `getPaymentsForExport` / etc.
4. Render `<ExportPrintView />` with columns, rows, filters
5. Only `#export-print-area` visible during print

**Available column schemas:**

| Type | Columns |
|------|---------|
| **orders** | order_id, created_at, customer_email, status, payment_status, payment_provider, subtotal, shipping, total, items_count, shipping_city |
| **payments** | order_id, created_at, provider, provider_txn_id, amount, currency, status, method |
| **emails** | sent_at, template, recipient, status, message_id, error |
| **users** | user_id, full_name, email, phone, role, city, state, created_at |
| **audit** | timestamp, actor_email, action, target_type, target_id, ip_hash |

**Format helpers:**
- `format: 'date'` → "5 Oct 2026"
- `format: 'currency'` → "₹18,999"
- Empty / null → "—"

**Example URL:**

```
/admin/exports/print/orders?fromDate=2026-10-01&toDate=2026-10-31&status=delivered
```

**Admin workflow:**
1. Open `/admin/exports`
2. Set filters (From / To / Status / Provider)
3. Click **Print** on any card
4. New tab opens with print-optimized view
5. Click **Print / Save as PDF** button
6. Browser's native print dialog → Save as PDF or send to printer

**Why zero-dependency:**
- **No Puppeteer** — 300MB Chromium binary, 3-8s cold start, not serverless-compatible
- **No PDF library** (pdfkit, pdfmake, jspdf) — 200-500KB bundle, manual layout, encoding issues
- **Browser-native print** is superior in every dimension:
  - 0 bytes bundle
  - 0s cold start
  - Full CSS support
  - WYSIWYG preview
  - Custom paper size, margins, headers/footers
  - High-DPI output
  - Font embedding

**Row limit:** 10,000 rows per export (same as CSV).

**Files:**
- `src/app/admin/exports/print/[type]/page.tsx` — Server component with admin verification
- `src/components/admin/ExportPrintView.tsx` — Print-optimized render component

**Errors:**

| Behavior | Cause |
|----------|-------|
| Redirect to `/` | Not authenticated or not admin |
| 404 | Invalid type param |
| Empty table | No data matching filters |

**See also:** [Architecture → PDF Print Export Pipeline](./architecture.md#pdf-print-export-pipeline) for the full design rationale.

---

## Error Codes

### Server Action errors

Server Actions throw `Error` objects. Messages are surfaced to the client via toast.

**Common patterns:**

| Pattern | Meaning |
|---------|---------|
| `Unauthorized` | No session |
| `Forbidden: Admin access required` | Non-admin caller |
| `Forbidden: Super admin access required` | Admin but not super admin |
| `Invalid X: <value>` | Zod validation failed |
| `X not found` | Missing entity |
| `You must be logged in to X` | Auth required for user action |

### HTTP status codes

| Code | Meaning |
|------|---------|
| 200 | Success (or intentional no-op) |
| 400 | Bad request (invalid JSON, missing fields) |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Rate limit headers

Rate-limited responses include:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1728740400000
Retry-After: 45
```

**Limiter tiers:**

| Route prefix | Limit |
|-------------|-------|
| `/auth` | 10/min |
| `/admin` | 60/min |
| `/checkout`, `/api/orders` | 20/min |
| `/cart`, `/api/cart` | 30/min |
| `/api/track` | 100/min |
| `/api/chat` | 20/min |
| `/search`, `/api/search` | 30/min |
| Everything else | 300/min |

**v3.2 note:** Print routes (`/admin/exports/print/*`) fall under the `/admin` tier — 60 requests/min.

---

## Further Reading

- [Architecture Deep Dive](./architecture.md) — Includes PDF Print Export Pipeline + Editorial Design System
- [Security Deep Dive](./security.md)
- [Database Schema](./database.md)
- [Testing Strategy](./testing.md)
- [Features](./features.md) — Feature-level documentation

---

<p align="center">
  <em>Last updated: 2026-10-16 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```

---