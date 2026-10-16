# Roadmap

> **Audience:** Users, contributors, and anyone curious about VESTIOR's future.
>
> **Promise:** This roadmap is honest. It reflects what we plan to build, what we'll prioritize, and what we're deliberately not doing.
>
> **Version:** This document reflects the state after **v3.2.0** (Editorial redesign + PDF export + cron hardening).

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

VESTIOR is at **v3.2.0** — production-ready with an **editorial design system**, **PDF print export**, AI chatbot, PWA, and hardened cron/email pipelines.

### What's shipped

| Category | Status |
|----------|--------|
| **Core commerce** | Browse → cart → checkout → orders — complete |
| **Payments** | COD + Stripe live, refunds, webhooks, idempotency, atomic order placement (v2) |
| **Admin panel** | 19 pages covering products, orders, payments, users, analytics, reviews, coupons, carts, audit, exports, visitors, sessions, reports, activity |
| **Email** | Gmail SMTP + QStash queue, 10 templates (editorial redesign), delivery tracking, welcome-back throttling |
| **Analytics** | Self-hosted event tracking + session tracking + product analytics + funnel + live users + new vs returning |
| **AI** | Groq-powered shopping assistant with tool-calling, streaming, session-scoped history |
| **PWA** | Installable, offline mode, service worker, app shortcuts, 30-day dismissal cooldown |
| **Growth** | Coupons (atomic), reviews, wishlist, abandoned cart recovery, recommendations, welcome-back emails |
| **Auth** | Email/password, Google OAuth, password reset flow (`token_hash` — v3.2 fix), strength meter, existing-email detection |
| **Editorial UI/UX** | Full redesign across 120+ files — bento cards, glass morphism, motion-first micro-interactions, design system tokens (v3.2) |
| **Data export** | CSV (5 types) + **PDF print views** (5 types, A4-optimized, zero-dependency) (v3.2) |
| **Cron** | Hourly abandoned-cart, 12h low-stock, daily combined, keep-alive — with **throttle-on-success** (v3.2 fix) |
| **Security** | RLS, atomic operations, idempotency (Lua), rate limiting, audit logs, immutability guards |
| **Testing** | 53 unit + 21 E2E tests, GitHub Actions CI (4 jobs) |
| **Performance** | 97/100 Lighthouse desktop, 91/100 mobile |
| **Docs** | 11 deep-dive files + README (~10,000 lines total) |

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

### 6. Design system first

Every new UI element must use existing tokens and patterns. If a pattern doesn't exist, we add it to the design system before using it. (New principle in v3.2.)

---

## Short Term — Next 3 Months

### Q4 2026 – Q1 2027 (Nov 2026 – Jan 2027)

#### 🎯 Multi-currency support

**Why:** Pakistan-based store, but customers exist globally. Prices currently display in PKR only.

**What:**
- Store prices in PKR (base currency)
- Real-time conversion based on daily exchange rates
- User selects currency (auto-detected by IP)
- Persisted in cookie
- All displays (product cards, cart, checkout, invoices, **PDF exports**, emails) convert
- Admin sets currency markup (e.g., +5% for USD)

**Effort:** ~2 weeks

**Blockers:** Need FX rate provider (exchangerate.host or similar — free tier).

**Priority:** High — immediate revenue impact for international customers.

---

#### 🎯 Sentry error tracking

**Why:** Currently, errors go to Vercel logs. We can't see them without manual review.

**What:**
- Sign up for Sentry free tier (5K errors/month)
- Install `@sentry/nextjs`
- Capture client + server errors
- Source maps uploaded
- Alerts on new issues
- Filter by route, user, release

**Effort:** ~3 days

**Blockers:** None.

**Priority:** High — observability gap.

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

**Priority:** Medium — quality-of-life for contributors.

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

**Priority:** High — directly reduces customer support load.

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

**Priority:** Reactive — upgrade only when needed.

---

## Medium Term — Next 6 Months

### Q2–Q3 2027 (Feb – Jul 2027)

#### 🎯 Multi-language (i18n)

**Why:** Urdu is the primary language for many Pakistani customers. English-only limits reach.

**What:**
- Next.js 16 i18n with App Router
- Language switcher (EN / UR)
- RTL layout for Urdu
- All UI strings externalized
- Emails in recipient's language
- **PDF export headers** in selected language
- DB stores language preference on profile
- **AI chatbot** responds in the user's language
- Number/date/currency formatting per locale

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
- Dashboard widget showing tier distribution

**Effort:** ~3 weeks

**Blockers:** None technical.

**Priority:** High — retention multiplier.

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

**Blockers:** Requires new tables `gift_cards` + `gift_card_transactions`. Similar pattern to coupons.

**Priority:** Medium — nice-to-have for holiday seasons.

---

#### 🎯 Order tracking page for guests

**Why:** Guests place orders, then lose the ability to check status. Send them a magic link.

**What:**
- Guest checkout flow (email + address, no signup)
- After order, send email with "track your order" link
- Link contains signed token, expires in 30 days
- Page shows order status, tracking, invoice
- **PDF invoice download** for guests

**Effort:** ~2 weeks

**Blockers:** Requires refactoring `orders` to allow `user_id = null`. Alternative: create shadow account.

**Priority:** Medium — reduces friction for one-time buyers.

---

#### 🎯 Advanced analytics

**Why:** Current analytics shows funnel + top products + sessions. Missing cohort/retention analysis.

**What:**
- Cohort retention (D1, D7, D30)
- Customer lifetime value
- Repeat purchase rate
- Product affinity (customers who bought X also bought Y)
- Search analytics (what users search, what they don't find)
- **PDF export for reports** (leverages v3.2 print pipeline)

**Effort:** ~3 weeks

**Blockers:** Requires pre-aggregation cron to keep dashboards fast.

**Priority:** Medium — decision-making tool for admins.

---

#### 🎯 Advanced AI features

**Why:** Current AI is read-only, tool-based. Next step: semantic search + personalization.

**What:**
- **Semantic search** — "fancy suit for wedding" → matches suits
- **"Recommended for you"** — based on browsing history
- **Auto-generated product descriptions** — for new products
- **Customer support chatbot** — with FAQs + order lookup
- **Multi-turn context** — "show me that in blue" after seeing a suit
- **Voice input** via browser Web Speech API (progressive enhancement)

**Effort:** ~4 weeks

**Blockers:** Needs vector embeddings (Voyage, OpenAI, or self-hosted) + cost analysis. Trade-off: semantic search requires an embedding store.

**Priority:** Medium — nice-to-have, current tools work well.

---

## Long Term — 12+ Months

### 2027+ and beyond

#### 🎯 Mobile app (React Native)

**Why:** Native app delivers better UX. Push notifications, offline, biometric auth.

**What:**
- React Native app (Expo)
- Shared business logic with web (via monorepo)
- Native camera for AR try-on (future)
- Push notifications
- Deep linking
- **AI chatbot** integrated natively
- **Offline-first** with local SQLite sync

**Effort:** ~3 months

**Blockers:** Significant investment. Only if user base justifies it.

**Priority:** Low — web PWA covers mobile UX well.

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
- Per-vendor PDF reports

**Effort:** ~6 months

**Blockers:** This is a different product. Would be a v5.0 or a fork.

**Status:** Not planned unless there's strong demand.

---

#### 🎯 ML-powered recommendations

**Why:** Current recommendations are rule-based. ML would personalize.

**What:**
- Train model on purchase history
- "Recommended for you" personalization
- Product affinity (customers who bought X also bought Y)
- Cohort retention analysis
- **AI-generated product descriptions** based on attributes
- **Search ranking** based on click-through data

**Effort:** ~2 months

**Blockers:** Needs data volume (10K+ orders) and ML infrastructure. Also: cost vs benefit at our scale.

**Priority:** Low — rule-based recs work well for now.

---

#### 🎯 Omnichannel

**Why:** Physical + online integration.

**What:**
- POS integration for in-store purchases
- Click-and-collect (buy online, pickup in store)
- Inventory sync across channels
- Unified customer profiles
- Unified order history (online + in-store)

**Effort:** ~4 months

**Blockers:** Requires physical store presence. Not applicable if purely online.

**Priority:** Depends on business expansion.

---

#### 🎯 Self-hosted AI inference

**Why:** Groq free tier caps at 1K/day. Paid tier adds per-request cost.

**What:**
- Deploy Llama or Mistral on dedicated GPU (vLLM, Ollama)
- Or use serverless inference (Replicate, Together AI)
- Swap `getGroq()` in `src/lib/ai/groq.ts` for a custom endpoint
- Cost: ~$20-50/month for low-traffic, vs per-request pricing

**Effort:** ~1 week (integration)

**Blockers:** Cost analysis. Only worth it at high volume (>50K AI requests/month).

**Priority:** Reactive — evaluate if Groq usage grows.

---

#### 🎯 Server-side PDF generation (if needed)

**Why:** Current PDF export uses browser's native print (client-side). If we need to **email PDFs as attachments**, we'll need server-side generation.

**What:**
- Add Puppeteer-as-a-service (Browserless.io, PDFShift) OR
- Self-hosted Puppeteer Lambda on AWS
- Reuse existing `ExportPrintView` component (same interface)
- Same print CSS (already A4-optimized)
- New API route: `/api/admin/pdf/[type]` returns PDF bytes
- Attach to emails (e.g., invoice attached to `order-delivered`)

**Effort:** ~1 week

**Blockers:** None technical. Decision depends on whether the feature is needed.

**Why we haven't done this yet:** Browser-native print is superior for admin use (full control, WYSIWYG). Only switch if automated delivery is required.

**Priority:** Low — admin use case is well-served by current implementation.

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

### ❌ Buying in bulk discount

**Why not:** Our products are premium, single-quantity purchases. Bulk discount would cannibalize margins.

### ❌ Multiple stores / white-label

**Why not:** We're single-vendor, single-brand. Forking for other brands is a documentation task, not a feature.

### ❌ Admin mobile app

**Why not:** Admin panel is already mobile-responsive (with editorial redesign). A native app adds ~6 months of work for marginal benefit.

### ❌ Dark mode toggle (light mode)

**Why not:** Our brand is dark. Light mode would break the visual identity. If we ever support it, it'd be a full redesign, not a toggle.

### ❌ Blockchain NFTs for authenticity

**Why not:** Solutions looking for problems. NFT receipts don't add value over regular receipts for physical goods.

### ❌ Deep integration with Facebook/Instagram

**Why not:** We use standard OG tags for share previews. Facebook Shop integration is complex and platform-specific. If demand emerges, we'd add via a service, not build.

### ❌ RAG for the AI chatbot

**Why not:** Vector embeddings + separate vector store + weekly re-indexing. For ~500 products, tool-calling is simpler and always correct. See [Developer FAQ → AI & Chatbot](./faq-developer.md#ai--chatbot).

**When we'd revisit:** If catalog grows beyond 10,000 products and semantic search becomes a hard requirement.

### ❌ Third-party analytics (Mixpanel, Amplitude)

**Why not:** We already use MongoDB for events + sessions. A `$group` aggregation over 100K events is fast and free. Third-party adds a script (page weight), a vendor, and monthly cost.

**When we'd revisit:** If we needed funnel visualization, cohorts, or user-level segmentation. Then we'd add PostHog (open-source, self-hostable).

### ❌ Session recording (Hotjar, FullStory)

**Why not:** Privacy-invasive, expensive, and heavy. Our session tracking captures the *what* (paths, products, orders), not the *how* (mouse movements, scroll patterns). Sufficient for e-commerce decisions.

### ❌ A/B testing framework

**Why not:** Low traffic volume makes A/B testing statistically meaningless. At 10K visitors/month, we'd need months for significance. Better to use qualitative feedback (customer emails, chat transcripts).

**When we'd revisit:** At 100K+ monthly visitors, we'd add PostHog Experiments or GrowthBook.

### ❌ Puppeteer for PDF generation (v3.2 decision)

**Why not:** 
- 300MB+ Chromium binary
- Not serverless-compatible (Vercel Function limits)
- Cold start 3-8s per render
- $20+/month for hosted alternative

Browser-native print (v3.2) is superior for admin use. See [Server-side PDF generation](#-server-side-pdf-generation-if-needed) for the one scenario where we'd add it.

**When we'd revisit:** If we need to email PDFs as attachments (server-side generation required).

### ❌ PDF library (pdfkit, pdfmake, jspdf) (v3.2 decision)

**Why not:**
- 200-500KB bundle size
- Manual layout (x/y coordinates, not CSS)
- Manual table drawing
- Manual page breaks
- Encoding issues with currency symbols

Browser-native print handles all of this natively. See [PDF Print Export Pipeline](./architecture.md#pdf-print-export-pipeline).

### ❌ CSS-in-JS (styled-components, Emotion) (v3.2 decision)

**Why not:**
- Runtime cost (styles generated in JS)
- No RSC compatibility
- Larger bundle
- Conflicts with Next.js App Router streaming

Tailwind v4 + design tokens (v3.2) covers 100% of our needs at 0 runtime cost.

### ❌ Design system library (shadcn/ui, Radix) (v3.2 decision)

**Why not:**
- We'd be building on someone else's tokens
- Adds 50-100KB for patterns we can build in 100 lines
- Our aesthetic (dark editorial) doesn't match their defaults
- Every customization = fighting the library

Our design system (v3.2) is documented, tested, and fully under our control.

### ❌ Component library (Chakra, MUI, Ant Design) (v3.2 decision)

**Why not:**
- 100-500KB bundle size
- Opinionated visual style
- Hard to customize without overriding everything
- Doesn't fit our editorial dark theme

Built 30 tiny components with Tailwind. Total ~10KB. Full control.

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
5. **Does it fit the design system?** (If not, does it justify adding a new pattern?)

If yes to all five, open an issue with:
- **Problem statement** — What problem does it solve?
- **Proposed solution** — How should it work?
- **Alternatives considered** — What else did you think of?
- **Success criteria** — How do we know it worked?
- **Design mockup** — Rough sketch or wireframe (optional but helpful)

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
| v3.1.0 | AI chatbot + PWA + auth polish | ✅ Shipped |
| v3.2.0 | Editorial redesign + PDF export + cron hardening | ✅ Shipped |
| v3.3.0 | Multi-currency + Sentry | 🚧 In progress |
| v3.4.0 | Order tracking + i18n | 📅 Planned |
| v4.0.0 | Loyalty + gift cards + advanced analytics | 🔮 Future |
| v5.0.0 | Mobile app / Marketplace | 🔮 Speculative |

---

## What Changed in This Update (v3.2)

**Shipped in v3.2:**
- ✅ Editorial UI/UX redesign (120+ files)
- ✅ PDF print export (5 types, zero-dependency)
- ✅ Cron hardening (throttle-on-success, param order fix)
- ✅ Auth fix (`token_hash` password reset flow)
- ✅ Checkout fix (`order_placed` event on Stripe)
- ✅ All 10 email templates redesigned
- ✅ Organized screenshot structure

**Reordered priorities:**
- **Sentry** moved up — critical observability gap
- **Multi-currency** stays top priority — highest revenue impact
- **Order tracking via couriers** moved up — reduces support load
- **Multi-language (i18n)** stays medium — depends on user base
- **Advanced analytics** now includes PDF export (leverages v3.2 pipeline)

**Removed from "planned":**
- ~~Puppeteer for PDF~~ → Deliberately not doing (browser-native is better)
- ~~PDF library~~ → Deliberately not doing (same reason)

**Added to "What we're not doing":**
- Puppeteer for PDF generation
- PDF library (pdfkit, pdfmake, jspdf)
- CSS-in-JS (styled-components, Emotion)
- Design system library (shadcn/ui, Radix)
- Component library (Chakra, MUI, Ant Design)

**Added as conditional future:**
- **Server-side PDF generation** — Only if we need to email PDFs as attachments

---

## Feedback

This roadmap is a living document. If something is unclear, misprioritized, or missing:

- Open an issue
- Start a discussion
- Email me

I genuinely read every response. Your feedback shapes this project.

---

<p align="center">
  <em>Last updated: 2026-10-16 · Review quarterly · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```

---
