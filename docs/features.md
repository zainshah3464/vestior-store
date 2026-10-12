# Feature Documentation

> **Audience:** Product managers, QA, and anyone exploring what VESTIOR can do.
>
> **Structure:** Each feature has a use case, technical implementation, and edge cases.

---

## Table of Contents

- [Customer Features](#customer-features)
  - [Homepage](#homepage)
  - [Product Discovery](#product-discovery)
  - [Product Detail](#product-detail)
  - [Cart](#cart)
  - [Checkout](#checkout)
  - [Orders](#orders)
  - [Reviews](#reviews)
  - [Wishlist](#wishlist)
  - [Profile](#profile)
  - [Authentication](#authentication)
- [Admin Features](#admin-features)
  - [Dashboard](#dashboard)
  - [Products](#products)
  - [Orders](#orders-1)
  - [Payments](#payments)
  - [Reviews Moderation](#reviews-moderation)
  - [Coupons](#coupons)
  - [Abandoned Carts](#abandoned-carts)
  - [Analytics](#analytics)
  - [Emails](#emails)
  - [Audit Logs](#audit-logs)
  - [Exports](#exports)
  - [Users](#users)
- [Marketing Features](#marketing-features)
  - [Recommendations](#recommendations)
  - [Abandoned Cart Recovery](#abandoned-cart-recovery)
  - [Coupon System](#coupon-system)
  - [SEO](#seo)
  - [Analytics Tracking](#analytics-tracking)

---

## Customer Features

### Homepage

**Use case:** First impression. Showcase brand, guide discovery, drive conversion.

**Sections:**
1. **Hero** — Full-screen, image background, animated heading ("ART OF ELEGANCE"), CTA buttons
2. **Category grid** — 8 categories with hover animations
3. **Featured collection** — Curated products, horizontal scroll
4. **New arrivals** — Latest products, horizontal scroll
5. **Trending now** — Computed from tracking events

**Technical:**
- Server Component with `revalidate: 300`
- `Promise.all` for parallel data fetching (featured, new arrivals, trending)
- Hero images use `next/image` with `priority` + `sizes` for responsive
- Below-fold sections lazy-loaded with `RecommendedRow`

**Edge cases:**
- Empty catalog → shows friendly "No products" message
- Trending fallback → newest products if no events
- Slow network → ISR serves cached version

---

### AI Shopping Assistant

**Use case:** Customers ask natural-language questions about products, categories, or orders.

**Features:**
- Floating chat widget (bottom-right)
- Streaming responses (word-by-word)
- Suggested prompts on empty state
- Simple markdown (bold, lists, code)
- Session-scoped history (sessionStorage)
- Clear conversation button
- Hidden on `/admin/*` pages

**Capabilities:**
- Search products by name, category, price range
- Get product details
- List categories
- Retrieve user's own orders (auth required)

**Technical:**
- Groq LPU inference (`openai/gpt-oss-120b`)
- Vercel AI SDK v5 with tool calling
- `stopWhen: stepCountIs(3)` — max 3 tool calls per turn
- Rate limit: 20 messages/min/IP
- Session ID in cookie

**Edge cases:**
- No products found → suggests alternatives
- Not logged in for order query → asks to sign in
- Groq down → 503 with friendly error
- Rate limit hit → 429 with retry hint

### Product Discovery

**Use case:** Customer wants to find specific products quickly.

**Features:**

**Search:**
- Debounced input (300ms) — no hammering
- Matches product names via Postgres `ILIKE` (case-insensitive)
- Recent searches saved in localStorage
- Popular searches as quick-pick chips
- Results show thumbnail + name + price + badges

**Filters (products page):**
- **Category** — All / Pants / Shirts / Coats / etc.
- **Price range** — Min + Max inputs, "Apply Price" button
- **In-stock only** — Toggle
- **Sort** — Newest, Price ↓, Price ↑, Top Rated, Most Popular
- **Active chips** — Remove each filter individually
- **Mobile drawer** — Bottom sheet with all filters

**Technical:**
- Filters parsed from URL search params (`parseFilters`)
- URL updates via `router.push` — shareable/bookmarkable
- Server-side filtering — DB does the work
- `getBatchRatingSummaries` for rating-based sort
- Empty state with "Clear all filters" link

**Edge cases:**
- No results → friendly message + clear filters link
- Invalid URL params → silently ignored, defaults used
- Rapid filter changes → debounced to prevent request spam
- Back button → restores previous filter state

---

### Product Detail

**Use case:** Customer wants full info before buying.

**Sections:**
1. **Image gallery** — Multi-image with prev/next arrows, thumbnail strip
2. **Info** — Name, category, price, compare price, discount %
3. **Size selector** — XS through 3XL + Custom
4. **Quantity picker** — 1 to available stock
5. **Stock indicator** — Green "X in stock" or red "Out of stock"
6. **Add to cart** — Large CTA
7. **Actions** — Wishlist toggle, Copy link, WhatsApp share
8. **Description**
9. **Trust badges** — Free shipping, Secure payment, Easy returns
10. **Reviews section** — Average rating, breakdown, list, submit form
11. **Recommendations** — "You May Also Like" + "Related Products" + "Recently Viewed"

**Technical:**
- `generateMetadata` for dynamic OG images
- JSON-LD `ProductSchema` with reviews + aggregate rating
- ISR via parent page (`revalidate: 300`)
- Review form is client-only; other sections RSC
- `trackViewed()` writes to localStorage for "Recently Viewed"
- `track('product_view', ...)` fires on mount

**Edge cases:**
- Product deleted mid-session → `notFound()` (404)
- Single image → arrows hidden
- Out of stock → "Add to Cart" disabled
- Unauthenticated user writes review → prompt to sign in
- User already reviewed → form pre-fills with existing (editing)

---

### Cart

**Use case:** Customer reviews items before checkout.

**Features:**
- Item list with thumbnail, name, price, quantity
- Quantity adjust (with stock clamp)
- Remove individual items
- Clear entire cart
- **Coupon field** with apply/remove
- Order summary: subtotal, discount, shipping, total
- Free-shipping progress bar (add ₹X more for free shipping)
- Empty state with CTA

**Technical:**
- Cart state in localStorage
- `cartUpdated` custom event for reactive count in navbar
- Deduplication: same product+size merged
- Clamps quantity to stock (in case stock dropped)
- Server sends order with only `{ product_id, quantity }` — server recalculates prices
- `CartTracker` syncs cart to MongoDB (debounced 2s) for abandoned-cart recovery

**Edge cases:**
- Product deleted while in cart → cart page shows placeholder
- Stock drops to 0 → checkout rejects with clear message
- Coupon invalid at checkout time → order proceeds without discount, user notified
- Multiple browser tabs → cart syncs via storage events (partial)

---

### Checkout

**Use case:** Convert cart to order.

**Flow:**
1. **Shipping step** — Address form, auto-filled from profile
2. **Review step** — Order summary, payment method selector, coupon field
3. **Payment** — COD (immediate) or Stripe Elements (card)

**Features:**
- **Progress tracker** — Visual step indicator
- **Payment method** — COD / Card (extensible)
- **Coupon** — Applied at any step, validated server-side
- **Address** — Auto-save? No (privacy) — user profile updated separately
- **Order summary** — Sticky sidebar on desktop, top card on mobile
- **Card payment** — Stripe Elements with night theme

**Technical:**
- Server Action `placeOrder` validates all inputs with Zod
- Atomic transaction creates order + decrements stock
- Coupon redemption happens atomically after order creation
- Payment intent created if Stripe selected
- Client receives `client_secret`, mounts `<Elements>`
- On success: `confirmPayment` action verifies with Stripe API
- Webhook also confirms (dual confirmation)

**Edge cases:**
- Not logged in → redirect to login
- Empty cart → redirect to cart page
- Insufficient stock → clear error message
- Coupon became invalid between apply and order → order proceeds without it, user notified
- Stripe intent creation fails → user stays on page, can retry
- Network fails during payment → user sees error, can retry
- User closes tab mid-payment → session remains, user can resume from `/orders`

---

### Orders

**Use case:** Customer tracks their purchase.

**Features:**
- **Order list** — All orders, newest first
- **Real-time status** — Updates without refresh (Supabase Realtime)
- **Filter tabs** — All / Pending / Processing / Shipped / Delivered / Cancelled
- **Order card** — ID, date, status, items preview, total
- **Order detail** — Progress tracker, items, address, payment info
- **Invoice** — Printable view with print-optimized CSS
- **Refresh button** — Manual refresh for impatient users

**Technical:**
- `OrdersRealtime` subscribes to Supabase changes on `orders` table
- Filtered by `user_id = auth.uid()`
- Detail page uses `fetchOrderDetail` which joins items + products + customer + payment (MongoDB)
- Invoice uses `getInvoiceData` — pure HTML with `@media print` styles

**Edge cases:**
- Order from 2 years ago → still loads
- Deleted product → order still shows (denormalized `product_name`)
- Payment pending → banner warns "Payment not completed"
- Refunded → purple banner "This order has been refunded"

---

### Reviews

**Use case:** Customer shares experience, builds trust for others.

**Features:**
- **Average rating** — Big number + stars
- **Breakdown** — Per-star distribution bars
- **Sort** — Verified purchases first, then newest
- **Show more** — Paginated 5 at a time
- **Submit form** — Star rating, title, comment
- **Edit own review** — Pre-filled form
- **Verified badge** — For users with purchase history
- **Moderation note** — "Pending approval" message after submit

**Technical:**
- One review per user per product (UNIQUE constraint)
- Rating 1-5, comment 10-2000 chars
- Verified purchase = user has an order with `status IN (delivered, shipped, processing)`
- All submissions go to `pending` status (admin approves)
- `get_product_review_stats` RPC returns aggregate (fast)
- Schema.org `Review` markup for Google stars

**Edge cases:**
- Not logged in → "Sign in to write a review"
- Already reviewed → form is "Edit Your Review"
- Editing approved review → resets to pending
- Out-of-stock product → still reviewable (if purchased before)

---

### Wishlist

**Use case:** Save products for later.

**Features:**
- **Heart toggle** — On product cards and detail page
- **Guest mode** — localStorage-based
- **Login merge** — Guest wishlist auto-merged on login
- **Wishlist page** — Grid with "Add to Cart" + "Remove"
- **Navbar badge** — Live count
- **Optimistic UI** — Instant feedback, rollback on error

**Technical:**
- Supabase `wishlists` table (user_id, product_id, created_at)
- Unique constraint prevents duplicates
- `useWishlist` context in `WishlistProvider`
- On login: `mergeWishlist(guestIds)` via Server Action (idempotent)

**Edge cases:**
- Empty wishlist → friendly message with "Browse Products" CTA
- Product out of stock → still in wishlist, "Out of Stock" badge
- Same product added twice → deduped server-side
- Rapid toggle clicks → debounced client-side (best-effort)

---

### Profile

**Use case:** Update personal info for faster checkout.

**Features:**
- Name, phone, address (line1, line2, city, state, pincode)
- Save button with loading state
- Profile auto-fills checkout address

**Technical:**
- Supabase `profiles` table (RLS: user sees own)
- Form state local, saved on submit
- `upsert` pattern (`onConflict: 'id'`)

**Edge cases:**
- Never filled address → checkout starts empty
- Invalid phone format → no validation (accepts any string)
- Same email as existing → no conflict (email is unique, but not editable)

---

### Authentication

**Use case:** Secure access to account.

**Features:**
- **Email/password signup** — Name, email, password (min 6 chars)
- **Email verification** — Required before login
- **Login** — Email + password
- **Google OAuth** — One-click
- **Logout** — Clears session
- **Password reset** — Supabase-managed

**Technical:**
- Supabase Auth with HTTP-only cookies
- PKCE for OAuth flow
- Middleware refreshes tokens on every request
- `AuthProvider` context exposes `user` + `loading`

**Edge cases:**
- Unverified email login → clear message
- Wrong password → "Invalid credentials"
- OAuth fails → redirects to login with error query
- Session expires → middleware refreshes silently
- Multiple tabs → session synced across tabs (cookies)

---

## Admin Features

### Dashboard

**Use case:** At-a-glance view of business health.

**Metrics:**
- Total products, orders, users
- Total revenue (completed orders)
- Average order value
- 7-day revenue chart
- Order status distribution (pie)
- Recent 5 orders
- Trend deltas (revenue vs previous period, order count)

**Technical:**
- Single RPC call (`get_dashboard_stats`) for aggregates
- Recharts for visualization (dynamically imported)
- Parallel data fetch with `Promise.all`

**Edge cases:**
- Zero orders → shows empty state, no crash
- Massive order volume → RPC returns one row regardless

---

### Products

**Use case:** Manage catalog.

**Features:**
- **List** — Searchable table, category filter, pagination
- **Stats** — Total, active, low stock, out of stock
- **Create** — Multi-image upload, all fields
- **Edit** — Same as create + existing image management
- **Delete** — (Not exposed; use `is_active = false`)

**Technical:**
- Images uploaded to Supabase Storage → public URLs
- `parseProductImages` handles JSON, Postgres array, plain URL formats
- Stock display with "Low" warning (< 10) and "Out" (0)

**Edge cases:**
- Image upload fails → toast error, product not created
- 5MB+ image → still uploads (no size limit enforced)
- Product with no image → placeholder shown
- Concurrent edits → last write wins

---

### Orders

**Use case:** Fulfill orders.

**Features:**
- **List** — Filter by status, search by order ID/email, paginated
- **Detail** — Full customer + items + payment info
- **Status update** — Dropdown (pending → processing → shipped → delivered → cancelled)
- **Resend email** — Manual re-send of any order email
- **Refund** — Stripe refund API
- **Invoice** — Print-optimized
- **Audit trail** — Shows every admin action on this order

**Technical:**
- Status updates trigger customer emails automatically
- Refund calls Stripe, then updates order status
- All actions logged to audit trail
- Order detail joins Supabase (order + items) with MongoDB (payment + audit)

---

### Payments

**Use case:** Monitor transactions, issue refunds.

**Features:**
- **Stats** — Total revenue, today revenue, success rate, Stripe revenue
- **Table** — All payments with order ID, customer, amount, status
- **Filters** — Provider, status, date range, search
- **Detail modal** — Shows webhook timeline from MongoDB
- **Refund** — Direct from modal

**Technical:**
- Data merged from Supabase (order info) + MongoDB (webhook events)
- Stripe refund via `stripeProvider.refundPayment`

---

### Reviews Moderation

**Use case:** Approve/reject customer reviews.

**Features:**
- **Tabs** — Pending / Approved / Rejected / All
- **Search** — By name, email, or comment
- **Stats** — Total, pending, approved, rejected
- **Approve** — Publishes immediately
- **Reject** — Hides from storefront
- **Delete** — Removes permanently

**Technical:**
- Approving triggers `revalidatePath('/products/[id]')`
- Schema.org markup updates automatically

---

### Coupons

**Use case:** Create and manage discount codes.

**Features:**
- **List** — All coupons with usage, status
- **Create** — Type, value, min order, max discount, limits, expiry
- **Edit** — Same fields
- **Toggle active** — Instant enable/disable
- **Copy code** — One-click
- **Delete** — Removes permanently
- **Stats** — Total, active, expired, discount given

**Technical:**
- Percent discounts capped at 100%
- Per-user limit enforced via `coupon_redemptions` table
- Total usage limit enforced via `usage_limit` column

**Edge cases:**
- Code collision → INSERT fails, error shown
- Editing code → allowed but old code stops working
- Deleting active coupon → subsequent uses fail (redemptions preserved)

---

### Abandoned Carts

**Use case:** Recover lost revenue.

**Features:**
- **Stats** — Abandoned count, recovered count, recovery rate, total value, emails sent
- **List** — Each cart with user, items, value, reminder history
- **Coupon** — Shows auto-generated code if sent
- **Recovered link** — Deep-links to recovered order

**Technical:**
- Cart snapshots synced from client (debounced 2s)
- Cron runs hourly to find carts 2+ hours old
- Max 3 reminders per cart, 7 days apart
- 5%-off coupon auto-generated per cart

---

### Analytics

**Use case:** Understand user behavior.

**Features:**
- **Live users** — Sessions active in last 5 min
- **Page views today** — Total + unique sessions
- **Orders today** — Total + conversion rate
- **Conversion funnel** — Visited → Product view → Add to cart → Checkout → Order
- **Top products** — By views, adds, orders (last 7 days)
- **Devices** — Desktop / mobile / tablet breakdown
- **Traffic sources** — Referrer domains

**Technical:**
- Events in MongoDB `events` collection
- Aggregation pipelines for each metric
- 90-day TTL auto-cleanup

---

### Emails

**Use case:** Monitor transactional email delivery.

**Features:**
- **Stats** — Total, sent, failed, queued
- **Table** — Template, recipient, status, sent time, message ID
- **Filters** — By template, status, search

**Technical:**
- Logs stored in MongoDB `email_logs`
- QStash retries visible (via admin inspection)

---

### Audit Logs

**Use case:** Track every admin action for compliance.

**Features:**
- **Stats** — Total, last 24h, top actor
- **Table** — Action, actor, target, timestamp
- **Filters** — Action type, target type, search

**Technical:**
- MongoDB `audit_logs` collection
- No TTL (kept forever)
- Before/after state stored

---

### Exports

**Use case:** Get data for accounting, marketing, backups.

**Features:**
- **Orders CSV** — Filterable by date, status, provider
- **Payments CSV** — All payment transactions
- **Emails CSV** — Delivery history
- **Users CSV** — All profiles
- **Audit CSV** — Admin actions

**Technical:**
- Server-side CSV builder (no dependencies)
- UTF-8 BOM for Excel compatibility
- 10,000 row limit per export
- Filterable by date range

---

### Users

**Use case:** Manage customer accounts.

**Features:**
- **List** — Searchable, filterable by role
- **Stats** — Total, admins, customers, new this week
- **Detail modal** — Full profile + address
- **Role badge** — Admin / Customer

**Technical:**
- Reads from `profiles` table
- RLS ensures only admins can list all users

---

## Marketing Features

### Recommendations

**Use case:** Increase average order value via cross-sell.

**Types:**
1. **Related Products** — Same category, similar price (±50%)
2. **You May Also Like** — Cross-category, similar price (±30%)
3. **Trending Now** — Top-viewed in last 7 days
4. **Recently Viewed** — User's own history

**Technical:**
- Related: DB query with category + price filters
- Also-like: DB query excluding current category
- Trending: MongoDB aggregation over `events`
- Recently viewed: localStorage IDs → server fetch

**Edge cases:**
- Product has no category → skips related, still shows also-like
- User just arrived → no recently viewed row (hidden)
- No trending yet → fallback to newest products

---

### Abandoned Cart Recovery

**Use case:** Recover lost sales.

**Flow:**
1. User adds items → cart synced to MongoDB (debounced 2s)
2. 2 hours pass without purchase
3. Cron picks up cart → generates 5% off coupon → sends email
4. Email contains cart contents + recovery link with token
5. User clicks link → cart restores → user checks out
6. Order places → cart marked recovered

**Technical:**
- CartTracker component (client, debounced)
- Cron endpoint with throttle (1/hour)
- Recovery email with tracking pixel
- Auto-coupon is idempotent (one per user)

**Performance:**
- Typical recovery rate: 5-15%
- Average recovered order: ~₹2,000

---

### Coupon System

**Use case:** Drive conversions with discounts.

**Capabilities:**
- **Percent** — "10% off"
- **Fixed** — "₹500 off"
- **Min order** — "Only on orders over ₹2,000"
- **Max discount** — Cap percent discounts (prevent ₹10,000 off)
- **Usage limit** — Total across all users
- **Per-user limit** — How many times one user can use
- **Expiry** — Auto-invalidate after date
- **Active toggle** — Instant enable/disable
- **Auto-generated** — For cart recovery

**Technical:**
- Validation via `validate_coupon` RPC
- Redemption via `redeem_coupon_atomic` (with `FOR UPDATE` lock)
- Tracked in `coupon_redemptions` table
- Race-safe: 20 concurrent redemptions with `usage_limit = 3` → exactly 3 succeed

---

### SEO

**Use case:** Rank on Google, get organic traffic.

**Features:**
- **`robots.txt`** — Dynamic, blocks admin/checkout
- **`sitemap.xml`** — Auto-generated, includes products + categories
- **JSON-LD schemas:**
  - `Organization` — Brand info
  - `WebSite` — Search action
  - `Product` — With offers, aggregateRating, reviews
  - `BreadcrumbList` — Navigation path
- **Dynamic OG images** — Product images in social previews
- **Canonical URLs** — Every dynamic page declares
- **Meta descriptions** — Dynamic per page
- **Semantic HTML** — Proper heading hierarchy

**Verified via:**
- [Rich Results Test](https://search.google.com/test/rich-results) → All 5 schemas valid
- [PageSpeed Insights](https://pagespeed.web.dev) → SEO 100/100

---

### Analytics Tracking

**Use case:** Understand users, optimize funnel, measure campaigns.

**Events tracked:**
- `page_view` — Every route change
- `product_view` — Product detail page
- `add_to_cart` — From card or detail
- `remove_from_cart` — From cart
- `checkout_started` — Checkout page load
- `checkout_completed` — Order success
- `order_placed` — Server-side event
- `login` / `signup` — Auth events
- `search` — Search queries
- `wishlist_add` / `wishlist_remove`
- `share_product` — WhatsApp/copy link

**Enrichment:**
- **Device** — Parsed from User-Agent
- **Country, city** — From Vercel headers
- **Referrer** — From `document.referrer`
- **IP hash** — SHA-256 + salt (never raw)

**Storage:**
- MongoDB `events` collection
- 90-day TTL auto-cleanup
- Indexed for fast aggregation

**Usage:**
- Conversion funnel (7 days)
- Top products (7 days)
- Live users (5 min)
- Traffic sources (7 days)
- Device breakdown (7 days)

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [Deployment Guide](./deployment.md)

---

<p align="center">
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>