## VESTIOR

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

[![Documentation](https://img.shields.io/badge/docs-12_files_·_8000_lines-blue?style=flat-square)](./docs/)

<br />

**Lighthouse Scores**

| Platform | Performance | Accessibility | Best Practices | SEO |
|:--------:|:-----------:|:-------------:|:--------------:|:---:|
| **Desktop** | **97** | **100** | **100** | **100** |
| **Mobile** | **91** | **100** | **100** | **100** |

**Quality Gates**

[![CI](https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml/badge.svg)](https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml)
[![Unit Tests](https://img.shields.io/badge/unit_tests-53_passing-brightgreen?style=flat-square)](#-testing)
[![E2E Tests](https://img.shields.io/badge/E2E_tests-21_passing-brightgreen?style=flat-square)](#-testing)
[![Coverage](https://img.shields.io/badge/coverage-55%25-yellowgreen?style=flat-square)](#-testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](#-tech-stack)

<br />

**[Live Demo](https://vestior.vercel.app)** · **[Documentation](#-table-of-contents)** · **[Report Bug](https://github.com/zainshah3464/vestior-store/issues)** · **[Request Feature](https://github.com/zainshah3464/vestior-store/issues)**

---

## Table of Contents

<details open>
<summary><strong>Click to expand full navigation</strong></summary>

- [Overview](#-overview)
- [What's New in v3.1](#-whats-new-in-v31)
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
  - [AI Chatbot Architecture](#ai-chatbot-architecture)
  - [Product Analytics Engine](#product-analytics-engine)
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
  - [AI Setup (Groq)](#8-ai-setup-groq)
  - [Run Development Server](#9-run-development-server)
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

## Documentation

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
- **[Developer FAQ](./docs/faq-developer.md)** — Architecture decisions, debugging, extending
- **[Roadmap](./docs/roadmap.md)** — Planned features, guiding principles, what we're not doing

---

## Overview

**VESTIOR** is a **production-grade, single-vendor e-commerce platform** built for premium men's fashion (suits, coats, pants, waistcoats, Gurkha, two-piece and three-piece sets). It goes far beyond a standard storefront — it integrates payment abstraction, self-hosted analytics, queue-based background processing, coupon economics, cart recovery, product recommendations, AI-powered shopping assistance, and full admin tooling into one cohesive system.

The project demonstrates **senior-level engineering decisions**:

- **Separation of concerns** — Supabase owns transactional data; MongoDB owns event/analytics data; Redis owns ephemeral state.
- **Database ownership boundaries** — No overlap. No confusion.
- **Idempotency** — Every webhook, every redemption, every notification delivery is guarded.
- **Atomic operations** — Order placement and coupon redemption are race-condition safe.
- **Graceful degradation** — If Redis, MongoDB, or any queue is down, the site keeps working.
- **Provider abstraction** — Payment providers (Stripe, COD) and email providers (Gmail SMTP, Resend) sit behind interfaces. Swappable without touching business logic.
- **Defense in depth** — Server-side validation, RLS policies, middleware guards, rate limiting, webhook signature verification — layered.
- **AI-powered discovery** — Groq LPU inference with tool-calling for real-time product search and order tracking.
- **Progressive Web App** — Installable, offline-capable, with service worker caching.

---

## What's New in v3.1

This release introduces **AI-powered shopping assistance**, **PWA capabilities**, and **comprehensive auth improvements**:

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI Shopping Assistant
- **Groq LPU inference** — sub-second response times
- **Tool-calling** — searchProducts, getProductById, getCategories, getMyOrders
- **Streaming responses** — word-by-word via SSE
- **Session-scoped history** — cleared when tab closes
- **Rate-limited** — 20 messages/min/IP
- **Prompt injection guard** — system role rejected from client
- **Suggested prompts** — guided first interaction
- **Typing indicator** — visual feedback during streaming

### 📱 Progressive Web App (PWA)
- **Service worker** — cache-first for assets, network-first for pages
- **Offline fallback page** — branded, with reconnect button
- **Install prompt** — 30-day dismissal cooldown
- **App shortcuts** — Products, Orders, New Arrivals
- **Stale-while-revalidate** for images
- **Cache-first** for immutable assets

</td>
<td width="50%" valign="top">

### 🔐 Auth Polish
- **Password reset flow** — forgot password → email → reset form
- **Password strength meter** — Very Weak → Very Strong
- **Real-time validation** — length, case, number requirements
- **Show/hide password** toggle
- **Existing email detection** — prevents silent account creation
- **Clearer login errors** — "Please verify your email first"

### 📊 Admin Dashboard 2.0
- **Command-center dashboard** — cross-page summary stats
- **Action Center** — pending reviews, orders, payments, abandoned carts
- **Recent Activity timeline** — audit log highlights
- **Live users widget** — auto-refreshing every 30s
- **Product Analytics** — views, cart adds, orders, conversion rate
- **New vs Returning** — visitor chart over 30 days
- **Payment method breakdown** — COD vs Stripe revenue

### 📧 Email System Fixes
- **Duplicate email fix** — webhook checks if order already completed
- **Correct payment method** — uses `payment_provider` not legacy `payment_method`
- **Discount/coupon in resend** — passes `discount_amount` and `coupon_code`
- **QStash failure logging** — marks emails as `failed` instead of stuck `queued`

</td>
</tr>
</table>

---

## Lighthouse Scores

Audited with **Google Lighthouse 13.5.0** on a **production build** with **mobile emulation** and **Slow 4G throttling**.

### Desktop

| Metric | Score | Status |
|:-------|:-----:|:------:|
| **Performance** | 97 | 🟢 Excellent |
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
| **Performance** | 91 | 🟢 Good |
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
- ✅ PWA — installable, offline mode, service worker
- ✅ Groq-powered AI chatbot
- ✅ Password reset flow with strength meter
- ✅ Privacy Policy, Terms, Refund pages

---

## Key Features

### 🛍️ Customer Experience

<details>
<summary><strong>AI-Powered Features</strong></summary>

- **AI Shopping Assistant** — Groq-powered chatbot (openai/gpt-oss-120b)
  - Real-time product search, category browsing, order tracking
  - Tool-calling (fetches actual DB data — never hallucinates prices)
  - Streaming responses with typing indicator
  - Session-scoped conversation history
  - Rate-limited (20 messages/min/IP)
  - Suggested prompts for guided first interaction
  - Hidden on `/admin/*` pages
  - **Security:** system messages stripped from client input, tools are read-only

</details>

<details>
<summary><strong>Authentication & Security</strong></summary>

- **Email + Password** with strong password validation (8+ chars, mixed case, number)
- **Password strength meter** (visual feedback: Very Weak → Very Strong)
- **Forgot / Reset password flow** (email link → secure reset form)
- **Google OAuth** with PKCE
- **Show / hide password** toggle
- **Verify email** required before login
- **Session-aware redirects** with cookie preservation
- **Existing email detection** — prevents silent account creation

</details>

<details>
<summary><strong>PWA — Progressive Web App</strong></summary>

- **Installable** — Add to Home Screen on mobile/desktop
- **Offline mode** — Service worker caches pages + static assets
- **Offline fallback page** with reconnect button
- **App shortcuts** — Browse Products, My Orders, New Arrivals
- **Smart install prompt** (30-day dismissal cooldown)
- **Stale-while-revalidate** for images
- **Cache-first** for immutable assets
- **Network-first** for HTML with offline fallback

</details>

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

16 dedicated pages, all dark-themed with glass-morphism UI:

| Page | Purpose |
|------|---------|
| **`/admin`** | Dashboard: command-center summary, Action Center, charts, recent orders + activity timeline |
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
| **`/admin/analytics`** | Live users, funnel, top products, devices, referrers, **Product Analytics**, **New vs Returning** |
| **`/admin/visitors`** | Every session — guests, new, returning, admins |
| **`/admin/sessions`** | Session drill-down with paths, products, orders |
| **`/admin/emails`** | Email delivery logs with filters |
| **`/admin/audit`** | Every admin action, timestamped |
| **`/admin/exports`** | CSV export center (orders, payments, emails, users, audit) |
| **`/admin/users`** | User table with search, role filter, detail modal |
| **`/admin/users/[id]/activity`** | User activity timeline with session history |
| **`/admin/reports`** | Sales reports with revenue, categories, top products, trends |

**Additional admin capabilities:**
- **Real-time notifications** — Web Audio chime + toast + browser notification on new orders
- **Audit logging** — Every privileged action timestamped with actor, target, before/after state
- **Payment refunds** — Stripe refund API + order status update
- **CSV exports** — Orders, payments, emails, users, audit logs (with date filters)
- **Printable invoices** — Customer + admin access, A4-optimized
- **Coupon management** — CRUD + atomic redemption + usage tracking
- **Review moderation** — Approve / reject / delete
- **Abandoned cart recovery** — View + track recovery emails
- **Product Analytics** — Views, cart adds, orders, conversion rate per product
- **Visitor tracking** — Session-level analytics with device, location, referrer

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

<details>
<summary><strong>Product Analytics</strong></summary>

- **Per-product performance** — views, cart adds, orders, revenue, conversion rate
- **Abandoned detection** — products with high views but zero orders highlighted
- **Category breakdown** — revenue and units sold per category
- **Top products** — by revenue, units sold, order count
- **Date range filtering** — 7d, 30d, 90d
- **Sortable table** — click column headers to sort

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
10. **Welcome back** (returning users, throttled to once per week)

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

## Tech Stack

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
  - Sessions
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
- **Groq** — AI chatbot (LPU inference)

### Testing & CI
- **Vitest** + RTL
- **Playwright**
- **GitHub Actions**
- **Codecov** ready
- **AI SDK v5** — Vercel AI SDK

</td>
</tr>
</table>

---

## Architecture

> 📖 For deep dives, see **[docs/architecture.md](./docs/architecture.md)** and **[docs/security.md](./docs/security.md)**.

### High-Level Data Flow

```mermaid
flowchart TD
    Browser[🌐 Browser]
    Edge[⚡ Edge Middleware<br/>proxy.ts]
    Server[🖥️ Server Actions & RSC<br/>Node.js]
    Supa[(🗄️ Supabase<br/>PostgreSQL + Auth + Storage)]
    Mongo[(🍃 MongoDB Atlas<br/>Events · Logs · Carts · Sessions)]
    Redis[(⚡ Upstash Redis<br/>Rate Limit · Idempotency)]
    QStash[📮 Upstash QStash<br/>Email Queue]
    Stripe[💳 Stripe API]
    Gmail[📧 Gmail SMTP]
    Groq[🤖 Groq LPU<br/>AI Inference]

    Browser -->|HTTP| Edge
    Edge -->|Session + Rate Limit| Server
    Server -->|RLS queries| Supa
    Server -->|Analytics events| Mongo
    Server -->|Rate limit / idempotency| Redis
    Server -->|Enqueue email job| QStash
    Server -->|Payment intents| Stripe
    Server -->|Chat completion| Groq
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
- AI chatbot: system prompt server-side only, tools are read-only

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
        WH->>WH: Check if already completed (duplicate guard)
        WH->>DB: UPDATE order
        WH->>Mongo: INSERT payment_transactions
    and Email
        SA->>QStash: queueEmail('payment-confirmed')
    end
```

**Dual confirmation:** Webhook + client-side verify. Both idempotent. Race-safe. Webhook checks if order is already completed to prevent duplicate emails.

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

**Failure logging:** If QStash publish fails, the email log is marked `failed` with the error message — no more stuck `queued` entries.

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
    J --> N[(MongoDB: sessions)]
    N --> O[Visitor classification]
    N --> P[Live users · New vs Returning]
    N --> Q[User activity timeline]
```

**Events tracked:** `page_view`, `product_view`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `checkout_completed`, `order_placed`, `login`, `signup`, `search`, `wishlist_add`, `wishlist_remove`, `share_product`.

**Sessions:** Each browser tab's continuous interaction is stored as a session document with full activity summary — paths visited, products viewed, orders placed, duration, device, referrer.

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

### AI Chatbot Architecture

```mermaid
flowchart LR
    A[User types message] --> B[ChatWidget]
    B --> C[POST /api/chat]
    C --> D[Rate limit: 20/min/IP]
    D --> E[Zod validate]
    E --> F[Strip system role]
    F --> G[streamText with tools]
    G --> H[Groq LPU Inference]
    H --> I{Tool call?}
    I -->|searchProducts| J[Supabase query]
    I -->|getProductById| J
    I -->|getCategories| J
    I -->|getMyOrders| K[Supabase RLS query]
    J --> L[Return JSON to LLM]
    K --> L
    L --> M[LLM generates response]
    M --> N[Stream via SSE]
    N --> O[Client renders word-by-word]
```

**Security:**
- Client cannot send `system` role (Zod rejects)
- System prompt server-side only
- Tools are read-only — no INSERT/UPDATE/DELETE
- `getMyOrders` uses RLS — only sees caller's own orders
- Rate-limited at 20 messages/min/IP

**Why tools over RAG?**
- **Fresh data** — Tools query live DB
- **No embeddings** — No vector store needed
- **Simpler** — One function call vs vector search
- **Authoritative** — Never hallucinates prices

---

### Product Analytics Engine

```mermaid
flowchart TD
    A[Events: product_view] --> B[(MongoDB: events)]
    C[Events: add_to_cart] --> B
    D[Events: order_placed] --> B
    E[Orders: shipped/delivered] --> F[(Supabase: order_items)]
    B --> G[Aggregation Pipeline]
    F --> H[RPC: get_product_sales_stats]
    G --> I[getProductEventMetrics]
    H --> J[getProductSalesStats]
    I --> K[merge by product_id]
    J --> K
    K --> L[ProductPerformanceRow]
    L --> M[ProductAnalytics table]
    L --> N[Conversion rate, abandoned flag]
    M --> O[Admin Dashboard]
    N --> O
```

**Metrics computed:**
- Views per product (from events)
- Cart adds per product (from events)
- Orders per product (from events + sales)
- Revenue per product (from order_items)
- Conversion rate: orders / views
- Abandoned: views >= 20 AND orders = 0

---

## Screenshots

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
- `/admin/analytics` — Analytics dashboard with product analytics
- `/admin/coupons` — Coupon management
- `/admin/reviews` — Review moderation
- `/admin/abandoned-carts` — Cart recovery
- `/admin/payments` — Payment dashboard
- `/admin/visitors` — Visitor tracking
- `/admin/sessions` — Session drill-down
- `/admin/reports` — Sales reports
- `/orders/[id]/invoice` — Printable invoice
- AI Chatbot — Floating chat widget

---

<div align="center">

**📌 End of Part 1 — Continue to Part 2 for setup, environment variables, and configuration.**

</div>

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **npm** (or pnpm/yarn) | Latest | Package manager |
| **Supabase account** | Free tier | Database + Auth + Storage + Realtime |
| **MongoDB Atlas account** | Free tier (M0) | Events, logs, cart snapshots, sessions |
| **Upstash account** | Free tier | Redis + QStash |
| **Stripe account** | Test mode | Card payments |
| **Gmail account** | Personal | Transactional email |
| **Groq account** | Free tier | AI chatbot (optional) |

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
# ══════════════════════════════════════════════════════════════
# SUPABASE (required)
# ══════════════════════════════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # ⚠️ Server-only, never expose

# ══════════════════════════════════════════════════════════════
# SITE (required)
# ══════════════════════════════════════════════════════════════
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ══════════════════════════════════════════════════════════════
# UPSTASH REDIS (required)
# ══════════════════════════════════════════════════════════════
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx...

# ══════════════════════════════════════════════════════════════
# MONGODB ATLAS (required)
# ══════════════════════════════════════════════════════════════
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=vestior

# ══════════════════════════════════════════════════════════════
# SECURITY (required)
# Generate with: openssl rand -hex 32
# ══════════════════════════════════════════════════════════════
IP_HASH_SALT=replace-with-32-plus-random-chars
CRON_SECRET=replace-with-32-plus-random-chars

# ══════════════════════════════════════════════════════════════
# EMAIL — Gmail SMTP (required)
# ══════════════════════════════════════════════════════════════
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=VESTIOR <your-email@gmail.com>

# ══════════════════════════════════════════════════════════════
# UPSTASH QSTASH (required)
# ══════════════════════════════════════════════════════════════
QSTASH_URL=https://qstash-us-east-1.upstash.io
QSTASH_TOKEN=eyJVc2VySUQiOiJ...
QSTASH_CURRENT_SIGNING_KEY=sig_xxxx
QSTASH_NEXT_SIGNING_KEY=sig_yyyy

# ══════════════════════════════════════════════════════════════
# STRIPE (required for card payments)
# ══════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ══════════════════════════════════════════════════════════════
# ADMIN
# ══════════════════════════════════════════════════════════════
ADMIN_EMAIL=your-admin-email@example.com

# ══════════════════════════════════════════════════════════════
# GOOGLE ANALYTICS (optional)
# ══════════════════════════════════════════════════════════════
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ══════════════════════════════════════════════════════════════
# AI — Groq (required for chatbot)
# Sign up: https://console.groq.com
# ══════════════════════════════════════════════════════════════
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
| 8 | `20261014_add_last_login.sql` | Login tracking columns |
| 9 | `20261015_add_super_admin.sql` | Super admin role |
| 10 | `20261016_normalize_user_roles.sql` | Role normalization |
| 11 | `20261017_sales_report_rpc.sql` | Sales report RPC |
| 12 | `20261018_product_analytics_rpc.sql` | Product analytics RPC |
| 13 | `20261019_place_order_atomic_v2.sql` | **Enhanced place_order_atomic with coupon + provider** |

**Important:** Migration #13 is the enhanced `place_order_atomic` RPC. It combines stock locking, coupon redemption, and payment provider tagging into a single atomic transaction.

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
| `sessions` | Visitor session tracking |

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

// sessions
db.sessions.createIndex({ session_id: 1 }, { unique: true })
db.sessions.createIndex({ user_id: 1, last_seen_at: -1 })
db.sessions.createIndex({ ip_hash: 1, last_seen_at: -1 })
db.sessions.createIndex({ visitor_type: 1, last_seen_at: -1 })
db.sessions.createIndex({ last_seen_at: 1 }, { expireAfterSeconds: 7776000 }) // 90d TTL
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

### 8. AI Setup (Groq)

The AI Shopping Assistant requires a Groq API key:

1. Sign up at [console.groq.com](https://console.groq.com) (free tier)
2. Go to **API Keys** → **Create Key**
3. Name it `VESTIOR`
4. Copy → `.env.local`:
   - `GROQ_API_KEY=gsk_...`

**Free tier limits:**
- 1,000 requests/day (any model)
- 8,000 tokens/minute
- 200,000 tokens/day

**Model selection:**
- Default: `openai/gpt-oss-120b` (500 tok/s, tool-calling)
- Faster: `openai/gpt-oss-20b` (1000 tok/s)

**Available regions:** Model availability varies. If `llama-*` returns 404, use `openai/gpt-oss-*`.

**Verify your key:**
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

---

### 9. Run Development Server

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
│       ├── ci.yml                              # GitHub Actions (4 jobs)
│       └── keep-alive.yml                      # DB keep-alive cron
├── e2e/                                        # Playwright E2E tests
│   ├── auth-guards.spec.ts
│   ├── cart-flow.spec.ts
│   ├── navigation.spec.ts
│   └── public-pages.spec.ts
├── public/
│   ├── suits/                                  # Hero images
│   ├── images/categories/                      # Category tiles
│   ├── og-image.png
│   ├── manifest.json                           # PWA manifest
│   ├── sw.js                                   # Service Worker
│   ├── offline.html                            # Offline fallback
│   └── site.webmanifest
├── src/
│   ├── actions/                                # Server Actions
│   │   ├── admin-management.ts
│   │   ├── confirmPayment.ts
│   │   ├── coupons.ts
│   │   ├── placeOrder.ts                       # Atomic order placement
│   │   ├── refundPayment.ts
│   │   ├── resendOrderEmail.ts
│   │   ├── reviews.ts
│   │   ├── updateOrderStatus.ts
│   │   └── wishlist.ts
│   ├── app/
│   │   ├── (main)/                             # Customer-facing
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   ├── verify-email/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   ├── reset-password/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── ResetPasswordForm.tsx
│   │   │   │   └── callback/route.ts
│   │   │   ├── cart/
│   │   │   ├── category/[slug]/
│   │   │   ├── checkout/
│   │   │   ├── featured/
│   │   │   ├── new-arrivals/
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── CustomerOrderDetail.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── ProductDetailClient.tsx
│   │   │   ├── profile/
│   │   │   ├── wishlist/
│   │   │   │   ├── page.tsx
│   │   │   │   └── WishlistGrid.tsx
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   ├── refund/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin/                              # Admin panel (16 pages)
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
│   │   │   │       ├── OrderDetailAdmin.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── payments/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── reports/
│   │   │   ├── reviews/
│   │   │   ├── sessions/
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/activity/page.tsx
│   │   │   ├── visitors/
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── export/route.ts
│   │   │   │   ├── live-users/route.ts
│   │   │   │   └── payment-detail/route.ts
│   │   │   ├── auth/
│   │   │   │   ├── login-success/route.ts
│   │   │   │   └── welcome/route.ts
│   │   │   ├── cart/
│   │   │   │   ├── recover/route.ts
│   │   │   │   └── sync/route.ts
│   │   │   ├── chat/route.ts                   # AI chatbot endpoint
│   │   │   ├── cron/
│   │   │   │   ├── abandoned-carts/route.ts
│   │   │   │   ├── daily/route.ts
│   │   │   │   ├── keep-alive/route.ts
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
│   │   ├── admin/                              # 40+ admin components
│   │   ├── auth/
│   │   │   ├── PasswordInput.tsx
│   │   │   └── PasswordStrengthMeter.tsx
│   │   ├── chat/
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatWidget.tsx
│   │   ├── invoice/
│   │   │   └── InvoiceView.tsx
│   │   ├── pwa/
│   │   │   ├── InstallPrompt.tsx
│   │   │   └── ServiceWorkerRegister.tsx
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
│   │   ├── ProductRow.tsx
│   │   ├── ProductSort.tsx
│   │   ├── StructuredData.tsx
│   │   ├── TrackingProvider.tsx
│   │   └── WishlistProvider.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── groq.ts
│   │   │   ├── system-prompt.ts
│   │   │   └── tools.ts
│   │   ├── analytics/
│   │   │   ├── product-queries.ts
│   │   │   ├── product-types.ts
│   │   │   ├── sales-queries.ts
│   │   │   ├── trends.ts
│   │   │   └── types.ts
│   │   ├── carts/
│   │   ├── coupons/
│   │   ├── dashboard/
│   │   ├── email/
│   │   │   ├── mailer.ts
│   │   │   ├── queries.ts
│   │   │   ├── queue.ts
│   │   │   ├── render.tsx
│   │   │   ├── types.ts
│   │   │   └── templates/                      # 10 email templates
│   │   ├── exports/
│   │   ├── invoice/
│   │   ├── orders/
│   │   ├── payments/
│   │   │   ├── index.ts
│   │   │   ├── queries.ts
│   │   │   ├── types.ts
│   │   │   └── providers/
│   │   │       ├── cod.ts
│   │   │       └── stripe.ts
│   │   ├── products/
│   │   ├── qstash/
│   │   ├── recommendations/
│   │   ├── reviews/
│   │   ├── supabase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── public.ts
│   │   │   └── server.ts
│   │   ├── tracking/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   ├── referrer.ts
│   │   │   ├── server-user.ts
│   │   │   ├── session-queries.ts
│   │   │   ├── session-types.ts
│   │   │   └── types.ts
│   │   ├── wishlist/
│   │   ├── audit.ts
│   │   ├── env.ts
│   │   ├── idempotency.ts
│   │   ├── mongodb.ts
│   │   ├── password.ts
│   │   ├── ratelimit.ts
│   │   ├── redis.ts
│   │   └── utils.ts
│   ├── providers/
│   │   └── AuthProvider.tsx
│   └── proxy.ts                                # Next.js 16 middleware
├── supabase/
│   └── migrations/                             # 13 SQL migrations
├── test/
│   ├── components/
│   ├── mocks/
│   ├── unit/
│   └── setup.ts
├── docs/
│   ├── api-reference.md
│   ├── architecture.md
│   ├── changelog.md
│   ├── contributing.md
│   ├── database.md
│   ├── deployment.md
│   ├── faq-developer.md
│   ├── features.md
│   ├── roadmap.md
│   ├── security.md
│   └── testing.md
├── .env.example
├── Dockerfile.vercel
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
- [x] **AI chat validation** — max 20 messages, 2000 chars each
- [x] **System role rejected** from AI chat input

</details>

<details open>
<summary><strong>Data Integrity</strong></summary>

- [x] **`FOR UPDATE` locks** prevent oversell on concurrent orders
- [x] **Idempotency keys** in Redis for every webhook (24h TTL)
- [x] **Coupon redemption locks** prevent race conditions
- [x] **One review per user per product** (UNIQUE constraint)
- [x] **Stock deduction inside transaction** — no partial state
- [x] **Atomic coupon + order** — single RPC transaction

</details>

<details open>
<summary><strong>Secrets & Isolation</strong></summary>

- [x] **Service-role key** never reaches browser (`import 'server-only'`)
- [x] **Environment variables** validated at startup (fail fast)
- [x] **CSP headers** on all responses
- [x] **CSRF protection** via Server Actions (built-in)
- [x] **Webhook signature verification** (Stripe + QStash)
- [x] **QStash job verification** — upstash-signature header

</details>

<details open>
<summary><strong>Rate Limiting & Abuse Prevention</strong></summary>

- [x] **Tiered limiters** (auth / admin / orders / cart / track / chat / general)
- [x] **Fail-open behavior** — site stays up if Redis is down
- [x] **IP hashing** (SHA-256 + salt) for tracking
- [x] **Cron authentication** via `CRON_SECRET`
- [x] **Per-user coupon limits** (default: 1)
- [x] **AI chatbot rate limit** — 20 messages/min/IP

</details>

<details open>
<summary><strong>AI Chatbot Security</strong></summary>

- [x] **System prompt server-side** — client cannot modify
- [x] **Role whitelist** — only `user` and `assistant` accepted
- [x] **Read-only tools** — no DB writes possible
- [x] **RLS-enforced order access** — user sees only own orders
- [x] **Fail-closed** — returns 503 if `GROQ_API_KEY` missing

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
| `changeUserRole(userId, role)` | `actions/admin-management.ts` | Super Admin | Promote/demote user |

### API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/chat` | POST | Public (rate-limited) | Streaming AI chatbot with tool calling |
| `/api/track` | POST | Public (rate-limited) | Event tracking ingestion |
| `/api/cart/sync` | POST | User | Sync cart snapshot to MongoDB |
| `/api/cart/recover` | GET | Public | Restore cart from recovery token |
| `/api/admin/export` | GET | Admin | CSV export (orders, payments, emails, users, audit) |
| `/api/admin/live-users` | GET | Admin | Live sessions (last 5 min) |
| `/api/admin/payment-detail` | GET | Admin | Payment details from MongoDB |
| `/api/auth/welcome` | POST | Public (rate-limited) | Queue welcome email |
| `/api/auth/login-success` | POST | User | Record login + welcome-back email |
| `/api/recommendations/recently-viewed` | GET | Public | Fetch product details by IDs |
| `/api/wishlist/ids` | GET | User | Fetch wishlist product IDs |
| `/api/webhooks/stripe` | POST | Signature-verified | Stripe webhook handler |
| `/api/jobs/send-email` | POST | QStash-verified | Email delivery job |
| `/api/cron/daily` | GET | Cron-secret | Combined daily cron |
| `/api/cron/abandoned-carts` | GET | Cron-secret | Abandoned cart reminders |
| `/api/cron/low-stock-alert` | GET | Cron-secret | Low stock alerts |
| `/api/cron/keep-alive` | GET | Cron-secret | DB keep-alive ping |

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
| `payment_method` | `text` | `cod` / `stripe` (legacy) |
| `payment_provider` | `text` | `cod` / `stripe` / `paypal` |
| `payment_intent_id` | `text` | Stripe PI ID |
| `payment_metadata` | `jsonb` | Full Stripe payload |
| `paid_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

**Immutability guard:** `orders.items` and `orders.address` are protected by a trigger — they cannot be modified after INSERT.

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
| `is_super_admin` | `bool` |
| `address_line1` | `text` |
| `address_line2` | `text` |
| `city` | `text` |
| `state` | `text` |
| `pincode` | `text` |
| `last_login_at` | `timestamptz` |
| `welcome_back_sent_at` | `timestamptz` |
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
| `place_order_atomic(items, address, coupon, provider)` | **v2**: Order + stock + coupon + provider in ONE transaction |
| `get_dashboard_stats()` | Single-query admin aggregation |
| `get_product_review_stats(product_id)` | Avg rating + breakdown |
| `get_products_review_stats(ids[])` | Batch ratings |
| `validate_coupon(code, user_id, subtotal)` | Coupon validity check |
| `redeem_coupon_atomic(code, user_id, order_id, subtotal)` | Atomic redemption |
| `get_sales_report(from, to)` | Sales analytics aggregation |
| `get_product_sales_stats(limit)` | Product-level analytics |
| `admin_change_user_role(user_id, role)` | Super-admin role change |

### MongoDB Collections

| Collection | Purpose | TTL |
|-----------|---------|-----|
| `events` | User behavior tracking | 90 days |
| `email_logs` | Email delivery history | none |
| `payment_transactions` | Payment audit trail | none |
| `audit_logs` | Admin actions | none |
| `analytics_daily` | Pre-aggregated metrics | none |
| `cart_snapshots` | Abandoned cart recovery | none |
| `sessions` | Visitor session tracking | 90 days |

---

## 📈 Performance & SEO

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
| AI streaming (SSE) | Perceived instant response |

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
npm run test:ui       # Interactive UI
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

<details>
<summary><strong>AI chatbot returns 503 "not configured"</strong></summary>

**Cause:** `GROQ_API_KEY` not set.

**Fix:** Sign up at [console.groq.com](https://console.groq.com), create a key, add to `.env.local`. Restart dev server.

</details>

<details>
<summary><strong>AI chatbot returns 404 "model does not exist"</strong></summary>

**Cause:** Groq model availability varies by region.

**Fix:** Check available models:

```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

If `openai/gpt-oss-120b` isn't listed, use another model from the response in `src/lib/ai/groq.ts`.

</details>

<details>
<summary><strong>AI chatbot rate limit (429)</strong></summary>

**Cause:** More than 20 messages/minute from same IP.

**Fix:** Wait 60 seconds. Rate limit resets automatically.

</details>

<details>
<summary><strong>PWA install prompt not showing</strong></summary>

**Cause:** Various.

**Checklist:**
1. Running on HTTPS (required for PWA)
2. Not already installed (check `display-mode: standalone`)
3. Not dismissed in last 30 days (check localStorage `vestior-pwa-install-dismissed`)
4. Browser supports `beforeinstallprompt` (Chrome, Edge — not Safari)

</details>

<details>
<summary><strong>Service worker not updating</strong></summary>

**Cause:** Browser caches old service worker.

**Fix:**
1. Bump `CACHE_VERSION` in `public/sw.js`
2. Hard refresh (Ctrl+Shift+R)
3. Or: DevTools → Application → Service Workers → Unregister, then reload

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

**Modern features used:** AVIF/WebP, CSS `aspect-ratio`, `:has()`, `view-transition` (progressive), Web Audio API, `navigator.sendBeacon`, Service Workers, `beforeinstallprompt`.

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
- ✅ Chat widget has `role="dialog"` and keyboard close
- ✅ PWA install prompt dismissible with aria-label

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
A: Analytics + email logs + abandoned carts + sessions temporarily fail. **Core commerce unaffected** (Supabase is source of truth).

**Q: Can I deploy to a VPS instead of Vercel?**
A: Yes. The `Dockerfile.vercel` is compatible with any Docker host. See `next.config.ts` for `output: 'standalone'`.

**Q: How does the AI chatbot work?**
A: VESTIOR uses Groq (LPU inference) with the `openai/gpt-oss-120b` model. It has access to read-only tools (`searchProducts`, `getCategories`, `getMyOrders`, etc.) but can never modify data. Rate-limited at 20 messages/min per IP. Free tier handles ~1,000 requests/day.

**Q: Can I install VESTIOR as an app?**
A: Yes. On Chrome/Edge (Android or desktop), you'll see an install prompt. On iOS Safari, tap Share → "Add to Home Screen". The app works offline for cached pages.

**Q: Do I need to verify my email?**
A: Yes. After signup, check your inbox for the verification link. Until verified, login will show "Please verify your email first".

**Q: Why do I get two payment confirmation emails?**
A: This was a bug in older versions. Now fixed: the Stripe webhook checks if the order is already completed before queuing the email.

**Q: How do I change the AI model?**
A: Edit `AI_MODELS` in `src/lib/ai/groq.ts`. Available options: `openai/gpt-oss-120b` (quality), `openai/gpt-oss-20b` (fast).

**Q: Can I see what visitors are doing live?**
A: Yes. `/admin/visitors` shows all sessions. `/admin/analytics` has a Live Users widget that auto-refreshes every 30 seconds.

**Q: How do I track product performance?**
A: `/admin/analytics` shows per-product views, cart adds, orders, and conversion rate. Products with high views but zero orders are flagged as "abandoned".

---

<div align="center">

**📌 End of Part 2 — Continue to Part 3 for Roadmap, Changelog, Deployment, and Contact.**

</div>
## 🗺️ Roadmap

> **Promise:** This roadmap is honest. It reflects what we plan to build, what we'll prioritize, and what we're deliberately not doing.

### Current State

VESTIOR is at **v3.1.0** — production-ready with AI-powered features and PWA capabilities.

### What's shipped

| Category | Status |
|----------|--------|
| **Core commerce** | Browse → cart → checkout → orders — complete |
| **Payments** | COD + Stripe live, refunds, webhooks, idempotency |
| **Admin panel** | 16 pages covering products, orders, payments, users, analytics, reviews, coupons, carts, audit, exports, visitors, sessions, reports |
| **Email** | Gmail SMTP + QStash queue, 10 templates, delivery tracking |
| **Analytics** | Self-hosted event tracking + sessions + product analytics + funnel + live users |
| **AI** | Groq-powered shopping assistant with tool-calling |
| **PWA** | Installable, offline mode, service worker, app shortcuts |
| **Growth** | Coupons, reviews, wishlist, abandoned cart recovery, recommendations |
| **Security** | RLS, atomic operations, idempotency, rate limiting, audit logs |
| **Testing** | 53 unit + 21 E2E tests, GitHub Actions CI (4 jobs) |
| **Performance** | 97/100 Lighthouse desktop, 91/100 mobile |
| **Docs** | 11 deep-dive files + README |

### Guiding Principles

Every feature decision traces back to these:

1. **Solve real problems** — We don't add features because they're trendy. We add them because users ask for them, or because they improve the fundamentals.
2. **Don't add complexity** — Every feature adds code, dependencies, tests, and maintenance. We add complexity only when the value exceeds the cost.
3. **Ship small, ship often** — Big releases are risky. We prefer frequent small releases over quarterly monoliths.
4. **Document everything** — A feature without docs doesn't exist. Every release updates the relevant `docs/` files.
5. **Security first** — No feature ships without a security review. RLS, input validation, rate limiting — non-negotiable.

---

### Short Term — Next 3 Months

#### 🎯 Multi-currency support

**Why:** Pakistan-based store, but customers exist globally. Prices currently display in PKR only.

**What:**
- Store prices in PKR (base currency)
- Real-time conversion based on daily exchange rates
- User selects currency (auto-detected by IP)
- Persisted in cookie
- All displays (product cards, cart, checkout, invoices, emails) convert
- Admin sets currency markup (e.g., +5% for USD)

**Effort:** ~2 weeks
**Blockers:** Need FX rate provider (exchangerate.host or similar — free tier).

---

#### 🎯 Order tracking via couriers

**Why:** Customers email asking "where is my order?" — we answer manually. Automate.

**What:**
- Integrate with TCS and Leopards (Pakistan's largest couriers)
- When order status → `shipped`, generate tracking number via API
- Add tracking URL to `order-shipped` email
- Order detail page shows live tracking status
- Admin panel shows tracking numbers

**Effort:** ~3 weeks
**Blockers:** Both couriers have API access, but rate-limited on free tier.

---

#### 🎯 Sentry error tracking

**Why:** Currently, errors go to Vercel logs. We can't see them without manual review.

**What:**
- Sign up for Sentry free tier (5K errors/month)
- Install `@sentry/nextjs`
- Capture client + server errors
- Source maps uploaded
- Alerts on new issues

**Effort:** ~3 days
**Blockers:** None.

---

#### 🎯 Codecov integration

**Why:** Coverage reports currently upload as CI artifacts. Codecov shows trends.

**What:**
- Connect Codecov to GitHub repo
- Update CI to upload coverage
- Add coverage badge to README
- Fail PR if coverage drops > 1%

**Effort:** ~2 hours
**Blockers:** None.

---

### Medium Term — Next 6 Months

#### 🎯 Multi-language (i18n)

**Why:** Urdu is the primary language for many Pakistani customers. English-only limits reach.

**What:**
- Next.js 16 i18n with App Router
- Language switcher (EN / UR)
- RTL layout for Urdu
- All UI strings externalized
- Emails in recipient's language
- DB stores language preference on profile

**Effort:** ~4 weeks
**Blockers:** Need to translate ~500 strings.

---

#### 🎯 Loyalty program

**Why:** Repeat customers generate 3x revenue of new customers. Reward them.

**What:**
- Points system: 1 point per ₹100 spent
- Redeemable for coupons (100 points = ₹100 off)
- Tiers: Bronze → Silver → Gold (based on lifetime spend)
- Tier perks: free shipping, early access, birthday discount
- Admin panel to view/adjust points

**Effort:** ~3 weeks
**Blockers:** None technical.

---

#### 🎯 Gift cards

**Why:** High-demand feature for gifting. Also acts as a marketing tool.

**What:**
- Buy a gift card (₹1,000 / ₹2,500 / ₹5,000 / custom)
- Delivered via email with code
- Redeem at checkout (like a coupon, but with balance tracking)
- Partial redemption (spend ₹1,200 of ₹2,500)
- Expiry: 12 months

**Effort:** ~2 weeks
**Blockers:** Requires new table `gift_cards` + `gift_card_transactions`.

---

#### 🎯 Order tracking page for guests

**Why:** Guests place orders, then lose the ability to check status. Send them a magic link.

**What:**
- Guest checkout flow (email + address, no signup)
- After order, send email with "track your order" link
- Link contains signed token, expires in 30 days
- Page shows order status, tracking, invoice

**Effort:** ~2 weeks
**Blockers:** Requires refactoring `orders` to allow `user_id = null`.

---

#### 🎯 Advanced AI features

**Why:** Current AI is read-only. Add personalized recommendations and semantic search.

**What:**
- **Semantic search** — "fancy suit for wedding" → matches suits
- **"Recommended for you"** — based on browsing history
- **Auto-generated product descriptions** — for new products
- **Customer support chatbot** — with FAQs and order lookup

**Effort:** ~4 weeks
**Blockers:** Needs vector embeddings (Voyage, OpenAI) and cost analysis.

---

### Long Term — 12+ Months

#### 🎯 Mobile app (React Native)

**Why:** Native app delivers better UX. Push notifications, offline, biometric auth.

**What:**
- React Native app (Expo)
- Shared business logic with web (via monorepo)
- Push notifications
- Deep linking
- Biometric auth

**Effort:** ~3 months
**Blockers:** Significant investment. Only if user base justifies it.

---

#### 🎯 Marketplace mode (multi-vendor)

**Why:** Transform from single-vendor to platform. Big pivot.

**What:**
- Vendor onboarding
- Vendor dashboards
- Per-vendor revenue tracking
- Split payments (Stripe Connect)
- Vendor-specific fulfillment

**Effort:** ~6 months
**Blockers:** This is a different product. Would be a v4.0 or a fork.

---

#### 🎯 ML-powered recommendations

**Why:** Current recommendations are rule-based. ML would personalize.

**What:**
- Train model on purchase history
- "Recommended for you" personalization
- Product affinity (customers who bought X also bought Y)
- Cohort retention analysis

**Effort:** ~2 months
**Blockers:** Needs data volume (10K+ orders) and ML infrastructure.

---

### What We're Not Doing

Some things we've deliberately not built. Reasons below.

- ❌ **Crypto payments** — Volatile, complex, not demanded by user base.
- ❌ **Subscription model** — Men's fashion isn't a subscription product.
- ❌ **Social features (follow, feed)** — VESTIOR is a store, not a social network.
- ❌ **Custom CMS for content** — Static content + product data. A CMS is overkill.
- ❌ **Voice search** — Low demand for a niche store.
- ❌ **VR/AR try-on** — Requires 3D models + AR SDKs. Not worth the cost at our scale.
- ❌ **Buying in bulk discount** — Products are premium, single-quantity purchases.
- ❌ **Multiple stores / white-label** — We're single-vendor, single-brand.
- ❌ **Admin mobile app** — Admin panel is already mobile-responsive.
- ❌ **Light mode toggle** — Our brand is dark. Light mode would break the visual identity.
- ❌ **Blockchain NFTs for authenticity** — Solutions looking for problems.
- ❌ **Deep integration with Facebook/Instagram** — Standard OG tags suffice.

---

### How to Influence the Roadmap

**Vote on existing items:** Reactions on issues count. High-reaction items move up.

**Propose new features:** Open an issue with:
- **Problem statement** — What problem does it solve?
- **Proposed solution** — How should it work?
- **Alternatives considered** — What else did you think of?
- **Success criteria** — How do we know it worked?

**Contribute code:** Comment on the issue, wait for maintainer confirmation, follow the [contributing guide](./docs/contributing.md).

**Sponsorship:** Email [zainshahzs110@gmail.com](mailto:zainshahzs110@gmail.com) with the feature name and rough budget.

---

## 📝 Changelog

All notable changes to VESTIOR are documented in this file. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

### v3.1.0 — AI + PWA + Auth Polish (Current)

**🤖 New — AI Shopping Assistant**
- Groq-powered chatbot with `openai/gpt-oss-120b` (500 tok/s)
- Tools: `searchProducts`, `getProductById`, `getCategories`, `getMyOrders`
- Streaming responses via SSE
- Session-scoped history (sessionStorage)
- Suggested prompts on empty state
- Rate-limited at 20 messages/min/IP
- Zero-cost (Groq free tier)
- Hidden on `/admin/*` pages
- Prompt injection guard: `system` role rejected from client
- Read-only tools: no DB writes possible
- Typing indicator during streaming
- Clear conversation button

**📱 New — PWA (Progressive Web App)**
- Service worker (`public/sw.js`)
  - Cache-first for static assets (JS/CSS/fonts)
  - Stale-while-revalidate for images
  - Network-first for HTML with offline fallback
  - Skips `/admin`, `/api`, `/auth` routes
- Offline page (`public/offline.html`)
  - Branded design matching site
  - Try Again button
- Install prompt
  - Auto-shows after 20s
  - 30-day dismissal cooldown
  - Hidden on `standalone` mode
- Enhanced manifest
  - Shortcuts (Products, Orders, New Arrivals)
  - Categories (shopping, fashion)
  - `display_override` for modern browsers
- Service worker auto-update (hourly check)

**🔐 New — Auth Polish**
- Password reset flow
  - `/auth/forgot-password` — email entry
  - `/auth/reset-password` — new password form with code exchange
  - Show/hide password toggle
  - Password strength meter (Very Weak → Very Strong)
  - Real-time validation (length, case, number)
- Login improvements
  - Clearer error messages ("Please verify your email first")
  - "Forgot password?" link
  - Show/hide password toggle
- Signup improvements
  - Existing-email detection (prevents silent account creation)
  - Strong password enforcement
  - Real-time strength meter

**📊 New — Admin Dashboard 2.0**
- **Command-center summary** — cross-page stats in one object
- **Action Center** — pending reviews, orders, payments, abandoned carts, low stock, failed emails
- **Recent Activity timeline** — audit log highlights on dashboard
- **Live Users widget** — auto-refreshing every 30s
- **Product Analytics** — per-product views, cart adds, orders, conversion rate, abandoned flag
- **New vs Returning chart** — 30-day visitor breakdown
- **Payment method breakdown** — COD vs Stripe revenue
- **Visitors page** (`/admin/visitors`) — every session
- **Session drill-down** (`/admin/sessions`) — full activity timeline
- **User activity page** (`/admin/users/[id]/activity`) — session history per user
- **Reports dashboard** (`/admin/reports`) — sales analytics with trends

**📧 Fixed — Email System**
- **Duplicate payment-confirmed emails** — webhook now checks if order already completed
- **Wrong payment method in resend** — now uses `payment_provider` not legacy `payment_method`
- **Discount/coupon missing in resend** — now passes `discount_amount` and `coupon_code`
- **Stuck `queued` emails** — QStash failures now mark logs as `failed`
- **Welcome-back throttle bug** — only sets `welcome_back_sent_at` if email actually queued

**⚡ Performance**
- Lighthouse Desktop: 98 → **97** (Performance)
- Lighthouse Mobile: 84 → **91** (Performance)
- Accessibility: 100 / 100 (Desktop + Mobile)
- Best Practices: 100 / 100
- SEO: 100 / 100

**📦 Dependencies**
- Added: `ai`, `@ai-sdk/groq`
- Removed: `next-pwa` (replaced with manual service worker)

---

### v3.0.0 — Enterprise Feature Set

**🎉 Major Features**
- Stripe payment integration with webhook idempotency
- Gmail SMTP + QStash email queue (10 transactional templates)
- Self-hosted event tracking engine (MongoDB)
- Custom analytics dashboard (funnel, live users, top products)
- Admin payments dashboard with refunds
- Customer + admin order detail pages with real-time tracking
- Audit logs (every privileged action tracked)
- Export center (CSV for 5 entity types)
- Product reviews with moderation + Schema.org markup
- Backend-synced wishlist with guest merge
- Coupon system with atomic redemption
- Printable invoices (print-optimized HTML)
- Abandoned cart recovery (auto-email + coupons)
- Product recommendations (related, cross-sell, trending, recently-viewed)
- Admin real-time notifications (sound + toast + browser)
- Advanced product filters + sorting with URL sync
- Session tracking (visitor analytics)

**⚡ Performance**
- Lighthouse Desktop: 84 → **98** (Performance)
- Lighthouse Mobile: 59 → **84** (Performance)
- Mobile LCP: 12.4s → **3.5s**
- Desktop LCP: 2.2s → **0.5s**
- ISR on all public pages (5 min revalidation)
- AVIF/WebP image formats
- Deferred GA4 (`lazyOnload`)
- Removed Hero animation from LCP elements

**🧪 Testing & Quality**
- 53 unit tests (Vitest + React Testing Library)
- 21 E2E tests (Playwright + Chromium)
- GitHub Actions CI (Lint, Unit, E2E, Security — 4 jobs)
- Coverage thresholds enforced in CI

**🔒 Security**
- Idempotency keys for every webhook
- `FOR UPDATE` locks on order + coupon operations
- IP hashing (SHA-256 + salt) for tracking
- Cron authentication via `CRON_SECRET`
- Webhook signature verification (Stripe + QStash)
- Zod validation on every Server Action
- `import 'server-only'` guards on sensitive modules

**🏗️ Architecture**
- Provider abstraction for payments (COD/Stripe)
- Provider abstraction for email (Gmail SMTP/Resend)
- Dual-database design (Supabase transactional + MongoDB analytical)
- QStash queue for background jobs
- Redis for idempotency + rate limiting + cache
- Docker support (Vercel-native container)

**🐛 Fixed**
- React hydration warning on root layout
- Stripe `capture` API error (switched to `retrieve`)
- QStash loopback address rejection in dev (direct send fallback)
- Multiple Supabase client instances (singleton pattern)
- Email not sending to non-verified addresses (Gmail SMTP migration)

---

### v2.0.0 — Production Hardening

**🔒 Security**
- Fixed critical RLS policy holes (any authenticated user could manage products/orders)
- Added `is_admin()` helper (SECURITY DEFINER)
- Server-side authorization in `updateOrderStatus`
- Replaced client-trusted pricing with server-side DB fetch
- Rate limiting across all route tiers (Upstash Redis)
- Cookie preservation on middleware redirects
- Open redirect fix in OAuth callback
- `import 'server-only'` guards on admin client
- Environment validation at startup (Zod schema)

**⚡ Performance**
- Atomic order placement RPC (`place_order_atomic`)
- Dashboard stats via single RPC (`get_dashboard_stats`)
- Singleton Supabase browser client
- Lazy-loaded images
- Dynamic import for Recharts (admin-only chunk)
- Hero image: 1.9MB → ~300KB WebP
- Removed `react-icons` dependency

**🔍 SEO & DX**
- Dynamic `robots.txt`
- Auto-generated `sitemap.xml`
- JSON-LD structured data
- Per-page dynamic metadata
- Canonical URLs
- Global error boundary
- Route-level loading states
- Upgraded to Next.js 16.3, React 19.3

**🏗️ Architecture**
- Migrated `middleware.ts` → `proxy.ts` (Next.js 16 convention)
- 13 database indexes added on hot query paths

---

### v1.0.0 — Initial Release

- Full e-commerce flow (products → cart → checkout → orders)
- Admin panel with dashboard, products, orders, users
- Email/password authentication via Supabase
- Google OAuth login
- Email verification flow
- Real-time order status updates via Supabase Realtime
- Glass-morphism UI with Framer Motion
- Google Analytics 4 integration
- Responsive design
- Dark theme with blue accents
- Category filter, live search, product gallery
- Cart persistence in localStorage

---

### Version History Summary

| Version | Date | Focus | Lighthouse (Desktop) |
|---------|------|-------|---------------------|
| v3.1.0 | 2026-10-13 | AI + PWA + Auth | 97/100/100/100 |
| v3.0.0 | 2026-10-12 | Enterprise features | 98/100/100/100 |
| v2.0.0 | 2026-10-05 | Security + perf | 87/85/100/100 |
| v1.0.0 | 2026-10-01 | Initial release | — |

---

### Upgrade Guide

#### From v3.0 to v3.1

**Database:**
1. Run new migrations (if not already applied):
   - `20261014_add_last_login.sql`
   - `20261015_add_super_admin.sql`
   - `20261016_normalize_user_roles.sql`
   - `20261017_sales_report_rpc.sql`
   - `20261018_product_analytics_rpc.sql`
   - `20261019_place_order_atomic_v2.sql` (⚠️ **Important** — enhanced order RPC)

2. Add `sessions` collection indexes in MongoDB:
   ```javascript
   db.sessions.createIndex({ session_id: 1 }, { unique: true })
   db.sessions.createIndex({ user_id: 1, last_seen_at: -1 })
   db.sessions.createIndex({ last_seen_at: 1 }, { expireAfterSeconds: 7776000 })
   ```

**Environment:**
Add new var to `.env.local`:
```
GROQ_API_KEY=gsk_...
```

**Code:**
No breaking changes for existing features. New components mount automatically.

#### From v2 to v3

See [docs/changelog.md](./docs/changelog.md) for full upgrade instructions.

---

### Deprecation Policy

- **Minor versions:** Deprecation warnings are added, feature remains functional.
- **Major versions:** Deprecated features may be removed.
- **Security fixes:** Never deprecated — patched in all supported versions.

**Current support:** v3.x only. v2.x is EOL.

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

### In Scope

- Authentication / authorization bypasses
- RLS policy escapes
- Server Action vulnerabilities
- Injection attacks (SQL, XSS, etc.)
- CSRF / SSRF / open redirect
- Sensitive data exposure
- AI prompt injection / jailbreak bypasses

### Out of Scope

- Rate limit bypass via distributed IPs
- DoS via legitimate high traffic
- Social engineering
- Issues already documented in the README

### Disclosure Policy

1. **Report privately** to the email above
2. **We acknowledge** within 48 hours
3. **We investigate** and develop a fix
4. **We coordinate disclosure** — you get credit (if you want) once patched
5. **Public disclosure** after fix is deployed

---

## 🚀 Deployment

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
GROQ_API_KEY
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

---

### Post-Deploy Checklist

- [ ] Lighthouse audit on live URL (target: 90+ mobile, 95+ desktop)
- [ ] Test signup + Google OAuth
- [ ] Test password reset flow
- [ ] Place a test order (COD + Stripe)
- [ ] Verify stock decremented
- [ ] Test admin access (customer redirected)
- [ ] Test AI chatbot ("Show me suits under ₹25,000")
- [ ] Verify `/robots.txt` and `/sitemap.xml`
- [ ] Test PWA install prompt
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Test product URL with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Configure GA4 custom events (optional)
- [ ] Verify Vercel cron runs (check logs after first hour)
- [ ] Test abandoned cart flow (add to cart, wait 2h+, check email)

---

### Docker (Alternative)

The `Dockerfile.vercel` is Vercel-native but compatible with any Docker host:

```bash
# Local build (requires Docker)
docker build -f Dockerfile.vercel -t vestior .
docker run -p 3000:3000 --env-file .env.local vestior
```

**Set `NEXT_OUTPUT=standalone`** in the build environment to enable standalone output.

---

### Other Platforms

Works on any Node.js host (Railway, Render, Fly.io, VPS):

1. Set all env vars
2. `npm run build`
3. `NEXT_OUTPUT=standalone node .next/standalone/server.js`
4. Configure cron jobs to hit `/api/cron/daily` hourly
5. Set up a reverse proxy (Nginx/Caddy) for HTTPS

---

### Cron Jobs

Two options for scheduled tasks:

**Option A — Vercel Cron (Hobby = 1 cron):**

`vercel.json` is pre-configured with a single daily cron:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 9 * * *"
    }
  ]
}
```

`/api/cron/daily` runs both low-stock alert + abandoned-cart recovery sequentially.

**Option B — External Cron (cron-job.org, free):**

For more granular control, use external cron:
- `https://your-domain.com/api/cron/low-stock-alert` — every 6 hours
- `https://your-domain.com/api/cron/abandoned-carts` — hourly
- Add header: `Authorization: Bearer YOUR_CRON_SECRET`

**Option C — GitHub Actions:**

The repo includes `.github/workflows/keep-alive.yml` which pings `/api/cron/keep-alive` twice daily to prevent free-tier DB pausing.

---

## 🤝 Contributing

Contributions welcome! Fork → branch → PR.

```bash
git checkout -b feature/amazing-feature
git commit -m 'feat: add amazing feature'
git push origin feature/amazing-feature
```

### Before Submitting

- [ ] Follow existing code style (Prettier via Tailwind plugin)
- [ ] Run `npm run build` (must succeed)
- [ ] Run `npm run typecheck` (must be clean)
- [ ] Run `npm run lint` (zero errors)
- [ ] Run `npm run test` (all pass)
- [ ] Add tests for new features
- [ ] Update README if behavior changes

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Meaning |
|------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `perf:` | Performance improvement |
| `docs:` | Documentation only |
| `refactor:` | Code change (no feature, no fix) |
| `test:` | Adding or fixing tests |
| `chore:` | Tooling, dependencies, config |

**Scopes:** `cart`, `checkout`, `payments`, `email`, `admin`, `auth`, `db`, `api`, `analytics`, `reviews`, `wishlist`, `coupons`, `invoices`, `ai`, `pwa`

**Examples:**
```
feat(ai): add semantic product search tool
fix(email): prevent duplicate payment-confirmed emails
perf(images): switch hero to AVIF format
docs(readme): update lighthouse scores
```

### What We're Looking For

- **Bug fixes** — especially in cart, checkout, payments, email
- **Performance improvements** — with Lighthouse benchmarks
- **Security hardening** — with CVE-style reasoning
- **Accessibility improvements** — WCAG AA compliance
- **Test coverage** — new tests, edge cases
- **Documentation** — clearer explanations, better examples

### What We Don't Accept

- Code style preferences without rationale
- Dependencies without justification
- Breaking changes in minor versions
- Tests that just test mocks
- Changes without tests
- AI-generated PRs without review (you must understand every line)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## 📄 License

**MIT** — see [LICENSE.txt](./LICENSE.txt).

You are free to use, modify, and distribute this project for personal or commercial purposes. Attribution appreciated but not required.

```
MIT License

Copyright (c) 2026 Zain Ali Shah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💰 Free Tier Limits

VESTIOR runs on **100% free tiers** at MVP scale. Here's what you get:

| Service | Free Tier | Capacity |
|---------|-----------|----------|
| **Vercel Hobby** | 100GB bandwidth, 100GB-hours compute | ~50K monthly visitors |
| **Supabase Free** | 500MB DB, 1GB storage, 50K MAU | ~10K products, 50K users |
| **MongoDB M0** | 512MB storage | ~500K events (90-day TTL) |
| **Upstash Redis** | 500K commands/month | ~1M rate-limit checks |
| **Upstash QStash** | 500 messages/day | ~15K emails/month |
| **Gmail SMTP** | 500 emails/day | ~15K emails/month |
| **Stripe** | No monthly fee | 2.9% + 30¢ per transaction |
| **Groq** | 1,000 requests/day | ~1K AI chats/day |
| **GitHub Actions** | 2,000 minutes/month | Plenty for CI |

**Total monthly cost: $0** until you exceed limits.

**When to upgrade:**
- **Vercel:** When you need commercial use + more crons → Pro ($20/month)
- **Supabase:** When you need backups + more compute → Pro ($25/month)
- **MongoDB:** When storage exceeds 512MB → M2 ($9/month)
- **Resend:** When you exceed 500 emails/day → Add Resend (free 3K/month)
- **Groq:** When you exceed 1K requests/day → Paid tier available

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

[⬆ Back to top](#vestior)

</div>

---

## 📌 Appendix — Design Decisions Deep Dive

Some design choices that deserve explanation:

### Why two databases?

**Supabase** handles transactional data (ACID, RLS). **MongoDB** handles high-volume append-only data (events, logs, sessions). Forcing them into one DB creates either performance debt (Postgres with millions of events) or schema pollution (MongoDB without RLS).

**Rule:** If losing a row breaks money or trust → Supabase. If losing a row just makes a dashboard slightly wrong → MongoDB.

### Why Gmail SMTP over Resend?

Gmail SMTP sends to **any recipient** without domain verification. Free tier: 500/day. Perfect for MVP. Migration path: swap `mailer.ts` to Resend when you hit 500/day or need better analytics.

### Why QStash over Vercel cron for emails?

Vercel functions have 10s limits. SMTP takes 2-5s. QStash decouples the user request from the email send. Automatic retries + Dead Letter Queue included.

### Why tools over RAG for the AI chatbot?

Tools query **live DB** — always fresh, no embeddings needed, never hallucinate prices. RAG would require vector embeddings + stale snapshots. For ~500 products, tools are simpler and always correct.

### Why no Redux / Zustand?

We have three state stores: Auth, Wishlist, Notifications. All used app-wide, updated infrequently, small in size. React Context handles this perfectly. A dedicated state library would add bundle size + learning curve for zero benefit.

### Why `place_order_atomic` v2?

Original version handled stock + order in one transaction. But coupon + payment provider were separate — which meant a failure between steps left inconsistent state. **v2 combines everything** into ONE transaction. No retry logic needed. No compensating RPC. Postgres guarantees atomicity.

### Why `orders.items` JSONB **and** `order_items` table?

- **`orders.items`** — Immutable snapshot. Fast display on order cards. Can't change after INSERT (trigger guard).
- **`order_items`** — Queryable table. For analytics, joins, revenue-by-category.

Both serve different needs. Duplication is intentional. Trigger ensures they don't drift.

---

<div align="center">

**The End.**

Thank you for reading this far. If you build something great with VESTIOR, let me know.

</div>