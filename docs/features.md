# Feature Documentation

> **Audience:** Product managers, QA, and anyone exploring what VESTIOR can do.
>
> **Structure:** Each feature has a use case, technical implementation, and edge cases.
>
> **Version:** This document reflects **v3.2.0** (Editorial redesign + PDF export + cron hardening).

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
  - [Exports (CSV + PDF Print)](#exports-csv--pdf-print)
  - [Users](#users)
- [Marketing Features](#marketing-features)
  - [Recommendations](#recommendations)
  - [Abandoned Cart Recovery](#abandoned-cart-recovery)
  - [Coupon System](#coupon-system)
  - [Welcome-Back Email](#welcome-back-email)
  - [SEO](#seo)
  - [Analytics Tracking](#analytics-tracking)
  - [Session Tracking](#session-tracking)
- [Design System (v3.2)](#design-system-v32)
- [Email Templates](#email-templates)

---

## Customer Features

### Homepage

**Use case:** First impression. Showcase brand, guide discovery, drive conversion.

**Sections:**
1. **Hero** — Full-screen editorial with adaptive imagery (mobile vs desktop)
2. **Category grid** — 8 categories with bento layout + hover "Shop Now" pill
3. **Featured collection** — Curated products, horizontal scroll with arrow navigation
4. **New arrivals** — Latest products, horizontal scroll
5. **Trending now** — Computed from tracking events

**Editorial design (v3.2):**
- **Ambient parallax orbs** — mouse-tracked depth on two orbs (opposite directions)
- **Editorial corner crosshair marks** — top-left, bottom-right (desktop only)
- **Vertical brand mark** — "VESTIOR · EST. 1968" on large screens (vertical writing mode)
- **Refined scroll indicator** — mouse outline with bouncing dot + "SCROLL" label
- **Bento category grid** — icon, hover "Shop Now" pill, animated gradient underline
- **Sharp scroll rows** — removed edge fade gradients for clean cut-off (v3.2)
- **Editorial section headers** — eyebrow pill + gradient-tinted headline + description

**Technical:**
- Server Component with `revalidate: 300`
- `Promise.all` for parallel data fetching (featured, new arrivals, trending)
- Hero images use `next/image` with `priority` + `sizes` for responsive
- Below-fold sections lazy-loaded with `RecommendedRow`
- LCP-critical elements have no entrance animation (h1, p)

**Edge cases:**
- Empty catalog → shows branded empty state with CTA
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
- Simple markdown rendering (bold, lists, code)
- Clear conversation button
- Auto-scroll to latest message
- ESC to close
- Session-scoped history (sessionStorage — cleared when tab closes)
- Body scroll lock with scrollbar-width compensation
- Full-screen on mobile, floating panel on desktop

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
- **Plural/singular variants** — "shirts" also matches "shirt" (v3.1)
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

**Editorial design (v3.2):**
- **Editorial header** — Eyebrow pill + bold title + live product count
- **Active filter chips** — Removable pills with X icon
- **Mobile filter drawer** — Spring-animated bottom sheet with drag handle
- **Empty state** — Icon tile + halo glow + "Clear filters" CTA

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
5. **Stock indicator** — Green "In stock" / Amber "Only X left" / Red "Out of stock"
6. **Add to cart** — Large CTA with "Added" flash state
7. **Actions** — Wishlist toggle, Copy link, WhatsApp share
8. **Description**
9. **Trust badges** — Free shipping, Secure payment, Easy returns
10. **Reviews section** — Average rating, breakdown, list, submit form
11. **Recommendations** — "You May Also Like" + "Related Products" + "Recently Viewed"

**Editorial design (v3.2):**
- **Editorial breadcrumb** — Chevron separators, truncated current item
- **Refined image gallery** — Nav arrows on hover, counter "1 / 5", badges for discount/NEW
- **Size selector** — Active checkmark badge with `layoutId` animation
- **Add to cart button** — States: default → "Added to Cart" (with checkmark) → default
- **Wishlist heart** — Spring animation on toggle
- **Copy link** — "Copy Link" → "Copied" flash state with checkmark
- **Trust badges** — 3-column grid with icons + subtext

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
- Out of stock → "Add to Cart" disabled, "Sold Out" overlay
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
- **Order summary** — Subtotal, shipping, total
- **Free-shipping progress bar** — "Add ₹X more for free shipping" with animated fill
- **Savings callout** — "You're saving ₹X today" (if discounts)
- **Trust strip** — Free Delivery, Secure Payment, 14-Day Returns

**Editorial design (v3.2):**

**Playful empty state (new in v3.2):**
- **Rotating messages** — Every 3.5s: "Your cart is feeling a little lonely" → "Every great outfit starts with one click" → etc. (5 messages)
- **Floating mini-icons** — Sparkles, Heart, Gift, Package with parallax drift
- **Animated shopping bag** — Breathing motion, sparkle accent, pulsing halo
- **Marketing benefits strip** — Free Shipping, 14-Day Returns, Secure Payment with icons
- **Primary CTA** — "Start Shopping" with shine sweep
- **Secondary link** — "Or explore new arrivals"

**Active cart design:**
- **Bento item cards** — Gradient background, hover border lift
- **Quantity stepper** — Inline controls with stock clamping
- **Savings indicator** — Per-item "You save ₹X on this item" note
- **Mobile summary card** — Top summary before items (sticky feel)
- **Desktop sticky sidebar** — 5-column summary with free shipping progress

**Technical:**
- Cart state in localStorage
- `cartUpdated` custom event for reactive count in navbar
- Deduplication: same product+size merged
- Clamps quantity to stock (in case stock dropped)
- Server sends order with only `{ product_id, quantity }` — server recalculates prices
- `CartTracker` syncs cart to MongoDB (debounced 2s) for abandoned-cart recovery

**Note (v3.1+):** Cart page no longer handles coupon application. All coupons are validated server-side at checkout via the `validate_coupon` RPC. This prevents client-side coupon abuse.

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
- **Animated 2-step stepper** — Icons + checkmarks + pulse rings on active step
- **Payment method selector** — COD / Card (extensible)
- **Coupon field** — Validated server-side via `validate_coupon` RPC
- **Order summary** — Sticky sidebar on desktop, top card on mobile
- **Card payment** — Stripe Elements with night theme

**Editorial design (v3.2):**
- **Animated stepper** — Rounded icon circles with checkmarks, connecting gradient bars
- **Shipping form** — Editorial fields with eyebrow labels, staggered entrance
- **Payment option cards** — Radio indicator with checkmark, active state with glow
- **Coupon field** — Applied state shows emerald card with code + description + remove button
- **Stripe Elements** — Custom variables (indigo primary, dark background, rounded)
- **CTA buttons** — Shine sweep, semantic color per step (indigo → emerald)

**Technical (v3.1+ — atomic order placement):**
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

**v3.2 Fix:**
- **`order_placed` event now tracked on Stripe success** — COD path already tracked; Stripe path was missing the tracking call. Now both paths emit `order_placed` with the correct `paymentMethod`, `couponCode`, and `discountAmount`.

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
- **Filter tabs** — All / Pending / Processing / Shipped / Delivered / Cancelled (with counts)
- **Order card** — ID, date, status, items preview (expandable), total
- **Order detail** — Progress tracker, items, address, payment info
- **Invoice** — Printable view with print-optimized CSS
- **Refresh button** — Manual refresh for impatient users

**Editorial design (v3.2):**
- **Order card** — Status-tinted ambient glow, expandable items, payment info row
- **Order detail progress tracker** — Animated steps with pulse rings on current, checkmarks on complete
- **Timeline card** — Items with thumbnails, per-line totals, subtotal/shipping/total breakdown
- **Shipping address card** — Icon-led fields (User, Phone, MapPin)
- **Payment card** — Method, status pill, "Paid on" date
- **Empty state** — Animated package icon with halo glow + "Start Shopping" CTA
- **Filter tabs** — Sticky with count badges, active glow

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

**Editorial design (v3.2):**
- **Big average rating** — 6xl number with star row + review count
- **Histogram** — Animated bars with star labels
- **Stats sidebar** — Sticky on desktop with CTA
- **Review cards** — Avatar + name + verified badge + star row + title + comment + date
- **Submit form** — Interactive star rating (30px), live rating label, character progress bar

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
- **Navbar badge** — Live count with pulse
- **Optimistic UI** — Instant feedback, rollback on error

**Editorial design (v3.2):**
- **Heart toggle on cards** — Red accent when active, spring animation
- **Empty state** — Animated heart tile with sparkle accent + halo glow + "Browse Products" CTA
- **Wishlist grid** — 2-column mobile → 4-column desktop, hover scale on image, discount badge
- **Remove button** — Red tinted with trash icon, hover brightening

**Technical:**
- Supabase `wishlists` table (user_id, product_id, created_at)
- Unique constraint prevents duplicates
- `useWishlist` context in `WishlistProvider`
- On login: `mergeWishlist(guestIds)` via Server Action (idempotent)

**Edge cases:**
- Empty wishlist → friendly message with "Browse Products" CTA
- Product out of stock → still in wishlist, "Sold Out" overlay
- Same product added twice → deduped server-side
- Rapid toggle clicks → debounced client-side (best-effort)

---

### Profile

**Use case:** Update personal info for faster checkout.

**Features:**
- Name, phone, address (line1, line2, city, state, pincode)
- Save button with loading state
- Profile auto-fills checkout address
- Quick links to Orders, Wishlist, Shop

**Editorial design (v3.2):**
- **Banner card** — Gradient indigo/violet banner with subtle grid pattern
- **Avatar** — Floating 2xl avatar with online dot, offset below banner
- **Quick links row** — 3-column grid with icon + label (Orders, Wishlist, Shop)
- **Form sections** — Grouped with eyebrow labels, staggered field entrance
- **Skeleton loader** — Matching card shapes for loading state

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
- **Existing email detection** — Signup shows "account exists" instead of silently failing

**Editorial design (v3.2):**
- **Login/Signup pages** — 3-column ambient background orbs + gradient icon tile + shimmer CTA
- **Password input** — Show/hide toggle with spring animation
- **Strength meter** — 4-segment animated bar + checklist + status footer
- **Google button** — Full-width with proper SVG logo

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

**Flow (v3.2 — `token_hash` flow):**
1. **`/auth/forgot-password`** — User enters email
2. **Supabase** — Sends reset link with `token_hash` + `type=recovery`
3. **`/auth/callback?token_hash=...&type=recovery`** — User clicks link from email
4. **Server-side** — `verifyOtp({ token_hash, type })` creates a **real session**
5. **Redirect** — Server redirects to `/auth/reset-password`
6. **Form** — User sets new password (session is active)
7. **Update** — `supabase.auth.updateUser({ password })`
8. **Redirect** — Auto-redirect to home (user is signed in)

**Features:**
- **Show/hide password toggle** — On both reset pages
- **Password strength meter** — Visual feedback (Very Weak → Very Strong)
- **Real-time validation** — Length, lowercase, uppercase, number
- **Match confirmation** — Real-time "Passwords match" indicator
- **Existing session detection** — If no session after callback, redirects to forgot-password with error

**Password requirements:**
- Minimum 8 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 number
- (Bonus) Special character increases score

**Technical:**
- **`/auth/forgot-password`** — Client page, calls `supabase.auth.resetPasswordForEmail()`
- **`/auth/callback`** — Handles both flows:
  - `token_hash` + `type` → password reset + email confirm (v3.2 preferred)
  - `code` → OAuth Google login (legacy, still supported)
- **`/auth/reset-password`** — Server page, verifies session exists, renders form
- **`ResetPasswordForm.tsx`** — Client component, calls `supabase.auth.updateUser({ password })`
- **`checkPasswordStrength()`** — Pure function in `lib/password.ts`
- **`PasswordInput`** — Reusable show/hide component
- **`PasswordStrengthMeter`** — Visual feedback with checklist

**v3.2 Fix:**
- **Session missing bug** — The old `code`-based flow was leaving users without a session after clicking the email link. Users saw "session expired" when trying to reset. Fixed by switching to `token_hash` flow which creates a real session in one atomic call.

**Edge cases:**
- Invalid/expired `token_hash` → redirect to forgot-password with error
- Code already used → redirect to forgot-password
- No session after callback → redirect to forgot-password
- Password doesn't meet requirements → submit disabled
- Passwords don't match → submit disabled
- Update fails → toast error, form stays

**Security:**
- `token_hash` never exposed to client JS (server-side exchange)
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
- **Editorial design (v3.2)** — Glass morphism card with app icon, benefits strip (Fast, Offline), Install/Not now buttons

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
  - `/admin/exports/print/*` → Skip (print views must be fresh) (v3.2)
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
- **Recent Activity Timeline** — Last 8 admin actions with actor + action label

**Editorial design (v3.2):**
- **Bento stat cards** — Left accent bar + ambient glow + icon tile + eyebrow + trend badge
- **Business health cards** — Icon in tinted tile + link with hover translate
- **Animated background shapes** — Subtle floating orbs (blur-60px)
- **Command Center eyebrow** — `Activity` icon + tracking-widest label
- **Recent orders table** — Status pills, monospace order IDs, tabular totals
- **Activity timeline** — Dots + connecting lines, action labels mapped to human text

**Technical:**
- Single RPC call (`get_dashboard_stats`) for base aggregates
- Parallel data fetch with `Promise.all`
- Recharts loaded dynamically (admin-only chunk)
- `getDashboardSummary()` — comprehensive summary
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

**Editorial design (v3.2):**
- **Count badges** — Large tabular numerals
- **Color-coded icons** — Semantic accent per card type
- **Pulse indicator** — Animated dot when items are pending
- **Hint text** — "awaiting approval", "3 items at risk"
- **Hover arrow** — Slides in on hover
- **All-clear state** — Green checkmark chip + "All caught up" message

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

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards (Total, Active, Low Stock, Out of Stock)
- **Search + filter bar** — Search input + category dropdown
- **Product table** — Thumbnail + name + external link, category, price, stock with badge, active status, edit link
- **Stock badges** — "Low" (amber) / "Out" (red)
- **Empty state** — Icon + "Add Product" CTA

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

**Editorial design (v3.2):**
- **Order table** — Monospace IDs, status pills, payment dot indicators
- **Order status updater** — Custom select with chevron/loader
- **Order detail page** — Progress tracker + items + shipping + payment + admin actions

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

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards (Total Revenue, Today, Success Rate, Stripe Revenue)
- **Payment table** — Provider icons (Card/Banknote), amount, status pill
- **Detail modal** — Provider hero + amount hero + webhook event timeline
- **Refund button** — Red accent with confirmation

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

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards with star accent on Total
- **Tab chips** — Icon + label + count badge
- **Review cards** — Avatar + name + verified badge + star row + comment + status pill + actions

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

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards (Total, Active, Expired, Discount Given)
- **Coupon modal** — Full-screen on mobile, centered on desktop with spring animation
- **Coupon table** — Monospace codes, copy button, discount type icon (Percent/IndianRupee), usage bars, expiry, status pill, actions
- **Toggle button** — Power icon, semantic color

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

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards (Abandoned, Recovered, Lost Value, Reminders Sent)
- **Cart cards** — Avatar + user info + subtotal hero + metrics grid (Abandoned, Emails Sent, Last Reminder, Coupon)
- **Item chips** — Horizontal scroll of product names with quantities
- **Recovered badge** — Emerald tinted with checkmark

**v3.2 Cron fixes:**
- **Param order corrected** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — was passing args wrong, silently limiting reminders.
- **Throttle only set on success** — Failed runs leave the throttle unset, so the next cron retries automatically.

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

**Editorial design (v3.2):**
- **Date range pills** — Segmented control with active glow
- **Stats row** — 4 bento cards (Live Users, Page Views, Orders Today, Conversion Rate)
- **Funnel** — Animated bars with counts + percentages
- **Top products** — Rank badges (gold/silver/bronze) + view/add/order stats
- **Devices breakdown** — Animated progress bars with device icons
- **Traffic sources** — Animated bars with referrer names
- **Live users widget** — Auto-refresh with pulse dot + viewer list

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

**Editorial design (v3.2):**
- **Section header** — Rose-tinted icon tile + title + description
- **Sortable headers** — Arrow up/down icon, active glow, direction indicator
- **Abandoned filter chip** — Amber tinted with pulse dot count
- **Conversion rate pills** — Color-coded (green > 5%, amber 1-5%, red < 1%)
- **Abandoned row highlight** — Amber bg with pulse dot before product name
- **Rank badges** — Top 3 gold/silver/bronze styling

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

**Editorial design (v3.2):**
- **Stats row** — 6 bento cards (Live Now, Guests, Users, New, Returning, Orders)
- **Visitor type tabs** — Icon + label + color-coded active state
- **Search bar** — Full-width with clear button
- **Visitor table** — Avatar + name/email, activity icons with counts, device icon, duration, relative last seen

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

**Editorial design (v3.2):**
- **Back link** — Chevron + "Back to Visitors"
- **Session header hero** — Large avatar with online dot + name + type badge + session ID
- **6 stat cards** — Bento style with semantic accent colors
- **Timeline card** — First seen, last seen, duration, ended_with badge
- **Device card** — Device icon + OS + browser + country + city
- **Referrer card** — Source badge + raw URL in monospace
- **Paths/Products/Orders** — Numbered lists + grid chips

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

**Editorial design (v3.2):**
- **Back link** — Chevron + "Back to Users"
- **Profile header** — Large avatar with online dot + name + contact row + role badge
- **6 aggregate stats** — Bento cards with icon tiles
- **Session history list** — Chronological list with device icon, ended_with badge, returning badge, meta row

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

**Editorial design (v3.2):**
- **Range pills** — Segmented control with active glow
- **4 stat cards** — Trend badges with up/down arrows + tabular numbers
- **Revenue chart** — Area chart with emerald gradient fill
- **Category chart** — Bar chart with multi-color palette
- **Provider breakdown** — Progress bars with gradient fills
- **Status grid** — 5 columns with semantic color per status

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
- **All 10 templates redesigned (v3.2)** with editorial style

**Editorial design (v3.2):**
- **Stats row** — 4 bento cards (Total, Sent, Failed, Queued)
- **Filter bar** — Search + template dropdown + status dropdown
- **Email table** — Blue icon tile + monospace template, recipient email, status pill with icon, timestamp, message ID with copy button

**Technical:**
- Logs stored in MongoDB `email_logs`
- QStash retries visible (via admin inspection)
- Error messages stored for failed sends

**v3.1 fixes:**
- **Stuck queued emails** — QStash failures now mark logs as `failed` with the error message

**v3.2 redesign:**
- All 10 templates redesigned with theme-matched editorial style (see [Email Templates](#email-templates) below)

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

**Editorial design (v3.2):**
- **Stats row** — 3 bento cards (Total Logs, Last 24h, Top Actor)
- **Action pills** — Monospace with colored dot per action type
- **Audit table** — Action pill, actor avatar + email, target type + ID, timestamp
- **Filter bar** — Search + action dropdown + target type dropdown

**Technical:**
- MongoDB `audit_logs` collection
- No TTL (kept forever)
- Before/after state stored
- IP hash for privacy (never raw IP)

---

### Exports (CSV + PDF Print)

**Use case:** Get data for accounting, marketing, backups — as CSV or PDF.

**Features:**

**CSV Export:**
- **Orders CSV** — Filterable by date, status, provider
- **Payments CSV** — All payment transactions
- **Emails CSV** — Delivery history
- **Users CSV** — All profiles
- **Audit CSV** — Admin actions

**PDF Print Export (v3.2 — NEW):**
- **Dedicated print routes** — `/admin/exports/print/[type]`
- **5 export types** — Orders, Payments, Emails, Users, Audit
- **A4 landscape** — Optimized for wide tables
- **Auto-repeating headers** — `thead { display: table-header-group }`
- **Row-level page-break** — `tr { page-break-inside: avoid }`
- **Filter-aware** — Date range, status, provider preserved
- **Zero dependencies** — Uses browser's native "Print → Save as PDF"

**Editorial design (v3.2):**
- **Filter panel** — 4-column grid (From, To, Status, Provider) with active filter chips
- **Export cards** — 5 cards with left accent bar + icon tile + description + Download CSV + Print buttons
- **Info banner** — "10,000 row limit" with icon
- **Print view** — White A4-optimized document with VESTIOR brand header, filter chips, data table, record count footer

**Technical:**

**CSV Export:**
- Server-side CSV builder (no dependencies)
- UTF-8 BOM for Excel compatibility
- 10,000 row limit per export
- Filterable by date range
- Admin-only (checked server-side)

**PDF Print Export:**
- Server Component with admin verification
- Print-optimized CSS (`@media print`)
- `@page { size: A4 landscape; margin: 10mm }`
- Only `#export-print-area` visible during print
- Table headers auto-repeat on page breaks
- Rows don't split across pages
- Filter state preserved via URL params

**Why zero-dependency PDF:**
- No Puppeteer (300MB Chromium binary, 3-8s cold start, not serverless-compatible)
- No PDF library (200-500KB bundle, manual layout)
- Browser's native print dialog is the most powerful PDF generator available
- Admin gets full control (paper size, margins, headers, footers)

**Edge cases:**
- No data in range → empty state with icon
- Filter chips clear button → resets filters
- Print route direct access → server redirects if not admin

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

**Editorial design (v3.2):**
- **User table** — Avatar with online dot + name/email, role badge, join date, actions
- **Detail modal** — Full-screen on mobile, centered on desktop with spring animation
- **Modal hero** — Large avatar with online dot, name, email, role badge
- **Info blocks** — Icon + label + value rows
- **Address section** — Icon header + address lines
- **Role dropdown** — Only for super admins, disabled for self/other super admins

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

**Editorial design (v3.2):**
- **Section header** — Bold title + subtitle + arrow navigation on hover
- **Scroll rows** — Arrow nav buttons on both sides, progress indicator bar
- **Sharp boundaries** — Removed edge fade gradients (v3.2)
- **Product cards** — Same as grid cards

**Technical:**
- Related: DB query with category + price filters
- Also-like: DB query excluding current category
- Trending: MongoDB aggregation over `events`
- Recently viewed: localStorage IDs → server fetch

**Edge cases:**
- Product has no category → skips related, still shows also-like
- User just arrived → no recently viewed row (hidden)
- No trending yet → fallback to newest products

**v3.2 Note:** Edge fade gradients removed from all scrollable rows (HomeProductSection, ProductRow, RecommendedRow) for consistent sharp cut-off.

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

**v3.2 Fixes:**
- **Param order corrected** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — was passing args wrong.
- **Throttle only set on success** — Failed runs leave the throttle unset, so the next cron retries automatically.

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

**Technical (v3.1+ — atomic):**
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
- **Editorial design (v3.2)** — Violet accent theme

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

**v3.2 Fix:**
- **`order_placed` event now tracked on Stripe success** — COD path already tracked; Stripe path was missing the tracking call.

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

## Design System (v3.2)

**Use case:** Cohesive, maintainable, brand-aligned UI across 120+ files.

**Design tokens:**

**Surfaces:**
- Background: `#0A0A0A`
- Card gradient: `#131313 → #0E0E0E`
- Border: `rgba(255,255,255,0.06)`
- Border hover: `rgba(255,255,255,0.12)`

**Text hierarchy:**
- Headlines: `text-white font-bold tracking-[-0.02em]`
- Body: `text-gray-300 / text-gray-400`
- Muted: `text-gray-500 / text-gray-600`
- Eyebrow: `text-[10px] tracking-[0.18em] uppercase font-semibold`
- Numbers: `tabular-nums`
- IDs: `ui-monospace tabular-nums`

**Semantic accents:**
| Purpose | Color |
|---------|-------|
| Primary | Indigo `#6366F1` |
| Success | Emerald `#10B981` |
| Warning | Amber `#F59E0B` |
| Danger | Red `#EF4444` |
| Info | Violet `#8B5CF6` |
| Secondary | Teal `#14B8A6` |
| Neutral | Gray `#6B7280` |

**Motion curves:**
- Easing: `[0.22, 1, 0.36, 1]`
- Stagger children: `0.06s`
- Duration: fast 0.2s / normal 0.4s / slow 0.6s

**Signature patterns:**
- **Bento stat cards** — left accent bar + ambient glow + icon tile + eyebrow + big number + subtitle
- **Grouped sidebar navigation** — Overview / Commerce / Audience / Operations
- **Empty states** — icon tile + halo glow + title + description + CTA
- **Status pills** — dot + icon + label, semantic color
- **Eyebrow pills** — `text-[10px] tracking-[0.18em] uppercase`
- **Shine sweeps** — animated highlight on primary CTAs
- **Skeleton loaders** — matching content shape with `animate-pulse`
- **Ambient orbs** — `blur-[70px]` accent-colored background glow
- **Timeline dots** — pulse-ping for live, solid for past

**Why a formal design system:**
- **Consistency** — Every admin page feels like the same product
- **Maintainability** — Change one token, update 120+ files
- **Accessibility** — Semantic colors have tested contrast ratios
- **Onboarding** — New contributors productive in a day
- **Performance** — Pure CSS, zero runtime overhead

---

## Email Templates

All 10 templates redesigned in v3.2 with **theme-matched editorial style:**

| Template | Accent Color | Purpose |
|----------|-------------|---------|
| `welcome` | Blue | On signup |
| `welcome-back` | Violet | Returning user (throttled) |
| `order-placed` | Blue | On order creation |
| `payment-confirmed` | Emerald | On payment success |
| `payment-failed` | Red | On payment failure |
| `order-shipped` | Violet | On status update (with timeline) |
| `order-delivered` | Emerald | On delivery |
| `order-cancelled` | Red | On cancellation |
| `low-stock-alert` | Amber | Admin notification |
| `abandoned-cart` | Violet | Recovery email with coupon |

**Common editorial structure:**
- Dark `#0A0A0A` background
- Brand masthead with accent-colored dot (`● VESTIOR`)
- Accent eyebrow badge (uppercase, tracking-widest)
- Semantic accent color per template
- Hairline accent dividers (`rgba(accent, 0.25)`)
- Gradient CTA buttons with box-shadow
- Trust footer with email reply prompt
- Auto-computed copyright year
- Preview text (inbox subject line)

**Rendering pipeline:**
- React Email components → HTML via `@react-email/render`
- QStash queue → `/api/jobs/send-email` → Gmail SMTP
- Dev mode: direct send (bypasses QStash)
- Logs stored in MongoDB `email_logs`

---

## Further Reading

- [Architecture Deep Dive](./architecture.md)
- [Security Deep Dive](./security.md)
- [Deployment Guide](./deployment.md)
- [Database Design](./database.md)
- [Testing](./testing.md)

---

<p align="center">
  <em>Last updated: 2026-10-16 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```

---
