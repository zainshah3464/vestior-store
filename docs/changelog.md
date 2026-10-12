# Changelog

All notable changes to VESTIOR are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

- [Unreleased](#unreleased)
- [v3.0.0 — Enterprise Feature Set](#v300--enterprise-feature-set-2026-10-12)
- [v2.0.0 — Production Hardening](#v200--production-hardening-2026-10-05)
- [v1.0.0 — Initial Release](#v100--initial-release-2026-10-01)

---

## [Unreleased]

### Planned for v3.1.0
- Multi-currency support (USD, EUR, GBP, AED)
- PayPal integration (once available in Pakistan)
- Order tracking via courier APIs (TCS, Leopards)
- Multi-language (i18n — English + Urdu)
- Loyalty program with points
- Gift cards
- Sentry error tracking
- Codecov integration
- PWA offline mode
- Advanced analytics dashboard (cohorts, retention)

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
- **Daily aggregation cron** (planned for v3.1)
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
- **9 new API routes**:
  - `/api/admin/export`
  - `/api/admin/payment-detail`
  - `/api/auth/welcome`
  - `/api/cart/recover`
  - `/api/cart/sync`
  - `/api/cron/abandoned-carts`
  - `/api/cron/daily`
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
| v3.0.0 | 2026-10-12 | Enterprise features | 98/100/100/100 |
| v2.0.0 | 2026-10-05 | Security + perf | 87/85/100/100 |
| v1.0.0 | 2026-10-01 | Initial release | — |

---

## Upgrade Guide

### From v2 to v3

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

**Code:**
No breaking changes for existing features. New components mount automatically.

**Deploy:**
1. Update Vercel env vars
2. Update Supabase redirect URLs
3. Add Stripe webhook endpoint
4. Redeploy

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
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```