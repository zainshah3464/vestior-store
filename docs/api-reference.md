# API Reference

> **Audience:** Engineers integrating with VESTIOR, or extending it.
>
> **Structure:** Server Actions, RPC functions, and API routes with full signatures, examples, and error contracts.

---

## Table of Contents

- [Conventions](#conventions)
- [Server Actions](#server-actions)
  - [placeOrder](#placeorder)
  - [confirmPayment](#confirmpayment)
  - [updateOrderStatus](#updateorderstatus)
  - [refundPayment](#refundpayment)
  - [resendOrderEmail](#resendorderemail)
  - [submitReview / updateReviewStatus / deleteReview](#review-actions)
  - [validateCoupon / createCoupon / updateCoupon / deleteCoupon](#coupon-actions)
  - [toggleWishlist / mergeWishlist](#wishlist-actions)
- [Supabase RPCs](#supabase-rpcs)
  - [place_order_atomic](#place_order_atomic)
  - [redeem_coupon_atomic](#redeem_coupon_atomic)
  - [validate_coupon](#validate_coupon)
  - [get_dashboard_stats](#get_dashboard_stats)
  - [get_product_review_stats](#get_product_review_stats)
  - [get_products_review_stats](#get_products_review_stats)
- [REST API Routes](#rest-api-routes)
  - [POST /api/track](#post-apitrack)
  - [POST /api/cart/sync](#post-apicartsync)
  - [GET /api/cart/recover](#get-apicartrecover)
  - [GET /api/admin/export](#get-apiadminexport)
  - [POST /api/webhooks/stripe](#post-apiwebhooksstripe)
  - [POST /api/jobs/send-email](#post-apijobssend-email)
  - [GET /api/cron/daily](#get-apicrondaily)
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
})
```

### REST API Routes

Next.js route handlers under `src/app/api/`. They:

- Use standard HTTP methods (GET, POST, PUT, DELETE)
- Return JSON with proper status codes
- Support `Authorization` header where required

---

## Server Actions

### placeOrder

**File:** `src/actions/placeOrder.ts`

Creates an order atomically with stock deduction, optional coupon redemption, and payment intent creation.

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
| `Coupon usage limit reached` | Coupon exhausted (non-fatal — order proceeds without discount) |

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

**Side effects:**
- Inserts into `orders`, `order_items`
- Decrements `products.stock`
- Inserts into `coupon_redemptions` (if coupon)
- Increments `coupons.times_used` (if coupon)
- Queues `order-placed` email
- Marks MongoDB cart snapshot as recovered
- Revalidates `/orders`, `/admin/orders`, `/admin`, `/products`, `/`

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

**Example:**

```typescript
const { alreadyPaid } = await confirmPayment(
  '0cc6c3f0-...',
  'pi_3UN9j3BKb8hmG9Rn2tp4eTkC'
)
```

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

**Example:**

```typescript
await updateOrderStatus('0cc6c3f0-...', 'shipped')
// → Customer receives "Your order is on the way" email
```

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

**Example:**

```typescript
await resendOrderEmail('0cc6c3f0-...', 'order-placed')
// → Customer gets "Your order is confirmed" email again
```

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

**Errors:**

| Message | Cause |
|---------|-------|
| `Review must be at least 10 characters` | Comment too short |
| `You must be logged in to review` | No session |
| `Invalid review` | Zod failure |

**Side effects:**
- Inserts or updates `product_reviews`
- Auto-detects verified purchase (user has order with status in delivered/shipped/processing)
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

**Example:**

```typescript
const result = await validateCoupon('WELCOME10', 3998)
// → {
//   valid: true,
//   couponId: '...',
//   code: 'WELCOME10',
//   discountType: 'percent',
//   discountValue: 10,
//   discountAmount: 400,
//   message: 'Coupon applied'
// }
```

#### createCoupon

Admin-only coupon creation.

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

### place_order_atomic

**Purpose:** Atomic order creation with stock deduction. Prevents oversell under concurrency.

**Signature:**

```sql
place_order_atomic(
  p_user_id UUID,
  p_user_email TEXT,
  p_items JSONB,      -- [{ product_id, quantity }, ...]
  p_address JSONB     -- { full_name, phone, line1, city, state, pincode, ... }
) RETURNS jsonb
```

**Returns:**

```json
{
  "order_id": "0cc6c3f0-...",
  "subtotal": 3998,
  "shipping": 100,
  "total": 4098
}
```

**Guarantees:**
- All stock is locked via `FOR UPDATE` before any decrement
- Rows locked in `product_id ASC` order (deadlock-free)
- Rollback on any error
- **Oversell is impossible**

**Errors raised:**
- `Insufficient stock for product X` — if any item's stock < qty
- `Product not found` — if product_id invalid
- `Product is not active` — if `is_active = false`

**Example:**

```typescript
const { data } = await supabaseAdmin.rpc('place_order_atomic', {
  p_user_id: user.id,
  p_user_email: user.email,
  p_items: [{ product_id: '550e8400-...', quantity: 2 }],
  p_address: { full_name: 'Zain', phone: '...', line1: '...', city: 'Karachi', state: 'Sindh', pincode: '75500' },
})
```

---

### redeem_coupon_atomic

**Purpose:** Atomic coupon redemption. Prevents exceeding usage limits.

**Signature:**

```sql
redeem_coupon_atomic(
  p_code TEXT,
  p_user_id UUID,
  p_order_id UUID,
  p_subtotal NUMERIC
) RETURNS jsonb
```

**Returns:**

```json
{
  "valid": true,
  "coupon_id": "...",
  "code": "WELCOME10",
  "discount_amount": 400
}
```

Or on failure:

```json
{
  "valid": false,
  "error": "Coupon usage limit reached"
}
```

**Guarantees:**
- Re-validates after acquiring lock (defends against TOCTOU)
- `FOR UPDATE` lock on coupon row
- Increments `times_used` and inserts redemption in same transaction

**Correctness proof:** 20 concurrent requests, `usage_limit = 3` → exactly 3 succeed.

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

**Returns same shape as `redeem_coupon_atomic`** but does not mutate.

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

---

### get_dashboard_stats

**Purpose:** Single-query admin aggregation. Replaces 4 separate client queries.

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

**Performance:** Transfers 1 row instead of 10,000. Critical for scale.

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

**Purpose:** Batch review stats for multiple products (for product listings).

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

## REST API Routes

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

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid JSON or payload shape |
| 429 | Rate limit exceeded |
| 500 | MongoDB storage failure |

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
Content-Disposition: attachment; filename="orders_2026-10-12_15-30-00.csv"

order_id,created_at,customer_email,status,payment_status,...
```

**Limit:** 10,000 rows per export.

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid type |
| 401 | No session |
| 403 | Not admin |
| 500 | DB error |

---

### POST /api/webhooks/stripe

**Purpose:** Stripe event handler.

**Auth:** Signature verification via `STRIPE_WEBHOOK_SECRET`

**Header:** `stripe-signature`

**Body:** Raw Stripe event JSON

**Handled events:**
- `payment_intent.succeeded` — Marks order paid, logs transaction, sends email
- `payment_intent.payment_failed` — Marks order failed, logs, sends email
- `charge.refunded` — Marks order refunded, logs

**Idempotency:** Each event ID processed at most once (Redis SETNX, 24h TTL).

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
2. Render React Email template
3. Send via Gmail SMTP
4. Update MongoDB `email_logs` with `status: 'sent'` + `provider_message_id`

**Retries:** Returns 500 on failure → QStash retries up to 3x with backoff.

**Render errors:** Returns 200 (don't retry — deterministic failure).

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
  "lowStock": { "sent": true, "count": 3 },
  "abandonedCarts": { "processed": 5, "sent": 5, "failed": 0 }
}
```

**Individual cron endpoints** also exist:
- `GET /api/cron/low-stock-alert`
- `GET /api/cron/abandoned-carts`

---

## Error Codes

### Server Action errors

Server Actions throw `Error` objects. Messages are surfaced to the client via toast.

**Common patterns:**

| Pattern | Meaning |
|---------|---------|
| `Unauthorized` | No session |
| `Forbidden: Admin access required` | Non-admin caller |
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

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [Database Schema](./database.md)
- [Testing Strategy](./testing.md)

---

<p align="center">
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
``