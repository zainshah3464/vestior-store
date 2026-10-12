<div align="center">

# VESTIOR

### Premium Men's Fashion E-Commerce Platform

**Production-grade, full-stack, single-vendor storefront — engineered with the same architectural patterns used by top-tier SaaS companies.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Redis](https://img.shields.io/badge/Upstash_Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com)

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE.txt)

[![Documentation](https://img.shields.io/badge/docs-12_files_·_7000_lines-blue?style=flat-square)](./docs/)

<br />

**Lighthouse Scores**

| Platform | Performance | Accessibility | Best Practices | SEO |
|:--------:|:-----------:|:-------------:|:--------------:|:---:|
| **Desktop** | 🟢 **98** | 💯 **100** | 💯 **100** | 💯 **100** |
| **Mobile** | 🟢 **84** | 💯 **100** | 💯 **100** | 💯 **100** |

**Quality Gates**

[![CI](https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml/badge.svg)](https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml)
[![Unit Tests](https://img.shields.io/badge/unit_tests-53_passing-brightgreen?style=flat-square)](#-testing)
[![E2E Tests](https://img.shields.io/badge/E2E_tests-21_passing-brightgreen?style=flat-square)](#-testing)
[![Coverage](https://img.shields.io/badge/coverage-55%25-yellowgreen?style=flat-square)](#-testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](#-tech-stack)

<br />

🌐 **[Live Demo](https://vestior.vercel.app)** · 📖 **[Documentation](#-table-of-contents)** · 🐛 **[Report Bug](https://github.com/zainshah3464/vestior-store/issues)** · 💡 **[Request Feature](https://github.com/zainshah3464/vestior-store/issues)**

</div>

---

## 📖 Table of Contents

<details open>
<summary><strong>Click to expand full navigation</strong></summary>

- [Overview](#-overview)
- [What's New in v3.0](#-whats-new-in-v30)
- [Lighthouse Scores](#-lighthouse-scores)
- [Key Features](#-key-features)
  - [Customer Experience](#-customer-experience)
  - [Admin Panel](#-admin-panel)
  - [Marketing & Growth](#-marketing--growth)
  - [Notifications & Communication](#-notifications--communication)
  - [Developer Experience](#-developer-experience)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
  - [High-Level Data Flow](#high-level-data-flow)
  - [Security Model](#security-model)
  - [Order Placement Flow](#order-placement-flow-atomic)
  - [Payment Processing](#payment-processing)
  - [Email Pipeline](#email-pipeline)
  - [Event Tracking Pipeline](#event-tracking-pipeline)
  - [Abandoned Cart Recovery](#abandoned-cart-recovery)
  - [Admin Real-Time Notifications](#admin-real-time-notifications)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone--install)
  - [Environment Variables](#2-environment-variables)
  - [Supabase Setup](#3-supabase-setup)
  - [MongoDB Setup](#4-mongodb-setup)
  - [Upstash Setup](#5-upstash-setup-redis--qstash)
  - [Stripe Setup](#6-stripe-setup)
  - [Email Setup](#7-email-setup-gmail-smtp)
  - [Run Development Server](#8-run-development-server)
- [How to Create First Admin](#-how-to-create-first-admin)
- [Seed Data](#-seed-data)
- [Project Structure](#-project-structure)
- [Security Checklist](#-security-checklist)
- [Server Actions API](#-server-actions-api)
- [Database Schema](#-database-schema)
- [Performance & SEO](#-performance--seo)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Troubleshooting](#-troubleshooting)
- [Browser Support](#-browser-support)
- [Accessibility](#-accessibility)
- [FAQ](#-faq)
- [Roadmap](#️-roadmap)
- [Changelog](#-changelog)
- [Security Disclosure](#️-security-disclosure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

</details>

---


## 📚 Documentation

Deep dives for engineers and evaluators:

### Core
- **[Architecture](./docs/architecture.md)** — Design philosophy, dual-database rationale, atomic operation patterns, scalability path
- **[Security](./docs/security.md)** — Threat model, defense layers, RLS patterns, incident response
- **[Deployment](./docs/deployment.md)** — Vercel/Docker/VPS setup, env vars, monitoring, rollback

### Developer Reference
- **[API Reference](./docs/api-reference.md)** — Server Actions, RPCs, REST endpoints with full signatures
- **[Database Design](./docs/database.md)** — ER diagram, all tables, migrations, indexes
- **[Features](./docs/features.md)** — Every feature with use cases and technical implementation
- **[Testing](./docs/testing.md)** — Unit + E2E strategy, CI integration, testing patterns

---

## 🎯 Overview

**VESTIOR** is a **production-grade, single-vendor e-commerce platform** built for premium men's fashion (suits, coats, pants, waistcoats, Gurkha, two-piece and three-piece sets). It goes far beyond a standard storefront — it integrates payment abstraction, self-hosted analytics, queue-based background processing, coupon economics, cart recovery, product recommendations, and full admin tooling into one cohesive system.

The project demonstrates **senior-level engineering decisions**:

- **Separation of concerns** — Supabase owns transactional data; MongoDB owns event/analytics data; Redis owns ephemeral state.
- **Database ownership boundaries** — No overlap. No confusion.
- **Idempotency** — Every webhook, every redemption, every notification delivery is guarded.
- **Atomic operations** — Order placement and coupon redemption are race-condition safe.
- **Graceful degradation** — If Redis, MongoDB, or any queue is down, the site keeps working.
- **Provider abstraction** — Payment providers (Stripe, COD) and email providers (Gmail SMTP, Resend) sit behind interfaces. Swappable without touching business logic.
- **Defense in depth** — Server-side validation, RLS policies, middleware guards, rate limiting, webhook signature verification — layered.

---

## 🚀 What's New in v3.0

This release represents a **massive architectural and feature upgrade** from v2.0. Highlights:

<table>
<tr>
<td width="50%" valign="top">

### 💳 Payments
- Multi-provider abstraction (COD + Stripe)
- Stripe Payment Intents + Elements
- Webhook with idempotency
- Refunds (admin + webhook)
- Payment transactions in MongoDB

### 📧 Email System
- Gmail SMTP delivery (no domain needed)
- QStash queue with retries + DLQ
- 9 transactional templates
- Delivery logs in MongoDB
- Admin email dashboard

### 📊 Analytics Engine
- Self-hosted event tracking (MongoDB)
- Conversion funnel
- Live users, top products
- Device + referrer breakdown
- Daily aggregation cron

</td>
<td width="50%" valign="top">

### 🛒 Growth Features
- **Coupon system** with atomic redemption
- **Product reviews** with moderation
- **Wishlist** (backend-synced)
- **Abandoned cart recovery** (auto-email + coupons)
- **Product recommendations** (related, cross-sell, trending)
- **Invoice PDF** (print-optimized)

### 🎛️ Admin Panel
- 12 dedicated admin pages
- Real-time notifications (sound + toast + browser)
- Audit logs (every action tracked)
- Export center (CSV for all entities)
- Analytics dashboard
- Payment refunds

### 🧪 Quality
- **53 unit tests** (Vitest + RTL)
- **21 E2E tests** (Playwright)
- **GitHub Actions CI** (4 jobs)
- **100/100 accessibility** (both platforms)
- **98/100/100/100 Lighthouse** (desktop)

</td>
</tr>
</table>

---

## 🏆 Lighthouse Scores

Audited with **Google Lighthouse 13.5.0** on a **production build** with **mobile emulation** and **Slow 4G throttling**.

### Desktop

| Metric | Score | Status |
|:-------|:-----:|:------:|
| **Performance** | 98 | 🟢 Excellent |
| **Accessibility** | 100 | 💯 Perfect |
| **Best Practices** | 100 | 💯 Perfect |
| **SEO** | 100 | 💯 Perfect |

**Core Web Vitals:**
- LCP: **0.5s** 🟢
- FCP: **0.3s** 🟢
- TBT: **100ms** 🟢
- CLS: **0** 🟢

### Mobile

| Metric | Score | Status |
|:-------|:-----:|:------:|
| **Performance** | 84 | 🟢 Good |
| **Accessibility** | 100 | 💯 Perfect |
| **Best Practices** | 100 | 💯 Perfect |
| **SEO** | 100 | 💯 Perfect |

**Core Web Vitals:**
- LCP: **3.5s** 🟡
- FCP: **0.9s** 🟢
- TBT: **250ms** 🟢
- CLS: **0** 🟢

### What's included

- ✅ Production Turbopack build
- ✅ ISR-cached public pages (`revalidate: 300`)
- ✅ AVIF + WebP image formats via `next/image`
- ✅ Preloaded LCP assets (hero images)
- ✅ Deferred GA4 (`lazyOnload`)
- ✅ Tree-shaken icon library (`optimizePackageImports`)
- ✅ Removed `console.*` in production
- ✅ Long-cache headers for static assets
- ✅ Sub-15KB CSS payload
- ✅ Zero layout shift (CLS 0)

---

## ✨ Key Features

### 🛍️ Customer Experience

<details open>
<summary><strong>Storefront & Discovery</strong></summary>

- **Elegant homepage** — Hero with adaptive imagery (mobile vs desktop), animated stats, category grid, featured + new-arrivals scroll rows, trending products row
- **Advanced product discovery**
  - Debounced live search (300ms) with recent search history
  - Category filtering
  - **Price range filter** (min/max)
  - **Sort**: Newest, Price ↓, Price ↑, Top Rated, Most Popular
  - **In-stock only** toggle
  - Active filter chips (removable)
  - Shareable/bookmarkable URLs
  - Mobile filter drawer
- **Product detail**
  - Multi-image gallery with prev/next
  - Image thumbnails
  - Size selector (XS–3XL + Custom)
  - Live stock indicator
  - Discount % badge
  - Wishlist toggle
  - Copy link + WhatsApp share
  - Dynamic OG metadata + JSON-LD

</details>

<details>
<summary><strong>Cart & Checkout</strong></summary>

- **localStorage cart** with deduplication and stock clamping
- Real-time cart count in navbar
- Quantity update, remove item, clear cart
- **Secure server-validated checkout** (client prices ignored)
- **Payment method selector**:
  - Cash on Delivery (COD)
  - Card via Stripe Elements
- **Coupon field** with server-side validation
- Auto-fill of shipping address from profile
- Stripe Elements with night theme
- Order confirmation with email

</details>

<details>
<summary><strong>Account & Orders</strong></summary>

- Email/password + Google OAuth
- Email verification flow
- PKCE-safe callback handling
- Profile management (name, phone, address)
- Order history with **real-time status updates** (Supabase Realtime)
- **Order detail page** with progress tracker
- **Invoice download** (print-optimized HTML → Save as PDF)
- **Wishlist** page (backend-synced, guest merge on login)
- **Product reviews** (verified purchase badges, moderation)

</details>

<details>
<summary><strong>Recommendations</strong></summary>

- **"You May Also Like"** — cross-category recommendations
- **"Related Products"** — same category, similar price
- **"Trending Now"** — from tracked events (last 7 days)
- **"Recently Viewed"** — localStorage-backed carousel
- All rows are scrollable with arrow navigation

</details>

---

### 🎛️ Admin Panel

12 dedicated pages, all dark-themed with glass-morphism UI:

| Page | Purpose |
|------|---------|
| **`/admin`** | Dashboard: revenue, orders, users, avg order value, charts, recent orders |
| **`/admin/products`** | Full CRUD + multi-image upload + quick stats |
| **`/admin/products/new`** | Create product form |
| **`/admin/products/[id]/edit`** | Edit product with image management |
| **`/admin/orders`** | Filterable order table |
| **`/admin/orders/[id]`** | Order detail with status change, refund, resend email, audit trail |
| **`/admin/orders/[id]/invoice`** | Print-optimized invoice |
| **`/admin/payments`** | Payment dashboard with refunds + transaction details (MongoDB) |
| **`/admin/reviews`** | Moderation queue (approve/reject/delete) |
| **`/admin/coupons`** | Full CRUD with usage tracking, per-user limits, expiry |
| **`/admin/abandoned-carts`** | Recovery stats + cart list with reminder history |
| **`/admin/analytics`** | Live users, funnel, top products, devices, referrers |
| **`/admin/emails`** | Email delivery logs with filters |
| **`/admin/audit`** | Every admin action, timestamped |
| **`/admin/exports`** | CSV export center (orders, payments, emails, users, audit) |
| **`/admin/users`** | User table with search, role filter, detail modal |

**Real-time admin notifications:**
- Web Audio API chime (no file needed)
- Custom toast with "View" action
- Browser native notification
- Bell icon with unread badge
- localStorage persistence
- Triggered by: `order INSERT` and `payment_status → completed`

---

### 📈 Marketing & Growth

<details open>
<summary><strong>Coupon System</strong></summary>

- **Percent or fixed** discount types
- **Min order amount** gate
- **Max discount cap** (for percent)
- **Total usage limit** + **per-user limit**
- **Expiry date**
- **Active/inactive toggle**
- **Atomic redemption** (`FOR UPDATE` lock prevents race conditions)
- Auto-generated **recovery coupons** (5% off, 7-day expiry)
- Admin panel with copy, toggle, edit, delete
- Full audit trail

</details>

<details>
<summary><strong>Abandoned Cart Recovery</strong></summary>

- **Silent cart tracker** — debounced client-side sync to MongoDB
- **Cron job** (hourly) — finds carts 2+ hours old
- **Auto-email** with cart contents + recovery link
- **Auto-5%-off coupon** per user (idempotent)
- **Recovery tracking** — marks cart recovered on successful order
- **Cooldown** — max 3 reminders, 7 days apart
- **Throttle** — 1 cron run per hour
- Admin dashboard with stats (recovery rate, lost value)

</details>

<details>
<summary><strong>Product Reviews</strong></summary>

- Authenticated users only
- **One review per user per product**
- Star rating (1-5) + title + comment
- **Verified Purchase badge** (checks order history)
- Moderation queue (pending → approved/rejected)
- **Schema.org Review markup** — Google stars in search results
- Average rating + breakdown on product page
- Star rating on product cards

</details>

<details>
<summary><strong>Wishlist</strong></summary>

- **Guest mode** — localStorage
- **Logged-in mode** — Supabase-backed
- **Auto-merge** guest wishlist on login
- Heart toggle on cards + detail page
- **Navbar badge** with live count
- Dedicated `/wishlist` page with add-to-cart
- Optimistic updates with rollback on error

</details>

---

### 🔔 Notifications & Communication

**Customer emails** (Gmail SMTP via Nodemailer, queued via QStash):

1. Welcome (on signup)
2. Order placed
3. Payment confirmed
4. Payment failed
5. Order shipped
6. Order delivered
7. Order cancelled
8. Low stock alert (admin)
9. **Abandoned cart** (with recovery coupon)

**Admin notifications:**
- Real-time toast + sound + browser notification
- Bell icon with count
- Dropdown with last 30 notifications
- Deep-link to order detail

---

### ⚡ Developer Experience

- **End-to-end TypeScript** (strict mode)
- **Zod** validation at every boundary
- **Vitest** unit tests (53 tests, 7 files)
- **Playwright** E2E tests (21 tests, 4 files)
- **GitHub Actions CI** (4 jobs, parallel)
- **Docker** support (Vercel-native container)
- **Vercel** deployment with cron jobs
- **Automated coverage reporting**
- **Structured error logging**
- **Environment validation at startup**
- **Audit logging on every privileged action**

---

## 🧰 Tech Stack

<table>
<tr>
<td width="33%" valign="top">

### Frontend
- **Next.js 16.3** (App Router, Turbopack, RSC)
- **React 19.3**
- **TypeScript 5** (strict)
- **Tailwind CSS v4**
- **Framer Motion 12**
- **Lucide React**
- **Recharts** (admin only)
- **react-hot-toast**

</td>
<td width="33%" valign="top">

### Backend & Data
- **Supabase**
  - PostgreSQL (RLS)
  - Auth (email + OAuth)
  - Storage
  - Realtime
- **MongoDB Atlas**
  - Events
  - Email logs
  - Payment txns
  - Audit logs
  - Cart snapshots
- **Upstash Redis**
  - Rate limiting
  - Idempotency
  - Cache

</td>
<td width="33%" valign="top">

### Integrations
- **Stripe** — payments + webhooks
- **Upstash QStash** — job queue
- **Gmail SMTP** (Nodemailer)
- **Resend** — backup
- **Google Analytics 4**
- **Vercel** — hosting + cron

### Testing & CI
- **Vitest** + RTL
- **Playwright**
- **GitHub Actions**
- **Codecov** ready

</td>
</tr>
</table>

---

## 🏗️ Architecture

> 📖 For deep dives, see **[docs/architecture.md](./docs/architecture.md)** and **[docs/security.md](./docs/security.md)**.

### High-Level Data Flow

```mermaid
flowchart TD
    Browser[🌐 Browser]
    Edge[⚡ Edge Middleware<br/>proxy.ts]
    Server[🖥️ Server Actions & RSC<br/>Node.js]
    Supa[(🗄️ Supabase<br/>PostgreSQL + Auth + Storage)]
    Mongo[(🍃 MongoDB Atlas<br/>Events · Logs · Carts)]
    Redis[(⚡ Upstash Redis<br/>Rate Limit · Cache)]
    QStash[📮 Upstash QStash<br/>Email Queue]
    Stripe[💳 Stripe API]
    Gmail[📧 Gmail SMTP]

    Browser -->|HTTP| Edge
    Edge -->|Session + Rate Limit| Server
    Server -->|RLS queries| Supa
    Server -->|Analytics events| Mongo
    Server -->|Rate limit / idempotency| Redis
    Server -->|Enqueue email job| QStash
    Server -->|Payment intents| Stripe
    QStash -->|POST /api/jobs/send-email| Server
    Server -->|Send email| Gmail
    Stripe -->|Webhook| Server
```

---

### Security Model

```mermaid
flowchart TB
    subgraph Untrusted["🔴 Untrusted — Browser"]
        A1[Supabase JS client — singleton]
        A2[Cart in localStorage]
        A3[All mutations via Server Actions]
    end

    subgraph Edge["🟡 Edge — Next.js proxy.ts"]
        B1[Rate limiting — Upstash]
        B2[Session refresh — cookie-preserving]
        B3[Route guards /admin → role='admin']
    end

    subgraph Server["🟢 Server — RSC + Actions"]
        C1[Re-authenticate every action]
        C2[Zod validate all inputs]
        C3[Fetch authoritative data from DB]
    end

    subgraph Truth["🔵 Source of Truth — Supabase"]
        D1[RLS on every table]
        D2[Atomic RPC for transactions]
        D3[Service-role key: server-only]
    end

    Untrusted -->|HTTP| Edge
    Edge -->|Sanitized request| Server
    Server -->|RLS-enforced| Truth
```

**Guarantees:**
- Client **never** controls prices — always fetched from DB
- Every admin action re-verifies the caller's role against `profiles` table
- Service-role key never reaches the browser (`import 'server-only'`)
- Open redirect protection on OAuth callback `next` param
- Rate limiting on every route tier with fail-open behavior

---

### Order Placement Flow (Atomic)

```mermaid
sequenceDiagram
    participant U as Customer
    participant SA as Server Action
    participant RPC as PostgreSQL RPC
    participant DB as Supabase
    participant Q as QStash
    participant M as MongoDB

    U->>SA: placeOrder(items, address, method, coupon?)
    SA->>SA: Validate input shape (Zod)
    SA->>SA: Authenticate caller
    SA->>SA: Merge duplicate product IDs
    SA->>RPC: place_order_atomic(...)
    RPC->>DB: BEGIN
    RPC->>DB: FOR each item: SELECT FOR UPDATE
    RPC->>DB: Verify stock >= qty
    RPC->>DB: UPDATE stock -= qty
    RPC->>DB: INSERT order + order_items
    RPC->>DB: COMMIT
    RPC-->>SA: { order_id, subtotal, shipping, total }
    SA->>RPC: redeem_coupon_atomic(...) (if coupon)
    RPC->>DB: Re-validate + FOR UPDATE lock
    RPC->>DB: Increment times_used + INSERT redemption
    RPC-->>SA: { discount_amount }
    SA->>DB: UPDATE order (coupon_code, discount_amount)
    SA->>Q: queueEmail('order-placed')
    Q-->>M: Log 'queued'
    SA->>M: markCartRecovered()
    SA-->>U: { success, orderId, total }
```

**Concurrency guarantee:** Under simultaneous orders on the same product, `FOR UPDATE` serializes access. **Oversell is impossible.**

---

### Payment Processing

```mermaid
sequenceDiagram
    participant U as Customer
    participant SA as placeOrder
    participant DB as Supabase
    participant SP as Stripe
    participant WH as Webhook

    U->>SA: Checkout with card
    SA->>DB: Create order (payment_status: pending)
    SA->>SP: paymentIntents.create()
    SP-->>SA: { id, client_secret }
    SA-->>U: client_secret
    U->>SP: stripe.confirmPayment() (Elements)
    SP-->>U: { status: 'succeeded' }
    U->>SA: confirmPayment(orderId, intentId)
    SA->>SP: paymentIntents.retrieve()
    SP-->>SA: { status: 'succeeded' }
    SA->>DB: UPDATE order (payment_status: completed)
    par Webhook (production)
        SP->>WH: payment_intent.succeeded
        WH->>WH: Verify signature
        WH->>WH: Check idempotency (Redis)
        WH->>DB: UPDATE order
        WH->>Mongo: INSERT payment_transactions
    and Email
        SA->>QStash: queueEmail('payment-confirmed')
    end
```

**Dual confirmation:** Webhook + client-side verify. Both idempotent. Race-safe.

---

### Email Pipeline

```mermaid
flowchart LR
    A[Server Action] -->|queueEmail| B[Log to MongoDB]
    B --> C{Local dev?}
    C -->|Yes| D[Send directly via Gmail SMTP]
    C -->|No| E[Push to QStash]
    E -->|POST /api/jobs/send-email| F[Job handler]
    F --> G[Render React Email]
    G --> H[Send via Gmail SMTP]
    H --> I[Update log: sent]
    D --> I
    I --> J[Resend webhook → status tracking]
```

**Why QStash?** Vercel functions have 10s limits. SMTP is slow. Queue decouples the two.

**Dev-mode fallback:** QStash can't reach `localhost`. Direct send in dev.

---

### Event Tracking Pipeline

```mermaid
flowchart LR
    A[User action] -->|track\('event', props\)| B[Client SDK]
    B --> C[Batch every 10s]
    C --> D[navigator.sendBeacon on unload]
    D --> E[POST /api/track]
    E --> F[Rate limit: 100/min/IP]
    F --> G[Zod validate]
    G --> H[Parse User-Agent]
    H --> I[Hash IP: SHA-256 + salt]
    I --> J[(MongoDB: events)]
    J --> K[TTL 90 days]
    J --> L[Aggregation pipelines]
    L --> M[Funnel · Top products · Devices · Referrers]
```

**Events tracked:** `page_view`, `product_view`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `checkout_completed`, `order_placed`, `login`, `signup`, `search`, `wishlist_add`, `wishlist_remove`, `share_product`.

---

### Abandoned Cart Recovery

```mermaid
flowchart TD
    A[Customer adds to cart] -->|cartUpdated event| B[CartTracker debounced 2s]
    B --> C[POST /api/cart/sync]
    C --> D[(MongoDB: cart_snapshots)]

    E[Cron: every hour] -->|GET /api/cron/abandoned-carts| F{Throttle: 50 min?}
    F -->|No| G[Skip]
    F -->|Yes| H[Find carts > 2h old, max 3 reminders]
    H --> I[For each cart]
    I --> J[Generate/lookup 5%-off coupon]
    J --> K[Queue email via QStash]
    K --> L[Update: last_reminder_at, count++]

    M[Customer clicks recovery link] -->|GET /cart?recover=TOKEN| N[/api/cart/recover]
    N --> O[Restore cart from snapshot]
    O --> P[Clean URL]

    Q[Order placed] --> R[markCartRecovered]
```

---

### Admin Real-Time Notifications

```mermaid
flowchart LR
    A[Customer places order] --> B[Supabase INSERT orders]
    B -->|Realtime channel| C[AdminNotificationsProvider]
    C --> D[Web Audio API chime]
    C --> E[Custom toast with View action]
    C --> F[Browser Notification API]
    C --> G[Bell icon badge++]
    C --> H[localStorage persist]
```

**Subscription:** `orders` table INSERT + UPDATE where `payment_status = 'completed'`.

---

## 📸 Screenshots

> Screenshots are captured from the production build at [vestior.vercel.app](https://vestior.vercel.app).

<table>
<tr>
<td width="50%">

**Homepage**
![Homepage](./public/og-image.png)

</td>
<td width="50%">

**Product Category**
![Category](./public/category.png)

</td>
</tr>
<tr>
<td width="50%">

**Cart**
![Cart](./public/cart.png)

</td>
<td width="50%">

**Checkout**
![Checkout](./public/checkout.png)

</td>
</tr>
<tr>
<td width="50%">

**Customer Orders**
![Orders](./public/order.png)

</td>
<td width="50%">

**Admin Dashboard**
![Dashboard](./public/dashboard.png)

</td>
</tr>
<tr>
<td width="50%">

**Admin Orders**
![Admin Orders](./public/ordersadmin.png)

</td>
<td width="50%">

**Admin Users**
![Admin Users](./public/useradmin.png)

</td>
</tr>
</table>

**Additional pages** (capture and add your own):
- `/admin/analytics` — Analytics dashboard
- `/admin/coupons` — Coupon management
- `/admin/reviews` — Review moderation
- `/admin/abandoned-carts` — Cart recovery
- `/admin/payments` — Payment dashboard
- `/orders/[id]/invoice` — Printable invoice

---

<div align="center">

**📌 End of Part 1 — Continue to Part 2 for setup, database schema, testing, and deployment.**

</div>
```
## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **npm** (or pnpm/yarn) | Latest | Package manager |
| **Supabase account** | Free tier | Database + Auth + Storage + Realtime |
| **MongoDB Atlas account** | Free tier (M0) | Events, logs, cart snapshots |
| **Upstash account** | Free tier | Redis + QStash |
| **Stripe account** | Test mode | Card payments |
| **Gmail account** | Personal | Transactional email |

> **Total cost to run:** **$0** on free tiers (see [Free Tier Limits](#-free-tier-limits))

---

### 1. Clone & Install

```bash
git clone https://github.com/zainshah3464/vestior-store.git
cd vestior-store
npm install
```

---

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values below. Every variable is validated at startup — a missing one will fail the build with a clear error.

```env
# ═══════════════════════════════════════════════════════════════
# SUPABASE (required)
# ═══════════════════════════════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # ⚠️ Server-only, never expose

# ═══════════════════════════════════════════════════════════════
# SITE (required)
# ═══════════════════════════════════════════════════════════════
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ═══════════════════════════════════════════════════════════════
# UPSTASH REDIS (required)
# ═══════════════════════════════════════════════════════════════
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx...

# ═══════════════════════════════════════════════════════════════
# MONGODB ATLAS (required)
# ═══════════════════════════════════════════════════════════════
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=vestior

# ═══════════════════════════════════════════════════════════════
# SECURITY (required)
# Generate with: openssl rand -hex 32
# ═══════════════════════════════════════════════════════════════
IP_HASH_SALT=replace-with-32-plus-random-chars
CRON_SECRET=replace-with-32-plus-random-chars

# ═══════════════════════════════════════════════════════════════
# EMAIL — Gmail SMTP (required)
# ═══════════════════════════════════════════════════════════════
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=VESTIOR <your-email@gmail.com>

# ═══════════════════════════════════════════════════════════════
# UPSTASH QSTASH (required)
# ═══════════════════════════════════════════════════════════════
QSTASH_URL=https://qstash-us-east-1.upstash.io
QSTASH_TOKEN=eyJVc2VySUQiOiJ...
QSTASH_CURRENT_SIGNING_KEY=sig_xxxx
QSTASH_NEXT_SIGNING_KEY=sig_yyyy

# ═══════════════════════════════════════════════════════════════
# STRIPE (required for card payments)
# ═══════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ═══════════════════════════════════════════════════════════════
# ADMIN
# ═══════════════════════════════════════════════════════════════
ADMIN_EMAIL=your-admin-email@example.com

# ═══════════════════════════════════════════════════════════════
# GOOGLE ANALYTICS (optional)
# ═══════════════════════════════════════════════════════════════
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **Never commit `.env.local`.** It's already in `.gitignore`.

---

### 3. Supabase Setup

#### 3a. Create Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `vestior` (or anything)
3. Save your DB password
4. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3b. Run Migrations

Open **SQL Editor** in Supabase and run these migrations in order (all files in `supabase/migrations/`):

| # | File | Purpose |
|---|------|---------|
| 1 | `20261003_fix_rls_policies.sql` | RLS on all tables + `is_admin()` helper |
| 2 | `20261004_add_indexes.sql` | Performance indexes on hot paths |
| 3 | `20261004_dashboard_stats.sql` | `get_dashboard_stats()` RPC |
| 4 | `20261005_add_payment_fields.sql` | Payment columns on orders |
| 5 | `20261011_add_product_reviews.sql` | Reviews table + RPC + RLS |
| 6 | `20261012_add_wishlists.sql` | Wishlist table + RLS |
| 7 | `20261013_add_coupons.sql` | Coupons + redemptions + RPCs |

Copy each file's contents and run in SQL Editor. All are **idempotent** (safe to re-run).

#### 3c. Create Storage Bucket

1. Go to **Storage** → **New Bucket**
2. Name: `product-images`
3. **Public bucket**: ✅ enabled
4. Save

#### 3d. Enable Authentication Providers

**Email/Password:**
1. **Authentication → Providers → Email** → Enable
2. Keep "Confirm email" ON

**Google OAuth (optional but recommended):**
1. [Google Cloud Console](https://console.cloud.google.com) → Create OAuth 2.0 credentials
2. Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`
3. Copy Client ID + Secret into Supabase **Authentication → Providers → Google**

#### 3e. URL Configuration

**Authentication → URL Configuration:**
- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.vercel.app/auth/callback`

#### 3f. Enable Realtime

**Database → Replication → `supabase_realtime` publication:**

Enable for these tables:
- `orders` (for customer real-time tracking + admin notifications)
- `product_reviews` (for live review updates — optional)

Or run in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
```

---

### 4. MongoDB Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free M0 cluster
2. **Database Access** → Create user (save password)
3. **Network Access** → Allow `0.0.0.0/0` (for Vercel) — or use Vercel IPs
4. **Connect → Drivers** → copy connection string
5. Replace `<username>` and `<password>` in `.env.local`

**Collections are auto-created** on first write:

| Collection | Purpose |
|-----------|---------|
| `events` | User behavior tracking |
| `email_logs` | Delivery history |
| `payment_transactions` | Stripe/COD records |
| `audit_logs` | Admin actions |
| `analytics_daily` | Pre-aggregated stats (cron) |
| `cart_snapshots` | Abandoned cart recovery |

**Recommended indexes** (auto-created by code where possible):

```javascript
// events
db.events.createIndex({ timestamp: -1 }, { expireAfterSeconds: 7776000 }) // 90d TTL
db.events.createIndex({ session_id: 1 })
db.events.createIndex({ user_id: 1, timestamp: -1 })
db.events.createIndex({ event_type: 1, timestamp: -1 })

// email_logs
db.email_logs.createIndex({ email: 1, created_at: -1 })
db.email_logs.createIndex({ status: 1, created_at: -1 })

// payment_transactions
db.payment_transactions.createIndex({ provider_txn_id: 1 }, { unique: true })
db.payment_transactions.createIndex({ order_id: 1 })

// audit_logs
db.audit_logs.createIndex({ timestamp: -1 })
db.audit_logs.createIndex({ target_id: 1 })

// cart_snapshots
db.cart_snapshots.createIndex({ user_id: 1 }, { unique: true })
db.cart_snapshots.createIndex({ recovery_token: 1 }, { unique: true })
db.cart_snapshots.createIndex({ updated_at: -1 })
```

---

### 5. Upstash Setup (Redis + QStash)

#### 5a. Redis

1. [console.upstash.com](https://console.upstash.com) → **Create Database**
2. Region: closest to you
3. Type: **Regional**
4. Copy from dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

#### 5b. QStash

Same account → **QStash** tab:

1. Copy **QStash Token** → `QSTASH_TOKEN`
2. Copy **Current Signing Key** → `QSTASH_CURRENT_SIGNING_KEY`
3. Copy **Next Signing Key** → `QSTASH_NEXT_SIGNING_KEY`
4. Set `QSTASH_URL` based on your region:
   - `us-east-1` → `https://qstash-us-east-1.upstash.io`
   - `eu-central-1` → `https://qstash-eu-central-1.upstash.io`

---

### 6. Stripe Setup

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Toggle **Test Mode** ON
2. **Developers → API Keys**:
   - Publishable → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret → `STRIPE_SECRET_KEY`
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

**Local webhook testing (optional):**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### 7. Email Setup (Gmail SMTP)

1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. App name: `VESTIOR`
4. Copy the 16-character password
5. Set in `.env.local`:
   - `GMAIL_USER=your-email@gmail.com`
   - `GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx`
   - `EMAIL_FROM=VESTIOR <your-email@gmail.com>`

**Free tier:** 500 emails/day. Perfect for small stores.

---

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Verify everything works:**

```bash
npm run typecheck   # TypeScript clean
npm run lint        # ESLint clean
npm run test        # 53 unit tests pass
npm run build       # Production build succeeds
```

---

## 👤 How to Create First Admin

There's **no self-serve admin signup** for security. To promote a user:

### Method 1 — Supabase Dashboard (Recommended)

1. **Sign up** normally via `/auth/signup`
2. Verify your email
3. Open **Supabase → Table Editor → `profiles`**
4. Find your row → change `role` from `customer` to `admin`
5. Save

### Method 2 — SQL Editor

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**Verify access control:**

| User type | `/admin` access |
|-----------|-----------------|
| Logged out | → `/auth/login` |
| Customer | → `/` |
| Admin | ✅ Full access |

---

## 🌱 Seed Data

Populate with 5 demo products via SQL Editor:

```sql
INSERT INTO public.products
  (name, description, price, compare_at_price, category, category_main, stock, is_active, is_new_arrival, is_featured, images)
VALUES
  (
    'Charcoal Overcoat',
    'Tailored wool-blend overcoat with notch lapels — a timeless winter essential.',
    18999, 23999, 'Overcoats', 'Coats', 15, true, true, true,
    '["https://placehold.co/800x800/1a1a1a/3B82F6?text=Overcoat"]'
  ),
  (
    'Classic Navy Suit',
    'Two-piece slim-fit suit in Italian wool. Perfect for the modern professional.',
    24999, 29999, 'Two Piece', '2 Piece', 10, true, false, true,
    '["https://placehold.co/800x800/1a1a1a/3B82F6?text=Navy+Suit"]'
  ),
  (
    'Khaki Twill Shirt',
    'Premium cotton twill shirt with mother-of-pearl buttons.',
    3999, 4999, 'Casual', 'Shirts', 50, true, true, false,
    '["https://placehold.co/800x800/1a1a1a/3B82F6?text=Khaki+Shirt"]'
  ),
  (
    'Olive Green Chinos',
    'Slim-fit stretch chinos in a rich olive tone.',
    4599, 5999, 'Slim Fit', 'Pants', 40, true, false, true,
    '["https://placehold.co/800x800/1a1a1a/3B82F6?text=Chinos"]'
  ),
  (
    'Heritage Gurkha Pants',
    'High-waisted Gurkha trousers with side adjusters — a wardrobe statement.',
    7999, 9999, 'Gurkha', 'Gurkha', 25, true, true, true,
    '["https://placehold.co/800x800/1a1a1a/3B82F6?text=Gurkha"]'
  );
```

Then upload real images via the admin panel.

**Sample coupon:**
```sql
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount, per_user_limit, is_active)
VALUES ('WELCOME10', '10% off for new customers', 'percent', 10, 0, 1, true);
```

---

## 📁 Project Structure

```
vestior-store/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions (4 jobs)
├── e2e/                               # Playwright E2E tests
│   ├── auth-guards.spec.ts
│   ├── cart-flow.spec.ts
│   ├── navigation.spec.ts
│   └── public-pages.spec.ts
├── public/
│   ├── suits/                         # Hero images
│   ├── images/categories/             # Category tiles
│   ├── og-image.png
│   ├── manifest.json
│   └── ...
├── src/
│   ├── actions/                       # Server Actions
│   │   ├── confirmPayment.ts
│   │   ├── coupons.ts
│   │   ├── placeOrder.ts
│   │   ├── refundPayment.ts
│   │   ├── resendOrderEmail.ts
│   │   ├── reviews.ts
│   │   ├── updateOrderStatus.ts
│   │   └── wishlist.ts
│   ├── app/
│   │   ├── (main)/                    # Customer-facing
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── category/[slug]/
│   │   │   ├── checkout/
│   │   │   ├── featured/
│   │   │   ├── new-arrivals/
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── CustomerOrderDetail.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── products/
│   │   │   ├── profile/
│   │   │   ├── wishlist/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin/                     # Admin panel
│   │   │   ├── abandoned-carts/
│   │   │   ├── analytics/
│   │   │   ├── audit/
│   │   │   ├── coupons/
│   │   │   ├── emails/
│   │   │   ├── exports/
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── payments/
│   │   │   ├── products/
│   │   │   ├── reviews/
│   │   │   ├── users/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── export/route.ts
│   │   │   │   └── payment-detail/route.ts
│   │   │   ├── auth/welcome/route.ts
│   │   │   ├── cart/
│   │   │   │   ├── recover/route.ts
│   │   │   │   └── sync/route.ts
│   │   │   ├── cron/
│   │   │   │   ├── abandoned-carts/route.ts
│   │   │   │   ├── daily/route.ts
│   │   │   │   └── low-stock-alert/route.ts
│   │   │   ├── jobs/send-email/route.ts
│   │   │   ├── recommendations/recently-viewed/route.ts
│   │   │   ├── track/route.ts
│   │   │   ├── webhooks/stripe/route.ts
│   │   │   └── wishlist/ids/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── admin/                     # 20+ admin components
│   │   ├── invoice/
│   │   │   └── InvoiceView.tsx
│   │   ├── recommendations/
│   │   │   ├── RecentlyViewed.tsx
│   │   │   └── RecommendedRow.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   └── StarRating.tsx
│   │   ├── ActiveFilters.tsx
│   │   ├── CartTracker.tsx
│   │   ├── CategorySection.tsx
│   │   ├── Footer.tsx
│   │   ├── GoogleAnalytics.tsx
│   │   ├── Hero.tsx
│   │   ├── HomeProductSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrdersRealtime.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductSort.tsx
│   │   ├── StructuredData.tsx
│   │   ├── TrackingProvider.tsx
│   │   └── WishlistProvider.tsx
│   ├── lib/
│   │   ├── carts/
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── coupons/
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── email/
│   │   │   ├── mailer.ts
│   │   │   ├── queue.ts
│   │   │   ├── queries.ts
│   │   │   ├── render.tsx
│   │   │   ├── types.ts
│   │   │   └── templates/             # 9 email templates
│   │   ├── exports/
│   │   │   ├── csv.ts
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── invoice/
│   │   │   └── generate.ts
│   │   ├── orders/
│   │   │   └── queries.ts
│   │   ├── payments/
│   │   │   ├── index.ts               # Factory
│   │   │   ├── queries.ts
│   │   │   ├── types.ts
│   │   │   └── providers/
│   │   │       ├── cod.ts
│   │   │       └── stripe.ts
│   │   ├── products/
│   │   │   └── filters.ts
│   │   ├── qstash/
│   │   │   └── verify.ts
│   │   ├── recommendations/
│   │   │   └── queries.ts
│   │   ├── reviews/
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── supabase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── public.ts
│   │   │   └── server.ts
│   │   ├── tracking/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   ├── server-user.ts
│   │   │   └── types.ts
│   │   ├── wishlist/
│   │   │   └── queries.ts
│   │   ├── audit.ts
│   │   ├── env.ts
│   │   ├── idempotency.ts
│   │   ├── mongodb.ts
│   │   ├── ratelimit.ts
│   │   ├── redis.ts
│   │   └── utils.ts
│   ├── providers/
│   │   └── AuthProvider.tsx
│   └── proxy.ts                       # Next.js 16 middleware
├── supabase/
│   └── migrations/                    # 7 SQL migrations
├── test/
│   ├── components/
│   │   ├── PaymentOption.test.tsx
│   │   └── ProductCard.test.tsx
│   ├── mocks/
│   │   └── server-only.ts
│   ├── unit/
│   │   ├── csv.test.ts
│   │   ├── idempotency.test.ts
│   │   ├── payments-cod.test.ts
│   │   ├── ratelimit.test.ts
│   │   └── utils.test.ts
│   └── setup.ts
├── .env.example
├── Dockerfile.vercel                  # Vercel-native container
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vercel.json
├── vitest.config.mts
└── README.md
```

---

## 🔐 Security Checklist

<details open>
<summary><strong>Authentication & Authorization</strong></summary>

- [x] **RLS enabled** on all Supabase tables
- [x] **`is_admin()` helper** — RLS-safe role check
- [x] **Every privileged Server Action** re-verifies admin role against `profiles` table
- [x] **Never trust client state** for authorization
- [x] **PKCE OAuth** flow with cookie-preserving callback
- [x] **Open redirect protection** on `next` query param
- [x] **Email verification** required before access

</details>

<details open>
<summary><strong>Input Validation</strong></summary>

- [x] **Zod schemas** on every Server Action and API route
- [x] **Atomic PostgreSQL RPCs** for multi-step operations
- [x] **Client-supplied prices** rejected — always fetched from DB
- [x] **Quantity clamps** (1–50 per item, max 30 distinct items)
- [x] **Address field validation** (required fields non-empty)

</details>

<details open>
<summary><strong>Data Integrity</strong></summary>

- [x] **`FOR UPDATE` locks** prevent oversell on concurrent orders
- [x] **Idempotency keys** in Redis for every webhook (24h TTL)
- [x] **Coupon redemption locks** prevent race conditions
- [x] **One review per user per product** (UNIQUE constraint)
- [x] **Stock deduction inside transaction** — no partial state

</details>

<details open>
<summary><strong>Secrets & Isolation</strong></summary>

- [x] **Service-role key** never reaches browser (`import 'server-only'`)
- [x] **Environment variables** validated at startup (fail fast)
- [x] **CSP headers** on all responses
- [x] **CSRF protection** via Server Actions (built-in)
- [x] **Webhook signature verification** (Stripe + QStash)

</details>

<details open>
<summary><strong>Rate Limiting & Abuse Prevention</summary>

- [x] **Tiered limiters** (auth / admin / orders / general / track)
- [x] **Fail-open behavior** — site stays up if Redis is down
- [x] **IP hashing** (SHA-256 + salt) for tracking
- [x] **Cron authentication** via `CRON_SECRET`
- [x] **Per-user coupon limits** (default: 1)

</details>

---

## 🔌 Server Actions API

All privileged operations go through Next.js Server Actions with strict authorization and Zod validation.

| Action | File | Auth | Purpose |
|--------|------|------|---------|
| `placeOrder(items, address, method, couponCode?)` | `actions/placeOrder.ts` | User | Atomic order + stock deduction + coupon redemption |
| `confirmPayment(orderId, intentId)` | `actions/confirmPayment.ts` | User | Stripe payment verification (fallback for webhooks) |
| `updateOrderStatus(orderId, status)` | `actions/updateOrderStatus.ts` | Admin | Whitelisted status transitions |
| `refundPayment(orderId)` | `actions/refundPayment.ts` | Admin | Stripe refund + order update |
| `resendOrderEmail(orderId, template)` | `actions/resendOrderEmail.ts` | Admin | Manual email resend |
| `submitReview(input)` | `actions/reviews.ts` | User | Create or update product review |
| `updateReviewStatus(id, status)` | `actions/reviews.ts` | Admin | Approve/reject review |
| `deleteReview(id)` | `actions/reviews.ts` | Admin | Delete review |
| `validateCoupon(code, subtotal)` | `actions/coupons.ts` | User | Check coupon validity |
| `createCoupon(input)` | `actions/coupons.ts` | Admin | Create coupon |
| `updateCoupon(id, input)` | `actions/coupons.ts` | Admin | Update coupon |
| `deleteCoupon(id)` | `actions/coupons.ts` | Admin | Delete coupon |
| `toggleCouponActive(id, bool)` | `actions/coupons.ts` | Admin | Enable/disable |
| `toggleWishlist(productId)` | `actions/wishlist.ts` | User | Add/remove from wishlist |
| `mergeWishlist(productIds[])` | `actions/wishlist.ts` | User | Merge guest wishlist on login |

### Guarantees

- **Re-authenticate** on every call — Server Actions are public POST endpoints
- **Authorize against DB state** — role checks against `profiles`, not JWT claims
- **Zod validation** on every argument
- **Fail closed** — thrown errors surface as toasts on the client

---

## 📊 Database Schema

### Supabase Tables

<details open>
<summary><strong>products</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `name` | `text` | |
| `description` | `text` | |
| `price` | `numeric` | PKR |
| `compare_at_price` | `numeric` | For discount display |
| `category` | `text` | Sub-category |
| `category_main` | `text` | Main category |
| `stock` | `int4` | Decremented atomically |
| `is_active` | `bool` | Storefront visibility |
| `is_new_arrival` | `bool` | Badge |
| `is_featured` | `bool` | Homepage highlight |
| `images` | `text` | JSON array of URLs |
| `created_at` / `updated_at` | `timestamptz` | |

</details>

<details open>
<summary><strong>orders</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users` |
| `user_email` | `text` | |
| `items` | `jsonb` | Snapshot at order time |
| `address` | `jsonb` | Shipping address |
| `subtotal` | `int4` | |
| `shipping` | `int4` | |
| `discount_amount` | `numeric` | Coupon discount |
| `coupon_code` | `text` | Applied code |
| `total` | `int4` | |
| `status` | `text` | `pending` / `processing` / `shipped` / `delivered` / `cancelled` |
| `payment_status` | `text` | `pending` / `completed` / `failed` / `refunded` |
| `payment_method` | `text` | `cod` / `stripe` |
| `payment_provider` | `text` | `cod` / `stripe` / `paypal` |
| `payment_intent_id` | `text` | Stripe PI ID |
| `payment_metadata` | `jsonb` | Full Stripe payload |
| `paid_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

</details>

<details>
<summary><strong>order_items</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `order_id` | `uuid` | FK → `orders` (cascade) |
| `product_id` | `uuid` | FK → `products` |
| `product_name` | `text` | Denormalized snapshot |
| `quantity` | `int4` | |
| `price` | `numeric` | |
| `created_at` | `timestamptz` | |

</details>

<details>
<summary><strong>profiles</strong></summary>

Extends `auth.users` — matches `id`, adds:

| Column | Type |
|--------|------|
| `id` | `uuid` (PK, FK → `auth.users`) |
| `full_name` | `text` |
| `email` | `text` (unique) |
| `phone` | `text` |
| `role` | `text` (`customer` / `admin`) |
| `address_line1` | `text` |
| `address_line2` | `text` |
| `city` | `text` |
| `state` | `text` |
| `pincode` | `text` |
| `created_at` / `updated_at` | `timestamptz` |

</details>

<details>
<summary><strong>product_reviews</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `product_id` | `uuid` | FK |
| `user_id` | `uuid` | FK |
| `user_name` | `text` | Snapshot |
| `user_email` | `text` | Snapshot |
| `rating` | `int4` | CHECK 1–5 |
| `title` | `text` | Optional |
| `comment` | `text` | |
| `status` | `text` | `pending` / `approved` / `rejected` |
| `is_verified_purchase` | `bool` | |
| `helpful_count` | `int4` | |
| `created_at` / `updated_at` | `timestamptz` | |

**UNIQUE** `(product_id, user_id)` — one review per user per product.

</details>

<details>
<summary><strong>wishlists</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK |
| `product_id` | `uuid` | FK |
| `created_at` | `timestamptz` | |

**UNIQUE** `(user_id, product_id)`.

</details>

<details>
<summary><strong>coupons</strong></summary>

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `code` | `text` | UNIQUE, uppercase |
| `description` | `text` | |
| `discount_type` | `text` | `percent` / `fixed` |
| `discount_value` | `numeric` | |
| `min_order_amount` | `numeric` | |
| `max_discount_amount` | `numeric` | For percent cap |
| `usage_limit` | `int4` | NULL = unlimited |
| `per_user_limit` | `int4` | Default 1 |
| `times_used` | `int4` | |
| `valid_from` | `timestamptz` | |
| `valid_until` | `timestamptz` | NULL = no expiry |
| `is_active` | `bool` | |
| `created_at` / `updated_at` | `timestamptz` | |

</details>

<details>
<summary><strong>coupon_redemptions</strong></summary>

| Column | Type |
|--------|------|
| `id` | `uuid` (PK) |
| `coupon_id` | `uuid` (FK) |
| `user_id` | `uuid` (FK) |
| `order_id` | `uuid` (FK) |
| `discount_amount` | `numeric` |
| `created_at` | `timestamptz` |

**UNIQUE** `(coupon_id, order_id)`.

</details>

### Supabase RPCs

| Function | Purpose |
|----------|---------|
| `is_admin()` | RLS-safe role check |
| `place_order_atomic(items, address, ...)` | Order + stock deduction with `FOR UPDATE` |
| `get_dashboard_stats()` | Single-query admin aggregation |
| `get_product_review_stats(product_id)` | Avg rating + breakdown |
| `get_products_review_stats(ids[])` | Batch ratings |
| `validate_coupon(code, user_id, subtotal)` | Coupon validity check |
| `redeem_coupon_atomic(code, user_id, order_id, subtotal)` | Atomic redemption |

### MongoDB Collections

| Collection | Purpose | TTL |
|-----------|---------|-----|
| `events` | User behavior tracking | 90 days |
| `email_logs` | Email delivery history | none |
| `payment_transactions` | Payment audit trail | none |
| `audit_logs` | Admin actions | none |
| `analytics_daily` | Pre-aggregated metrics | none |
| `cart_snapshots` | Abandoned cart recovery | none |

---

## 📡 Performance & SEO

### Performance Wins

| Optimization | Impact |
|--------------|--------|
| Next.js `Image` with AVIF/WebP | Images 30–50% smaller |
| ISR on public pages (5 min) | TTFB 750ms → ~100ms |
| `priority` on hero images | LCP preload |
| Deferred GA4 (`lazyOnload`) | TBT −100ms |
| `optimizePackageImports` | Lucide + Framer Motion tree-shaken |
| Removed `console.*` in prod | −15KB |
| Long-cache headers | Repeat visits instant |
| Hero animation removed from LCP elements | Mobile LCP −4s |
| `Promise.all` parallel fetches | Dashboard 4x faster |
| Dynamic import Recharts | Admin-only chunk |

### SEO

- ✅ **Dynamic `robots.txt`** — Blocks admin/checkout from crawlers
- ✅ **Auto-generated `sitemap.xml`** — Products + categories + static pages (hourly revalidation)
- ✅ **JSON-LD schemas** — Organization, WebSite, Product, Breadcrumb, Review
- ✅ **Per-page dynamic metadata** — Product names in OG + Twitter cards
- ✅ **Canonical URLs** on every dynamic route
- ✅ **Rich Results eligible** — Google stars in search from reviews
- ✅ **Semantic HTML** — `<main>`, `<nav>`, `<article>`, proper heading hierarchy

---

## 🧪 Testing

### Unit Tests (Vitest + RTL)

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**53 tests** covering:

| File | Tests | Coverage |
|------|-------|----------|
| `csv.test.ts` | 12 | CSV builder (escaping, BOM, filenames) |
| `utils.test.ts` | 11 | `parseProductImages` (all formats) |
| `ratelimit.test.ts` | 10 | Limiter tiers + client key |
| `payments-cod.test.ts` | 6 | COD provider contract |
| `ProductCard.test.tsx` | 6 | Cart interactions, badges |
| `idempotency.test.ts` | 5 | Redis lock + result cache |
| `PaymentOption.test.tsx` | 3 | Selection, disabled state |

**Coverage thresholds** (enforced in CI):
- Lines: 55%
- Functions: 55%
- Branches: 50%
- Statements: 55%

### E2E Tests (Playwright)

```bash
npm run test:e2e          # Headless
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:report   # View last HTML report
```

**21 tests** covering:

| Suite | Tests | Focus |
|-------|-------|-------|
| `public-pages.spec.ts` | 9 | Homepage, products, category, 404, robots, sitemap |
| `auth-guards.spec.ts` | 6 | Redirects + login/signup page rendering |
| `cart-flow.spec.ts` | 4 | Add, view, update qty, remove |
| `navigation.spec.ts` | 2 | Navbar links, search modal |

**Config:**
- Chromium only
- Sequential (`workers: 1`) — shared auth state
- Retries: 3 in CI, 1 local
- 90s timeout (CI cold starts)

---

## 🔄 CI/CD

**GitHub Actions** runs on every push and PR to `main`.

### Workflow Jobs (parallel where possible)

```mermaid
flowchart LR
    A[push/PR] --> B[Lint & Typecheck]
    A --> C[Unit Tests]
    B --> D[E2E Tests]
    C --> D
    B --> E[Security Audit]
```

| Job | Runs | Details |
|-----|------|---------|
| **Lint & Typecheck** | ESLint + `tsc --noEmit` | ~40s |
| **Unit Tests** | `vitest run --coverage` | ~60s, coverage uploaded |
| **E2E Tests** | Playwright + Chromium | ~2 min, reports uploaded on failure |
| **Security Audit** | `npm audit --audit-level=high` | ~10s (fail-soft) |

### Required GitHub Secrets

Set these in **Settings → Secrets and variables → Actions**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
MONGODB_URI
IP_HASH_SALT
CRON_SECRET
ADMIN_EMAIL
GMAIL_USER
GMAIL_APP_PASSWORD
EMAIL_FROM
QSTASH_URL
QSTASH_TOKEN
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

> **Safe?** Yes. GitHub secrets are encrypted at rest (AES-256), masked in logs, and never exposed to fork PRs.

---

## 🐛 Troubleshooting

<details>
<summary><strong>Build fails: Missing environment variables</strong></summary>

**Cause:** One or more required env vars not set in `.env.local`.

**Fix:** The error message lists exactly which are missing. Compare against `.env.example`.

</details>

<details>
<summary><strong>Google OAuth redirects to login or fails</strong></summary>

**Cause:** Redirect URL not whitelisted in Supabase.

**Fix:** Supabase → Authentication → URL Configuration → add both:
- `http://localhost:3000/auth/callback`
- `https://your-domain.vercel.app/auth/callback`

</details>

<details>
<summary><strong>Images not loading (broken image icons)</strong></summary>

**Cause:** Storage bucket not public, or remote pattern missing in `next.config.ts`.

**Fix:**
- Supabase → Storage → `product-images` → make **Public**
- `next.config.ts` → add hostname to `images.remotePatterns`

</details>

<details>
<summary><strong>429 Too Many Requests on normal browsing</strong></summary>

**Cause:** Rate limit triggered by aggressive testing.

**Fix:**
- Wait 60 seconds
- Verify Upstash env vars
- Temporarily bump limits in `src/lib/ratelimit.ts`

</details>

<details>
<summary><strong>Real-time updates not working</strong></summary>

**Cause:** Realtime not enabled on `orders` table.

**Fix:** Supabase → Database → Replication → enable `orders`:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
```

</details>

<details>
<summary><strong>Stripe webhook 401 Invalid signature</strong></summary>

**Cause:** `STRIPE_WEBHOOK_SECRET` mismatch.

**Fix:**
- Stripe Dashboard → Developers → Webhooks → copy signing secret
- For local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

</details>

<details>
<summary><strong>QStash: "endpoint resolves to a loopback address"</strong></summary>

**Cause:** QStash can't reach `localhost`.

**Fix:** The email queue auto-detects dev mode and sends directly via Gmail SMTP. No tunnel needed.

</details>

<details>
<summary><strong>Emails not arriving</strong></summary>

**Checklist:**
1. Gmail app password set correctly (spaces included)?
2. 2-Step Verification enabled on Gmail?
3. Check MongoDB `email_logs` — `status: sent` or `failed`?
4. Check spam folder
5. Check terminal for `[email] sent` or `[email] failed` logs

</details>

<details>
<summary><strong>Session lost after refresh</strong></summary>

**Cause:** Middleware not refreshing cookies.

**Fix:** Ensure `src/proxy.ts` uses cookie-preserving `redirectWithCookies` helper (see source).

</details>

<details>
<summary><strong>"Invalid Refresh Token" spam</strong></summary>

**Cause:** Multiple Supabase clients or missing middleware.

**Fix:**
- Verify `src/lib/supabase/client.ts` exports a **singleton**
- Verify `src/proxy.ts` runs on all pages

</details>

<details>
<summary><strong>Build fails: "Cookies can only be modified in a Server Action"</strong></summary>

**Cause:** Server Component writing cookies.

**Fix:** `src/lib/supabase/server.ts` should wrap `cookieStore.set` in `try/catch` (silently ignore in RSC).

</details>

<details>
<summary><strong>"middleware is deprecated" warning on Next.js 16</strong></summary>

**Cause:** Next.js 16 renamed `middleware.ts` → `proxy.ts`.

**Fix:** Already handled — file is `src/proxy.ts` and exports `proxy`.

</details>

<details>
<summary><strong>E2E tests fail with ECONNREFUSED</strong></summary>

**Cause:** Web server not started.

**Fix:** `playwright.config.ts` has `webServer` configured. Ensure `npm run start` works locally:

```bash
npm run build
npm run start
```

</details>

<details>
<summary><strong>Vercel cron limit reached</strong></summary>

**Cause:** Hobby plan allows 1 cron per project.

**Fix:**
- **Option A:** Upgrade to Pro
- **Option B:** Use external cron (cron-job.org) to hit `/api/cron/daily`
- **Option C:** Combine into one daily cron (already done via `/api/cron/daily`)

</details>

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 100+ | ✅ Full |
| Firefox | 100+ | ✅ Full |
| Safari | 15+ | ✅ Full |
| Edge | 100+ | ✅ Full |
| Safari iOS | 15+ | ✅ Full |
| Chrome Android | 100+ | ✅ Full |
| Samsung Internet | 18+ | ✅ Full |

**Not supported:** Internet Explorer (any version).

**Modern features used:** AVIF/WebP, CSS `aspect-ratio`, `:has()`, `view-transition` (progressive), Web Audio API, `navigator.sendBeacon`.

---

## ♿ Accessibility

**Lighthouse Accessibility: 100/100** (both desktop and mobile)

### Implemented

- ✅ Semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ ARIA labels on every icon-only button
- ✅ `aria-pressed` on toggles (wishlist, filter chips)
- ✅ `aria-live` regions for toasts
- ✅ Keyboard navigation (all interactive elements)
- ✅ Focus-visible outlines on every focusable element
- ✅ **Skip to main content** link
- ✅ Color contrast meets WCAG AA everywhere
- ✅ Alt text on all meaningful images
- ✅ `role="status"` on loading states
- ✅ No `user-scalable=no` (zoom allowed)
- ✅ Form inputs have visible labels
- ✅ Touch targets ≥ 44px

---

## ❓ FAQ

**Q: Is this multi-vendor?**
A: No. VESTIOR is a **single-vendor** store — one admin manages all products, orders, and users.

**Q: What payment methods are supported?**
A: **Cash on Delivery (COD)** and **Stripe** (test mode ready, live-mode compatible). The provider abstraction makes adding PayPal, Razorpay, etc. a single-file change.

**Q: Can customers see their order history?**
A: Yes, at `/orders` with real-time status updates, plus a printable invoice.

**Q: How do I add a new category?**
A: Categories are derived from `category_main`. Just type a new value when creating/editing a product. Update `src/components/CategorySection.tsx` to add the homepage tile.

**Q: Can I use this for other products (not clothing)?**
A: Yes. The core logic is generic. Update category names, imagery, branding.

**Q: How do I reset a customer's password?**
A: Supabase → Auth → Users → select user → "Send password recovery".

**Q: Where are product images stored?**
A: Supabase Storage → `product-images` bucket (public).

**Q: How do I disable a product without deleting it?**
A: Set `is_active = false` in the admin panel. Hidden from storefront, preserved in DB.

**Q: Is there a public API?**
A: Not currently. Server Actions are internal. For external use, build routes under `src/app/api/`.

**Q: How does the abandoned cart recovery work?**
A: Client silently syncs carts every 2s (debounced). A cron job runs hourly, finds carts >2h old, sends reminders with 5% off. Max 3 reminders per cart, 7 days apart.

**Q: Are product reviews moderated?**
A: Yes. All reviews start as `pending`. Admins approve/reject via `/admin/reviews`.

**Q: What happens if Redis is down?**
A: Site keeps working (fail-open rate limiting). Idempotency falls back to permissive.

**Q: What happens if MongoDB is down?**
A: Analytics + email logs + abandoned carts temporarily fail. **Core commerce unaffected** (Supabase is source of truth).

**Q: Can I deploy to a VPS instead of Vercel?**
A: Yes. The `Dockerfile.vercel` is compatible with any Docker host. See `next.config.ts` for `output: 'standalone'`.

---

## 🗺️ Roadmap

### ✅ Completed (v3.0)

- [x] Core e-commerce flow (browse → cart → checkout → orders)
- [x] Admin panel with full CRUD
- [x] Real-time order status updates
- [x] Email verification + Google OAuth
- [x] Rate limiting & RLS hardening
- [x] Atomic stock deduction
- [x] Production-grade SEO (robots, sitemap, JSON-LD)
- [x] **Stripe payments + webhooks**
- [x] **Email system (Gmail SMTP + QStash)**
- [x] **Custom tracking engine**
- [x] **Admin payments dashboard**
- [x] **Order detail pages (customer + admin)**
- [x] **Audit logs**
- [x] **Export center (CSV)**
- [x] **Product reviews + moderation**
- [x] **Backend-synced wishlist**
- [x] **Coupon system with atomic redemption**
- [x] **Printable invoices**
- [x] **Abandoned cart recovery**
- [x] **Product recommendations**
- [x] **Admin real-time notifications**
- [x] **Advanced filters + sorting**
- [x] **100/100 Lighthouse accessibility**
- [x] **53 unit tests + 21 E2E tests**
- [x] **GitHub Actions CI (4 jobs)**
- [x] **Docker support**

### 🚧 Planned (v3.1+)

- [ ] Multi-currency support
- [ ] PayPal integration (Pakistan-blocked for now)
- [ ] Order tracking integration (courier APIs)
- [ ] Multi-language (i18n — English/Urdu)
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Advanced analytics dashboard (cohorts, retention)
- [ ] Sentry error tracking
- [ ] Automated Codecov integration
- [ ] PWA enhancements (offline mode)

---

## 📅 Changelog

### v3.0.0 — Enterprise Feature Set (Current)

**🎉 Major Features**
- Added Stripe payment integration with webhook idempotency
- Added Gmail SMTP + QStash email queue (9 transactional templates)
- Added self-hosted event tracking engine (MongoDB)
- Added custom analytics dashboard (funnel, live users, top products)
- Added admin payments dashboard with refunds
- Added customer + admin order detail pages with real-time tracking
- Added audit logs (every privileged action tracked)
- Added export center (CSV for 5 entity types)
- Added product reviews with moderation + Schema.org markup
- Added backend-synced wishlist with guest merge
- Added coupon system with atomic redemption
- Added printable invoices (print-optimized HTML)
- Added abandoned cart recovery (auto-email + coupons)
- Added product recommendations (related, cross-sell, trending, recently-viewed)
- Added admin real-time notifications (sound + toast + browser)
- Added advanced product filters + sorting with URL sync

**⚡ Performance**
- Lighthouse Desktop: 84 → **98** (Performance)
- Lighthouse Desktop: 85 → **100** (Accessibility)
- Lighthouse Mobile: 59 → **84** (Performance)
- Lighthouse Mobile: 85 → **100** (Accessibility)
- Mobile LCP: 12.4s → **3.5s**
- Desktop LCP: 2.2s → **0.5s**
- ISR on all public pages (5 min revalidation)
- AVIF/WebP image formats via `next/image`
- Deferred GA4 (`lazyOnload`)
- Removed Hero animation from LCP elements
- Long-cache headers for static assets
- Tree-shaken icon library + Framer Motion

**🧪 Testing & Quality**
- 53 unit tests (Vitest + React Testing Library)
- 21 E2E tests (Playwright + Chromium)
- GitHub Actions CI (Lint, Unit, E2E, Security — 4 jobs)
- Coverage thresholds enforced in CI
- Playwright reports uploaded on failure
- Vitest coverage uploaded as artifact

**🛡️ Security**
- Idempotency keys for every webhook
- `FOR UPDATE` locks on order + coupon operations
- IP hashing (SHA-256 + salt) for tracking
- Cron authentication via `CRON_SECRET`
- Webhook signature verification (Stripe + QStash)
- Zod validation on every Server Action
- `import 'server-only'` guards on sensitive modules
- Audit logging on every admin action

**🏗️ Architecture**
- Provider abstraction for payments (COD/Stripe)
- Provider abstraction for email (Gmail SMTP/Resend)
- Dual-database design (Supabase transactional + MongoDB analytical)
- QStash queue for background jobs
- Redis for idempotency + rate limiting + cache
- Docker support (Vercel-native container)
- Vercel cron configuration

### v2.0.0 — Production Hardening

- Fixed critical RLS policy holes
- Added server-side authorization to all admin actions
- Replaced client-trusted pricing with server-side DB fetch
- Added rate limiting across all route tiers
- Atomic order placement RPC with `FOR UPDATE` locks
- Dashboard stats aggregated via single RPC
- Dynamic `robots.txt` and `sitemap.xml`
- JSON-LD structured data
- Global error boundary + loading states
- Migrated `middleware.ts` → `proxy.ts`
- 13 database indexes added

### v1.0.0 — Initial Release

- Full e-commerce flow (products → cart → checkout → orders)
- Admin panel with dashboard, products, orders, users
- Email/password + Google OAuth
- Realtime order status updates
- Glass-morphism UI with Framer Motion
- Google Analytics 4 integration
- Responsive design

---

## 🛡️ Security Disclosure

If you discover a security vulnerability, **please do not open a public issue**.

**Contact:** [zainshahzs110@gmail.com](mailto:zainshahzs110@gmail.com)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response:** Acknowledgment within 48 hours. Critical patches within 7 days.

**In scope:**
- Authentication / authorization bypasses
- RLS policy escapes
- Server Action vulnerabilities
- Injection attacks (SQL, XSS, etc.)
- CSRF / SSRF / open redirect
- Sensitive data exposure

**Out of scope:**
- Rate limit bypass via distributed IPs
- DoS via legitimate high traffic
- Social engineering
- Issues already documented in the README

---

## 🚢 Deployment

### Vercel (Recommended)

**1. Push to GitHub:**
```bash
git push origin main
```

**2. Import to Vercel:**
- Go to [vercel.com/new](https://vercel.com/new)
- Select your `vestior-store` repo
- Framework: **Next.js** (auto-detected)

**3. Add environment variables:**

Settings → Environment Variables → add **all** variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          (Production + Preview)
NEXT_PUBLIC_SITE_URL               (your Vercel URL)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
MONGODB_URI
MONGODB_DB_NAME
IP_HASH_SALT
CRON_SECRET
ADMIN_EMAIL
GMAIL_USER
GMAIL_APP_PASSWORD
EMAIL_FROM
QSTASH_URL
QSTASH_TOKEN
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID       (optional)
```

**4. Update Supabase redirect URLs:**

Authentication → URL Configuration → Redirect URLs:
- Add `https://your-domain.vercel.app/auth/callback`

**5. Update Stripe webhook:**

Developers → Webhooks → Add endpoint:
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

**6. Deploy** 🎉

### Post-Deploy Checklist

- [ ] Lighthouse audit on live URL (target: 90+ mobile, 95+ desktop)
- [ ] Test signup + Google OAuth
- [ ] Place a test order (COD + Stripe)
- [ ] Verify stock decremented
- [ ] Test admin access (customer redirected)
- [ ] Verify `/robots.txt` and `/sitemap.xml`
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Test product URL with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Configure GA4 custom events (optional)
- [ ] Verify Vercel cron runs (check logs after first hour)

### Docker (Alternative)

The `Dockerfile.vercel` is Vercel-native but compatible with any Docker host:

```bash
# Local build (requires Docker)
docker build -f Dockerfile.vercel -t vestior .
docker run -p 3000:3000 --env-file .env.local vestior
```

**Set `NEXT_OUTPUT=standalone`** in the build environment to enable standalone output.

### Other Platforms

Works on any Node.js host (Railway, Render, Fly.io, VPS):

1. Set all env vars
2. `npm run build`
3. `NEXT_OUTPUT=standalone node .next/standalone/server.js`
4. Configure cron jobs to hit `/api/cron/daily` hourly
5. Set up a reverse proxy (Nginx/Caddy) for HTTPS

---

## 🤝 Contributing

Contributions welcome! Fork → branch → PR.

```bash
git checkout -b feature/amazing-feature
git commit -m 'feat: add amazing feature'
git push origin feature/amazing-feature
```

**Before submitting:**

- [ ] Follow existing code style (Prettier via Tailwind plugin)
- [ ] Run `npm run build` (must succeed)
- [ ] Run `npm run typecheck` (must be clean)
- [ ] Run `npm run lint` (zero errors)
- [ ] Run `npm run test` (all pass)
- [ ] Add tests for new features
- [ ] Update README if behavior changes

### Commit Convention

- `feat:` new feature
- `fix:` bug fix
- `perf:` performance improvement
- `docs:` documentation
- `refactor:` code refactor
- `test:` tests
- `chore:` tooling

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## 📄 License

**MIT** — see [LICENSE.txt](./LICENSE.txt).

You are free to use, modify, and distribute this project for personal or commercial purposes. Attribution appreciated but not required.

---

## 📞 Contact

**Zain Ali Shah**

- 📧 Email: [zainshahzs110@gmail.com](mailto:zainshahzs110@gmail.com)
- 🐙 GitHub: [@zainshah3464](https://github.com/zainshah3464)
- 🌐 Live: [vestior.vercel.app](https://vestior.vercel.app)
- 💼 Open to: Full-stack engineering roles, contract work, collaborations

---

<div align="center">

### ⭐ If this project helped you, please give it a star — it means a lot!

<br />

**Built with precision. Deployed with confidence.**

<em>Made with ❤️ and modern web technologies</em>

<br />
<br />

[⬆ Back to top](#-vestior)

</div>
```

---