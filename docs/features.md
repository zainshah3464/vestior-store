# Feature Documentation

> **Audience:** Product managers, QA, and anyone exploring what VESTIOR can do.
>
> **Structure:** Each feature has a use case, technical implementation, and edge cases.

---

## Table of Contents

- [Customer Features](#customer-features)
  - [Homepage](#homepage)
  - [AI Shopping Assistant](#ai-shopping-assistant)
  - [Product Discovery](#product-discovery)
  - [Product Detail](#product-detail)
  - [Cart](#cart)
  - [Checkout](#checkout)
  - [Orders](#orders)
  - [Reviews](#reviews)
  - [Wishlist](#wishlist)
  - [Profile](#profile)
  - [Authentication](#authentication)
  - [Password Reset Flow](#password-reset-flow)
  - [PWA (Progressive Web App)](#pwa-progressive-web-app)
- [Admin Features](#admin-features)
  - [Dashboard](#dashboard)
  - [Action Center](#action-center)
  - [Products](#products)
  - [Orders](#orders-1)
  - [Payments](#payments)
  - [Reviews Moderation](#reviews-moderation)
  - [Coupons](#coupons)
  - [Abandoned Carts](#abandoned-carts)
  - [Analytics](#analytics)
  - [Product Analytics](#product-analytics)
  - [Visitors](#visitors)
  - [Session Drill-Down](#session-drill-down)
  - [User Activity Timeline](#user-activity-timeline)
  - [Reports](#reports)
  - [Emails](#emails)
  - [Audit Logs](#audit-logs)
  - [Exports](#exports)
  - [Users](#users)
- [Marketing Features](#marketing-features)
  - [Recommendations](#recommendations)
  - [Abandoned Cart Recovery](#abandoned-cart-recovery)
  - [Coupon System](#coupon-system)
  - [Welcome-Back Email](#welcome-back-email)
  - [SEO](#seo)
  - [Analytics Tracking](#analytics-tracking)
  - [Session Tracking](#session-tracking)

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

**Use case:** Customers ask natural-language questions about products, categories, or orders. Answers instantly, without browsing.

**Location:** Floating chat widget (bottom-right of every page except `/admin/*`).

**Features:**

**Chat Interface:**
- Floating action button with pulse indicator
- Slide-up panel (mobile: full-screen; desktop: 420×640 panel)
- Streaming responses (word-by-word via SSE)
- Typing indicator (three bouncing dots)
- Suggested prompts on empty state
- Simple markdown rendering (bold, lists)
- Clear conversation button
- Auto-scroll to latest message
- ESC to close
- Session-scoped history (sessionStorage — cleared when tab closes)

**Capabilities (via tools):**

| User asks | Tool called |
|-----------|-------------|
| "Show me suits under ₹25,000" | `searchProducts({ category, maxPrice })` |
| "What categories do you have?" | `getCategories()` |
| "Tell me more about product X" | `getProductById({ id })` |
| "Where is my order?" | `getMyOrders({ limit })` (auth required) |

**Technical:**
- **Model:** `openai/gpt-oss-120b` (Groq LPU inference — ~500 tok/s)
- **Framework:** Vercel AI SDK v5 with `streamText`
- **Tool calling:** `stopWhen: stepCountIs(3)` — max 3 tool calls per turn
- **Streaming:** `toTextStreamResponse()` — plain text via SSE
- **Rate limit:** 20 messages/min/IP
- **Message limits:** max 20 messages per request, max 2,000 chars each
- **Session storage:** `sessionStorage` (client-side, cleared on tab close)
- **System prompt:** server-side only (`src/lib/ai/system-prompt.ts`)

**Security:**
- Zod schema rejects `system` role from client (prompt injection guard)
- Tools are read-only — no INSERT/UPDATE/DELETE
- `getMyOrders` uses user session client (RLS-enforced)
- Fail-closed: 503 if `GROQ_API_KEY` missing

**Edge cases:**
- No products found → LLM suggests alternatives ("Try browsing Suits")
- Not logged in for order query → LLM asks to sign in
- Groq service down → 503 with friendly error
- Rate limit hit → 429 with retry hint
- Empty LLM response → fallback message ("I couldn't generate a response")
- Stream aborted (user closes panel) → request cancelled via AbortController
- Model 404 (region restriction) → server logs error, user sees 500

**Why tools over RAG:**
- **Fresh data** — Every query hits live DB
- **No embeddings** — No vector store, no re-indexing
- **Authoritative** — LLM cannot hallucinate prices (must call tool)
- **Auditable** — Tool calls are logged

---

### Product Discovery

**Use case:** Customer wants to find specific products quickly.

**Features:**

**Search:**
- Debounced input (300ms) — no hammering
- Matches product names via Postgres `ILIKE` (case-insensitive)
- Recent searches saved in localStorage (last 5)
- Popular searches as quick-pick chips
- Results show thumbnail + name + price + badges
- Tracked as `search` event with query + result count

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
- **Coupon hint** — "Have a coupon? Apply it at checkout" (see [Coupon System](#coupon-system))
- Order summary: subtotal, shipping, total
- Free-shipping progress bar (add ₹X more for free shipping)
- Empty state with CTA

**Technical:**
- Cart state in localStorage
- `cartUpdated` custom event for reactive count in navbar
- Deduplication: same product+size merged
- Clamps quantity to stock (in case stock dropped)
- Server sends order with only `{ product_id, quantity }` — server recalculates prices
- `CartTracker` syncs cart to MongoDB (debounced 2s) for abandoned-cart recovery

**Note (v3.1):** Cart page no longer handles coupon application. All coupons are validated server-side at checkout via the `validate_coupon` RPC. This prevents client-side coupon abuse.

**Edge cases:**
- Product deleted while in cart → cart page shows placeholder
- Stock drops to 0 → checkout rejects with clear message
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
- **Coupon** — Validated server-side via `validate_coupon` RPC
- **Order summary** — Sticky sidebar on desktop, top card on mobile
- **Card payment** — Stripe Elements with night theme

**Technical (v3.1 — atomic order placement):**
- Server Action `placeOrder` validates all inputs with Zod
- **Single atomic transaction** (`place_order_atomic` v2) handles:
  - Stock lock + decrement
  - Coupon validation + redemption
  - Order insert
  - Order items insert
  - Coupon redemption record
  - Payment provider tagging
- If **any** step fails, the entire transaction rolls back
- Payment intent created (Stripe) *after* order commit
- Client receives `client_secret`, mounts `<Elements>`
- On success: `confirmPayment` action verifies with Stripe API
- Webhook also confirms (dual confirmation, both idempotent)

**v3.1 Fixes:**
- **No more partial state** — v1 split order + coupon + provider into 3 separate operations. v2 combines them into 1 transaction.
- **No duplicate payment emails** — Webhook checks `payment_status` before queueing `payment-confirmed` email.

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
- Deleted product → order still shows (denormalized `product_name` in `orders.items` snapshot)
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
- **Email/password signup** — Name, email, password (strength-checked)
- **Email verification** — Required before login
- **Login** — Email + password
- **Google OAuth** — One-click
- **Logout** — Clears session
- **Password reset** — Full flow (see below)
- **Existing email detection** — v3.1 — Signup shows "account exists" instead of silently failing

**Technical:**
- Supabase Auth with HTTP-only cookies
- PKCE for OAuth flow
- Middleware refreshes tokens on every request
- `AuthProvider` context exposes `user` + `loading`

**Edge cases:**
- Unverified email login → clear message "Please verify your email first"
- Wrong password → "Wrong email or password. Please try again."
- Too many attempts → "Too many attempts. Please wait a moment."
- OAuth fails → redirects to login with error query
- Session expires → middleware refreshes silently
- Multiple tabs → session synced across tabs (cookies)

---

### Password Reset Flow

**Use case:** Customer forgot password, needs to regain access without contacting support.

**Flow:**
1. **`/auth/forgot-password`** — User enters email
2. **Supabase** — Sends reset link with one-time code
3. **`/auth/reset-password?code=...`** — User clicks link from email
4. **Server-side** — Exchange code for session
5. **Form** — User sets new password
6. **Redirect** — Auto-redirect to home (user is signed in)

**Features:**
- **Show/hide password toggle** — On both reset pages
- **Password strength meter** — Visual feedback (Very Weak → Very Strong)
- **Real-time validation** — Length, lowercase, uppercase, number
- **Match confirmation** — Real-time "Passwords match" indicator
- **Existing session detection** — If code is invalid/expired, redirects to forgot-password with error

**Password requirements:**
- Minimum 8 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 number
- (Bonus) Special character increases score

**Technical:**
- **`/auth/forgot-password`** — Client page, calls `supabase.auth.resetPasswordForEmail()`
- **`/auth/reset-password`** — Server page, exchanges `code` for session via `exchangeCodeForSession()`
- **`ResetPasswordForm.tsx`** — Client component, calls `supabase.auth.updateUser({ password })`
- **`checkPasswordStrength()`** — Pure function in `lib/password.ts`
- **`PasswordInput`** — Reusable show/hide component
- **`PasswordStrengthMeter`** — Visual feedback with checklist

**Edge cases:**
- Invalid/expired code → redirect to forgot-password with error
- Code already used → redirect to forgot-password
- No session after exchange → redirect to forgot-password
- Password doesn't meet requirements → submit disabled
- Passwords don't match → submit disabled
- Update fails → toast error, form stays

**Security:**
- Code never exposed to client JS (server-side exchange)
- One-time use (Supabase-managed TTL)
- HTTP-only cookies for session
- Rate-limited by Supabase

---

### PWA (Progressive Web App)

**Use case:** Install VESTIOR as a native-feeling app. Works offline. Launches instantly from home screen.

**Features:**

**Installation:**
- **Install prompt** — Auto-shows after 20s on supported browsers
- **30-day dismissal cooldown** — After "Not now", silent for 30 days
- **Hidden in standalone mode** — No prompt if already installed
- **iOS instructions** — "Add to Home Screen" via Safari share menu

**Offline Support:**
- **Service worker** — Caches pages, images, and static assets
- **Offline fallback page** — Branded `/offline.html` with "Try Again" button
- **Stale-while-revalidate** — Images show cached, update in background
- **Cache-first** — Static assets (JS/CSS/fonts) load instantly

**App Shortcuts (long-press on installed icon):**
- **Browse Products** → `/products`
- **My Orders** → `/orders`
- **New Arrivals** → `/new-arrivals`

**Manifest:**
- **Name:** VESTIOR — Premium Tailored Fashion
- **Display:** `standalone` (hides browser chrome)
- **Theme color:** `#0A0A0A` (matches brand)
- **Icons:** SVG + PNG (192, 512, maskable variants)
- **Orientation:** portrait-primary
- **Categories:** shopping, lifestyle, fashion

**Technical:**
- **Service worker:** `public/sw.js` — hand-written (no `next-pwa`)
- **Registration:** `ServiceWorkerRegister` component — production-only, loads after page load
- **Caching strategy:**
  - `/_next/static/*`, `/suits/*`, `/fonts/*` → Cache-first
  - Images → Stale-while-revalidate
  - HTML pages → Network-first with cache fallback
  - `/admin/*`, `/api/*`, `/auth/*` → Skip (always live)
- **Cache versioning:** Bump `CACHE_VERSION` to invalidate old caches on deploy
- **Updates:** Hourly check for new service worker
- **Offline page:** Pre-cached on SW install

**Edge cases:**
- Not HTTPS → SW disabled (browsers require secure context)
- Safari iOS → No `beforeinstallprompt` event (users must manually add)
- Cache full → Old entries evicted (browser-managed)
- Deploy while user has SW → New SW activates on next navigation
- FireFox private mode → SW disabled

**Performance impact:**
- **First visit:** SW registers after `load` (no blocking)
- **Second visit:** Static assets from cache (~50ms faster)
- **Offline:** Cached pages load normally

---

## Admin Features

### Dashboard

**Use case:** At-a-glance view of business health. Command center for daily operations.

**Metrics:**

**Top Row (6 cards):**
- Total Products (+ out-of-stock count)
- Total Orders (+ pending count, trend %)
- Total Users (+ new visitors today)
- Total Revenue (+ Stripe revenue, trend %)
- Average Order Value
- Live Users (+ today's visitors)

**Business Health Row (4 cards):**
- Total Reviews (approved + pending)
- Active Coupons (+ total redemptions)
- Abandoned Cart Recovery (recovered + pending)
- Emails Today (sent + failed)

**Charts:**
- **Revenue (7 days)** — Area chart
- **Order Status** — Pie chart with legend

**Recent Activity:**
- **Recent Orders** — Last 5 orders with customer, amount, status
- **Recent Activity Timeline** — Last 8 admin actions with actor

**Technical:**
- Single RPC call (`get_dashboard_stats`) for base aggregates
- Parallel data fetch with `Promise.all`
- Recharts loaded dynamically (admin-only chunk)
- `getDashboardSummary()` — new comprehensive summary
- `getRecentActivity(8)` — audit log highlights

**Edge cases:**
- Zero orders → shows empty state, no crash
- Massive order volume → RPC returns one row regardless
- MongoDB down → summary shows 0 for analytics fields

---

### Action Center

**Use case:** Quick access to items requiring admin attention.

**Cards (6, clickable to jump to relevant page):**

| Card | Data Source | Action |
|------|-------------|--------|
| **Pending Reviews** | `product_reviews` count | → `/admin/reviews` |
| **Pending Orders** | `orders.status = 'pending'` | → `/admin/orders?status=pending` |
| **Pending Payments** | `orders.payment_status = 'pending'` | → `/admin/payments` |
| **Abandoned Carts** | `cart_snapshots` count + value | → `/admin/abandoned-carts` |
| **Low Stock** | `products.stock < 10` | → `/admin/products` |
| **Failed Emails** | `email_logs.status = 'failed'` today | → `/admin/emails?status=failed` |

**Visual:**
- Count badge (large number)
- Icon (color-coded by urgency)
- Hint text ("awaiting approval", "3 items at risk")
- Hover: arrow icon appears

**If all clear:**
- Shows "✓ All caught up" message
- Cards show `0` in muted gray
- Border removed

**Technical:**
- Data from `getDashboardSummary()`
- Renders in `QuickActionsGrid` component

**Edge cases:**
- No pending items → shows all-clear state
- MongoDB down → abandoned cart count = 0 (graceful)

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
- **Payment timeline** — Webhook events from MongoDB

**Technical:**
- Status updates trigger customer emails automatically
- Refund calls Stripe, then updates order status
- All actions logged to audit trail
- Order detail joins Supabase (order + items) with MongoDB (payment + audit)

**v3.1 fixes:**
- **Resend order email** — Uses `payment_provider` (not legacy `payment_method`) and includes `discount_amount` + `coupon_code`

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
- Webhook events preserved with raw payload for debugging

**v3.1 fixes:**
- **Duplicate payment-confirmed email** — Now fixed: webhook checks `payment_status` before queueing

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
- Validation: `validate_coupon` RPC
- Redemption: atomic inside `place_order_atomic` v2

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
- 5%-off coupon auto-generated per cart (idempotent)

---

### Analytics

**Use case:** Understand user behavior.

**Features:**
- **Live users** — Sessions active in last 5 min (auto-refresh 30s)
- **Page views today** — Total + unique sessions
- **Orders today** — Total + conversion rate
- **Conversion funnel** — Visited → Product view → Add to cart → Checkout → Order
- **Top products** — By views, adds, orders (last 7 days)
- **Devices** — Desktop / mobile / tablet breakdown
- **Traffic sources** — Referrer domains
- **Date range toggle** — Last 7d / 30d / 90d

**Technical:**
- Events in MongoDB `events` collection
- Sessions in MongoDB `sessions` collection
- Aggregation pipelines for each metric
- 90-day TTL auto-cleanup
- Live users widget auto-refreshes via `/api/admin/live-users`

---

### Product Analytics

**Use case:** Understand per-product performance and spot problems.

**Features:**

**Global Stats (4 cards):**
- Units sold (across all products)
- Product revenue
- Average units per order
- Products tracked (+ abandoned count)

**Product Performance Table:**
- Views per product (from events)
- Cart adds per product
- Orders per product
- Revenue per product
- **Conversion rate** — orders / views
- **Sortable** — Click column headers
- **Abandoned filter** — Show only products with high views, zero orders
- **Row highlighting** — Amber background for abandoned products

**Top Products by Revenue:**
- Ranked table of top sellers
- Units sold, order count, revenue
- Limited to shipped + delivered orders

**Technical:**
- Merged data: MongoDB `events` + Supabase `order_items`
- `getProductEventMetrics()` — views, cart adds, orders from events
- `getProductSalesStats()` — units, revenue from `get_product_sales_stats` RPC
- **Abandoned heuristic:** `views >= 20 && orders === 0`

**Why 20 views?** Below 20 views, zero orders is noise. Above 20 is a signal (bad copy, price, photos, or stock).

**Edge cases:**
- No product activity → empty state
- Product with views but no sales → highlighted
- Sales data missing → falls back to event order count

---

### Visitors

**Use case:** See every visitor session — guests, new, returning, admins.

**Features:**
- **Overview stats** — Live users, guests today, users today, new visitors, returning, orders today
- **Filter tabs** — All / Guest / New / Returning / Admin
- **Search** — By email, name, or session ID
- **Table columns:**
  - Type badge (color-coded)
  - Visitor (name/email or session ID)
  - Activity (page views, product views, orders)
  - Device (OS icon)
  - Duration
  - Last seen (relative time)
- **Details link** → Session drill-down

**Technical:**
- MongoDB `sessions` collection
- `fetchSessions()` — paginated list with filters
- `getVisitorOverview()` — aggregated stats
- All data from session upserts (`/api/track`)

**Edge cases:**
- No sessions → empty state
- Guest with no email → shows session ID
- Session TTL 90 days → old sessions auto-purge

---

### Session Drill-Down

**Use case:** Deep dive into one visitor session's complete journey.

**Features:**

**Header:**
- User avatar (initial)
- Name or email or "Guest Visitor"
- Visitor type badge
- Link to user profile (if logged in)
- Session ID

**Stats (6 cards):**
- Page views
- Products viewed
- Cart adds
- Orders
- Revenue
- Duration

**Session Timeline:**
- First seen
- Last seen
- Duration
- **Ended with** — `order` / `abandon` / `bounce` (color-coded)

**Device & Location:**
- Device type
- OS
- Browser
- Country
- City

**Referrer:**
- Classified source (Google, Instagram, etc.)
- Raw referrer URL

**Paths Visited:**
- Numbered list of unique paths

**Products Viewed:**
- Grid of product IDs (clickable → product page)

**Orders Placed:**
- Grid of order IDs (clickable → admin order detail)

**Technical:**
- MongoDB `sessions` collection
- Query by `session_id`
- Rendered by `SessionDetail` component

**Edge cases:**
- Empty arrays → section hidden
- Dangling product IDs → link leads to 404 (product deleted)
- Null referrer → "Unknown" shown

---

### User Activity Timeline

**Use case:** See everything one user has ever done.

**Features:**

**Profile Header:**
- Avatar
- Name + email + phone
- Join date
- Role badge

**Aggregate Stats (6 cards):**
- Total sessions
- Total page views
- Total product views
- Total orders
- Total revenue
- Total time spent

**Session History:**
- Last 50 sessions
- Date/time
- `ended_with` badge
- Device icon
- Page views, product views, duration
- Referrer source
- Order count + revenue
- Paths visited (first 5)

**Technical:**
- MongoDB `sessions` collection
- Query by `user_id`
- `fetchUserSessions(userId)`
- Limited to 50 most recent

**Edge cases:**
- No sessions → "No tracked sessions yet"
- User just signed up → empty state

---

### Reports

**Use case:** Business analytics for decision-making.

**Features:**

**Range Selector:**
- Last 7 days
- Last 30 days (default)
- Last 90 days
- All time

**Summary Stats (4 cards with trends):**
- Total Revenue (+ trend vs previous period)
- Total Orders (+ trend)
- Average Order Value (+ trend)
- Pending Orders

**Charts:**
- **Revenue Over Time** — Area chart
- **Revenue by Category** — Bar chart
- **Revenue by Payment Method** — Progress bars (COD vs Stripe)

**Order Status Distribution:**
- Grid of 5 cards (pending, processing, shipped, delivered, cancelled)

**Top Selling Products:**
- Ranked table
- Units sold, order count, revenue

**Technical:**
- Single RPC call (`get_sales_report`) for all aggregations
- Only `shipped` and `delivered` orders count toward revenue
- Previous period auto-computed for trend comparison
- `computeTrends()` — pure function for % delta

**Edge cases:**
- No orders in range → empty states
- "All time" preset → skips trend (no previous period)
- Zero previous period → trend shows as `+100%` or `0%`

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
- Error messages stored for failed sends

**v3.1 fixes:**
- **Stuck queued emails** — QStash failures now mark logs as `failed` with the error message

---

### Audit Logs

**Use case:** Track every admin action for compliance.

**Features:**
- **Stats** — Total, last 24h, top actor
- **Table** — Action, actor, target, timestamp
- **Filters** — Action type, target type, search

**Actions logged:**
- `payment.refund`
- `coupon.create`, `coupon.update`, `coupon.delete`
- `user.change_role`
- `product.create`, `product.update`, `product.delete`
- `review.approved`, `review.rejected`, `review.delete`

**Technical:**
- MongoDB `audit_logs` collection
- No TTL (kept forever)
- Before/after state stored
- IP hash for privacy (never raw IP)

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
- Admin-only (checked server-side)

---

### Users

**Use case:** Manage customer accounts.

**Features:**
- **List** — Searchable, filterable by role
- **Stats** — Total, admins, customers, new this week
- **Detail modal** — Full profile + address
- **Role badge** — Admin / Customer / Super Admin
- **Change role** — (super-admin only) Promote/demote via dropdown
- **Activity link** → User activity timeline

**Technical:**
- Reads from `profiles` table
- RLS ensures only admins can list all users
- Role changes via `admin_change_user_role` RPC (verifies super-admin inside Postgres)

**Edge cases:**
- Regular admin → cannot change roles (dropdown hidden)
- Super admin → cannot demote self, cannot demote other super admins
- Target user already has role → option disabled

---

## Marketing Features

### Recommendations

**Use case:** Increase average order value via cross-sell.

**Types:**
1. **Related Products** — Same category, similar price (±50%)
2. **You May Also Like** — Cross-category, similar price (±30%)
3. **Trending Now** — Top-viewed in last 7 days
4. **Recently Viewed** — User's own history (localStorage)

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
- **Max 3 reminders**, 7 days apart

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

**Technical (v3.1 — atomic):**
- Validation via `validate_coupon` RPC
- **Redemption happens inside `place_order_atomic` v2** — single transaction with stock lock, order insert, coupon usage increment, and redemption record
- No more partial state (v1 had coupon consumed but discount missing)
- Race-safe: 20 concurrent redemptions with `usage_limit = 3` → exactly 3 succeed

**Client-side (v3.1 fix):**
- Cart page no longer handles coupon application
- All coupons validated server-side at checkout
- Prevents client-side abuse

---

### Welcome-Back Email

**Use case:** Re-engage returning users. Remind them what they've been missing.

**Trigger:** User logs in, but only if:
- Not their first login
- Not an admin
- Last welcome-back email was > 7 days ago

**Content:**
- Personalized greeting with name
- Last order ID (if any)
- "Shop New Arrivals" CTA
- "Browse All Products" CTA

**Technical:**
- Triggered by `/api/auth/login-success` (called after successful login)
- Throttle: `welcome_back_sent_at` in `profiles`
- **v3.1 fix:** Throttle marker only set if email actually queued (not on QStash failure)
- Admin-only users skip this email (they see the dashboard)

**Edge cases:**
- First login ever → no email, just record `last_login_at`
- Admin user → no email
- QStash down → throttle marker not set, user gets another chance next login
- No last order → email still sent, just omits the order section

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

**Batching:**
- Client SDK batches events in-memory
- Flush every 10s OR when queue reaches 10 events
- `navigator.sendBeacon` on page unload (survives navigation)
- Fallback to fetch if beacon unsupported

---

### Session Tracking

**Use case:** Aggregate user behavior into session-level insights. Foundation for visitor analytics and activity timelines.

**What's tracked per session:**
- Session ID (24h cookie)
- User (if logged in)
- Visitor type (guest / new / returning / admin)
- Device (type, OS, browser)
- Location (country, city)
- Referrer (raw + classified)
- First seen, last seen
- Duration (ms)
- Page views, product views, cart adds, order count
- Revenue
- Unique paths visited
- Unique products viewed
- Order IDs placed
- `ended_with` — order / abandon / bounce

**Classification:**
- **Logged in as admin** → `admin`
- **Logged in as user** → `returning`
- **Guest with known IP hash** → `returning`
- **Guest with new IP hash** → `new`

**`ended_with` heuristic:**
- `order` — if any order placed
- `abandon` — if duration ≥ 30s, no order
- `bounce` — if duration < 30s, no order

**Technical:**
- MongoDB `sessions` collection
- Upserted on every track batch
- TTL: 90 days (auto-purge)
- Indexes: `session_id` UNIQUE, `user_id + last_seen_at`, `ip_hash + last_seen_at`, `visitor_type + last_seen_at`

**Used by:**
- `/admin/visitors` — full list
- `/admin/sessions?id=X` — drill-down
- `/admin/users/[id]/activity` — user timeline
- Dashboard `LiveUsersWidget`
- `NewVsReturningChart`

**Privacy:**
- IP hashed (never raw)
- Session ID not a credential (only identifies a tab)
- 24h cookie TTL
- No PII beyond user_id + email (if logged in)

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [Deployment Guide](./deployment.md)
- [Database Design](./database.md)
- [Testing](./testing.md)

---

<p align="center">
  <em>Last updated: 2026-10-14 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```