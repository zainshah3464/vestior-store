# Roadmap

> **Audience:** Users, contributors, and anyone curious about VESTIOR's future.
>
> **Promise:** This roadmap is honest. It reflects what we plan to build, what we'll prioritize, and what we're deliberately not doing.

---

## Table of Contents

- [Current State](#current-state)
- [Guiding Principles](#guiding-principles)
- [Short Term — Next 3 Months](#short-term--next-3-months)
- [Medium Term — Next 6 Months](#medium-term--next-6-months)
- [Long Term — 12+ Months](#long-term--12-months)
- [What We're Not Doing](#what-were-not-doing)
- [How to Influence the Roadmap](#how-to-influence-the-roadmap)

---

## Current State

VESTIOR is at **v3.0.0** — production-ready with enterprise features.

### What's shipped

| Category | Status |
|----------|--------|
| **Core commerce** | Browse → cart → checkout → orders — complete |
| **Payments** | COD + Stripe live, refunds, webhooks, idempotency |
| **Admin panel** | 12 pages covering products, orders, payments, users, analytics, reviews, coupons, carts, audit, exports |
| **Email** | Gmail SMTP + QStash queue, 9 templates, delivery tracking |
| **Analytics** | Self-hosted event tracking with MongoDB, funnel, live users, top products |
| **Growth** | Coupons, reviews, wishlist, abandoned cart recovery, recommendations |
| **Security** | RLS, atomic operations, idempotency, rate limiting, audit logs |
| **Testing** | 53 unit + 21 E2E tests, GitHub Actions CI (4 jobs) |
| **Performance** | 98/100 Lighthouse desktop, 84/100 mobile |
| **Docs** | 8 deep-dive files + README |

### What's next

See sections below. This roadmap is reviewed quarterly.

---

## Guiding Principles

Every feature decision traces back to these:

### 1. Solve real problems

We don't add features because they're trendy. We add them because users ask for them, or because they improve the fundamentals.

### 2. Don't add complexity

Every feature adds code, dependencies, tests, and maintenance. We add complexity only when the value exceeds the cost.

### 3. Ship small, ship often

Big releases are risky. We prefer frequent small releases over quarterly monoliths.

### 4. Document everything

A feature without docs doesn't exist. Every release updates the relevant `docs/` files.

### 5. Security first

No feature ships without a security review. RLS, input validation, rate limiting — non-negotiable.

---

## Short Term — Next 3 Months

### Q4 2026 (Oct–Dec)

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

**Blockers:** Both couriers have API access, but rate-limited on free tier. Negotiation needed.

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

#### 🎯 PWA offline mode

**Why:** Mobile users lose data when network drops. Offline support improves UX.

**What:**
- Service worker via `next-pwa`
- Cache static assets
- Cache product pages (stale-while-revalidate)
- Offline fallback page
- Install prompt on mobile

**Effort:** ~4 days

**Blockers:** `next-pwa` compat with Next.js 16 Turbopack needs verification.

---

## Medium Term — Next 6 Months

### Q1–Q2 2027

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

**Blockers:** Need to translate ~500 strings. Can be partially outsourced.

**Priority:** High if user base is Urdu-first, medium otherwise.

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

**Blockers:** Requires new table `gift_cards` + `gift_card_transactions`. Similar pattern to coupons.

---

#### 🎯 Order tracking page for guests

**Why:** Guests place orders, then lose the ability to check status. Send them a magic link.

**What:**
- Guest checkout flow (email + address, no signup)
- After order, send email with "track your order" link
- Link contains signed token, expires in 30 days
- Page shows order status, tracking, invoice

**Effort:** ~2 weeks

**Blockers:** Requires refactoring `orders` to allow `user_id = null`. Alternative: create shadow account.

---

#### 🎯 Advanced analytics

**Why:** Current analytics shows funnel + top products. Missing cohort/retention analysis.

**What:**
- Cohort retention (D1, D7, D30)
- Customer lifetime value
- Repeat purchase rate
- Product affinity (customers who bought X also bought Y)
- Search analytics (what users search, what they don't find)

**Effort:** ~3 weeks

**Blockers:** Requires pre-aggregation cron to keep dashboards fast.

---

## Long Term — 12+ Months

### 2027+

#### 🎯 Mobile app (React Native)

**Why:** Native app delivers better UX. Push notifications, offline, biometric auth.

**What:**
- React Native app (Expo)
- Shared business logic with web (via monorepo)
- Native camera for AR try-on (future)
- Push notifications
- Deep linking

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

**Status:** Not planned unless there's strong demand.

---

#### 🎯 AI-powered recommendations

**Why:** Current recommendations are rule-based. ML would personalize.

**What:**
- Train model on purchase history
- "Recommended for you" personalization
- Semantic search (find "fancy suit" → all suits)
- Auto-generated product descriptions
- Chatbot for customer support

**Effort:** ~2 months

**Blockers:** Needs data volume (10K+ orders) and ML infrastructure. Also: cost vs benefit at our scale.

---

#### 🎯 Omnichannel

**Why:** Physical + online integration.

**What:**
- POS integration for in-store purchases
- Click-and-collect (buy online, pickup in store)
- Inventory sync across channels
- Unified customer profiles

**Effort:** ~4 months

**Blockers:** Requires physical store presence. Not applicable if purely online.

---

## What We're Not Doing

Some things we've deliberately not built. Reasons below.

### ❌ Crypto payments

**Why not:** Crypto is volatile, complex, and not demanded by our user base. If demand emerges, we'd use a provider like Coinbase Commerce (not build in-house).

### ❌ Subscription model

**Why not:** Men's fashion isn't a subscription product. Customers buy occasionally, not monthly. Subscriptions would add complexity for zero benefit.

### ❌ Social features (follow, feed)

**Why not:** VESTIOR is a store, not a social network. Social features dilute focus. Reviews are the social layer.

### ❌ Custom CMS for content

**Why not:** We use static content + product data. A CMS is overkill. If content becomes a bottleneck, we'd integrate Sanity/Contentful, not build one.

### ❌ Voice search

**Why not:** Low demand for a niche store. If it becomes standard, we'd add via browser APIs, not build from scratch.

### ❌ VR/AR try-on

**Why not:** Requires 3D models of products (which we don't have) + AR SDKs + device compatibility. Not worth the cost at our scale. Revisit if demand justifies.

### ❌ Loyalty program with subscriptions

**Why not:** (See "subscription model" above.)

### ❌ Buying in bulk discount

**Why not:** Our products are premium, single-quantity purchases. Bulk discount would cannibalize margins.

### ❌ Multiple stores / white-label

**Why not:** We're single-vendor, single-brand. Forking for other brands is a documentation task, not a feature.

### ❌ Admin mobile app

**Why not:** Admin panel is already mobile-responsive. A native app adds ~6 months of work for marginal benefit.

### ❌ Dark mode toggle (light mode)

**Why not:** Our brand is dark. Light mode would break the visual identity. If we ever support it, it'd be a full redesign, not a toggle.

### ❌ Blockchain NFTs for authenticity

**Why not:** Solutions looking for problems. NFT receipts don't add value over regular receipts for physical goods.

### ❌ Deep integration with Facebook/Instagram

**Why not:** We use standard OG tags for share previews. Facebook Shop integration is complex and platform-specific. If demand emerges, we'd add via a service, not build.

---

## How to Influence the Roadmap

### Vote on existing items

Open an issue or upvote existing ones:
- **Feature request:** https://github.com/zainshah3464/vestior-store/issues/new
- **Existing issues:** https://github.com/zainshah3464/vestior-store/issues

Reactions (👍, ❤️, etc.) on issues count. High-reaction items move up the priority list.

### Propose new features

Before opening an issue, ask yourself:

1. **Does this solve a real problem** I or other users have?
2. **Is it aligned with VESTIOR's focus** (premium men's fashion, single-vendor)?
3. **Would I use it** if it existed?
4. **Can it be built in <4 weeks** (or split into smaller features)?

If yes to all four, open an issue with:
- **Problem statement** — What problem does it solve?
- **Proposed solution** — How should it work?
- **Alternatives considered** — What else did you think of?
- **Success criteria** — How do we know it worked?

### Contribute code

If you want to build something from the roadmap:
1. Comment on the issue saying so.
2. Wait for maintainer confirmation (avoid duplicate work).
3. Follow the [contributing guide](./contributing.md).

### Sponsorship

VESTIOR is free, open-source, and run by a solo maintainer. If you'd like to sponsor a specific feature:

- Email **zainshahzs110@gmail.com** with the feature name and rough budget.
- We'll discuss scope and timeline.
- Sponsored features move to the top of the roadmap.

**Note:** Sponsorship doesn't guarantee the feature will be built exactly as you want. We discuss scope and agree on deliverables.

---

## Version History (Roadmap)

| Version | Focus | Status |
|---------|-------|--------|
| v1.0.0 | Core commerce | ✅ Shipped |
| v2.0.0 | Security + performance | ✅ Shipped |
| v3.0.0 | Enterprise features | ✅ Shipped |
| v3.1.0 | Multi-currency + PWA | 🚧 Planned |
| v3.2.0 | Order tracking + i18n | 📅 Planned |
| v4.0.0 | Loyalty + gift cards | 🔮 Future |

---

## Feedback

This roadmap is a living document. If something is unclear, misprioritized, or missing:

- Open an issue
- Start a discussion
- Email me

I genuinely read every response. Your feedback shapes this project.

---

<p align="center">
  <em>Last updated: 2026-10-12 · Review quarterly · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```