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

[![Documentation](https://img.shields.io/badge/docs-11_files_·_10000+_lines-blue?style=flat-square)](./docs/)
[![Version](https://img.shields.io/badge/version-3.2.0-success?style=flat-square)](#-changelog)

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
- [What's New in v3.2](#-whats-new-in-v32)
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
  - [PDF Print Export Pipeline](#pdf-print-export-pipeline)
  - [Editorial UI Design System](#editorial-ui-design-system)
- [Screenshots](#-screenshots)
  - [Customer-Facing Pages](#customer-facing-pages)
  - [Admin Pages](#admin-pages)
  - [Email Templates](#email-templates)
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

**VESTIOR** is a **production-grade, single-vendor e-commerce platform** built for premium men's fashion (suits, coats, pants, waistcoats, Gurkha, two-piece and three-piece sets). It goes far beyond a standard storefront — it integrates payment abstraction, self-hosted analytics, queue-based background processing, coupon economics, cart recovery, product recommendations, AI-powered shopping assistance, PDF export, and full admin tooling into one cohesive system.

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
- **Editorial UI/UX** — Full redesign with dark editorial theme, bento-style layouts, glass morphism, motion-first micro-interactions.
- **Data portability** — CSV export for every entity + PDF print views for archival & compliance.

---

## What's New in v3.2

**v3.2** is the **largest UI/UX overhaul + feature hardening release** since v3.0. It brings the entire app to a coherent **editorial design language**, adds **PDF print export**, hardens the **cron + email pipeline**, and fixes critical bugs across auth, checkout, and notifications.

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Editorial UI/UX Redesign (Massive)

The entire application was redesigned around a **cohesive editorial design system** — 120 files changed, ~24,000 lines added, ~8,500 removed.

**Design principles:**
- **Bento-style stat cards** — left accent bar, ambient glow, tabular numerals, mono type for values
- **Glass morphism** — `backdrop-blur-xl`, layered opacity, subtle borders
- **Grouped sidebar navigation** — Overview / Commerce / Audience / Operations
- **Editorial typography** — tracking-tight headlines, `[0.15em]` uppercase eyebrows, `tabular-nums` for all numbers
- **Motion-first micro-interactions** — hover lifts, staggered children, shine sweeps on CTAs
- **Ambient glow orbs** — context-matched color per page section
- **Consistent empty states** — every list, table, and grid has a branded empty state
- **Status pills everywhere** — dot + icon + label, color-coded by semantic meaning
- **Sharp scroll boundaries** — removed edge fade gradients for consistent cut-off
- **Responsive-first** — every component tested at 320px → 2xl breakpoint

**Pages redesigned:**
- Homepage (Hero + CategorySection + HomeProductSection + RecommendedRow)
- Products listing + Product detail + Reviews section
- Cart (with playful rotating empty-state messages)
- Checkout (2-step with animated stepper)
- Orders list + Order detail + Invoice
- Wishlist + WishlistGrid
- Profile
- Auth pages (login, signup, forgot, reset, verify)
- Legal pages (privacy, terms, refund)
- **All 16 admin pages** — dashboard, analytics, orders, payments, products, users, reviews, coupons, abandoned carts, visitors, sessions, reports, emails, audit, exports, activity
- **All 10 email templates** — welcome, order-placed, payment-confirmed, payment-failed, order-shipped, order-delivered, order-cancelled, low-stock-alert, abandoned-cart, welcome-back

</td>
<td width="50%" valign="top">

### 🖨️ PDF Print Export (New)

`/admin/exports/print/[type]` — dedicated print-optimized views for all 5 export types.

**Features:**
- **Print-optimized CSS** — `@media print` with `visibility: hidden` on chrome, only the print area visible
- **A4 landscape** for tables (`@page { size: A4 landscape }`)
- **UTF-8 BOM** — currency symbols (₹) render correctly
- **Banded rows** — `thead { display: table-header-group }` for multi-page tables
- **Row-level page-break** — `tr { page-break-inside: avoid }`
- **Filter chips** displayed in header
- **Record count + generated date**
- **Available types:** Orders, Payments, Emails, Users, Audit logs
- **Zero external dependencies** — uses browser's native "Print → Save as PDF"

**Why this matters:** Admins can now archive exports as PDFs, print physical copies for accounting, or attach reports to email threads — all with one click.

### 🐛 Critical Bug Fixes

**Cron + Email pipeline (4 fixes):**

1. **Low-stock throttle on failure** — Throttle key is only set on **real success**. Previously, a failed queueEmail call still set the throttle — the next cron run was skipped, and the alert never fired.

2. **Abandoned-cart parameter order** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — the cron was passing args in the wrong order (`maxAgeHours` instead of `maxReminders`), silently limiting reminders to wrong values.

3. **Abandoned-cart window** — Correct throttle window (50 minutes) + correct 2-hour cart age threshold. Verified via curl test — 4 low-stock alerts + 1 abandoned cart sent successfully.

4. **Email queue hardening** — If `qstash.publishJSON` throws, the email log is now marked `status: 'failed'` with the error message. Previously it stayed `status: 'queued'` forever — invisible to admins.

**Auth (1 fix):**

5. **Password reset / email confirm session missing** — Switched to `token_hash` flow in `/auth/callback`. The previous `code`-based flow was leaving users without a session after clicking the email link. Now uses `supabase.auth.verifyOtp({ token_hash, type })`.

**Checkout (1 fix):**

6. **`order_placed` event not tracked on Stripe success** — COD flow tracked the event correctly, but the Stripe success path called `handlePaymentSuccess` without tracking. Now both paths emit `order_placed` with the correct `paymentMethod`, `couponCode`, and `discountAmount`.

**UI polish (1 refactor):**

7. **Edge fade gradients removed** — Scrollable rows (HomeProductSection, ProductRow, RecommendedRow) had edge fade gradients that created inconsistent visual cut-off. Removed for sharp, clean boundaries.

</td>
</tr>
</table>

### 📸 New Organized Screenshot Structure

Screenshots are now organized by context in `public/images/`:

```
public/images/
├── admin_pages-images/          (10 admin screenshots)
│   ├── admin-dashboard.jpg
│   ├── admin-analytics-page.jpg
│   ├── admin-product-management-page.jpg
│   ├── admin-order-management-page.jpg
│   ├── admin-payment-managemet-page.jpg
│   ├── admin-coupon-management-page.jpg
│   ├── admin-abandoned-cart-management-page.jpg
│   ├── admin-review-approvel-page.jpg
│   ├── admin-report-page.jpg
│   └── admin-export-center-page.jpg
├── customer_facing-images/      (9 customer screenshots)
│   ├── home-page.jpg
│   ├── home-category-page.jpg
│   ├── product-page.jpg
│   ├── product-id-page-quickview.jpg
│   ├── cart-page.jpg
│   ├── checkout-page.jpg
│   ├── customer-order-page.jpg
│   ├── customer-order-id-page.jpg
│   └── customer-order-id-invoice.jpg
└── email_template_images/       (7 email screenshots)
    ├── abandoned-card-email.jpg
    ├── cancelled-email.jpg
    ├── delivered.jpg
    ├── order-confirmed-email.jpg
    ├── payment-succes.jpg
    ├── reset-email-template.jpg
    └── shipped-email.jpg
```

### 🔄 Version History Update

| Version | Date | Focus | Lighthouse (Desktop) |
|---------|------|-------|---------------------|
| **v3.2.0** | **2026-10-16** | **Editorial redesign + PDF export + bug fixes** | **97/100/100/100** |
| v3.1.0 | 2026-10-13 | AI + PWA + Auth polish | 97/100/100/100 |
| v3.0.0 | 2026-10-12 | Enterprise features | 98/100/100/100 |
| v2.0.0 | 2026-10-05 | Security + perf | 87/85/100/100 |
| v1.0.0 | 2026-10-01 | Initial release | — |

### 📦 Commit Trail (v3.1 → v3.2)

Chronological list of the commits that shaped this release:

- `feat(ui): redesign entire app with editorial theme + responsive fixes` (120 files, +23,657 / −8,498)
- `feat(email): redesign all email templates with theme-matched editorial style`
- `fix(ui): polish row shadows, navbar scroll lock, and category page redesign`
- `fix(cron): low-stock throttle on failure + abandoned-cart window + email queue hardening`
- `fix(cron): correct param order in findAbandonedCarts (maxReminders, not maxAgeHours)`
- `fix(checkout): track order_placed event on COD and Stripe success`
- `fix(auth): use token_hash flow for reset/confirm email — fixes session missing`
- `refactor(ui): remove edge fade gradients from scrollable rows for consistent sharp cut-off`
- `feat(admin): add PDF print export + fix test suite + lint errors`

---

## What's New in v3.1

This release introduced **AI-powered shopping assistance**, **PWA capabilities**, and **comprehensive auth improvements**:

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
- ✅ **Editorial redesign** — cohesive design language across 120+ files
- ✅ **PDF print export** — zero-dependency, print-optimized
- ✅ **Grouped admin sidebar** — Overview / Commerce / Audience / Operations
- ✅ **Bento-style stat cards** — consistent across every admin page
- ✅ **Sharp scroll boundaries** — no edge fade gradients

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
- **Forgot / Reset password flow** (email link → secure reset form via `token_hash` flow)
- **Google OAuth** with PKCE
- **Show / hide password** toggle
- **Verify email** required before login
- **Session-aware redirects** with cookie preservation
- **Existing email detection** — prevents silent account creation
- **Editorial auth pages** — animated 3-column backgrounds, gradient icon tiles, shimmer CTAs

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

- **Editorial homepage** — Hero with adaptive imagery (mobile vs desktop), animated stats, category grid, featured + new-arrivals scroll rows, trending products row
  - **Ambient parallax orbs** — mouse-tracked depth
  - **Corner crosshair marks** for editorial feel
  - **Vertical brand mark** on large screens ("VESTIOR · EST. 1968")
  - **Refined scroll indicator** with mouse outline + bouncing dot
  - **Bento category grid** — icon, hover "Shop Now" pill, animated underline
  - **Sharp scroll rows** — no edge fade, arrow navigation, progress bar
- **Advanced product discovery**
  - Debounced live search (300ms) with recent search history
  - **Plural/singular variants** — "shirts" also matches "shirt"
  - Category filtering
  - **Price range filter** (min/max)
  - **Sort**: Newest, Price ↓, Price ↑, Top Rated, Most Popular
  - **In-stock only** toggle
  - Active filter chips (removable)
  - Shareable/bookmarkable URLs
  - Mobile filter drawer (bottom sheet)
- **Product detail**
  - Multi-image gallery with prev/next + thumbnails
  - Size selector (XS–3XL + Custom)
  - Live stock indicator (green / amber / red)
  - Discount % badge
  - Wishlist toggle
  - Copy link + WhatsApp share
  - Dynamic OG metadata + JSON-LD
  - **Recommended rows** — Related, You May Also Like, Recently Viewed

</details>

<details>
<summary><strong>Cart & Checkout</strong></summary>

- **localStorage cart** with deduplication and stock clamping
- Real-time cart count in navbar
- Quantity update, remove item, clear cart
- **Playful empty state** — rotating messages ("Every great outfit starts with one click"), floating mini-icons, marketing benefits strip
- **Secure server-validated checkout** (client prices ignored)
- **Payment method selector**:
  - Cash on Delivery (COD)
  - Card via Stripe Elements
- **Coupon field** with server-side validation (both desktop sidebar + mobile)
- Auto-fill of shipping address from profile
- **Animated 2-step stepper** with checkmarks and pulse rings
- Stripe Elements with night theme + custom variables
- Order confirmation with email
- **Trust strip** — Free Delivery / Secure Payment / 14-Day Returns

</details>

<details>
<summary><strong>Account & Orders</strong></summary>

- Email/password + Google OAuth
- Email verification flow
- PKCE-safe callback handling
- Profile management (name, phone, address)
- Order history with **real-time status updates** (Supabase Realtime)
- **Order detail page** with progress tracker (animated steps + pulse rings)
- **Invoice download** (print-optimized HTML → Save as PDF)
- **Wishlist** page (backend-synced, guest merge on login)
- **Product reviews** (verified purchase badges, moderation)
- **Editorial empty states** for orders, wishlist, cart

</details>

<details>
<summary><strong>Recommendations</strong></summary>

- **"You May Also Like"** — cross-category recommendations
- **"Related Products"** — same category, similar price
- **"Trending Now"** — from tracked events (last 7 days)
- **"Recently Viewed"** — localStorage-backed carousel
- All rows scrollable with arrow navigation + progress bar
- **Sharp boundaries** — no edge fade gradients

</details>

---

### 🎛️ Admin Panel

**19 dedicated pages**, all dark-themed with **editorial glass-morphism UI**:

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
| **`/admin/exports`** | CSV export center + **PDF print views** (NEW) |
| **`/admin/exports/print/[type]`** | **Print-optimized PDF-ready views** (NEW) |
| **`/admin/users`** | User table with search, role filter, detail modal |
| **`/admin/users/[id]/activity`** | User activity timeline with session history |
| **`/admin/reports`** | Sales reports with revenue, categories, top products, trends |

**Additional admin capabilities:**
- **Real-time notifications** — Web Audio chime + toast + browser notification on new orders
- **Audit logging** — Every privileged action timestamped with actor, target, before/after state
- **Payment refunds** — Stripe refund API + order status update
- **CSV exports** — Orders, payments, emails, users, audit logs (with date filters)
- **PDF print exports** — Dedicated print routes, A4-optimized, filter-aware
- **Printable invoices** — Customer + admin access, A4-optimized
- **Coupon management** — CRUD + atomic redemption + usage tracking
- **Review moderation** — Approve / reject / delete
- **Abandoned cart recovery** — View + track recovery emails
- **Product Analytics** — Views, cart adds, orders, conversion rate per product
- **Visitor tracking** — Session-level analytics with device, location, referrer
- **Grouped sidebar navigation** — Overview / Commerce / Audience / Operations
- **Bento-style stat cards** — left accent bar, ambient glow, tabular numerals
- **Consistent status pills** — dot + icon + label, color-coded

**Real-time admin notifications:**
- Web Audio API chime (no file needed)
- Custom toast with "View" action + shine sweep
- Browser native notification
- Bell icon with unread badge + pulse
- localStorage persistence
- Triggered by: `order INSERT` and `payment_status → completed`

**Editorial design system (all admin pages):**
- **Card layout** — `bg-gradient-to-b from-[#131313] to-[#0e0e0e] border-white/[0.06]`
- **Left accent bar** — `w-[3px] h-10 rounded-r-full` in semantic color
- **Ambient glow orbs** — `blur-[70px]` behind each stat
- **Eyebrow pills** — `text-[10px] tracking-[0.18em] uppercase`
- **Empty states** — icon tile + title + description + clear CTA
- **Grouped tables** — hover states, header tracking, `tabular-nums`
- **Motion-first** — staggered children, hover lifts, shine sweeps

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
- **v3.2 fixes:** Correct param order in `findAbandonedCarts`, correct age window, throttle only set on success

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
- **Editorial review cards** with star accent + status badge

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
- **Editorial empty state** — animated heart tile + sparkle accent

</details>

<details>
<summary><strong>Product Analytics</strong></summary>

- **Per-product performance** — views, cart adds, orders, revenue, conversion rate
- **Abandoned detection** — products with high views but zero orders highlighted (amber pulse dot)
- **Category breakdown** — revenue and units sold per category
- **Top products** — by revenue, units sold, order count (rank badges for top 3)
- **Date range filtering** — 7d, 30d, 90d
- **Sortable table** — click column headers to sort, direction indicators
- **Abandoned filter** — one-click to show only abandoned products

</details>

<details>
<summary><strong>PDF Print Export (v3.2)</strong></summary>

- **Dedicated print routes** — `/admin/exports/print/[type]`
- **5 export types:**
  - Orders — order ID, customer, status, items, totals, shipping
  - Payments — provider, txn ID, amount, status, method
  - Emails — template, recipient, status, message ID
  - Users — name, email, phone, role, city, state
  - Audit — timestamp, actor, action, target, IP hash
- **Print-optimized CSS:**
  - `@page { size: A4 landscape; margin: 10mm }`
  - `thead { display: table-header-group }` — repeat headers on page breaks
  - `tr { page-break-inside: avoid }` — no split rows
  - `visibility: hidden` on all chrome, only `#export-print-area` visible
- **Filter-aware** — date range, status, provider preserved in print
- **Active filter chips** displayed in document header
- **Record count + generation date** in header
- **Zero external dependencies** — uses browser's native print → Save as PDF
- **UTF-8 rendering** — currency symbols (₹) preserved

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

**All 10 templates redesigned in v3.2** with **theme-matched editorial style:**
- Dark `#0A0A0A` background
- Brand masthead with accent-colored dot (`● VESTIOR`)
- Accent eyebrow badge (uppercase, tracking-widest)
- Semantic accent color per template (blue for orders, emerald for success, red for failures, amber for warnings, violet for shipped/abandoned)
- Hairline accent dividers (`rgba(accent, 0.25)`)
- Gradient CTA buttons with box-shadow
- Trust footer with email reply prompt
- Copyright year auto-computed

**Admin notifications:**
- Real-time toast + sound + browser notification
- Bell icon with count badge + pulse
- Dropdown with last 30 notifications
- Deep-link to order detail
- **v3.2 polish:** Editorial toast design with left accent bar + icon tile + "View" action

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
- **Editorial design system** — consistent tokens across 120+ files
- **Zero-dependency CSV builder** — handles escapes, quotes, newlines, BOM
- **Zero-dependency PDF print** — uses browser native print

---

<div align="center">
📌 End of Part 1 — Continue to Part 2 for Tech Stack, Architecture (with PDF Print + Editorial UI diagrams), Screenshots (new paths), Getting Started, Supabase/MongoDB/Upstash/Stripe/Gmail/Groq setup, First Admin, Seed Data, Project Structure
</div>

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
- **Lucide React** (tree-shaken)
- **Recharts** (admin only, lazy-loaded)
- **react-hot-toast** (custom editorial theme)

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

### UI/UX Stack (v3.2)
- **Editorial design system**
- **Glass morphism** (`backdrop-blur-xl`)
- **Framer Motion** micro-interactions
- **Custom editorial tokens** — dark theme
- **Recharts** — Area, Bar, Pie, Legend
- **Web Audio API** — notification chime

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
- PDF print routes: server-side admin verification before rendering

---

### Order Placement Flow (Atomic v2)

```mermaid
sequenceDiagram
    participant U as Customer
    participant SA as Server Action
    participant RPC as PostgreSQL RPC v2
    participant DB as Supabase
    participant Q as QStash
    participant M as MongoDB

    U->>SA: placeOrder(items, address, method, coupon?)
    SA->>SA: Validate input shape (Zod)
    SA->>SA: Authenticate caller
    SA->>SA: Merge duplicate product IDs
    SA->>RPC: place_order_atomic(...) ← ONE transaction
    RPC->>DB: BEGIN
    RPC->>DB: FOR each item: SELECT FOR UPDATE (sorted by id ASC)
    RPC->>DB: Verify stock >= qty
    RPC->>DB: UPDATE stock -= qty
    RPC->>DB: Lock coupon row (if provided)
    RPC->>DB: Re-validate expiry / usage / min order / per-user
    RPC->>DB: Increment times_used + INSERT redemption
    RPC->>DB: INSERT order (with coupon + provider fields)
    RPC->>DB: INSERT order_items
    RPC->>DB: COMMIT
    RPC-->>SA: { order_id, subtotal, shipping, discount_amount, coupon_code, total }
    SA->>Q: queueEmail('order-placed')
    Q-->>M: Log 'queued'
    SA->>M: markCartRecovered()
    SA-->>U: { success, orderId, total }
```

**v2 atomicity guarantee:** In v1, order creation, coupon redemption, and payment provider tagging were **3 separate operations**. Any failure left inconsistent state. In v2, all four concerns live in **one transaction**. If any step fails, everything rolls back. **No retry logic. No compensating RPC.**

**Concurrency guarantee:** Under simultaneous orders on the same product, `FOR UPDATE` (with canonical lock ordering by `product_id ASC`) serializes access. **Oversell is impossible. Deadlocks are impossible.**

---

### Payment Processing

```mermaid
sequenceDiagram
    participant U as Customer
    participant SA as placeOrder
    participant DB as Supabase
    participant SP as Stripe
    participant WH as Webhook
    participant M as MongoDB

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
    SA->>M: INSERT payment_transactions (if not exists)
    SA->>QStash: queueEmail('payment-confirmed')
    par Webhook (production)
        SP->>WH: payment_intent.succeeded
        WH->>WH: Verify signature
        WH->>WH: Check idempotency (Redis SETNX + Lua)
        WH->>DB: Check if already completed (duplicate guard)
        WH->>DB: UPDATE order
        WH->>M: INSERT payment_transactions
        WH->>WH: Skip email if already completed
    end
```

**Dual confirmation:** Webhook + client-side verify. Both idempotent. Race-safe.

**v3.1 fix:** Webhook now checks `payment_status` before queuing the email — prevents duplicate "payment-confirmed" emails when both paths run.

**v3.2 fix:** `order_placed` tracking event now fires on BOTH COD and Stripe success paths.

---

### Email Pipeline

```mermaid
flowchart LR
    A[Server Action] -->|queueEmail| B[Log to MongoDB]
    B --> C{Local dev?}
    C -->|Yes| D[Send directly via Gmail SMTP]
    C -->|No| E[Push to QStash]
    E -->|POST /api/jobs/send-email| F[Job handler]
    F --> G[Verify QStash signature]
    G --> H[Render React Email]
    H --> I[Send via Gmail SMTP]
    I --> J[Update log: sent + messageId]
    D --> J
    J --> K[Optional: Resend webhook → status tracking]
    
    F -.->|Render failed| L[Mark failed — no retry]
    F -.->|SMTP failed| M[Return 500 — QStash retries 3x]
    E -.->|Publish failed| N[Mark failed with error]
```

**Why QStash?** Vercel functions have 10s limits. SMTP is slow. Queue decouples the two.

**Dev-mode fallback:** QStash can't reach `localhost`. Direct send in dev.

**v3.1 fix:** If QStash publish fails, the email log is marked `failed` with the error message — no more stuck `queued` entries.

**v3.2 fix:** Cron throttles are only set on **real success** — no more silent skips when the previous run failed.

---

### Event Tracking Pipeline

```mermaid
flowchart LR
    A[User action] -->|track\('event', props\)| B[Client SDK]
    B --> C[Batch every 10s OR 10 events]
    C --> D[navigator.sendBeacon on unload]
    D --> E[POST /api/track]
    E --> F[Rate limit: 100/min/IP]
    F --> G[Zod validate payload]
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

**Sessions:** Each browser tab's continuous interaction is stored as a session document with full activity summary — paths visited, products viewed, orders placed, duration, device, referrer, `ended_with` heuristic (order / abandon / bounce).

---

### Abandoned Cart Recovery

```mermaid
flowchart TD
    A[Customer adds to cart] -->|cartUpdated event| B[CartTracker debounced 2s]
    B --> C[POST /api/cart/sync]
    C --> D[(MongoDB: cart_snapshots)]

    E[Cron: hourly] -->|GET /api/cron/abandoned-carts| F{Throttle: 50 min?}
    F -->|Yes, throttled| G[Skip + return minutesSince]
    F -->|No| H[ensureCartIndexes]
    H --> I[findAbandonedCarts(minAgeHours=2, maxReminders=3, limit=100)]
    I --> J[For each cart]
    J --> K[generateRecoveryCoupon (idempotent)]
    K --> L[queueEmail via QStash]
    L --> M{logId returned?}
    M -->|Yes| N[markReminderSent + count++]
    M -->|No| O[failed++ — do NOT throttle]
    N --> P[redis.set THROTTLE_KEY]

    Q[Customer clicks recovery link] -->|GET /cart?recover=TOKEN| R[/api/cart/recover]
    R --> S[findCartByToken → restore items]
    S --> T[Clean URL]

    U[Order placed] --> V[markCartRecovered]
```

**v3.2 fixes:**
- **Param order corrected** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — was passing args wrong, silently limiting reminders.
- **Throttle only set on success** — failed runs leave the throttle unset, so the next cron can retry.

---

### Admin Real-Time Notifications

```mermaid
flowchart LR
    A[Customer places order] --> B[Supabase INSERT orders]
    B -->|Realtime channel| C[AdminNotificationsProvider]
    C --> D[Web Audio API chime<br/>C5 → E5 two-note beep]
    C --> E[Editorial toast<br/>Left accent bar + View action]
    C --> F[Browser Notification API]
    C --> G[Bell icon badge++ + pulse]
    C --> H[localStorage persist<br/>Max 30 notifications]
    
    I[Payment completed] --> J[Supabase UPDATE orders]
    J --> C
```

**Subscription:** `orders` table INSERT + UPDATE where `payment_status = 'completed'`.

**Notification types:**
- `order_placed` → indigo accent + Sparkles icon
- `payment_completed` → emerald accent + CheckCheck icon
- `order_cancelled` → red accent + Bell icon

**Toast design (v3.2):**
- Left accent bar (`border-l-[3px]`)
- Icon tile with matching bg + border
- Title + 2-line message
- "View" action with `ExternalLink` icon + hover translate
- Shine sweep on the View button
- Auto-dismiss after 8s

---

### AI Chatbot Architecture

```mermaid
flowchart LR
    A[User types message] --> B[ChatWidget]
    B --> C[POST /api/chat]
    C --> D[Rate limit: 20/min/IP]
    D --> E[Zod validate]
    E --> F[Strip system role<br/>Only user/assistant allowed]
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
    M --> N[Stream via text/plain SSE]
    N --> O[Client renders word-by-word]
    O --> P[Auto-scroll + typing indicator]
```

**Security:**
- Client cannot send `system` role (Zod rejects)
- System prompt server-side only
- Tools are read-only — no INSERT/UPDATE/DELETE
- `getMyOrders` uses RLS — only sees caller's own orders
- Rate-limited at 20 messages/min/IP
- `stopWhen: stepCountIs(3)` — max 3 tool calls per turn
- Fail-closed — returns 503 if `GROQ_API_KEY` missing

**Why tools over RAG?**
- **Fresh data** — Tools query live DB
- **No embeddings** — No vector store needed
- **Simpler** — One function call vs vector search
- **Authoritative** — Never hallucinates prices

**v3.1 polish:**
- Session-scoped history in `sessionStorage` (cleared when tab closes)
- Suggested prompts on empty state
- Typing indicator (three bouncing dots)
- Clear conversation button
- ESC to close panel
- Full-screen on mobile, floating panel on desktop
- Body scroll lock with scrollbar-width compensation
- Stream abort via `AbortController` when panel closes

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
- Cart-to-order rate: orders / cartAdds
- Abandoned: views >= 20 AND orders = 0

**Sortable columns (v3.1+):** Views, Cart adds, Orders, Revenue, Conversion rate — with animated direction indicator.

**Abandoned filter:** One-click to show only abandoned products. Amber pulse dot on each.

---

### PDF Print Export Pipeline (NEW in v3.2)

```mermaid
flowchart TD
    A[Admin clicks Print] -->|window.open| B[/admin/exports/print/[type]?filters]
    B --> C[Server Component]
    C --> D{Verify admin session}
    D -->|Fail| E[redirect /]
    D -->|Pass| F[Fetch filtered data]
    F --> G[<ExportPrintView type title columns rows filters />]
    G --> H[Render white A4-optimized doc]
    H --> I[Admin clicks Print button]
    I -->|window.print| J[Browser print dialog]
    J --> K[Save as PDF OR send to printer]
    
    L[Print CSS] --> M[@page A4 landscape]
    L --> N[visibility: hidden on chrome]
    L --> O[thead: display table-header-group]
    L --> P[tr: page-break-inside avoid]
    L --> Q[Only #export-print-area visible]
```

**Why zero-dependency?**
- No Puppeteer / no headless Chrome (heavy)
- No server-side PDF library (adds 200KB+)
- Browser's native print → "Save as PDF" is 100% free
- Admin gets full control (paper size, margins, headers, footers)
- Works offline once page loaded

**Print styling (5 export types):**

| Type | Key columns |
|------|-------------|
| **Orders** | Order ID, Date, Customer, Status, Payment, Provider, Subtotal, Shipping, Total, Items, City |
| **Payments** | Order ID, Date, Provider, Txn ID, Amount, Currency, Status, Method |
| **Emails** | Sent At, Template, Recipient, Status, Message ID, Error |
| **Users** | User ID, Name, Email, Phone, Role, City, State, Joined |
| **Audit** | Timestamp, Actor, Action, Target Type, Target ID, IP Hash |

**Format functions:**
- `format: 'date'` → "5 Oct 2026"
- `format: 'currency'` → "₹18,999"
- Empty / null → "—"

---

### Editorial UI Design System (NEW in v3.2)

The v3.2 redesign introduces a **cohesive design language** built on top of Tailwind v4. Every component adheres to the same tokens:

```mermaid
mindmap
  root((Editorial<br/>Design System))
    Colors
      Background: #0A0A0A
      Card: #131313 → #0e0e0e gradient
      Border: white/[0.06]
      Border Hover: white/[0.12]
      Text Primary: #FFFFFF
      Text Secondary: gray-500
      Text Muted: gray-600
    Accents
      Indigo (primary)
      Emerald (success)
      Amber (warning)
      Rose (danger)
      Violet (info)
      Teal (secondary)
    Typography
      Headlines: tracking-tight, font-bold
      Eyebrows: text-[10px] tracking-[0.18em] uppercase
      Numbers: tabular-nums
      Mono: ui-monospace for IDs
    Surfaces
      Card: from-[#131313] to-[#0e0e0e]
      Border: border-white/[0.06]
      Rounded: rounded-2xl
      Shadow: shadow-2xl shadow-black/30
    Motion
      Stagger children: 0.06
      Duration: 0.4s
      Easing: [0.22, 1, 0.36, 1]
      Hover lift: y: -3
    Interactions
      Shine sweep on CTAs
      Layout-animated active sidebar
      Pulse ring on active steps
      Ping dot on live states
```

**Signature patterns:**

1. **Bento stat cards** — left accent bar + ambient glow orb + icon tile + eyebrow + big number + subtitle
2. **Grouped sidebar** — Overview / Commerce / Audience / Operations with layout-animated active bar
3. **Empty states** — icon tile + halo glow + title + description + CTA (never a bare "No data")
4. **Status pills** — `w-1 h-1 rounded-full` dot + icon + label, semantic color
5. **Eyebrow pills** — `text-[10px] tracking-[0.18em] uppercase` in accent-tinted bg
6. **Shine sweeps** — `-inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full`
7. **Skeleton loaders** — matching card shape with `animate-pulse`
8. **Ambient orbs** — `blur-[70px]` accent-colored background glow per card
9. **Timeline dots** — pulse-ping for live, solid for past
10. **Progress bars** — gradient fill, animated on mount

**Why this matters:**
- **Consistency** — every admin page feels like the same product
- **Performance** — pure CSS, no runtime overhead
- **Accessibility** — semantic colors, sufficient contrast
- **Maintainability** — tokens documented, easy to extend
- **Brand identity** — dark editorial tone throughout

---

## Screenshots

> Screenshots are captured from the production build at [vestior.vercel.app](https://vestior.vercel.app). All images organized by context in `public/images/`.

### Customer-Facing Pages

<table>
<tr>
<td width="50%">

**Homepage**
![Homepage](./public/images/customer_facing-images/home-page.jpg)

</td>
<td width="50%">

**Home — Category Section**
![Home Category](./public/images/customer_facing-images/home-category-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Products Listing**
![Products](./public/images/customer_facing-images/product-page.jpg)

</td>
<td width="50%">

**Product Detail + Quick View**
![Product Detail](./public/images/customer_facing-images/product-id-page-quickview.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Cart**
![Cart](./public/images/customer_facing-images/cart-page.jpg)

</td>
<td width="50%">

**Checkout**
![Checkout](./public/images/customer_facing-images/checkout-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Customer Orders**
![Orders](./public/images/customer_facing-images/customer-order-page.jpg)

</td>
<td width="50%">

**Order Detail**
![Order Detail](./public/images/customer_facing-images/customer-order-id-page.jpg)

</td>
</tr>
<tr>
<td width="50%" colspan="2">

**Printable Invoice**
![Invoice](./public/images/customer_facing-images/customer-order-id-invoice.jpg)

</td>
</tr>
</table>

---

### Admin Pages

<table>
<tr>
<td width="50%">

**Admin Dashboard**
![Admin Dashboard](./public/images/admin_pages-images/admin-dashboard.jpg)

</td>
<td width="50%">

**Admin Analytics**
![Admin Analytics](./public/images/admin_pages-images/admin-analytics-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Product Management**
![Product Management](./public/images/admin_pages-images/admin-product-management-page.jpg)

</td>
<td width="50%">

**Order Management**
![Order Management](./public/images/admin_pages-images/admin-order-management-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Payment Management**
![Payment Management](./public/images/admin_pages-images/admin-payment-managemet-page.jpg)

</td>
<td width="50%">

**Coupon Management**
![Coupon Management](./public/images/admin_pages-images/admin-coupon-management-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Abandoned Cart Recovery**
![Abandoned Carts](./public/images/admin_pages-images/admin-abandoned-cart-management-page.jpg)

</td>
<td width="50%">

**Review Moderation**
![Review Approval](./public/images/admin_pages-images/admin-review-approvel-page.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Sales Reports**
![Reports](./public/images/admin_pages-images/admin-report-page.jpg)

</td>
<td width="50%">

**Export Center**
![Exports](./public/images/admin_pages-images/admin-export-center-page.jpg)

</td>
</tr>
</table>

**Additional admin pages** (view live or capture your own):
- `/admin/visitors` — Session list with tabs (All / Guest / New / Returning / Admin)
- `/admin/sessions` — Session drill-down with paths, products, orders, device, referrer
- `/admin/users` — User table with search, role filter, super-admin promotion
- `/admin/users/[id]/activity` — User activity timeline
- `/admin/emails` — Email delivery logs with template + status filters
- `/admin/audit` — Every admin action with actor, target, before/after
- `/admin/exports/print/orders` — Print-optimized orders (Save as PDF)

---

### Email Templates

All 10 templates designed with **theme-matched editorial style** — dark background, brand masthead, accent eyebrow badge, semantic accent color per template.

<table>
<tr>
<td width="50%">

**Order Confirmed**
![Order Confirmed](./public/images/email_template_images/order-confirmed-email.jpg)

</td>
<td width="50%">

**Payment Success**
![Payment Success](./public/images/email_template_images/payment-succes.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Order Shipped**
![Shipped](./public/images/email_template_images/shipped-email.jpg)

</td>
<td width="50%">

**Order Delivered**
![Delivered](./public/images/email_template_images/delivered.jpg)

</td>
</tr>
<tr>
<td width="50%">

**Order Cancelled**
![Cancelled](./public/images/email_template_images/cancelled-email.jpg)

</td>
<td width="50%">

**Abandoned Cart**
![Abandoned Cart](./public/images/email_template_images/abandoned-card-email.jpg)

</td>
</tr>
<tr>
<td width="50%" colspan="2">

**Password Reset**
![Password Reset](./public/images/email_template_images/reset-email-template.jpg)

</td>
</tr>
</table>

**Templates not shown but implemented:**
- Welcome (on signup)
- Payment Failed
- Low Stock Alert (admin notification)
- Welcome Back (returning users, throttled)

---

<div align="center">

**📌 End of Part 2 — Continue to Part 3 for Getting Started, Setup, Project Structure, Security Checklist, Server Actions, and Database Schema.**

</div>

---

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
| 9 | `20261015_add_super_admin.sql` | Super admin role + `admin_change_user_role` RPC |
| 10 | `20261016_normalize_user_roles.sql` | Role normalization (hardened, reversible, whitelist-based) |
| 11 | `20261017_sales_report_rpc.sql` | Sales report RPC |
| 12 | `20261018_product_analytics_rpc.sql` | Product analytics RPC |
| 13 | `20261019_place_order_atomic_v2.sql` | **⚠️ Enhanced `place_order_atomic` (v2)** — coupon + provider in ONE transaction |

**Important:** Migration #13 is the enhanced `place_order_atomic` RPC. It combines stock locking, coupon redemption, and payment provider tagging into a **single atomic transaction**. If you're upgrading from an earlier deployment, you **must** run this.

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
  - `https://your-domain.vercel.app/auth/reset-password` (for password reset via `token_hash` flow)

#### 3f. Enable Realtime

**Database → Replication → `supabase_realtime` publication:**

Enable for these tables:
- `orders` (for customer real-time tracking + admin notifications)
- `order_items` (for real-time item updates)

Or run in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
```

#### 3g. Verify RLS Policies

All 8 tables should have RLS enabled with these policies:

| Table | Policies |
|-------|----------|
| `products` | Admins can view all / insert / update / delete. Anyone views active. |
| `orders` | Users view own. Users insert own. Admins update / delete. |
| `order_items` | Users view own. Users insert own. Admins update / delete. |
| `profiles` | Users view own. Users insert own. Users update own. Admins delete. |
| `product_reviews` | Anyone reads approved. Users read/insert/update own. Admins read/update/delete all. |
| `wishlists` | Users read/insert/delete own. |
| `coupons` | Anyone reads active. Admins manage all. |
| `coupon_redemptions` | Users see own. Admins read all. |

---

### 4. MongoDB Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free M0 cluster
2. **Database Access** → Create user (save password)
3. **Network Access** → Allow `0.0.0.0/0` (for Vercel) — or use Vercel IPs
4. **Connect → Drivers** → copy connection string
5. Replace `<username>` and `<password>` in `.env.local`

**Collections are auto-created** on first write:

| Collection | Purpose | TTL |
|-----------|---------|-----|
| `events` | User behavior tracking | 90 days |
| `email_logs` | Delivery history | none |
| `payment_transactions` | Stripe/COD records | none |
| `audit_logs` | Admin actions | none |
| `analytics_daily` | Pre-aggregated stats (cron) | none |
| `cart_snapshots` | Abandoned cart recovery | none |
| `sessions` | Visitor session tracking | 90 days |

**Recommended indexes** (auto-created by code where possible):

```javascript
// ─────────────────────────────────────────────
// events
// ─────────────────────────────────────────────
db.events.createIndex({ timestamp: -1 }, { expireAfterSeconds: 7776000 }) // 90d TTL
db.events.createIndex({ session_id: 1 })
db.events.createIndex({ user_id: 1, timestamp: -1 })
db.events.createIndex({ event_type: 1, timestamp: -1 })
db.events.createIndex({ 'properties.productId': 1, timestamp: -1 })

// ─────────────────────────────────────────────
// email_logs
// ─────────────────────────────────────────────
db.email_logs.createIndex({ email: 1, created_at: -1 })
db.email_logs.createIndex({ status: 1, created_at: -1 })
db.email_logs.createIndex({ template: 1, created_at: -1 })

// ─────────────────────────────────────────────
// payment_transactions
// ─────────────────────────────────────────────
db.payment_transactions.createIndex({ provider_txn_id: 1 }, { unique: true })
db.payment_transactions.createIndex({ order_id: 1 })

// ─────────────────────────────────────────────
// audit_logs
// ─────────────────────────────────────────────
db.audit_logs.createIndex({ timestamp: -1 })
db.audit_logs.createIndex({ actor_id: 1, timestamp: -1 })
db.audit_logs.createIndex({ target_id: 1 })
db.audit_logs.createIndex({ action: 1, timestamp: -1 })
db.audit_logs.createIndex({ target_type: 1, target_id: 1 })

// ─────────────────────────────────────────────
// cart_snapshots
// ─────────────────────────────────────────────
db.cart_snapshots.createIndex({ user_id: 1 }, { unique: true })
db.cart_snapshots.createIndex({ recovery_token: 1 }, { unique: true })
db.cart_snapshots.createIndex({ updated_at: -1 })
db.cart_snapshots.createIndex(
  { recovered_at: 1, last_reminder_at: 1 },
  { sparse: true }
)

// ─────────────────────────────────────────────
// sessions
// ─────────────────────────────────────────────
db.sessions.createIndex(
  { session_id: 1 },
  { unique: true, name: 'session_id_unique' }
)
db.sessions.createIndex(
  { user_id: 1, last_seen_at: -1 },
  { sparse: true, name: 'user_recent' }
)
db.sessions.createIndex(
  { ip_hash: 1, last_seen_at: -1 },
  { name: 'ip_recent' }
)
db.sessions.createIndex(
  { visitor_type: 1, last_seen_at: -1 },
  { name: 'type_recent' }
)
db.sessions.createIndex(
  { last_seen_at: 1 },
  { expireAfterSeconds: 7776000, name: 'session_ttl_90d' }
)
```

**Note:** `ensureSessionIndexes()` and `ensureCartIndexes()` create most of these automatically on cold start. Manual creation via `mongosh` is only needed if you want to guarantee they exist **before** the first request.

---

### 5. Upstash Setup (Redis + QStash)

#### 5a. Redis

1. [console.upstash.com](https://console.upstash.com) → **Create Database**
2. Region: closest to you (or match Vercel region)
3. Type: **Regional**
4. Copy from dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Quotas to monitor:**
- Commands per day
- Storage bytes
- Bandwidth

Enable **alerts** in Upstash console if approaching limits.

#### 5b. QStash

Same account → **QStash** tab:

1. Copy **QStash Token** → `QSTASH_TOKEN`
2. Copy **Current Signing Key** → `QSTASH_CURRENT_SIGNING_KEY`
3. Copy **Next Signing Key** → `QSTASH_NEXT_SIGNING_KEY`
4. Set `QSTASH_URL` based on your region:
   - `us-east-1` → `https://qstash-us-east-1.upstash.io`
   - `eu-central-1` → `https://qstash-eu-central-1.upstash.io`

**Quotas:**
- 500 messages/day (free)
- 10K messages/month

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

**Why Gmail over Resend?** Gmail SMTP sends to **any recipient** without domain verification. Free tier: 500/day. Migration path: swap `mailer.ts` to Resend when you hit 500/day or need better analytics.

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

### Create a Super Admin (can change other users' roles)

```sql
UPDATE public.profiles
SET role = 'admin', is_super_admin = true
WHERE email = 'your-email@example.com';
```

**Verify access control:**

| User type | `/admin` access |
|-----------|-----------------|
| Logged out | → `/auth/login` |
| Customer | → `/` |
| Admin | ✅ Full access |
| Super Admin | ✅ Full access + role changes |

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
│   ├── images/
│   │   ├── admin_pages-images/                 # 10 admin screenshots
│   │   ├── customer_facing-images/             # 9 customer screenshots
│   │   ├── email_template_images/              # 7 email screenshots
│   │   └── categories/                         # Category tiles
│   ├── og-image.jpg                            # OpenGraph image
│   ├── manifest.json                           # PWA manifest
│   ├── sw.js                                   # Service Worker
│   ├── offline.html                            # Offline fallback
│   └── site.webmanifest
├── src/
│   ├── actions/                                # Server Actions
│   │   ├── admin-management.ts                 # Super-admin role change
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
│   │   │   │   └── callback/route.ts           # Handles code + token_hash flows
│   │   │   ├── cart/page.tsx
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── featured/page.tsx
│   │   │   ├── new-arrivals/page.tsx
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
│   │   │   ├── profile/page.tsx
│   │   │   ├── wishlist/
│   │   │   │   ├── page.tsx
│   │   │   │   └── WishlistGrid.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   ├── refund/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin/                              # Admin panel (19 pages)
│   │   │   ├── abandoned-carts/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── audit/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── coupons/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── emails/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── exports/
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── print/
│   │   │   │       └── [type]/page.tsx         # NEW in v3.2
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── OrderDetailAdmin.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── payments/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── sessions/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/activity/
│   │   │   │       ├── loading.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── visitors/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
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
│   │   │   │   ├── abandoned-carts/route.ts    # v3.2: fixed param order + throttle on success
│   │   │   │   ├── daily/route.ts              # Combined cron
│   │   │   │   ├── keep-alive/route.ts
│   │   │   │   └── low-stock-alert/route.ts    # v3.2: throttle only on success
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
│   │   │   ├── AbandonedCartsTable.tsx
│   │   │   ├── AdminCharts.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminNotificationsProvider.tsx  # v3.2: editorial toast
│   │   │   ├── AdminShell.tsx
│   │   │   ├── AdminSidebar.tsx                # v3.2: grouped navigation
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── AuditStats.tsx
│   │   │   ├── AuditTable.tsx
│   │   │   ├── CartStats.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── CouponsTable.tsx
│   │   │   ├── CouponStats.tsx
│   │   │   ├── DashboardClient.tsx
│   │   │   ├── DeleteProductButton.tsx
│   │   │   ├── EmailsTable.tsx
│   │   │   ├── EmailStats.tsx
│   │   │   ├── ExportCenter.tsx
│   │   │   ├── ExportPrintView.tsx             # NEW in v3.2
│   │   │   ├── FunnelChart.tsx
│   │   │   ├── LiveUsersWidget.tsx
│   │   │   ├── NewVsReturningChart.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── OrderStatusUpdater.tsx
│   │   │   ├── PaymentDetailsModal.tsx
│   │   │   ├── PaymentsStats.tsx
│   │   │   ├── PaymentsTable.tsx
│   │   │   ├── ProductAnalytics.tsx
│   │   │   ├── ProductsTable.tsx
│   │   │   ├── QuickActionsGrid.tsx
│   │   │   ├── ReportsDashboard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── ReviewAdminStats.tsx
│   │   │   ├── ReviewsAdminTable.tsx
│   │   │   ├── SessionDetail.tsx
│   │   │   ├── UserActivityTimeline.tsx
│   │   │   ├── UserDetailsModal.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   ├── VisitorsStats.tsx
│   │   │   └── VisitorsTable.tsx
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
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── coupons/
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   │   └── queries.ts
│   │   ├── email/
│   │   │   ├── mailer.ts
│   │   │   ├── queries.ts
│   │   │   ├── queue.ts                        # v3.2: throttle + failure handling
│   │   │   ├── render.tsx
│   │   │   ├── types.ts
│   │   │   └── templates/                      # 10 templates (v3.2 redesign)
│   │   │       ├── abandoned-cart.tsx
│   │   │       ├── low-stock-alert.tsx
│   │   │       ├── order-cancelled.tsx
│   │   │       ├── order-delivered.tsx
│   │   │       ├── order-placed.tsx
│   │   │       ├── order-shipped.tsx
│   │   │       ├── payment-confirmed.tsx
│   │   │       ├── payment-failed.tsx
│   │   │       ├── welcome-back.tsx
│   │   │       └── welcome.tsx
│   │   ├── exports/
│   │   │   ├── csv.ts
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── invoice/
│   │   │   └── generate.ts
│   │   ├── orders/
│   │   │   └── queries.ts
│   │   ├── payments/
│   │   │   ├── index.ts
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
│   │   │   ├── admin.ts                        # service-role client
│   │   │   ├── client.ts                       # browser singleton
│   │   │   ├── public.ts                       # ISR-friendly
│   │   │   └── server.ts                       # cookie-aware
│   │   ├── tracking/
│   │   │   ├── client.ts                       # batched SDK
│   │   │   ├── queries.ts
│   │   │   ├── referrer.ts
│   │   │   ├── server-user.ts
│   │   │   ├── session-queries.ts
│   │   │   ├── session-types.ts
│   │   │   └── types.ts
│   │   ├── wishlist/
│   │   │   └── queries.ts
│   │   ├── audit.ts
│   │   ├── env.ts                              # Zod validation
│   │   ├── idempotency.ts                      # Redis + Lua
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

<div align="center">

**📌 End of Part 2 — Continue to Part 3 for Security Checklist, Server Actions API, Database Schema, Performance & SEO, Testing, and CI/CD.**

</div>
```

---

## 🔐 Security Checklist

<details open>
<summary><strong>Authentication & Authorization</strong></summary>

- [x] **RLS enabled** on all 8 Supabase tables
- [x] **`is_admin()` helper** — RLS-safe role check (SECURITY DEFINER)
- [x] **Every privileged Server Action** re-verifies admin role against `profiles` table
- [x] **Never trust client state** for authorization
- [x] **PKCE OAuth** flow with cookie-preserving callback
- [x] **`token_hash` flow** for password reset / email confirm (v3.2 fix — prevents missing session)
- [x] **Open redirect protection** on `next` query param (must start with `/`, not `//`)
- [x] **Email verification** required before access
- [x] **Super admin tier** — role changes require super-admin (checked inside Postgres via `admin_change_user_role` RPC)
- [x] **Role normalization hardened** — whitelist-based migration with backup table

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
- [x] **PDF print route** — admin session verified server-side before rendering
- [x] **CSV export** — 10,000 row cap per export

</details>

<details open>
<summary><strong>Data Integrity</strong></summary>

- [x] **`FOR UPDATE` locks** prevent oversell on concurrent orders
- [x] **Canonical lock ordering** (`product_id ASC`) — prevents deadlocks
- [x] **Idempotency keys** in Redis for every webhook (24h TTL, atomic Lua release)
- [x] **Coupon redemption locks** prevent race conditions
- [x] **One review per user per product** (UNIQUE constraint)
- [x] **Stock deduction inside transaction** — no partial state
- [x] **Atomic coupon + order + provider** — single RPC transaction (v2)
- [x] **Immutability guard** — `orders.items` and `orders.address` cannot be modified after INSERT (trigger-enforced)
- [x] **Unique `provider_txn_id`** in MongoDB — prevents duplicate payment records

</details>

<details open>
<summary><strong>Secrets & Isolation</strong></summary>

- [x] **Service-role key** never reaches browser (`import 'server-only'`)
- [x] **Environment variables** validated at startup (Zod schema, fail fast)
- [x] **CSP headers** on all responses
- [x] **CSRF protection** via Server Actions (built-in)
- [x] **Webhook signature verification** (Stripe + QStash)
- [x] **QStash job verification** — `upstash-signature` header with key rotation support
- [x] **IP hashing** (SHA-256 + salt) — raw IPs never stored
- [x] **No PII in logs** — only hashed identifiers

</details>

<details open>
<summary><strong>Rate Limiting & Abuse Prevention</strong></summary>

- [x] **Tiered limiters** (auth / admin / orders / cart / search / track / chat / general)
- [x] **Fail-open behavior** — site stays up if Redis is down
- [x] **Sliding-window algorithm** — no burst at boundaries
- [x] **Cron authentication** via `CRON_SECRET`
- [x] **Per-user coupon limits** (default: 1)
- [x] **AI chatbot rate limit** — 20 messages/min/IP
- [x] **Rate limit headers** in 429 responses (`X-RateLimit-*`, `Retry-After`)

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

</details>

<details open>
<summary><strong>AI Chatbot Security</strong></summary>

- [x] **System prompt server-side** — client cannot modify
- [x] **Role whitelist** — only `user` and `assistant` accepted (Zod enum)
- [x] **Read-only tools** — no DB writes possible
- [x] **RLS-enforced order access** — user sees only own orders
- [x] **Fail-closed** — returns 503 if `GROQ_API_KEY` missing
- [x] **Max 3 tool calls per turn** — `stopWhen: stepCountIs(3)`
- [x] **Streaming abort** — `AbortController` when panel closes
- [x] **Session-scoped history** — `sessionStorage` (cleared when tab closes)

</details>

<details open>
<summary><strong>PDF Print Export Security</strong></summary>

- [x] **Admin session verification** — server-side check before render
- [x] **Type whitelist** — only `orders`, `payments`, `emails`, `users`, `audit` accepted
- [x] **Filter-aware** — date range, status, provider preserved
- [x] **No PII leak** — only authorized admins can access print routes
- [x] **No external dependencies** — no Puppeteer, no headless browser
- [x] **Row limits** — 10,000 max per export (same as CSV)

</details>

---

## 🔌 Server Actions API

All privileged operations go through Next.js Server Actions with strict authorization and Zod validation.

### Customer Actions

| Action | File | Auth | Purpose |
|--------|------|------|---------|
| `placeOrder(items, address, method, couponCode?)` | `actions/placeOrder.ts` | User | Atomic order + stock deduction + coupon redemption + provider tagging |
| `confirmPayment(orderId, intentId)` | `actions/confirmPayment.ts` | User | Stripe payment verification (fallback for webhooks) |
| `submitReview(input)` | `actions/reviews.ts` | User | Create or update product review (resets to pending) |
| `validateCoupon(code, subtotal)` | `actions/coupons.ts` | User | Check coupon validity |
| `toggleWishlist(productId)` | `actions/wishlist.ts` | User | Add/remove from wishlist |
| `mergeWishlist(productIds[])` | `actions/wishlist.ts` | User | Merge guest wishlist on login |

### Admin Actions

| Action | File | Auth | Purpose |
|--------|------|------|---------|
| `updateOrderStatus(orderId, status)` | `actions/updateOrderStatus.ts` | Admin | Whitelisted status transitions + email trigger |
| `refundPayment(orderId)` | `actions/refundPayment.ts` | Admin | Stripe refund + order update + audit log |
| `resendOrderEmail(orderId, template)` | `actions/resendOrderEmail.ts` | Admin | Manual email resend with correct payment provider + discount |
| `updateReviewStatus(id, status)` | `actions/reviews.ts` | Admin | Approve/reject review + audit log |
| `deleteReview(id)` | `actions/reviews.ts` | Admin | Delete review + audit log |
| `createCoupon(input)` | `actions/coupons.ts` | Admin | Create coupon + audit log |
| `updateCoupon(id, input)` | `actions/coupons.ts` | Admin | Update coupon + audit log |
| `deleteCoupon(id)` | `actions/coupons.ts` | Admin | Delete coupon + audit log |
| `toggleCouponActive(id, bool)` | `actions/coupons.ts` | Admin | Enable/disable coupon |

### Super Admin Actions

| Action | File | Auth | Purpose |
|--------|------|------|---------|
| `changeUserRole(userId, role)` | `actions/admin-management.ts` | Super Admin | Promote/demote user (verified inside Postgres via RPC) |

### Guarantees

- **Re-authenticate** on every call — Server Actions are public POST endpoints
- **Authorize against DB state** — role checks against `profiles`, not JWT claims
- **Zod validation** on every argument
- **Fail closed** — thrown errors surface as toasts on the client
- **Audit logged** — every privileged mutation writes to MongoDB `audit_logs`

---

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
| `/api/cron/abandoned-carts` | GET | Cron-secret | Abandoned cart reminders (v3.2: fixed) |
| `/api/cron/low-stock-alert` | GET | Cron-secret | Low stock alerts (v3.2: throttle on success) |
| `/api/cron/keep-alive` | GET | Cron-secret | DB keep-alive ping |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (or intentional no-op) |
| 400 | Bad request (invalid JSON, missing fields) |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Rate Limit Headers

Rate-limited responses include:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1728740400000
Retry-After: 45
```

---

## 📊 Database Schema

**8 Supabase tables + 7 MongoDB collections + 10 PostgreSQL RPCs.**

**No overlap** — each table/collection has a single owner:
- **Supabase** owns transactional data (ACID, RLS)
- **MongoDB** owns analytical/append-only data (high volume)
- **Redis** owns ephemeral state (rate limits, idempotency, cache)

---

### Supabase Tables (8)

#### 1. `products`

Catalog of items for sale.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `name` | `text` | NOT NULL |
| `description` | `text` | |
| `price` | `numeric` | PKR |
| `compare_at_price` | `numeric` | For discount display |
| `category` | `text` | Sub-category (e.g., "Classic Fit") |
| `category_main` | `text` | Main category (e.g., "Suits") |
| `stock` | `int4` | DEFAULT 0, decremented atomically |
| `is_active` | `bool` | DEFAULT true, storefront visibility |
| `is_new_arrival` | `bool` | DEFAULT false, badge |
| `is_featured` | `bool` | DEFAULT false, homepage highlight |
| `images` | `text` | JSON array of URLs (or PG array literal) |
| `created_at` | `timestamptz` | DEFAULT now() |
| `updated_at` | `timestamptz` | DEFAULT now() |

**RLS policies:**
- Anyone reads `is_active = true`
- Admins read all
- Admins insert/update/delete

**Indexes:**
- `idx_products_active_featured_created` — Partial: featured + created_at DESC
- `idx_products_active_new_arrival_created` — Partial: new arrivals
- `idx_products_category_active_created` — Category pages
- `idx_products_active_created` — General listing
- `idx_products_name_trgm` — GIN trigram for `ILIKE '%q%'`
- `idx_products_active` — Admin filter

---

#### 2. `orders`

Order headers. Denormalizes `user_email` for query speed.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id`, `ON DELETE CASCADE` |
| `user_email` | `text` | Denormalized for admin queries |
| `items` | `jsonb` | **Immutable snapshot** of items |
| `address` | `jsonb` | **Immutable snapshot** of shipping address |
| `subtotal` | `int4` | |
| `shipping` | `int4` | |
| `discount_amount` | `numeric` | Coupon discount |
| `coupon_code` | `text` | Applied coupon code |
| `total` | `int4` | = subtotal + shipping − discount |
| `status` | `text` | `pending` / `processing` / `shipped` / `delivered` / `cancelled` |
| `payment_status` | `text` | `pending` / `completed` / `failed` / `refunded` |
| `payment_method` | `text` | `cod` / `stripe` (legacy, kept for compat) |
| `payment_provider` | `text` | `cod` / `stripe` / `paypal` (extensible) |
| `payment_intent_id` | `text` | Stripe PI ID |
| `payment_metadata` | `jsonb` | Full Stripe payload |
| `paid_at` | `timestamptz` | |
| `created_at` | `timestamptz` | DEFAULT now() |

**Immutability guard:** A `BEFORE UPDATE` trigger (`trg_orders_snapshot_immutable`) prevents modification of `items` or `address` after INSERT. Uses `WHEN` clause for zero overhead on normal updates.

**RLS policies:**
- Users read own orders (`user_id = auth.uid()`) OR admin
- Users insert own orders only
- Only admins update (status changes)
- Only admins delete

**Indexes:**
- `idx_orders_user_created` — Customer order history
- `idx_orders_status_created` — Admin filter
- `idx_orders_created` — Admin sort
- `idx_orders_created_range` — Date-range queries
- `idx_orders_payment_provider` — Payments dashboard
- `idx_orders_payment_status` — Partial: pending payments

---

#### 3. `order_items`

Line items. Denormalizes product name + price at order time.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `order_id` | `uuid` | FK → `orders`, `ON DELETE CASCADE` |
| `product_id` | `uuid` | FK → `products` |
| `product_name` | `text` | Snapshot (immutable) |
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

**Realtime:** ✅ Enabled (v3.2 — for real-time item updates)

---

#### 4. `profiles`

Extends `auth.users` with app-specific fields.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, FK → `auth.users.id`, `ON DELETE CASCADE` |
| `full_name` | `text` | |
| `email` | `text` | UNIQUE, denormalized from `auth.users` |
| `phone` | `text` | |
| `role` | `text` | DEFAULT 'customer', CHECK `IN ('customer', 'admin')` |
| `is_super_admin` | `bool` | DEFAULT false — can change roles |
| `address_line1` | `text` | |
| `address_line2` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `pincode` | `text` | |
| `last_login_at` | `timestamptz` | Last successful login |
| `welcome_back_sent_at` | `timestamptz` | Throttle for welcome-back emails |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Auto-creation:** `handle_new_user()` trigger fires on `auth.users` INSERT.

**RLS policies:**
- Users read own profile OR admin
- Users insert own profile (trigger runs as service_role — bypasses)
- Users update own profile OR admin
- Only admins delete

**Indexes:**
- `idx_profiles_created` — Admin user list sort
- `idx_profiles_last_login` — Partial: `(last_login_at DESC NULLS LAST)`

**Role normalization:** Legacy `role = 'user'` values were migrated to `'customer'` via `20261016_normalize_user_roles.sql`. A backup table (`_role_normalization_backup`) preserves old values. The migration is:
- **Whitelist-based** — only touches known-legacy values (`user`, `member`, `guest`, `''`)
- **Reversible** — backup table allows rollback
- **Atomic** — wrapped in a `DO $$` block
- **Fails loudly** — aborts if unknown roles exist after normalization

---

#### 5. `product_reviews`

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
| `comment` | `text` | 10–2000 chars |
| `status` | `text` | `pending` / `approved` / `rejected` |
| `is_verified_purchase` | `bool` | Auto-detected |
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

**Triggers:** `trg_product_reviews_updated_at` (auto-update `updated_at` on UPDATE).

**Indexes:**
- `idx_reviews_product_approved` — Partial: approved reviews
- `idx_reviews_status` — Admin moderation
- `idx_reviews_user` — My reviews

---

#### 6. `wishlists`

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

**Indexes:**
- `idx_wishlists_user` — User's wishlist page
- `idx_wishlists_product` — "How many users wishlisted this?"

---

#### 7. `coupons`

Discount codes with all constraint types.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `code` | `text` | UNIQUE, uppercase |
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
- `idx_coupons_code_active` — Partial: active coupons
- `idx_coupons_active_until` — `(is_active, valid_until)`

**Triggers:** `trg_coupons_updated_at` (auto-update `updated_at`).

---

#### 8. `coupon_redemptions`

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
- `idx_redemptions_coupon` — Usage stats

---

### Supabase RPCs (10)

#### `is_admin()`

RLS-safe role check. `SECURITY DEFINER`, `STABLE`, `SET search_path`.

**Why `SECURITY DEFINER`?** Reads `profiles`, which itself has RLS. Without it, the function would recurse infinitely.

**Why `STABLE`?** Postgres caches the result within a single query.

---

#### `place_order_atomic` (v2)

**Signature:**
```sql
place_order_atomic(
  p_user_id        uuid,
  p_user_email     text,
  p_items          jsonb,
  p_address        jsonb,
  p_coupon_code    text DEFAULT NULL,
  p_payment_method text DEFAULT 'cod'
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
3. If coupon set: lock coupon row (`FOR UPDATE`), re-validate, increment `times_used`
4. Insert order with `coupon_code`, `discount_amount`, `payment_method`, `payment_provider`
5. Insert `order_items`
6. Insert `coupon_redemptions` (if coupon applied)
7. Return summary

**Failure policy:** If the coupon is invalid for any reason (expired, used up, min order not met), the order **still succeeds without the discount**. Only hard DB errors abort the transaction.

**Security:** `SECURITY DEFINER`, `SET search_path = public, pg_temp`, `REVOKE ALL FROM PUBLIC`, `GRANT EXECUTE TO service_role`.

**v2 vs v1:**
- **v1:** Order + stock in one transaction. Coupon + provider were **separate** — a failure left inconsistent state.
- **v2:** All four concerns in **one transaction**. No partial state possible.

---

#### `get_dashboard_stats()`

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

#### `get_sales_report(from, to)`

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

---

#### `get_product_sales_stats(limit)`

**Returns:**
```json
{
  "top_products": [{ "id", "name", "units_sold", "revenue", "order_count", "avg_unit_price" }],
  "by_category": [{ "category", "units_sold", "revenue", "order_count" }],
  "global": {
    "total_units_sold": 312,
    "total_revenue": 4521000,
    "total_orders_with_items": 187,
    "avg_units_per_order": 1.67
  }
}
```

**Merged with:** MongoDB `events` (views, cart adds) in `getProductPerformance()` for the abandoned flag and conversion rate.

---

#### `get_product_review_stats(product_id)`

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

#### `get_products_review_stats(ids[])`

**Returns:**
```json
{
  "550e8400-...": { "average_rating": 4.5, "total_count": 24 },
  "660e8400-...": { "average_rating": 5.0, "total_count": 3 }
}
```

**Use case:** Product grid needs ratings for 40 products. One call instead of 40.

---

#### `validate_coupon(code, user_id, subtotal)`

**Returns (valid):**
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

**Returns (invalid):**
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

#### `redeem_coupon_atomic(code, user_id, order_id, subtotal)`

**Standalone atomic coupon redemption** (kept for backward compatibility).

**Note:** In v3.1+, this RPC is **no longer used by `placeOrder`**. Coupon redemption happens **inside `place_order_atomic` v2**. This function remains for backward compatibility with external callers.

---

#### `admin_change_user_role(target_user_id, new_role)`

**Super-admin only.** Authorization enforced **inside Postgres**.

**Rules:**
1. Caller (`auth.uid()`) must be super admin
2. Target must not be self (can't demote self)
3. Target must not be another super admin
4. `p_new_role` must be `'admin'` or `'customer'`

**Why inside Postgres?** The JS check in `changeUserRole` is a fast-fail optimization. The authoritative check is here. Even if a JS bypass existed, this RPC would reject.

---

### MongoDB Collections (7)

#### `events`

User behavior tracking.

**Document shape:**
```typescript
{
  _id: ObjectId,
  user_id: string | null,
  session_id: string,
  event_type: 'page_view' | 'product_view' | 'add_to_cart' | ... ,
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

**Indexes:** `timestamp` (TTL 90d), `session_id`, `user_id + timestamp`, `event_type + timestamp`, `properties.productId + timestamp`.

**13 event types:** `page_view`, `product_view`, `add_to_cart`, `remove_from_cart`, `checkout_started`, `checkout_completed`, `order_placed`, `login`, `signup`, `search`, `wishlist_add`, `wishlist_remove`, `share_product`.

---

#### `sessions`

Visitor session documents. One document per browser tab session.

**Document shape:**
```typescript
{
  _id: ObjectId,
  session_id: string,              // Random UUID from client cookie
  user_id: string | null,          // null for guests
  user_email: string | null,
  user_name: string | null,
  visitor_type: 'guest' | 'new' | 'returning' | 'admin',
  ip_hash: string,                 // SHA-256(salt + IP)
  country: string | null,          // From Vercel headers
  city: string | null,
  device: { type, os, browser },
  referrer: string | null,
  referrer_source: string,         // 'google' | 'instagram' | 'direct' | ...
  first_seen_at: Date,
  last_seen_at: Date,
  duration_ms: number,
  page_view_count: number,
  product_view_count: number,
  cart_add_count: number,
  order_count: number,
  revenue: number,
  paths_visited: string[],         // Unique paths this session
  products_viewed: string[],       // Unique product IDs
  orders_placed: string[],         // Order IDs
  ended_with: 'order' | 'abandon' | 'bounce' | null,
}
```

**Indexes:** `session_id` UNIQUE, `user_id + last_seen_at` sparse, `ip_hash + last_seen_at`, `visitor_type + last_seen_at`, `last_seen_at` (TTL 90d).

**`ended_with` heuristic:**
- `order` — if `order_count > 0`
- `abandon` — if `duration_ms >= 30_000`
- `bounce` — otherwise

**Used by:** `/admin/visitors`, `/admin/sessions`, `/admin/users/[id]/activity`, `LiveUsersWidget`, `NewVsReturningChart`.

---

#### `email_logs`

Every email attempted.

**Document shape:**
```typescript
{
  _id: ObjectId,
  user_id: string | null,
  email: string,
  template: string,        // 'welcome' | 'order-placed' | ...
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'opened' | 'bounced',
  provider_message_id: string | null,
  error: string | null,
  metadata: Record<string, unknown>,
  created_at: Date,
  updated_at: Date,
}
```

**Lifecycle:**
```
queued → sent (via QStash job) → delivered (via Resend webhook)
                              → opened (tracking pixel)
queued → failed (on SMTP error, up to 3 retries)
queued → failed (if QStash publish throws — v3.1 fix)
```

**v3.2 fix:** Cron throttle only set on real success.

---

#### `payment_transactions`

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
  card_last4?: string | null,
  card_brand?: string | null,
  webhook_events: Array<{
    event: string,
    at: Date,
    raw: unknown
  }>,
  created_at: Date,
  updated_at: Date,
}
```

**Indexes:** `provider_txn_id` UNIQUE (prevents duplicate records), `order_id`.

**Why `webhook_events` array?** Full audit trail for debugging. If Stripe claims a webhook fired and we disagree, we have the raw payload.

**Duplicate guard:** Before inserting, we check if a document with the same `provider_txn_id` exists. Handles the race between client-side `confirmPayment` and the webhook.

---

#### `audit_logs`

Admin actions timeline.

**Document shape:**
```typescript
{
  _id: ObjectId,
  actor_id: string,
  actor_email: string,
  action: string,        // 'order.refund' | 'coupon.create' | ...
  target_type: string,   // 'order' | 'coupon' | 'product' | 'user' | 'review'
  target_id: string,
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
  ip_hash: string | null,
  metadata: Record<string, unknown>,
  timestamp: Date,
}
```

**Indexes:** `timestamp`, `actor_id + timestamp`, `target_type + target_id`, `action + timestamp`.

**No TTL** — kept indefinitely for compliance.

**Actions logged:**
- `payment.refund`
- `coupon.create`, `coupon.update`, `coupon.delete`
- `user.change_role`
- `product.create`, `product.update`, `product.delete`
- `review.approved`, `review.rejected`, `review.delete`

---

#### `cart_snapshots`

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

**Indexes:** `user_id` UNIQUE, `recovery_token` UNIQUE, `updated_at`, `recovered_at + last_reminder_at` sparse.

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

**Lifecycle:**
1. Client syncs cart on change (debounced 2s)
2. If cart becomes empty → document deleted
3. Cron runs hourly → finds eligible carts → sends recovery email + 5% coupon
4. Order placed → `markCartRecovered` sets `recovered_at`, `recovered_order_id`

---

#### `analytics_daily`

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

**Indexes:** `date` UNIQUE.

**Status:** Reserved for future optimization. Current analytics queries MongoDB `events` and `sessions` collections directly.

---

### Database Ownership Boundaries

**Rule:** If losing a row breaks money or trust → Supabase. If losing a row just makes a dashboard slightly wrong → MongoDB.

| Data | Where | Why |
|------|-------|-----|
| Products | Supabase | Transactional, ACID, RLS |
| Orders | Supabase | Money + trust |
| Order items | Supabase | Referential integrity |
| Profiles | Supabase | RLS, auth integration |
| Reviews | Supabase | Moderation, RLS |
| Wishlists | Supabase | Per-user, RLS |
| Coupons | Supabase | Atomic redemption |
| Coupon redemptions | Supabase | Audit trail |
| Events | MongoDB | High-volume, append-only |
| Sessions | MongoDB | High-volume, TTL |
| Email logs | MongoDB | Append-only, no ACID needed |
| Payment transactions | MongoDB | Audit trail + webhook payloads |
| Audit logs | MongoDB | Append-only, no TTL |
| Cart snapshots | MongoDB | Mutable state, recovery focus |
| Analytics daily | MongoDB | Pre-aggregated, optional |

**No overlap. No confusion.**

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
| **Editorial redesign** | Consistent paint, fewer reflows |
| **Removed edge fades** | Cleaner scroll cut-off |
| **Zero-dependency PDF print** | No Puppeteer / Chrome overhead |
| **Custom CSV builder** | No external library |

### Core Web Vitals

**Desktop:**
- LCP: **0.5s** 🟢
- FCP: **0.3s** 🟢
- TBT: **100ms** 🟢
- CLS: **0** 🟢

**Mobile:**
- LCP: **3.5s** 🟡
- FCP: **0.9s** 🟢
- TBT: **250ms** 🟢
- CLS: **0** 🟢

**Why mobile LCP is 3.5s:** Client-side hydration + Framer Motion animations on mid-range phones. Optimized as far as possible without dropping interactivity.

### SEO

- ✅ **Dynamic `robots.txt`** — Blocks admin/checkout from crawlers
- ✅ **Auto-generated `sitemap.xml`** — Products + categories + static pages (hourly revalidation)
- ✅ **JSON-LD schemas:**
  - `Organization` — Brand info
  - `WebSite` — Search action
  - `Product` — With offers, aggregateRating, reviews
  - `BreadcrumbList` — Navigation path
- ✅ **Per-page dynamic metadata** — Product names in OG + Twitter cards
- ✅ **Canonical URLs** on every dynamic route
- ✅ **Rich Results eligible** — Google stars in search from reviews
- ✅ **Semantic HTML** — `<main>`, `<nav>`, `<article>`, proper heading hierarchy
- ✅ **Sitemap submitted** to Google Search Console

### Image Optimization

- **AVIF + WebP** formats served based on `Accept` header
- **Responsive sizes:** 640, 750, 828, 1080, 1200, 1920, 2048
- **Quality values:** 70, 75, 80, 85
- **Cache TTL:** 60 days
- **Remote patterns:** Supabase Storage + placehold.co

---

## 🧪 Testing

### Unit Tests (Vitest + RTL)

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:ui       # Interactive UI
```

**53 tests** across 7 files:

| File | Tests | Coverage |
|------|-------|----------|
| `csv.test.ts` | 12 | CSV builder (escaping, quotes, newlines, BOM, filenames) |
| `utils.test.ts` | 11 | `parseProductImages` (JSON, PG arrays, plain strings, edge cases) |
| `ratelimit.test.ts` | 10 | Limiter tiers + client key resolution |
| `payments-cod.test.ts` | 6 | COD provider contract (intent, retrieve, capture, refund, webhook) |
| `ProductCard.test.tsx` | 6 | Cart interactions, badges, stock states, quantity increment |
| `idempotency.test.ts` | 5 | Redis lock + result cache + Lua release |
| `PaymentOption.test.tsx` | 3 | Selection, disabled state, click handler |

**Coverage thresholds** (enforced in CI):
- Lines: 55%
- Functions: 55%
- Branches: 50%
- Statements: 55%

**Exclusions** (integration-covered by E2E):
- `src/lib/supabase/**` — DB clients
- `src/providers/**` — React Contexts
- `src/actions/**` — Server Actions
- `src/app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### E2E Tests (Playwright)

```bash
npm run test:e2e          # Headless
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:report   # View last HTML report
```

**21 tests** across 4 specs:

| Suite | Tests | Focus |
|-------|-------|-------|
| `public-pages.spec.ts` | 9 | Homepage, products, category, featured, new arrivals, cart empty, 404, robots.txt, sitemap.xml |
| `auth-guards.spec.ts` | 6 | Redirects for /admin, /orders, /checkout, /profile + login/signup page rendering |
| `cart-flow.spec.ts` | 4 | Add to cart, view, update qty, remove |
| `navigation.spec.ts` | 2 | Navbar links + search modal open/close |

**Config:**
- Chromium only
- Sequential (`workers: 1`) — shared auth state
- Retries: 3 in CI, 1 local
- 90s timeout (CI cold starts)
- `webServer` auto-starts app
- Trace + screenshot + video on failure

### Testing AI Chatbot

**Philosophy:** The AI chatbot is **non-deterministic** — the same input produces different outputs. We test **boundaries**, not content.

| What we test | What we don't test |
|--------------|-------------------|
| Zod schema accepts `user`/`assistant` only | LLM's actual response text |
| Zod schema rejects `system` role | Tool call order |
| Message count ≤ 20 | Chat content |
| Message length ≤ 2000 | Specific prices mentioned |
| Rate limit returns 429 | Streaming chunk timing |
| Tool schemas validate input | |
| System prompt contains "decline" | |
| Tools are read-only (no mutation verbs) | |

**Manual verification before releases:**
1. Open chat widget
2. Click "Show me suits under ₹25,000"
3. Verify streaming response with product names + prices
4. Try prompt injection — LLM should decline
5. Send 21 messages fast → 21st returns 429

### Testing PWA

- **Static tests** — Verify `sw.js` content (routes skipped, cache version)
- **E2E tests** — Verify SW registers in real browser
- **Manual tests** — Offline mode via DevTools

### Testing Atomic Operations

**Three layers:**
1. **Unit tests** — Zod validation (input shape, quantity limits, address fields)
2. **Manual concurrency script** — `scripts/test-concurrency.ts`:
   - 10 parallel orders, stock = 5 → exactly 5 succeed
   - 20 parallel coupon redemptions, limit = 3 → exactly 3 succeed
3. **Post-deploy smoke test** — Verify a real order succeeds end-to-end

### Testing Immutability Guards

**Manual SQL test** (run in Supabase SQL Editor on dev):

```sql
-- Create a test order
INSERT INTO public.orders (user_id, user_email, items, address, subtotal, shipping, total)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'test@example.com',
        '[{"product_id": "abc", "quantity": 1}]'::jsonb,
        '{"full_name": "Test", "city": "Karachi"}'::jsonb,
        100, 100, 200)
RETURNING id;

-- Try to modify items — should FAIL
UPDATE public.orders SET items = '[]'::jsonb WHERE id = '<test-id>';
-- Expected: ERROR: orders.items is an immutable snapshot

-- Try to update status — should SUCCEED
UPDATE public.orders SET status = 'processing' WHERE id = '<test-id>';
-- Expected: UPDATE 1
```

### Test Pyramid

```
       ┌─────────────────────┐
       │   E2E Tests (21)    │  ~90s
       │   Playwright        │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │  Component Tests    │  Folded into unit suite
       │  React Testing Lib  │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │   Unit Tests (53)   │  ~30s
       │   Vitest            │
       └─────────────────────┘
```

**Distribution:**
- **Unit tests (70%)** — Fast, isolated, high coverage
- **E2E tests (30%)** — Slow, integrated, user-facing flows
- **No separate integration layer** — Folded into E2E for practicality

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

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Effect:** If you push twice rapidly, only the latest runs. Saves CI minutes.

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
GROQ_API_KEY                     # ← New in v3.1
```

> **Safe?** Yes. GitHub secrets are encrypted at rest (AES-256), masked in logs, and never exposed to fork PRs.

### Keep-Alive Workflow

The repo includes `.github/workflows/keep-alive.yml`:

```yaml
on:
  schedule:
    - cron: '0 0,12 * * *'    # Twice daily
  workflow_dispatch:          # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping keep-alive endpoint
        run: |
          curl -sS --max-time 30 -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            "${{ secrets.SITE_URL }}/api/cron/keep-alive"
```

**Why?** Free-tier databases pause after inactivity:
- Supabase Free: pauses after 7 days
- MongoDB M0: pauses after 60 days

Pinging twice daily keeps them warm.

### Build Verification

Every commit must pass:
- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — clean
- [ ] `npm run test` — 53 unit tests pass
- [ ] `npm run build` — succeeds locally
- [ ] `npm run test:e2e` — 21 E2E tests pass (CI only)

---

<div align="center">

**📌 End of Part 3 — Continue to Part 4 for Troubleshooting, FAQ, Roadmap, Changelog, Deployment, Contributing, and Contact.**

</div>
```

---
## 🐛 Troubleshooting

<details>
<summary><strong>Build fails: Missing environment variables</strong></summary>

**Cause:** One or more required env vars not set in `.env.local`.

**Fix:** The error message lists exactly which are missing. Compare against `.env.example`. All required variables are validated by Zod at startup.

</details>

<details>
<summary><strong>Google OAuth redirects to login or fails</strong></summary>

**Cause:** Redirect URL not whitelisted in Supabase.

**Fix:** Supabase → Authentication → URL Configuration → add both:
- `http://localhost:3000/auth/callback`
- `https://your-domain.vercel.app/auth/callback`

</details>

<details>
<summary><strong>Password reset link → "session missing" or stuck on login</strong></summary>

**Cause (fixed in v3.2):** Old flow used `code`-based exchange which left users without a session.

**Fix:** The `/auth/callback` route now handles `token_hash` flow via `supabase.auth.verifyOtp({ token_hash, type })`. Ensure:
1. Supabase → Authentication → URL Configuration → add `https://your-domain.vercel.app/auth/reset-password`
2. Email templates use `{{ .TokenHash }}` (not legacy `{{ .ConfirmationURL }}` — or update the redirect URL)

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
- Check `X-RateLimit-*` headers in 429 responses for details

</details>

<details>
<summary><strong>Real-time updates not working</strong></summary>

**Cause:** Realtime not enabled on `orders` (or `order_items`) table.

**Fix:** Supabase → Database → Replication → enable both:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
```

**Verify:** Admin → open dashboard → place a test order from another browser. The admin bell should pulse and a toast should appear.

</details>

<details>
<summary><strong>Stripe webhook 401 Invalid signature</strong></summary>

**Cause:** `STRIPE_WEBHOOK_SECRET` mismatch.

**Fix:**
- Stripe Dashboard → Developers → Webhooks → copy signing secret
- For local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Ensure the webhook endpoint URL matches your deployment (https, no trailing slash)

</details>

<details>
<summary><strong>QStash: "endpoint resolves to a loopback address"</strong></summary>

**Cause:** QStash can't reach `localhost`.

**Fix:** The email queue auto-detects dev mode (`NEXT_PUBLIC_SITE_URL` contains `localhost`/`127.0.0.1`/`192.168`/`.local`) and sends directly via Gmail SMTP. No tunnel needed.

**To test QStash locally (optional):** Use ngrok/cloudflared and update `NEXT_PUBLIC_SITE_URL`.

</details>

<details>
<summary><strong>Emails not arriving</strong></summary>

**Checklist:**
1. Gmail app password set correctly (spaces included)?
2. 2-Step Verification enabled on Gmail?
3. Check MongoDB `email_logs` — `status: sent` or `failed`?
4. Check spam folder
5. Check terminal for `[email] sent` or `[email] failed` logs
6. **v3.2:** If log status is `queued` for more than 5 minutes, check QStash dashboard → Logs → Delivery attempts

</details>

<details>
<summary><strong>Cron job not firing / throttle skip</strong></summary>

**Symptom (v3.2):** `{"success":true,"skipped":true,"reason":"throttled","minutesSince":11}`

**Cause:** Throttle window active (50 min for carts, 12h for low-stock).

**Fix:**
- Wait for throttle to expire
- To force-run: delete throttle key from Redis
  ```
  DEL throttle:cron:abandoned-carts
  DEL throttle:alert:low-stock
  ```

**v3.2 fix:** Throttle is **only set on real success**. If `queueEmail` fails, throttle stays unset — next cron run retries automatically.

**How to test locally:**
```bash
curl -X GET https://your-domain.vercel.app/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

</details>

<details>
<summary><strong>Session lost after refresh</strong></summary>

**Cause:** Middleware not refreshing cookies.

**Fix:** Ensure `src/proxy.ts` uses the cookie-preserving `redirectWithCookies` helper. Cookies are set on both the request AND the redirect response.

</details>

<details>
<summary><strong>"Invalid Refresh Token" spam</strong></summary>

**Cause:** Multiple Supabase clients or missing middleware.

**Fix:**
- Verify `src/lib/supabase/client.ts` exports a **singleton** (uses `let client: SupabaseClient | null`)
- Verify `src/proxy.ts` runs on all pages (matcher config excludes only static assets)
- Clear cookies and re-login

</details>

<details>
<summary><strong>Build fails: "Cookies can only be modified in a Server Action"</strong></summary>

**Cause:** Server Component trying to write cookies.

**Fix:** `src/lib/supabase/server.ts` should wrap `cookieStore.set` in `try/catch` (silently ignore in RSC context).

</details>

<details>
<summary><strong>"middleware is deprecated" warning on Next.js 16</strong></summary>

**Cause:** Next.js 16 renamed `middleware.ts` → `proxy.ts`.

**Fix:** Already handled — file is `src/proxy.ts` and exports `proxy` (not `middleware`).

</details>

<details>
<summary><strong>E2E tests fail with ECONNREFUSED</strong></summary>

**Cause:** Web server not started.

**Fix:** `playwright.config.ts` has `webServer` configured. Ensure `npm run start` works locally:

```bash
npm run build
npm run start
# In another terminal:
npm run test:e2e
```

</details>

<details>
<summary><strong>Vercel cron limit reached</strong></summary>

**Cause:** Hobby plan allows 1 cron per project.

**Fix:**
- **Option A:** Upgrade to Vercel Pro ($20/mo)
- **Option B:** Use external cron (cron-job.org, free) to hit `/api/cron/daily`
- **Option C:** Use GitHub Actions schedule (already have `keep-alive.yml` as example)

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

If `openai/gpt-oss-120b` isn't listed, use another model from the response in `src/lib/ai/groq.ts` (`AI_MODELS.QUALITY`).

**Known regional variation (Oct 2026):** DMM (Saudi) region accounts have `openai/gpt-oss-*` instead of `llama-*`.

</details>

<details>
<summary><strong>AI chatbot rate limit (429)</strong></summary>

**Cause:** More than 20 messages/minute from same IP.

**Fix:** Wait 60 seconds. Rate limit resets automatically. Check `Retry-After` header.

</details>

<details>
<summary><strong>PWA install prompt not showing</strong></summary>

**Cause:** Various.

**Checklist:**
1. Running on HTTPS (required for PWA)
2. Not already installed (check `display-mode: standalone`)
3. Not dismissed in last 30 days (check localStorage `vestior-pwa-install-dismissed`)
4. Browser supports `beforeinstallprompt` (Chrome, Edge — not Safari)
5. Waited at least 20 seconds (auto-show delay)

**iOS Safari:** No `beforeinstallprompt`. Use Share → "Add to Home Screen".

</details>

<details>
<summary><strong>Service worker not updating</strong></summary>

**Cause:** Browser caches old service worker.

**Fix:**
1. Bump `CACHE_VERSION` in `public/sw.js`
2. Hard refresh (Ctrl+Shift+R)
3. Or: DevTools → Application → Service Workers → Unregister, then reload
4. Or: DevTools → Application → Storage → Clear site data

</details>

<details>
<summary><strong>PDF print view shows dark background</strong></summary>

**Cause:** Browser's print settings override.

**Fix:**
- Chrome: Print dialog → "More settings" → uncheck "Background graphics" or set to **ON** (either works — our CSS forces white)
- Firefox: Print dialog → uncheck "Print backgrounds"
- Verify `@media print` styles are loaded (`body { background: white !important }`)

**v3.2 note:** Print CSS uses `visibility: hidden` on all body children, then `visibility: visible` on `#export-print-area` and its descendants. This ensures only the print area shows.

</details>

<details>
<summary><strong>PDF export missing rows on multi-page print</strong></summary>

**Cause:** Table header doesn't repeat.

**Fix:** Our print CSS uses `thead { display: table-header-group }` — headers auto-repeat on every page. If you're not seeing this:
- Verify your browser is Chrome/Firefox (both support it)
- Reduce row height (some browsers fail with very tall rows)
- Check `tr { page-break-inside: avoid }` is applied

</details>

<details>
<summary><strong>Editorial UI feels broken / missing styles</strong></summary>

**Cause:** Tailwind v4 not loading, or cache stale.

**Fix:**
1. `rm -rf .next && npm run dev`
2. Verify `postcss.config.mjs` has `@tailwindcss/postcss`
3. Verify `src/app/globals.css` has `@import "tailwindcss"`
4. Hard refresh browser (Ctrl+Shift+R)

</details>

<details>
<summary><strong>Currency symbol shows as "?" in CSV export</strong></summary>

**Cause:** Excel opens CSV without UTF-8 detection.

**Fix:** Already handled — our CSV builder prepends a UTF-8 BOM (`\uFEFF`). Excel will detect UTF-8 and display ₹ correctly.

**If still broken:**
- Open Excel → Data → From Text/CSV → choose "UTF-8" encoding
- Or open with Google Sheets (auto-detects)

</details>

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 100+ | ✅ Full |
| Firefox | 100+ | ✅ Full |
| Safari | 15+ | ✅ Full |
| Edge | 100+ | ✅ Full |
| Safari iOS | 15+ | ✅ Full (PWA manual install) |
| Chrome Android | 100+ | ✅ Full (PWA install prompt) |
| Samsung Internet | 18+ | ✅ Full |

**Not supported:** Internet Explorer (any version).

**Modern features used:**
- AVIF/WebP image formats
- CSS `aspect-ratio`
- CSS `:has()` (progressive enhancement)
- `view-transition` (progressive)
- Web Audio API (admin notification chime)
- `navigator.sendBeacon` (event batching)
- Service Workers (PWA)
- `beforeinstallprompt` (PWA install)
- `backdrop-filter` (glass morphism)
- `Intl` formatting (dates, currency)
- `AbortController` (chat streaming)

**Progressive enhancement:** Every modern feature has a graceful fallback:
- AVIF → WebP → JPEG
- `:has()` → static CSS
- Web Audio → silent fail
- Service Worker → normal HTTP
- `beforeinstallprompt` → manual install via instructions

---

## ♿ Accessibility

**Lighthouse Accessibility: 100/100** (both desktop and mobile)

### Implemented

**Semantic HTML:**
- `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<aside>`, `<section>`
- Proper heading hierarchy (h1 → h2 → h3, no skips)
- `<button>` for actions, `<a>` for navigation
- `<form>` with `<label>` for every input
- `<table>` with `<thead>`, `<tbody>`, `<th>`

**ARIA:**
- `aria-label` on every icon-only button
- `aria-pressed` on toggles (wishlist, filter chips, abandoned filter)
- `aria-live="polite"` on toasts and loading states
- `aria-live="assertive"` on critical notifications
- `aria-modal="true"` on dialogs (payment detail, user detail, chat)
- `aria-expanded` on collapsible sections
- `aria-selected` on tabs
- `aria-current="page"` on active nav links
- `role="status"` on loading spinners
- `role="dialog"` on modals
- `role="tablist"` + `role="tab"` on filter tabs
- `role="radiogroup"` + `role="radio"` on star rating
- `aria-hidden="true"` on decorative elements

**Keyboard:**
- All interactive elements reachable via Tab
- Focus-visible outlines on every focusable element
- ESC closes modals (chat, payment detail, user detail, notification dropdown)
- Enter submits forms
- Space toggles checkboxes
- Arrow keys in dropdowns (native `<select>`)

**Visual:**
- Color contrast meets WCAG AA everywhere
- No color-only information (icons + labels always paired)
- Alt text on all meaningful images
- Decorative images use `aria-hidden="true"`

**Motion:**
- `prefers-reduced-motion` respected via Tailwind
- No autoplaying videos
- Animations have pauses (not infinite flickers)

**Structure:**
- **Skip to main content** link (first focusable element)
- Landmarks on every page
- Breadcrumb navigation
- Consistent header/footer across pages

**Forms:**
- Visible labels on every input
- Real-time validation with clear error messages
- Loading states with spinners + disabled buttons
- Success/error toasts with proper ARIA

**Touch targets:**
- Minimum 44×44 px for all interactive elements
- Adequate spacing between adjacent targets

**Print:**
- Print views hide navigation, footer, chrome
- Only the invoice/export visible
- A4-optimized layout

### Tested with

- **axe DevTools** — 0 violations
- **Lighthouse Accessibility** — 100/100
- **WAVE** — 0 errors
- **Screen reader** — tested with VoiceOver (macOS/iOS) and NVDA (Windows)

---

## ❓ FAQ

### General

**Q: Is this multi-vendor?**
A: No. VESTIOR is a **single-vendor** store — one admin manages all products, orders, and users. Multi-vendor would be a completely different product (v4.0 or a fork).

**Q: What payment methods are supported?**
A: **Cash on Delivery (COD)** and **Stripe** (test mode ready, live-mode compatible). The provider abstraction makes adding PayPal, Razorpay, etc. a single-file change.

**Q: Can I use this for other products (not clothing)?**
A: Yes. The core logic is generic. Update category names, imagery, branding. Size selector (XS–3XL + Custom) may need adjustment if not applicable.

**Q: Is there a public API?**
A: Not currently. Server Actions are internal. For external use, build routes under `src/app/api/`. The API routes that DO exist are documented in the API Reference section.

**Q: How do I disable a product without deleting it?**
A: Set `is_active = false` in the admin panel. Hidden from storefront, preserved in DB.

**Q: How do I add a new category?**
A: Categories are derived from `category_main`. Just type a new value when creating/editing a product. Update `src/components/CategorySection.tsx` to add the homepage tile.

### Auth & Users

**Q: Can customers see their order history?**
A: Yes, at `/orders` with real-time status updates, plus a printable invoice.

**Q: How do I reset a customer's password?**
A: Supabase → Auth → Users → select user → "Send password recovery". Or use the customer-facing `/auth/forgot-password` flow.

**Q: Do I need to verify my email?**
A: Yes. After signup, check your inbox for the verification link. Until verified, login will show "Please verify your email first".

**Q: Why does my password reset link not work?**
A: **v3.2 fixed this.** The flow now uses `token_hash` (Supabase's newer recommended flow). Ensure Supabase URL Configuration includes `/auth/reset-password` in Redirect URLs.

**Q: What happens if a user signs up with Google and later wants a password?**
A: They can use "Forgot password" to set one. Supabase auth handles the linking automatically.

**Q: How do I promote a user to admin?**
A: Supabase → Table Editor → `profiles` → change `role` to `admin`. For super admin (can change roles), also set `is_super_admin = true`.

### Payments

**Q: How does Stripe work if the client's browser closes mid-payment?**
A: The order exists in DB with `payment_status: pending`. The Stripe webhook fires asynchronously and completes it. Both client-side `confirmPayment` and webhook are idempotent.

**Q: What if a customer pays twice?**
A: Not possible. Stripe's PaymentIntent is single-use. Idempotency keys prevent duplicate processing on our end.

**Q: Can I refund an order?**
A: Yes. Admin → Order detail → Refund button. For Stripe orders, calls Stripe Refund API. For COD, marks order refunded.

**Q: What if the webhook fails?**
A: Stripe retries automatically (up to 72h with exponential backoff). Our handler is idempotent, so retries are safe.

### Email

**Q: Why do I get two payment confirmation emails?**
A: This was a bug in older versions. **Fixed in v3.1:** the Stripe webhook checks if the order is already completed before queuing the email. Whichever path fires first wins.

**Q: Why is my email stuck as `queued`?**
A: **Fixed in v3.1:** if `qstash.publishJSON` throws, the log is now marked `failed` with the error. Before, it stayed `queued` forever.

**Q: Can I use Resend instead of Gmail?**
A: Yes. Swap `src/lib/email/mailer.ts` from Nodemailer to Resend SDK. Everything else stays. `RESEND_API_KEY` is already in `.env.example` (optional).

**Q: How do I test email templates locally?**
A: The email queue detects `localhost` and sends directly (bypassing QStash). Emails arrive in your Gmail inbox. Check `email_logs` in MongoDB.

### AI Chatbot

**Q: How does the AI chatbot work?**
A: VESTIOR uses Groq (LPU inference) with the `openai/gpt-oss-120b` model. It has access to read-only tools (`searchProducts`, `getCategories`, `getMyOrders`, etc.) but can never modify data. Rate-limited at 20 messages/min per IP. Free tier handles ~1,000 requests/day.

**Q: Why tools over RAG?**
A: Tools query **live DB** — always fresh, no embeddings needed, never hallucinate prices. RAG would require vector embeddings + stale snapshots. For ~500 products, tools are simpler and always correct.

**Q: Can I change the AI model?**
A: Yes. Edit `AI_MODELS` in `src/lib/ai/groq.ts`. Available options: `openai/gpt-oss-120b` (quality), `openai/gpt-oss-20b` (fast). Verify model availability with the `/models` endpoint.

**Q: What if Groq is down?**
A: The chatbot returns 503 with "AI chatbot is not configured." The rest of the site works normally.

**Q: Can the chatbot take actions (place orders, etc.)?**
A: No. Tools are strictly **read-only**. It can search products, get product details, list categories, and retrieve the user's order history. It cannot modify anything.

### PWA

**Q: Can I install VESTIOR as an app?**
A: Yes. On Chrome/Edge (Android or desktop), you'll see an install prompt. On iOS Safari, tap Share → "Add to Home Screen". The app works offline for cached pages.

**Q: Why doesn't the install prompt appear?**
A: Check: HTTPS, not already installed, not dismissed in last 30 days, supported browser (Chrome/Edge). Safari doesn't support `beforeinstallprompt`.

**Q: What works offline?**
A: Cached pages (previously visited), static assets (JS/CSS/fonts), and images. Dynamic content (products, cart) requires a connection.

### Performance & SEO

**Q: Why is mobile LCP 3.5s?**
A: Client-side hydration + Framer Motion animations on mid-range phones. Optimized as far as possible without dropping interactivity. On desktop, LCP is 0.5s.

**Q: Does the site work without JavaScript?**
A: Partially. Server-rendered pages work, but cart, search, AI chat, and interactive filtering need JS. This is standard for modern e-commerce.

**Q: Is the site SEO-friendly?**
A: Yes. Lighthouse SEO = 100/100. Dynamic metadata, JSON-LD schemas (Organization, WebSite, Product, Breadcrumb, Review), auto-generated sitemap, canonical URLs, rich results eligible.

**Q: How do I submit the sitemap to Google?**
A: [Google Search Console](https://search.google.com/search-console) → Add property → Verify → Sitemaps → submit `https://your-domain.com/sitemap.xml`.

### Admin Panel

**Q: Can I see what visitors are doing live?**
A: Yes. `/admin/visitors` shows all sessions. `/admin/analytics` has a Live Users widget that auto-refreshes every 30 seconds.

**Q: How do I track product performance?**
A: `/admin/analytics` shows per-product views, cart adds, orders, and conversion rate. Products with high views but zero orders are flagged as "abandoned".

**Q: Can I export data?**
A: Yes. `/admin/exports` — CSV for orders, payments, emails, users, and audit logs. **NEW in v3.2:** PDF print views for all 5 export types.

**Q: How do I export to PDF?**
A: Admin → `/admin/exports` → click **Print** on any card → opens a print-optimized page → use browser's "Print → Save as PDF".

**Q: How do I change a user's role?**
A: Only **super admins** can change roles. Go to `/admin/users` → click user → role dropdown. Regular admins can't do this (security).

**Q: What's an "abandoned" product?**
A: A product with **20+ views** but **zero orders** in the selected date range. Indicates a potential issue (price, photos, copy, stock).

### Deployment

**Q: Can I deploy to a VPS instead of Vercel?**
A: Yes. The `Dockerfile.vercel` is compatible with any Docker host. See the Deployment section for details on VPS setup.

**Q: What's the free tier cost?**
A: **$0/month** until you exceed limits. See "Free Tier Limits" section for details on each service.

**Q: When should I upgrade?**
A: 
- **Vercel:** Commercial use or more crons → Pro ($20/mo)
- **Supabase:** Backups + more compute → Pro ($25/mo)
- **MongoDB:** Storage > 512MB → M2 ($9/mo)
- **Groq:** >1K requests/day → Paid tier

**Q: How do I roll back a deployment?**
A: Vercel → Deployments → find last good → ⋯ → **Promote to Production**. ~30 seconds.

### Data & Recovery

**Q: What happens if Redis is down?**
A: Site keeps working (fail-open rate limiting). Idempotency falls back to permissive. Idempotency keys won't be cached — duplicate webhooks may double-process, but our DB-level UNIQUE constraints prevent actual duplicates.

**Q: What happens if MongoDB is down?**
A: Analytics + email logs + abandoned carts + sessions temporarily fail. **Core commerce unaffected** (Supabase is source of truth).

**Q: What happens if Supabase is down?**
A: Site is fully down. Products, orders, users all come from Supabase. This is by design — single source of truth for transactional data.

**Q: How do I back up data?**
A: 
- **Supabase:** Pro tier has daily backups + PITR. Free tier: manual `pg_dump` via Supabase CLI.
- **MongoDB:** M2+ has automated backups. M0: no backups (free tier limitation).
- **Redis:** Ephemeral. No backups needed.

---

## 🗺️ Roadmap

> **Promise:** This roadmap is honest. It reflects what we plan to build, what we'll prioritize, and what we're deliberately not doing.

### Current State

VESTIOR is at **v3.2.0** — production-ready with editorial UI, AI chatbot, PWA, and PDF export.

### What's Shipped

| Category | Status |
|----------|--------|
| **Core commerce** | Browse → cart → checkout → orders — complete |
| **Payments** | COD + Stripe live, refunds, webhooks, idempotency, atomic v2 |
| **Admin panel** | 19 pages covering products, orders, payments, users, analytics, reviews, coupons, carts, audit, exports, visitors, sessions, reports |
| **Email** | Gmail SMTP + QStash queue, 10 templates, delivery tracking, editorial redesign |
| **Analytics** | Self-hosted event tracking + sessions + product analytics + funnel + live users |
| **AI** | Groq-powered shopping assistant with tool-calling + streaming |
| **PWA** | Installable, offline mode, service worker, app shortcuts |
| **Growth** | Coupons (atomic), reviews, wishlist, abandoned cart recovery, recommendations |
| **Editorial UI** | Full redesign across 120+ files — bento cards, glass morphism, motion-first |
| **Data export** | CSV + **PDF print views** (v3.2) |
| **Security** | RLS, atomic operations, idempotency (Lua), rate limiting, audit logs, immutability guards |
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
- All displays (product cards, cart, checkout, invoices, emails, PDF exports) convert
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

#### 🎯 Groq paid tier evaluation

**Why:** Free tier caps at 1,000 requests/day. If AI usage grows, we hit the cap.

**What:**
- Monitor Groq usage dashboard
- Evaluate pricing (~$0.05-0.10 per 1K requests)
- Set up alerts at 800 requests/day
- Upgrade if consistently hitting 1K/day

**Effort:** ~1 day (setup) + ongoing monitoring
**Blockers:** None. Cost decision when usage justifies.

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
- PDF export headers in selected language
- DB stores language preference on profile
- **AI chatbot** responds in user's language

**Effort:** ~4 weeks
**Blockers:** Need to translate ~500 strings. Can be partially outsourced.

---

#### 🎯 Loyalty program

**Why:** Repeat customers generate 3x revenue of new customers. Reward them.

**What:**
- Points system: 1 point per ₹100 spent
- Redeemable for coupons (100 points = ₹100 off)
- Tiers: Bronze → Silver → Gold (based on lifetime spend)
- Tier perks: free shipping, early access, birthday discount
- Admin panel to view/adjust points
- Email notifications on tier upgrades

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
- Refundable? No (industry standard)

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

#### 🎯 Advanced analytics

**Why:** Current analytics shows funnel + top products + sessions. Missing cohort/retention analysis.

**What:**
- Cohort retention (D1, D7, D30)
- Customer lifetime value
- Repeat purchase rate
- Product affinity (customers who bought X also bought Y)
- Search analytics (what users search, what they don't find)

**Effort:** ~3 weeks
**Blockers:** Requires pre-aggregation cron to keep dashboards fast.

---

#### 🎯 Advanced AI features

**Why:** Current AI is read-only, tool-based. Next step: semantic search + personalization.

**What:**
- **Semantic search** — "fancy suit for wedding" → matches suits
- **"Recommended for you"** — based on browsing history
- **Auto-generated product descriptions** — for new products
- **Customer support chatbot** — with FAQs + order lookup
- **Multi-turn context** — "show me that in blue" after seeing a suit

**Effort:** ~4 weeks
**Blockers:** Needs vector embeddings (Voyage, OpenAI, or self-hosted) + cost analysis.

---

### Long Term — 12+ Months

#### 🎯 Mobile app (React Native)

**Why:** Native app delivers better UX. Push notifications, offline, biometric auth.

**What:**
- React Native app (Expo)
- Shared business logic with web (via monorepo)
- Native camera for AR try-on (future)
- Push notifications
- Deep linking
- **AI chatbot** integrated natively

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
- Buyer reviews of vendors

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
- **AI-generated product descriptions** based on attributes

**Effort:** ~2 months
**Blockers:** Needs data volume (10K+ orders) and ML infrastructure.

---

#### 🎯 Self-hosted AI inference

**Why:** Groq free tier caps at 1K/day. Paid tier adds per-request cost.

**What:**
- Deploy Llama or Mistral on dedicated GPU (vLLM, Ollama)
- Or use serverless inference (Replicate, Together AI)
- Swap `getGroq()` in `src/lib/ai/groq.ts` for a custom endpoint
- Cost: ~$20-50/month for low-traffic, vs per-request pricing

**Effort:** ~1 week (integration)
**Blockers:** Cost analysis. Only worth it at high volume.

---

### What We're Not Doing

Some things we've deliberately not built. Reasons below.

- ❌ **Crypto payments** — Volatile, complex, not demanded by user base. If demand emerges, use a provider (Coinbase Commerce).
- ❌ **Subscription model** — Men's fashion isn't a subscription product. Customers buy occasionally.
- ❌ **Social features (follow, feed)** — VESTIOR is a store, not a social network. Reviews are the social layer.
- ❌ **Custom CMS for content** — Static content + product data. A CMS is overkill.
- ❌ **Voice search** — Low demand for a niche store.
- ❌ **VR/AR try-on** — Requires 3D models + AR SDKs. Not worth the cost at our scale.
- ❌ **Buying in bulk discount** — Products are premium, single-quantity purchases.
- ❌ **Multiple stores / white-label** — We're single-vendor, single-brand.
- ❌ **Admin mobile app** — Admin panel is already mobile-responsive.
- ❌ **Light mode toggle** — Our brand is dark. Light mode would break the visual identity.
- ❌ **Blockchain NFTs for authenticity** — Solutions looking for problems.
- ❌ **Deep integration with Facebook/Instagram** — Standard OG tags suffice.
- ❌ **RAG for the AI chatbot** — Tools are simpler and always correct for ~500 products.
- ❌ **Third-party analytics (Mixpanel, Amplitude)** — Our self-hosted MongoDB analytics is fast and free.
- ❌ **Session recording (Hotjar, FullStory)** — Privacy-invasive, expensive, and heavy.
- ❌ **A/B testing framework** — Low traffic volume makes it statistically meaningless.

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

### v3.2.0 — Editorial Redesign + PDF Export + Bug Fixes (Current)

**Release date:** 2026-10-16
**Scope:** 120 files changed, +23,657 / −8,498 lines (across multiple commits)

This is the **largest UI/UX overhaul + feature hardening release** since v3.0. It brings the entire app to a coherent **editorial design language**, adds **PDF print export**, and fixes critical bugs across auth, checkout, and notifications.

**🎨 Added — Editorial UI/UX Redesign (Massive)**

Redesigned the entire application around a **cohesive editorial design system**.

*Design principles:*
- Bento-style stat cards with left accent bar + ambient glow orb
- Glass morphism (`backdrop-blur-xl`) throughout
- Grouped sidebar navigation (Overview / Commerce / Audience / Operations)
- Editorial typography — `tracking-tight` headlines, `[0.15em]` uppercase eyebrows, `tabular-nums` for all numbers
- Motion-first micro-interactions — hover lifts, staggered children, shine sweeps on CTAs
- Ambient glow orbs per page section (color-matched)
- Consistent empty states on every list, table, and grid
- Status pills everywhere (dot + icon + label, semantic color)
- Sharp scroll boundaries — removed edge fade gradients
- Responsive-first — every component tested at 320px → 2xl

*Pages redesigned:*
- Homepage (Hero + CategorySection + HomeProductSection + RecommendedRow)
- Products listing, Product detail, Reviews section
- Cart (with playful rotating empty-state messages + floating mini-icons)
- Checkout (2-step with animated stepper)
- Orders list, Order detail, Invoice
- Wishlist, WishlistGrid
- Profile
- Auth pages (login, signup, forgot, reset, verify)
- Legal pages (privacy, terms, refund)
- **All 19 admin pages**
- **All 10 email templates** (theme-matched editorial style)
- Global error boundary, 404 page, loading states

*Signature patterns:*
- **Bento stat cards** — left accent bar + ambient glow + icon tile + eyebrow + big number + subtitle
- **Grouped sidebar** — layout-animated active bar + ExternalLink on hover for "Back to Site"
- **Empty states** — icon tile + halo glow + title + description + CTA
- **Status pills** — `w-1 h-1 rounded-full` dot + icon + label
- **Eyebrow pills** — `text-[10px] tracking-[0.18em] uppercase`
- **Shine sweeps** — `-inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent`
- **Skeleton loaders** — matching card shape with `animate-pulse`
- **Ambient orbs** — `blur-[70px]` accent-colored background glow per card
- **Timeline dots** — pulse-ping for live, solid for past

**🖨️ Added — PDF Print Export**

`/admin/exports/print/[type]` — dedicated print-optimized views for all 5 export types.

*Features:*
- Print-optimized CSS (`@media print` with `visibility: hidden` on chrome)
- A4 landscape for tables (`@page { size: A4 landscape }`)
- UTF-8 BOM — currency symbols (₹) render correctly
- Banded headers (`thead { display: table-header-group }`) — auto-repeat on page breaks
- Row-level page-break (`tr { page-break-inside: avoid }`)
- Filter-aware — date range, status, provider preserved
- Active filter chips in header
- Record count + generation date
- **Zero external dependencies** — uses browser's native "Print → Save as PDF"
- Available types: Orders, Payments, Emails, Users, Audit logs

**📸 Added — Organized Screenshot Structure**

Screenshots organized by context in `public/images/`:
- `admin_pages-images/` — 10 admin screenshots
- `customer_facing-images/` — 9 customer screenshots
- `email_template_images/` — 7 email screenshots

**🐛 Fixed — Cron + Email Pipeline (4 fixes)**

1. **Low-stock throttle on failure** — Throttle key is now set **only on real success**. Previously, a failed `queueEmail` still set the throttle — the next cron run was skipped, and the alert never fired.

2. **Abandoned-cart parameter order** — `findAbandonedCarts(minAgeHours, maxReminders, limit)` — the cron was passing args in the wrong order (`maxAgeHours` instead of `maxReminders`), silently limiting reminders to wrong values.

3. **Abandoned-cart window** — Correct throttle window (50 minutes) + correct 2-hour cart age threshold. Verified via curl test — 4 low-stock alerts + 1 abandoned cart sent successfully.

4. **Email queue hardening** — If `qstash.publishJSON` throws, the email log is now marked `status: 'failed'` with the error message. Previously it stayed `status: 'queued'` forever — invisible to admins.

**🔐 Fixed — Auth (1 fix)**

5. **Password reset / email confirm session missing** — Switched to `token_hash` flow in `/auth/callback`. The previous `code`-based flow was leaving users without a session after clicking the email link. Now uses `supabase.auth.verifyOtp({ token_hash, type })`.

**💳 Fixed — Checkout (1 fix)**

6. **`order_placed` event not tracked on Stripe success** — COD flow tracked the event correctly, but the Stripe success path called `handlePaymentSuccess` without tracking. Now both paths emit `order_placed` with the correct `paymentMethod`, `couponCode`, and `discountAmount`.

**🎨 Refactored — UI Polish (1 refactor)**

7. **Edge fade gradients removed** — Scrollable rows (HomeProductSection, ProductRow, RecommendedRow) had edge fade gradients that created inconsistent visual cut-off. Removed for sharp, clean boundaries.

**📧 Redesigned — All 10 Email Templates**

Theme-matched editorial style:
- Dark `#0A0A0A` background
- Brand masthead with accent-colored dot (`● VESTIOR`)
- Accent eyebrow badge (uppercase, tracking-widest)
- Semantic accent color per template:
  - Blue for orders (`#3B82F6`)
  - Emerald for success (`#10B981`)
  - Red for failures (`#EF4444`)
  - Amber for warnings (`#F59E0B`)
  - Violet for shipped/abandoned (`#8B5CF6`)
- Hairline accent dividers (`rgba(accent, 0.25)`)
- Gradient CTA buttons with box-shadow
- Trust footer with email reply prompt
- Auto-computed copyright year

**📊 Enhanced — Admin Notifications**

- Editorial toast design with left accent bar (`border-l-[3px]`)
- Icon tile with matching bg + border
- Title + 2-line message
- "View" action with `ExternalLink` icon + hover translate
- Shine sweep on the View button
- Auto-dismiss after 8s

**🏗️ Added — Editorial Design System**

- Consistent tokens across 120+ files
- Documented color palette, typography, surfaces, motion
- Reusable patterns: bento cards, empty states, status pills, eyebrows
- Zero runtime overhead (pure CSS)
- Full accessibility compliance (WCAG AA)

**⚡ Performance**

- Lighthouse Desktop: **97/100** (unchanged)
- Lighthouse Mobile: **91/100** (unchanged)
- Accessibility: **100/100** (unchanged)
- Best Practices: **100/100**
- SEO: **100/100**
- Zero-dependency PDF print — no Puppeteer/Chrome overhead
- Sharp scroll boundaries — cleaner paint

**📦 Dependencies**

- No new dependencies added
- Kept 100% free-tier compatible

**📚 Documentation**

- README updated with v3.2 features
- Docs updated to reflect editorial redesign
- Screenshot paths updated to new organized structure

---

### v3.1.0 — AI + PWA + Auth Polish

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
| **v3.2.0** | **2026-10-16** | **Editorial redesign + PDF export + bug fixes** | **97/100/100/100** |
| v3.1.0 | 2026-10-13 | AI + PWA + Auth polish | 97/100/100/100 |
| v3.0.0 | 2026-10-12 | Enterprise features | 98/100/100/100 |
| v2.0.0 | 2026-10-05 | Security + perf | 87/85/100/100 |
| v1.0.0 | 2026-10-01 | Initial release | — |

---

### Upgrade Guide

#### From v3.1 to v3.2

**Database:** No new migrations required.

**Environment:** No new env vars required.

**Code:** No breaking changes. The editorial redesign replaces all UI components in-place. Simply pull the latest code and redeploy.

**Verification after deploy:**
- [ ] Test password reset flow — session should be created (v3.2 fix)
- [ ] Test Stripe checkout — verify `order_placed` event fires in MongoDB
- [ ] Test cron manually — verify throttle only set on success
- [ ] Test PDF export — click Print, verify A4-optimized view

#### From v3.0 to v3.1

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

3. Enable Realtime on `order_items` table:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
   ```

**Environment:**
Add new var to `.env.local`:
```
GROQ_API_KEY=gsk_...
```

**Code:** No breaking changes.

**Deploy:**
1. Update Vercel env vars (add `GROQ_API_KEY`)
2. Redeploy
3. Verify AI chatbot works ("Show me suits under ₹25,000")
4. Verify PWA install prompt appears (mobile or Chrome desktop)
5. Check email logs no longer show stuck `queued` entries

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
- PDF print route exposure
- CSV export data leaks

### Out of Scope

- Rate limit bypass via distributed IPs
- DoS via legitimate high traffic
- Social engineering
- Issues already documented in the README
- Self-XSS (user attacking themselves)

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
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `.next`

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
- Add `https://your-domain.vercel.app/auth/reset-password` (for v3.2 `token_hash` flow)

**5. Update Stripe webhook:**

Developers → Webhooks → Add endpoint:
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

**6. Deploy** 🎉

---

### Post-Deploy Checklist

- [ ] Lighthouse audit on live URL (target: 90+ mobile, 95+ desktop)
- [ ] Test signup + Google OAuth
- [ ] Test password reset flow (v3.2 `token_hash`) — session should be created
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
- [ ] **v3.2:** Test PDF print export from `/admin/exports`
- [ ] **v3.2:** Verify editorial UI on all admin pages
- [ ] **v3.2:** Verify admin notifications (place test order from incognito)

---

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

### VPS Deployment (Ubuntu 22.04 Example)

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and build
cd /var/www
git clone https://github.com/zainshah3464/vestior-store.git
cd vestior-store
npm install
NEXT_OUTPUT=standalone npm run build

# Create .env.local
cp .env.example .env.local
nano .env.local  # paste all production values

# Start with PM2
pm2 start .next/standalone/server.js --name vestior
pm2 save
pm2 startup
```

**Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name vestior.com www.vestior.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**SSL with Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vestior.com -d www.vestior.com
```

### Cron Jobs

Three options for scheduled tasks:

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

For more granular control:
- `https://your-domain.com/api/cron/low-stock-alert` — every 6 hours
- `https://your-domain.com/api/cron/abandoned-carts` — hourly
- Add header: `Authorization: Bearer YOUR_CRON_SECRET`

**Option C — GitHub Actions:**

The repo includes `.github/workflows/keep-alive.yml` which pings `/api/cron/keep-alive` twice daily to prevent free-tier DB pausing.

### Rollback

Vercel → Deployments → find last good → ⋯ → **Promote to Production**. ~30 seconds.

**For DB migrations:** Not auto-reversible. Write a new migration that undoes the change, test in dev, apply to production.

**Special case — role normalization:** Reversible via backup table:
```sql
UPDATE public.profiles p
SET role = b.old_role
FROM public._role_normalization_backup b
WHERE p.id = b.id;
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

### When to Upgrade

- **Vercel:** When you need commercial use + more crons → Pro ($20/month)
- **Supabase:** When you need backups + more compute → Pro ($25/month)
- **MongoDB:** When storage exceeds 512MB → M2 ($9/month)
- **Resend:** When you exceed 500 emails/day → Add Resend (free 3K/month)
- **Groq:** When you exceed 1K requests/day → Paid tier available

### Scaling Checklist

**At 10K orders/month:**
- [ ] Upgrade Vercel to Pro
- [ ] Upgrade Supabase to Pro (backups + no pause)
- [ ] Review MongoDB performance advisor
- [ ] Check Upstash quotas
- [ ] Monitor Groq daily request count

**At 100K orders/month:**
- [ ] Supabase Pro → Team tier
- [ ] MongoDB M0 → M10
- [ ] Add Redis caching layer for product queries
- [ ] Add Sentry error tracking
- [ ] Migrate Groq to paid tier if hitting free limits
- [ ] Consider adding Resend for transactional email

**At 1M orders/month:**
- [ ] Migrate from Vercel to AWS ECS / Kubernetes
- [ ] Self-hosted Postgres with read replicas
- [ ] Sharded MongoDB or migrate to ClickHouse
- [ ] CDN caching for product pages
- [ ] Split admin panel from storefront
- [ ] Background workers on dedicated queue (BullMQ, SQS)
- [ ] Self-hosted AI inference (vLLM, Ollama)

**None of the core business logic changes.** Just swap connection strings and add infrastructure.

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
- [ ] Run `npm run test:e2e` (all pass)
- [ ] Add tests for new features
- [ ] Update README if behavior changes
- [ ] New migrations must be idempotent
- [ ] New AI tools must be read-only
- [ ] Server-only modules must have `import 'server-only'`

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
| `build:` | Build system changes |
| `ci:` | CI configuration |
| `revert:` | Revert a previous commit |

**Scopes:** `cart`, `checkout`, `payments`, `email`, `admin`, `auth`, `db`, `api`, `analytics`, `reviews`, `wishlist`, `coupons`, `invoices`, `ai`, `pwa`, `sessions`, `audit`, `ui`, `exports`

**Examples:**
```
feat(ai): add semantic product search tool
fix(email): prevent duplicate payment-confirmed emails
fix(cron): correct param order in findAbandonedCarts
feat(admin): add PDF print export for all entity types
refactor(ui): remove edge fade gradients from scrollable rows
perf(images): switch hero to AVIF format
docs(readme): update lighthouse scores
```

### What We're Looking For

- **Bug fixes** — especially in cart, checkout, payments, email, cron
- **Performance improvements** — with Lighthouse benchmarks
- **Security hardening** — with CVE-style reasoning
- **Accessibility improvements** — WCAG AA compliance
- **Test coverage** — new tests, edge cases
- **AI improvements** — better tool descriptions, prompt refinements, new tools
- **PWA improvements** — offline UX, cache strategy, install flow
- **Documentation** — clearer explanations, better examples
- **UI polish** — consistent with editorial design system

### What We Don't Accept

- Code style preferences without rationale
- Dependencies without justification
- Breaking changes in minor versions
- Tests that just test mocks
- Changes without tests
- LLM output tests (non-deterministic — test boundaries instead)
- AI-generated PRs without review (you must understand every line)
- Reformatting existing code "for consistency" without discussing first

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

### Getting Help

| Channel | Use for |
|---------|---------|
| **GitHub Issues** | Bug reports, feature requests |
| **GitHub Discussions** | Questions, ideas, show-and-tell |
| **Email** | Security disclosures, private matters |

**Response time (solo maintainer):**
- Bug reports: 24-72 hours
- Feature requests: 3-7 days
- PR reviews: 48 hours
- Security disclosures: 24 hours

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

## 📞 Contact

**Zain Shah**

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

### Why the editorial redesign in v3.2?

The original UI was functional but inconsistent — different components used different patterns, colors, spacings. The v3.2 redesign:
- **Establishes a single design language** across 120+ files
- **Improves maintainability** — tokens documented, easy to extend
- **Boosts brand identity** — dark editorial tone throughout
- **Enhances perceived performance** — cleaner paint, fewer reflows
- **Zero runtime cost** — pure CSS, no JS overhead

Result: every page feels like the same product.

### Why PDF print export (v3.2)?

Three reasons:
1. **Compliance** — many jurisdictions require printable audit trails
2. **Practicality** — admins want physical copies for accounting
3. **Zero dependencies** — browser's native "Print → Save as PDF" is free

We chose **not** to use Puppeteer/headless Chrome (heavy, slow) or a server-side PDF library (200KB+ bundle). Instead, we use print-optimized CSS that leverages what the browser already does perfectly.

### Why `token_hash` flow for password reset (v3.2)?

Supabase deprecated the older `code`-based flow in favor of `token_hash`. The new flow:
- **Prevents session loss** — user gets a real session after clicking the link
- **More secure** — hash is single-use and time-limited
- **Simpler** — one API call instead of a code exchange dance

The old flow was leaving users without a session after clicking the reset link. The v3.2 fix was a one-line change but a critical bug.

### Why sharp scroll boundaries (v3.2)?

Previous versions added **edge fade gradients** to scrollable rows (product carousels, recommended rows). The intent was "premium soft edges." The result was:
- Inconsistent visual cut-off (fades were in different places on different rows)
- Performance cost (extra gradient layers)
- Confusion — users couldn't tell where the scroll area ended

**v3.2 removed all edge fades** in favor of sharp boundaries. Cleaner look, faster paint, clearer affordance.

### Why `stepCountIs(3)` for AI tool calls?

A single user message can trigger a chain:
```
User: "Do I have suits in stock that match my last order?"
Step 1: getMyOrders({ limit: 1 }) → { items: [{ productId: "abc", category: "Suits" }] }
Step 2: searchProducts({ category: "Suits" }) → [...10 suits]
Step 3: getProductById({ id: "xyz" }) → { stock: 5, ... }
```

**3 steps is enough** for:
- Search → get details → answer
- Get order → search → answer
- Get categories → search → answer

**4+ steps** usually means the LLM is confused. Cap prevents runaway tool-calling + cost explosion.

---

<div align="center">

**The End.**

Thank you for reading this far. If you build something great with VESTIOR, let me know.

</div>
```

---