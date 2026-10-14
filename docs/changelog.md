# Changelog

All notable changes to VESTIOR are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

- [Unreleased](#unreleased)
- [v3.1.0 — AI + PWA + Auth Polish](#v310--ai--pwa--auth-polish-2026-10-14)
- [v3.0.0 — Enterprise Feature Set](#v300--enterprise-feature-set-2026-10-12)
- [v2.0.0 — Production Hardening](#v200--production-hardening-2026-10-05)
- [v1.0.0 — Initial Release](#v100--initial-release-2026-10-01)

---

## [Unreleased]

### Planned for v3.2.0

- Multi-currency support (USD, EUR, GBP, AED)
- Sentry error tracking
- Codecov integration
- Order tracking via courier APIs (TCS, Leopards)

### Planned for v3.3.0

- Multi-language (i18n — English + Urdu)
- Guest order tracking via magic link
- Advanced analytics (cohorts, retention, CLV)

### Planned for v4.0.0

- Loyalty program with points
- Gift cards
- PayPal integration (once available in Pakistan)
- Semantic search for AI chatbot

---

## [v3.1.0] — AI + PWA + Auth Polish (2026-10-14)

This release introduces **AI-powered shopping assistance**, **PWA capabilities**, **comprehensive auth improvements**, and **email system hardening** across 5+ critical bug fixes.

### 🎉 Added — AI Shopping Assistant

- **Groq-powered chatbot** with `openai/gpt-oss-120b` (500 tok/s)
- **Tools:** `searchProducts`, `getProductById`, `getCategories`, `getMyOrders`
- **Streaming responses** via Server-Sent Events
- **Session-scoped history** (sessionStorage — cleared when tab closes)
- **Suggested prompts** on empty state
- **Typing indicator** (three bouncing dots)
- **Clear conversation** button
- **Hidden on `/admin/*`** pages
- **Floating action button** with pulse indicator
- **Rate-limited** at 20 messages/min/IP
- **Zero-cost** (Groq free tier)

### 🔐 Added — Auth Polish

- **Password Reset Flow**
  - `/auth/forgot-password` — email entry
  - `/auth/reset-password` — new password form with server-side code exchange
  - Show/hide password toggle
  - Password strength meter (Very Weak → Very Strong)
  - Real-time validation (length, case, number)
  - Password match indicator
- **Login Improvements**
  - Clearer error messages ("Please verify your email first")
  - "Forgot password?" link
  - Show/hide password toggle
- **Signup Improvements**
  - **Existing-email detection** (was silently creating "duplicate")
  - Strong password enforcement
  - Real-time strength meter

### 📱 Added — PWA (Progressive Web App)

- **Service Worker** (`public/sw.js`) — hand-written, no `next-pwa`
  - Cache-first for static assets (JS/CSS/fonts)
  - Stale-while-revalidate for images
  - Network-first for HTML with offline fallback
  - Skips `/admin`, `/api`, `/auth` routes
  - Hourly update check
- **Offline Page** (`public/offline.html`) — branded design with "Try Again" button
- **Install Prompt**
  - Auto-shows after 20s
  - 30-day dismissal cooldown
  - Hidden on `standalone` mode
- **Enhanced Manifest**
  - App shortcuts (Products, Orders, New Arrivals)
  - Categories (shopping, fashion)
  - `display_override` for modern browsers
  - Maskable icons (192, 512)

### 📊 Added — Admin Dashboard 2.0

- **Command-Center Dashboard**
  - 6 top cards (products, orders, users, revenue, AOV, live users)
  - 4 business health cards (reviews, coupons, cart recovery, emails)
  - Recent activity timeline (last 8 admin actions)
- **Action Center** — pending items grid
  - Pending reviews, orders, payments, abandoned carts, low stock, failed emails
  - "All caught up" state when no items pending
- **Live Users Widget** — auto-refreshes every 30s
- **Product Analytics** — per-product views, cart adds, orders, conversion rate, abandoned flag
- **New vs Returning chart** — 30-day visitor breakdown
- **Payment method breakdown** — COD vs Stripe revenue bars

### 📈 Added — Session Tracking

- **MongoDB `sessions` collection** — one document per browser tab session
- **Visitor classification** — `guest`, `new`, `returning`, `admin`
- **Tracked per session:**
  - Device, OS, browser
  - Country, city (from Vercel headers)
  - Referrer (raw + classified source)
  - Page views, product views, cart adds, order count, revenue
  - Unique paths, products, orders
  - Duration (ms)
  - `ended_with` heuristic — `order` / `abandon` / `bounce`
- **90-day TTL** (auto-purge)
- **Upsert pattern** — every track batch creates/updates the session

### 📊 Added — Analytics Pages

- **`/admin/visitors`** — full session list with filters
- **`/admin/sessions?id=X`** — deep-dive into one session
- **`/admin/users/[id]/activity`** — user activity timeline
- **`/admin/reports`** — sales analytics with trends
  - 7d / 30d / 90d / All time presets
  - Revenue over time (area chart)
  - Revenue by category (bar chart)
  - Revenue by payment method (progress bars)
  - Top selling products table

### 🤖 Added — AI Features

- AI Shopping Assistant (see above)
- **AI Setup section** in README + Deployment docs
- **AI tools** — read-only, RLS-enforced
- **AI system prompt** — server-side only, injection-resistant

### 🐛 Fixed — Email System (5 critical bugs)

- **Duplicate payment-confirmed emails**
  - Stripe webhook now checks `orders.payment_status` before queueing
  - If client-side `confirmPayment` already ran, webhook skips the email
  - Whichever path fires first wins
- **Resend order email — wrong payment method**
  - Was using legacy `payment_method`
  - Now uses `payment_provider` (canonical)
- **Resend order email — missing discount + coupon**
  - Now passes `discount_amount` and `coupon_code` to template
  - Email shows discount line correctly
- **Stuck `queued` emails on QStash failure**
  - If `qstash.publishJSON` throws, log is now marked `failed` with error
  - Previously stayed `queued` forever
- **Welcome-back email throttle bug**
  - Throttle marker (`welcome_back_sent_at`) only set if email actually queued
  - Previously set even on QStash failure — user got no email for 7 days

### 🐛 Fixed — Order Placement (Atomic v2)

- **No more partial state**
  - v1 split order + coupon + provider into 3 separate operations
  - v2 combines them into **one Postgres transaction**
  - If any step fails, entire transaction rolls back
  - No compensating RPC, no retry logic needed
- **Atomic coupon redemption**
  - Coupon lock + validation + increment + redemption record all inside the same transaction as the order
- **`payment_method` also set on INSERT**
  - Previously only `payment_provider` was set post-insert
  - `payment_method` column was stuck on default

### 🐛 Fixed — Other

- Signup detects existing accounts (was showing "created" silently)
- Login surfaces "Email not confirmed" properly
- Reset flow correctly redirects to reset form
- PWA install prompt no longer repeats after dismiss
- Groq model changed to `openai/gpt-oss-120b` (region-compatible)
- Image quality warnings resolved

### 🔒 Security — Hardened

- **Role normalization migration** — whitelist-based, backup table, atomic DO block
  - Previously `NOT IN ('customer', 'admin')` was destructive to future roles
  - Now only touches known-legacy values: `user`, `member`, `guest`, `''`
  - Backup preserved in `_role_normalization_backup`
  - Fails loudly if unknown roles exist after normalization
- **Immutability guards** — Postgres trigger on `orders`
  - Blocks any UPDATE to `items` or `address` after INSERT
  - Uses `WHEN` clause — zero overhead on normal updates
  - Prevents accidental history rewrite
- **Super admin tier** — `is_super_admin` on profiles
  - Role changes require super-admin (checked inside Postgres via `admin_change_user_role` RPC)
  - Regular admin compromised ≠ role escalation
- **Idempotency — Lua atomic release** (v2)
  - Previous: `GET` then `DEL` — race condition on TTL expiry
  - Now: Lua script runs atomically inside Redis
  - No more possibility of deleting another process's lock
- **AI prompt injection guard**
  - Zod schema rejects `system` role from client
  - Only `user` and `assistant` accepted
- **Session privacy**
  - IP hashed (SHA-256 + salt), never raw
  - Session ID is not a credential (identifies a tab, not a person)
  - 24h cookie TTL
- **QStash signature verification** with key rotation support (`CURRENT` + `NEXT` keys)

### ⚡ Performance

- **Lighthouse Desktop:** 98 → **97** (Performance), 100 → **100** (A11y/Best/SEO)
- **Lighthouse Mobile:** 84 → **91** (Performance), 100 → **100** (A11y/Best/SEO)
- **Mobile LCP:** 3.5s → **3.5s** (unchanged)
- **Desktop LCP:** 0.5s → **0.5s** (unchanged)
- **CLS:** 0 (still perfect)
- **AI streaming** — perceived instant response
- **PWA service worker** — static assets from cache on second visit
- **Chat widget** — lazy-loaded (after page load) to avoid LCP impact

### 📦 Dependencies

- **Added:** `ai`, `@ai-sdk/groq`
- **Removed:** `next-pwa` (replaced with manual service worker)

### 📚 Documentation

- **11 deep-dive docs** (was 7)
  - Added: `faq-developer.md`, `roadmap.md`
  - Updated: all existing docs to reflect v3.1 features
- **README rewritten** with AI + PWA sections (~8000 lines total)

### 🏗️ Architecture — New

- **AI layer** — Groq + Vercel AI SDK v5
- **Session tracking layer** — MongoDB `sessions` collection
- **Product analytics engine** — MongoDB events + Supabase order_items merge
- **PWA layer** — Service worker + manifest + offline page
- **Migration #13** — `place_order_atomic_v2` (atomic coupon + provider)

### 🧪 Testing — Planned

- Unit tests for AI tool schemas (documented)
- Unit tests for password strength (documented)
- Manual SQL test for immutability guards (documented)
- Concurrency test script for atomic operations (documented)

---

## [v3.0.0] — Enterprise Feature Set (2026-10-12)

This is the largest release since v1.0. VESTIOR went from a functional storefront to a **production-grade, enterprise-level platform**.

### 🎉 Added — Payments

- **Stripe integration** with Payment Intents
  - `stripeProvider` implementing the `PaymentProvider` interface
  - Client-side `<PaymentElement>` with night theme
  - `confirmPayment` Server Action for server-side verification
  - Webhook handler with signature verification + idempotency
  - Refunds via admin panel
- **Payment provider abstraction** — `getPaymentProvider(id)` factory
  - COD provider (baseline)
  - Stripe provider (extensible)
  - PayPal placeholder (ready for future)
- **Payment fields on `orders`** — `payment_provider`, `payment_intent_id`, `payment_metadata`, `paid_at`
- **`payment_transactions`** MongoDB collection for audit trail
- **Admin payments dashboard** (`/admin/payments`)
  - Total revenue, today's revenue, success rate, Stripe revenue
  - Transaction table with search, filters, pagination
  - Detail modal showing webhook event timeline
  - Refund button (calls Stripe API)

### 🎉 Added — Email System

- **Gmail SMTP delivery** via Nodemailer
  - Sends to any recipient without domain verification
  - 500 emails/day free tier
  - App password setup (16-char, 2FA-compatible)
- **QStash job queue** for background email delivery
  - Automatic retries (3x with backoff)
  - Dead Letter Queue
  - Region-aware URLs
  - Dev-mode fallback (direct send when QStash can't reach localhost)
- **9 React Email templates:**
  - `welcome` — On signup
  - `order-placed` — On order creation
  - `payment-confirmed` — On payment success
  - `payment-failed` — On payment failure
  - `order-shipped` — On status update
  - `order-delivered` — On delivery
  - `order-cancelled` — On cancellation
  - `low-stock-alert` — Admin notification
  - `abandoned-cart` — Recovery email with coupon
- **MongoDB `email_logs`** collection with full delivery history
- **Resend webhooks** for delivery/open/bounce tracking (optional)
- **Admin email dashboard** (`/admin/emails`) with stats + filters

### 🎉 Added — Analytics Engine

- **Self-hosted event tracking** with MongoDB
  - 13 event types: `page_view`, `product_view`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `checkout_completed`, `order_placed`, `login`, `signup`, `search`, `wishlist_add`, `wishlist_remove`, `share_product`
  - Client SDK with batching (10s or 10 events)
  - `navigator.sendBeacon` on page unload
  - Session ID in 24h cookie
  - IP hashing (SHA-256 + salt) for privacy
  - User-Agent parsing server-side
  - Country/city from Vercel headers
- **Admin analytics dashboard** (`/admin/analytics`)
  - Live users (last 5 minutes)
  - Page views + unique sessions today
  - **Conversion funnel** (7 days)
  - Top products (views, adds, orders)
  - Device breakdown
  - Traffic sources (referrers)
- **90-day TTL** on events (auto-cleanup)

### 🎉 Added — Growth Features

- **Coupon system**
  - Percent or fixed discount types
  - Minimum order amount gate
  - Max discount cap (for percent)
  - Total usage limit + per-user limit
  - Expiry date
  - Active/inactive toggle
  - **Atomic redemption** with `FOR UPDATE` locks
  - Auto-generated **5% recovery coupons** for abandoned carts
  - Admin panel with copy, toggle, edit, delete
  - Full audit trail via `coupon_redemptions` table
- **Product reviews**
  - One review per user per product
  - Star rating (1-5) + title + comment
  - **Verified Purchase** badge (checks order history)
  - Moderation workflow (pending → approved/rejected)
  - **Schema.org Review markup** for Google stars
  - Average rating + breakdown on product page
  - Star rating on product cards
  - Admin moderation panel (`/admin/reviews`)
- **Backend-synced wishlist**
  - Guest mode (localStorage)
  - Logged-in mode (Supabase-backed)
  - Auto-merge on login
  - Navbar badge with count
  - Dedicated `/wishlist` page
  - Optimistic updates with rollback
- **Abandoned cart recovery**
  - Silent client-side sync (debounced 2s)
  - Hourly cron to find carts 2+ hours old
  - Auto-email with cart contents + recovery link
  - Auto-generated coupon per user (idempotent)
  - Recovery tracking (marks cart recovered on order)
  - Cooldown: max 3 reminders, 7 days apart
  - Admin dashboard with stats
- **Product recommendations**
  - Related products (same category, similar price)
  - "You May Also Like" (cross-category)
  - "Trending Now" (from events)
  - "Recently Viewed" (localStorage-backed)
  - Scrollable rows with arrow navigation
- **Advanced product filters**
  - Price range filter (min/max)
  - Sort: Newest, Price ↓, Price ↑, Top Rated, Most Popular
  - In-stock only toggle
  - Active filter chips (removable)
  - Mobile filter drawer (bottom sheet)
  - URL sync (shareable/bookmarkable)
  - Server-side filtering

### 🎉 Added — Admin Panel Expansion

- **Order detail pages** (customer + admin)
  - Progress tracker with status visualization
  - Item list with thumbnails
  - Shipping address
  - Payment info
  - Status change, refund, resend email actions
  - Real-time status updates (Supabase Realtime)
  - Audit trail of admin actions
- **Printable invoices**
  - Customer + admin access
  - Print-optimized HTML (Save as PDF)
  - A4 page size
  - Discount + coupon display
  - Payment method + status + transaction ID
  - Email link included
- **Audit logs** (`/admin/audit`)
  - Every admin action recorded
  - Actor, action, target, before/after state
  - IP hash, timestamp
  - Filters by action, target type, actor
- **Export center** (`/admin/exports`)
  - Orders, payments, emails, users, audit logs
  - CSV format with UTF-8 BOM (Excel-friendly)
  - Date range + status filters
  - 10,000 row limit per export
- **Real-time notifications**
  - Web Audio API chime (no file needed)
  - Custom toast with "View" action
  - Browser native notification
  - Bell icon with unread count badge
  - Dropdown with last 30 notifications
  - localStorage persistence
  - Triggered by: order INSERT + payment_status → completed
- **Admin sidebar** expanded to 12 pages

### ⚡ Performance

- **Lighthouse Desktop:** 84 → 98 (Performance), 85 → 100 (Accessibility)
- **Lighthouse Mobile:** 59 → 84 (Performance), 85 → 100 (Accessibility)
- **Mobile LCP:** 12.4s → 3.5s (**−72%**)
- **Desktop LCP:** 2.2s → 0.5s (**−77%**)
- **CLS:** 0 (perfect score both platforms)
- **ISR on public pages** (`revalidate: 300`)
- **AVIF + WebP image formats** via `next/image`
- **`priority` preload** on hero images
- **Deferred GA4** (`lazyOnload`)
- **Removed Hero animation** from LCP elements
- **Long-cache headers** for static assets (1 year immutable)
- **`optimizePackageImports`** for Lucide + Framer Motion
- **Removed `console.*`** in production
- **Public Supabase client** (`supabasePublic`) for ISR-compatible pages

### 🔒 Security

- **Idempotency keys** for every webhook (Redis SETNX, 24h TTL)
- **`FOR UPDATE` locks** on order placement + coupon redemption
- **IP hashing** (SHA-256 + salt) for tracking
- **Cron authentication** via `CRON_SECRET`
- **Webhook signature verification** (Stripe + QStash)
- **Zod validation** on every Server Action
- **`import 'server-only'`** guards on sensitive modules
- **Audit logging** on every privileged action
- **Fix:** Hydration warning on `<html>` element

### 🧪 Testing

- **53 unit tests** via Vitest + React Testing Library
  - CSV builder (12)
  - Product image parsing (11)
  - Rate limiter tiers (10)
  - COD payment provider (6)
  - ProductCard component (6)
  - Idempotency (5)
  - PaymentOption component (3)
- **21 E2E tests** via Playwright
  - Public pages (9)
  - Auth guards (6)
  - Cart flow (4)
  - Navigation (2)
- **GitHub Actions CI** with 4 parallel jobs:
  - Lint & Typecheck
  - Unit Tests + Coverage upload
  - E2E Tests + Playwright report
  - Security Audit

### 🏗️ Architecture

- **Dual-database design** — Supabase (transactional) + MongoDB (analytical)
- **Provider abstraction** for payments + email
- **QStash queue** for background jobs
- **Redis** for idempotency + rate limiting + cache
- **Docker support** via `Dockerfile.vercel` (Vercel-native container)
- **Vercel cron** configuration
- **11 new API routes**:
  - `/api/admin/export`
  - `/api/admin/payment-detail`
  - `/api/auth/welcome`
  - `/api/cart/recover`
  - `/api/cart/sync`
  - `/api/cron/abandoned-carts`
  - `/api/cron/daily`
  - `/api/cron/keep-alive`
  - `/api/jobs/send-email`
  - `/api/recommendations/recently-viewed`
  - `/api/webhooks/stripe`
  - `/api/wishlist/ids`
- **7 database migrations** (RLS, indexes, payments, reviews, wishlists, coupons)
- **6 MongoDB collections** (events, email_logs, payment_transactions, audit_logs, cart_snapshots, analytics_daily)

### 📚 Documentation

- Complete README rewrite (~1500 lines)
- 7 new `docs/` files:
  - Architecture deep dive
  - Security deep dive
  - Deployment guide
  - Features documentation
  - API reference
  - Database design
  - Testing strategy

### 🐛 Fixed

- React hydration warning on root layout
- Stripe `capture` API error (switched to `retrieve`)
- QStash loopback address rejection in dev (direct send fallback)
- Multiple Supabase client instances (singleton pattern)
- Email not sending to non-verified addresses (Gmail SMTP migration from Resend)
- Preconnect hints pointing to unused origins
- Unused `<link rel="preconnect">` in layout
- Manual memory leak in Hero animation timers
- Double `useEffect` fires on cart update

---

## [v2.0.0] — Production Hardening (2026-10-05)

Critical security fixes and performance improvements.

### 🔒 Security

- **Fixed critical RLS policy holes** — Any authenticated user could manage products/orders
  - Added `is_admin()` helper (SECURITY DEFINER)
  - Rewrote all product/order RLS policies
  - Added admin-only policies for sensitive operations
- **Server-side authorization** in `updateOrderStatus`
  - Re-verifies role against `profiles` table
  - Never trusts JWT claims
- **Replaced client-trusted pricing** with server-side DB fetch
  - `placeOrder` RPC now reads authoritative prices
  - Client-supplied prices discarded
- **Rate limiting** across all route tiers (Upstash Redis)
  - auth: 10/min
  - admin: 60/min
  - orders: 20/min
  - track: 100/min
  - general: 300/min
- **Cookie preservation** on middleware redirects
  - Custom `redirectWithCookies` helper
  - Prevents session loss on refresh
- **Open redirect fix** in OAuth callback
  - `next` param must start with `/` and not `//`
- **`import 'server-only'`** guards on admin client
  - Build-time error if imported by client
- **Environment validation** at startup
  - Zod schema for all required vars
  - Fails build with clear error

### ⚡ Performance

- **Atomic order placement RPC** (`place_order_atomic`)
  - `FOR UPDATE` locks on stock
  - Deadlock-safe ordering (by `product_id ASC`)
  - Zero oversell under concurrency
- **Dashboard stats via single RPC** (`get_dashboard_stats`)
  - Returns 1 row instead of 10,000
  - `Promise.all` for parallel fetch
- **Singleton Supabase browser client**
  - One WebSocket, no refresh races
- **Lazy-loaded images**
- **Dynamic import for Recharts** (admin-only chunk)
- **Hero image: 1.9MB → ~300KB WebP**
- **Removed `react-icons`** dependency (migrated to Lucide)

### 🔍 SEO & DX

- **Dynamic `robots.txt`** — Blocks admin/checkout from crawlers
- **Auto-generated `sitemap.xml`** — Products, categories, static pages
- **JSON-LD structured data** — Organization, WebSite, Product, Breadcrumb
- **Per-page dynamic metadata** — OG + Twitter cards
- **Canonical URLs** on every dynamic route
- **Global error boundary** (`error.tsx`)
- **Route-level loading states** (`loading.tsx`)
- **`.env.example`** for onboarding
- **Upgraded to Next.js 16.3, React 19.3**

### 🏗️ Architecture

- **Migrated `middleware.ts` → `proxy.ts`** (Next.js 16 convention)
- **13 database indexes** added on hot query paths
  - Products: active/featured/new/category
  - Orders: user/status/date
  - Order items: order/product
  - Profiles: created
  - Trigram index on product names

---

## [v1.0.0] — Initial Release (2026-10-01)

First public release.

### Added

- **Full e-commerce flow** (products → cart → checkout → orders)
- **Admin panel** with dashboard, products, orders, users
- **Email/password authentication** via Supabase
- **Google OAuth login**
- **Email verification** flow
- **Real-time order status updates** via Supabase Realtime
- **Glass-morphism UI** with Framer Motion animations
- **Google Analytics 4** integration
- **Custom branded email templates**
- **Responsive design** (mobile, tablet, desktop)
- **Dark theme** with blue accents
- **Category filter** on products page
- **Live search** in navbar
- **Product image gallery**
- **Cart persistence** in localStorage
- **Order history** page
- **Profile management** page
- **Admin product CRUD** with image upload
- **Admin order management**
- **Admin user table**

---

## Version History Summary

| Version | Date | Focus | Lighthouse (Desktop) |
|---------|------|-------|---------------------|
| v3.1.0 | 2026-10-14 | AI + PWA + Auth polish | 97/100/100/100 |
| v3.0.0 | 2026-10-12 | Enterprise features | 98/100/100/100 |
| v2.0.0 | 2026-10-05 | Security + perf | 87/85/100/100 |
| v1.0.0 | 2026-10-01 | Initial release | — |

---

## Upgrade Guide

### From v3.0 to v3.1

**Database:**

1. Run new migrations (in order):
   - `20261014_add_last_login.sql` — Adds `last_login_at`, `welcome_back_sent_at` columns
   - `20261015_add_super_admin.sql` — Adds `is_super_admin` column + `admin_change_user_role` RPC
   - `20261016_normalize_user_roles.sql` — Whitelist-based role normalization + backup table
   - `20261017_sales_report_rpc.sql` — Adds `get_sales_report` RPC
   - `20261018_product_analytics_rpc.sql` — Adds `get_product_sales_stats` RPC
   - `20261019_place_order_atomic_v2.sql` — **⚠️ Critical** — Replaces order RPC with atomic v2

2. Add `sessions` collection indexes in MongoDB:
   ```javascript
   db.sessions.createIndex({ session_id: 1 }, { unique: true })
   db.sessions.createIndex({ user_id: 1, last_seen_at: -1 })
   db.sessions.createIndex({ ip_hash: 1, last_seen_at: -1 })
   db.sessions.createIndex({ visitor_type: 1, last_seen_at: -1 })
   db.sessions.createIndex({ last_seen_at: 1 }, { expireAfterSeconds: 7776000 })
   ```

3. Verify all RPCs exist:
   ```sql
   SELECT proname FROM pg_proc WHERE proname IN (
     'place_order_atomic',
     'admin_change_user_role',
     'get_sales_report',
     'get_product_sales_stats'
   );
   ```

**Environment:**

Add new var to `.env.local` and Vercel:
```
GROQ_API_KEY=gsk_...
```

**Code:**

- No breaking changes for existing features.
- New components (ChatWidget, PWA register, Action Center) mount automatically.

**Deploy:**

1. Update Vercel env vars (add `GROQ_API_KEY`)
2. Redeploy
3. Verify AI chatbot works ("Show me suits under ₹25,000")
4. Verify PWA install prompt appears (mobile or Chrome desktop)
5. Check email logs no longer show stuck `queued` entries

### From v2 to v3

See [v3.0.0 section](#v300--enterprise-feature-set-2026-10-12) for the full feature list.

**Database:**
1. Run new migrations:
   - `20261005_add_payment_fields.sql`
   - `20261011_add_product_reviews.sql`
   - `20261012_add_wishlists.sql`
   - `20261013_add_coupons.sql`

2. Enable Realtime on `orders` table:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
   ```

3. Create MongoDB collections (auto-created on first write):
   - `email_logs`
   - `payment_transactions`
   - `audit_logs`
   - `cart_snapshots`

**Environment:**
Add new vars to `.env.local`:
```
MONGODB_URI
MONGODB_DB_NAME
QSTASH_URL
QSTASH_TOKEN
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY
GMAIL_USER
GMAIL_APP_PASSWORD
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### From v1 to v2

**Database:**
Run `20261003_fix_rls_policies.sql` and `20261004_add_indexes.sql`.

**Breaking change:** RLS policies for `products` are stricter. If you were relying on the old "any authenticated user" policy, you'll need to promote users to admin via SQL.

**Deploy:**
Update `.env.local` with any new vars. Redeploy.

---

## Deprecation Policy

- **Minor versions:** Deprecation warnings are added, feature remains functional.
- **Major versions:** Deprecated features may be removed.
- **Security fixes:** Never deprecated — patched in all supported versions.

**Current support:** v3.x only. v2.x is EOL.

---

## Contributing to Changelog

When submitting a PR, update this file under `[Unreleased]` with:

```markdown
### Added
- New feature

### Changed
- Modified behavior

### Fixed
- Bug fix

### Removed
- Removed feature

### Security
- Security improvement
```

Categories follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

<p align="center">
  <em>Last updated: 2026-10-14 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```