# Developer FAQ

> **Audience:** Developers working on VESTIOR, or evaluating it for adoption.
>
> **Companion to:** [README FAQ](../README.md#-faq) (which covers user-facing questions)

---

## Table of Contents

- [Architecture Decisions](#architecture-decisions)
- [Database](#database)
- [Authentication](#authentication)
- [Payments](#payments)
- [Emails](#emails)
- [Performance](#performance)
- [Testing](#testing)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Extending](#extending)

---

## Architecture Decisions

### Why Next.js App Router over Pages Router?

**Short answer:** Server Components.

**Long answer:** App Router gives us:
- React Server Components (RSC) — zero JS for server-only components
- Nested layouts — shared UI without re-rendering
- Streaming SSR — better perceived performance
- Route groups — organize files without affecting URLs
- Server Actions — mutations without API routes

Pages Router would require an API layer for every mutation. App Router collapses that.

**Trade-offs:**
- Steeper learning curve
- Some libraries aren't compatible (e.g., older CMS clients)
- Debugging is less familiar

For a greenfield project in 2026, App Router is the right choice.

---

### Why two databases?

**Short answer:** Different access patterns.

**Long answer:** See [Architecture → Dual-Database Rationale](./architecture.md#dual-database-rationale).

**Real costs:**
- Two connection pools (Vercel function cold-start overhead)
- Two backup strategies
- Two query languages (SQL + MongoDB)

**Real benefits:**
- Supabase handles ACID + RLS (impossible in MongoDB)
- MongoDB handles high-volume events without index bloat

We'd unify if:
- Traffic drops below 1K events/day
- We stop needing analytics
- MongoDB becomes a maintenance burden

Neither is close to happening.

---

### Why Upstash over self-hosted Redis?

**Short answer:** Serverless compatibility.

**Long answer:** Traditional Redis uses TCP connections. Vercel Functions don't maintain TCP connections across invocations — each cold start opens new ones. This exhausts connection limits fast.

Upstash is HTTP-based. Every request is a stateless HTTP call. No connection pooling needed.

**Trade-offs:**
- Latency: ~5-10ms vs ~1ms for self-hosted
- Cost: Pay-per-request
- Vendor lock-in

For our scale (< 1M requests/month), the latency difference is imperceptible. Cost stays free-tier.

---

### Why no Redux / Zustand / Jotai?

**Short answer:** React Context is enough.

**Long answer:** We have three state stores:

1. **Auth** (`AuthProvider`) — user object
2. **Wishlist** (`WishlistProvider`) — product IDs
3. **Notifications** (`AdminNotificationsProvider`) — admin alerts

All three are:
- Used app-wide
- Updated infrequently
- Small in size (< 100 items)

Context handles this perfectly. A dedicated state library would add:
- Bundle size (~10KB)
- Learning curve for new contributors
- One more abstraction to debug

**When we'd add one:** If we had 10+ context providers, or if we needed time-travel debugging.

---

### Why no TypeScript `strict: false` anywhere?

**Short answer:** Strict mode catches bugs.

**Long answer:** `strict: true` enables:
- `noImplicitAny` — no silent `any`
- `strictNullChecks` — `null` and `undefined` are explicit
- `strictFunctionTypes` — safer function signatures
- `strictBindCallApply` — safer `.bind()`, `.call()`, `.apply()`

Every non-strict codebase we've worked on has had runtime null errors. Strict mode eliminates that class of bug.

**The cost:** More annotations. But writing `string | null` explicitly is *thinking time*, not typing time. It forces you to consider edge cases.

**The escape hatch:** `// @ts-expect-error` with a comment. Used 3 times in this codebase, all for third-party type mismatches.

---

### Why Tailwind over CSS-in-JS?

**Short answer:** Performance + DX.

**Long answer:**

**Performance:**
- Tailwind generates CSS at build time (no runtime)
- CSS-in-JS libraries (styled-components, Emotion) inject styles at runtime
- Runtime injection causes: larger bundle, layout thrash, hydration mismatches

**DX:**
- Tailwind classes are discoverable via autocomplete
- CSS-in-JS requires knowing the library's API
- Tailwind v4 has zero-config setup with Next.js

**Trade-offs:**
- Long class strings
- No dynamic styles (unless using `style` prop)
- Learning curve for utility-first

**When we'd switch:** Never. The benefits are too clear.

---

## Database

### Why is `products.images` a `text` column instead of `jsonb`?

**Historical reason.** The original schema used `text` to store a JSON array. When we moved to a proper array, we kept it for compatibility.

**Why not migrate?**
- Migration requires updating all 40+ products
- `parseProductImages` handles both formats transparently
- No user-facing benefit

**When we'd migrate:** If we need server-side `jsonb` operators (e.g., `images @> '["url"]'`).

---

### Why is `orders.items` a `jsonb` snapshot AND `order_items` a table?

**Both serve different needs:**

- **`orders.items`** — Immutable snapshot. If a product's name changes, historical orders must still show the original.
- **`order_items`** — Queryable for joins (e.g., "which products are selling best?").

Duplication is intentional. The JSON is a cache; the table is the source.

**Rule:** If you need to modify item data, update both.

---

### Why no foreign key on `orders.items[].product_id`?

Because `items` is `jsonb`. Postgres can't enforce FKs inside JSON.

**Alternative:** The `order_items` table has proper FKs. If referential integrity matters, query that table.

**If we needed FK on `items`:** We'd normalize — remove `items` JSON and always join `order_items`.

---

### How do you handle soft delete?

**Products:** `is_active = false`. Hidden from storefront, preserved in DB.

**Users:** Cascade delete on `auth.users`. All related rows (orders, reviews, wishlist) cascade.

**Reviews:** Hard delete by admin. But audit log preserves the action.

**Coupons:** Hard delete. Redemptions cascade.

**Philosophy:** Soft delete for user-content (products). Hard delete for admin-content (coupons). Audit log for compliance.

---

### Why `is_admin()` is `SECURITY DEFINER`?

Because it reads `profiles`, which itself has RLS. Without `SECURITY DEFINER`, the function would recurse infinitely (RLS calls function, function queries profiles, RLS on profiles fires, calls function, ...).

`SECURITY DEFINER` runs the function as the defining user (postgres), bypassing RLS for the query *inside the function only*. The outer query still respects RLS.

**Safety:**
- `SET search_path = public, pg_temp` prevents hijacking
- `REVOKE ALL ... FROM PUBLIC` prevents misuse
- `GRANT EXECUTE ... TO authenticated` limits callers

---

## Authentication

### Why Supabase Auth over NextAuth?

**Supabase Auth:**
- Integrated with our DB (RLS uses `auth.uid()`)
- Handles OAuth, email verification, password reset
- Free tier covers 50K MAU
- Session management via HTTP-only cookies
- Zero custom code for auth flow

**NextAuth:**
- Requires a database adapter (custom code)
- Doesn't integrate with RLS natively
- More configuration
- Session management is manual

**Result:** We'd write ~500 lines of NextAuth glue to replicate what Supabase gives us for free.

---

### Why HTTP-only cookies instead of localStorage?

**Security.** localStorage is accessible to any JavaScript on the page. If XSS happens, the attacker steals the token.

HTTP-only cookies are not accessible to JavaScript. XSS can't steal the session.

**Trade-off:** Cookies are sent with every request. For a SPA, this is usually fine.

**SameSite=Lax** prevents CSRF for top-level navigation.

---

### Why PKCE for OAuth?

**PKCE** (Proof Key for Code Exchange) prevents authorization code interception.

**Flow:**
1. Client generates `code_verifier` (random)
2. Client hashes it → `code_challenge`
3. Redirect to Google with `code_challenge`
4. Google returns `code`
5. Client sends `code` + `code_verifier` to our server
6. Server hashes `code_verifier`, compares to `code_challenge`

**Why it matters:** Even if an attacker intercepts the `code`, they can't exchange it without the `code_verifier`.

**Implicit flow** (no PKCE) would expose tokens in URL fragments. Not acceptable in 2026.

---

## Payments

### Why Stripe over Razorpay/PayPal?

**Stripe:**
- Best-in-class API
- Excellent developer experience
- Supports Pakistan (via test mode for now)
- Rich webhook ecosystem
- Free tier for testing

**Razorpay:**
- India-focused
- Limited Pakistan support
- Less polished API

**PayPal:**
- Not available in Pakistan for merchant accounts
- Would require a foreign entity

**Migration path:** The provider abstraction (`PaymentProvider` interface) means adding Razorpay is a single-file change.

---

### Why `capture_method: 'automatic'`?

Stripe's default is `automatic_async` — payment captures when the charge succeeds. We let Stripe handle capture.

**Earlier mistake:** We called `stripe.paymentIntents.capture()` after success, which threw "already captured". Fixed by using `retrieve()` to verify status instead.

**When to use manual capture:** If you want to authorize first, then capture later (e.g., for pre-orders). Not our use case.

---

### Why confirm payment on the client AND via webhook?

**Defense in depth.**

**Client-side confirm:**
- Fast feedback for user
- Works without webhook (dev mode)
- Immediate UI update

**Webhook:**
- Authoritative (source of truth is Stripe's server)
- Works if client crashes mid-flow
- Retries automatically if our endpoint fails

**Both paths are idempotent** (via Redis SETNX). Whichever fires first wins; the second is a no-op.

---

### Why no PCI compliance certification?

We use **Stripe Elements**, which means:
- Card data never touches our servers
- Card data goes directly from browser → Stripe
- We only store `payment_intent_id` (a reference, not card data)

This puts us in **SAQ A** compliance tier (the simplest). Stripe handles SAQ D (the hard one).

**If we built a custom checkout:** We'd need SAQ D, which costs $50K+ in audits. Not worth it.

---

## Emails

### Why Gmail SMTP over Resend?

**Gmail SMTP:**
- Sends to any recipient without domain verification
- 500 emails/day (personal account)
- Free
- Fast setup

**Resend:**
- 3000 emails/month free tier
- Requires domain verification to send to non-verified addresses
- Better analytics (opens, clicks)
- Better for scale

**Our choice:** Start with Gmail SMTP. Migrate to Resend when:
1. We hit 500 emails/day
2. We need better deliverability
3. We verify our own domain

**Migration path:** Change `mailer.ts` from Nodemailer to Resend SDK. Everything else stays.

---

### Why QStash over Vercel cron for emails?

**Vercel cron:**
- Limited to 1 per Hobby project
- No built-in retries
- Triggers a function; must finish in 10-60s

**QStash:**
- HTTP-based queue
- Automatic retries with backoff
- Dead Letter Queue for failures
- Per-message pricing
- No worker to deploy

**The problem we're solving:** SMTP connections take 2-5s. On Vercel Hobby (10s limit), we're racing the clock. QStash decouples the user request from the email send.

**Trade-off:** Adds QStash as a dependency. If QStash is down, emails queue but don't send.

---

### Why React Email over HTML strings?

**React Email:**
- Type-safe templates (props are typed)
- Component composition
- Renders to HTML at build time
- Preview server for local dev
- No XSS risk from user data

**HTML strings:**
- Prone to typos
- No type safety
- XSS risk if user data isn't escaped
- No preview

**The cost:** `@react-email/components` + `@react-email/render` add ~50KB to the server bundle (not client).

**Worth it?** Yes. The DX is 10x better, and emails look professional.

---

## Performance

### Why 98 desktop / 84 mobile (Lighthouse)?

Mobile hardware is slower:
- 4G network vs WiFi
- Slower CPU
- Smaller viewport triggers more layout calculations
- Lighthouse uses Moto G Power emulation (mid-range phone)

**Our biggest mobile issue:** LCP (Largest Contentful Paint) is 3.5s. Desktop is 0.5s.

**Why the difference?**
- Hero image is 60KB. On 4G, that's ~300ms download.
- Client-side hydration takes ~1.5s on mobile CPUs.
- Framer Motion animations add ~300ms.

**How we got here:**
- Started at 12.4s LCP on mobile
- Removed animation from LCP elements (h1, p)
- Added AVIF/WebP via next/image
- Deferred GA4
- ISR'd public pages

**Remaining bottleneck:** Framer Motion JS on mobile. Could be reduced further by removing animations from non-critical elements.

---

### Why no bundle analyzer in CI?

**Analyzer output is noisy.** It shows "this chunk is 50KB" without telling you if 50KB is too much.

Instead, we:
- Run analyzer locally before major changes
- Set size budget alarms in Lighthouse
- Deploy and measure with real users

**If we needed automated bundle monitoring:** We'd add `size-limit` GitHub Action with per-file budgets.

---

### Why `revalidate: 300` on public pages?

**Balance between freshness and speed.**

- 300 seconds = 5 minutes
- Product updates propagate within 5 min
- Most users see cached version (fast)
- Vercel CDN serves millions without hitting our DB

**If we needed instant updates:** We'd use `revalidateTag` to invalidate specific pages on product change. Adds complexity.

---

## Testing

### Why Vitest over Jest?

**Vitest:**
- Native ESM support
- Vite-based (fast)
- Same API as Jest
- Built-in coverage
- No config gymnastics for TypeScript

**Jest:**
- Mature, widely used
- Slower on modern JS
- ESM support is hacky
- Needs `ts-jest` or `babel-jest`

**Migration path:** Vitest's API is Jest-compatible. If we ever need to switch back, it's a config change.

---

### Why Playwright over Cypress?

**Playwright:**
- Multi-browser (Chromium, Firefox, WebKit)
- Fast parallel execution
- Native TypeScript
- Auto-waiting by default
- Better debugging (trace viewer)

**Cypress:**
- Excellent DX
- Slower
- Limited cross-browser (paid for some)
- Runs in-browser (limits some assertions)

**Our use case:** We only need Chromium (Safari/Firefox users are < 5%). Playwright's speed wins.

---

### Why E2E over integration tests?

**Pragmatic answer:** Integration tests require mocking Supabase, Redis, MongoDB, Stripe. That's a lot of setup.

**Our approach:** Test the full stack via E2E. Slower but more realistic.

**Trade-off:** E2E is flakier (network, timing). We mitigate with:
- `workers: 1` (no parallelism)
- 3 retries in CI
- `waitForFunction` instead of fixed timeouts

**When we'd add integration tests:** If a bug keeps slipping through E2E.

---

## Deployment

### Why Vercel over Railway/Render/Fly.io?

**Vercel:**
- Zero-config Next.js deployment
- Auto-scaling
- Global CDN
- Preview deploys per PR
- Free tier for hobby projects
- Integrated cron + edge functions

**Railway:**
- More control
- Requires Docker config
- Cheaper at scale

**Fly.io:**
- Global edge
- Cheap
- Steeper learning curve

**Our choice:** Vercel for MVP. If we hit Vercel's free-tier limits, migrate to Fly.io.

---

### Why Vercel containers (Docker) if we're not using them?

**Two reasons:**

1. **Portability.** The `Dockerfile.vercel` proves the app runs in a container. If we migrate to Railway/Fly.io, we're ready.

2. **Isolation.** Some workloads (PDF generation, image processing) benefit from running in containers with system dependencies. We haven't needed this yet, but the option exists.

**Note:** We're not running containers today. The file exists for future use.

---

### Why Hobby plan with only 1 cron?

**Cost.** Vercel Pro is $20/user/month. For a personal project, that's a real cost.

**Workaround:** Combine crons into one endpoint (`/api/cron/daily`) that runs both jobs sequentially. Slight latency cost, zero monthly cost.

**When to upgrade:** If we hit commercial usage (Vercel's Hobby plan is for non-commercial use). At that point, upgrade to Pro.

---

## Local Development

### Why is my build slow on F: drive?

**Filesystem performance.** NTFS on slower drives (especially non-SSD) has high file stat latency. Next.js Turbopack reads thousands of files during build.

**Solutions:**
1. Move project to an SSD (`C:` drive if possible).
2. Use WSL2 (Linux filesystem is much faster).
3. Increase build memory: `NODE_OPTIONS="--max-old-space-size=8192"`.

**If neither works:** Accept slower builds. The app is still fast at runtime.

---

### Why does the app fail to start with "Cannot find module 'server-only'"?

**Cause:** You're running code outside Next.js (e.g., in a raw Node script).

**Why:** The `server-only` package is a Next.js marker. It throws when imported in a non-Next.js context.

**Fix:** In tests, alias `server-only` to an empty module (see `vitest.config.mts`). For Node scripts, don't import server-only modules.

---

### Why does QStash fail with "endpoint resolves to a loopback address"?

**Cause:** QStash can't reach `localhost`. It's a cloud service.

**Fix:** In development, we detect `NEXT_PUBLIC_SITE_URL` starting with `http://` and send emails directly (bypassing QStash). See `queueEmail()` in `src/lib/email/queue.ts`.

**To test QStash locally:** Use a tunnel (ngrok, cloudflared) and update `NEXT_PUBLIC_SITE_URL`. This is optional — the direct-send fallback works for most cases.

---

### Why does my cart count show 0 after refresh, but the cart page shows items?

**Cause:** Cart in localStorage but navbar doesn't re-read on mount.

**Why:** The navbar reads cart in `useEffect` listening to `cartUpdated` events. On initial mount, it reads from localStorage.

**If it's not working:**
- Check `localStorage.getItem('cart')` in DevTools Console.
- Ensure `dispatchEvent(new Event('cartUpdated'))` is called after localStorage changes.
- Check for errors in the browser console.

**Related:** This was a bug in v1.0. Fixed in v1.1.

---

## Common Tasks

### How do I add a new product category?

1. Create products with the new `category_main` value (via admin panel).
2. Update `src/components/CategorySection.tsx` to add a tile.

That's it. Categories are data-driven.

---

### How do I add a new email template?

1. Create `src/lib/email/templates/my-template.tsx`.
2. Export a default React component.
3. Add to `EmailTemplate` type in `src/lib/email/types.ts`.
4. Add to `SUBJECTS` map in `src/lib/email/render.tsx`.
5. Add a `case` in the `renderEmail` switch.
6. Trigger from wherever needed via `queueEmail({ template: 'my-template', ... })`.

---

### How do I add a new payment provider?

1. Create `src/lib/payments/providers/my-provider.ts`.
2. Implement the `PaymentProvider` interface (see `types.ts`).
3. Register in `src/lib/payments/index.ts`.
4. Add to `PaymentProviderId` type.
5. Update checkout UI to offer it.

---

### How do I add a new admin page?

1. Create `src/app/admin/my-page/page.tsx`.
2. Add `loading.tsx` for the loading state.
3. Add to `menuItems` in `src/components/admin/AdminSidebar.tsx`.
4. (Optional) Add data fetching in the page (server component).
5. (Optional) Add client components for interactivity.

---

### How do I add a new database migration?

1. Create `supabase/migrations/YYYYMMDD_description.sql`.
2. Write **idempotent SQL** — use `IF NOT EXISTS`, `DROP POLICY IF EXISTS`.
3. Test in dev Supabase.
4. Run in prod Supabase.
5. Commit the file.

**Never edit an existing migration** — always add a new one.

---

### How do I change the color scheme?

1. Edit `src/app/globals.css` — update CSS custom properties (`--accent`, etc.).
2. Search-and-replace Tailwind classes:
   - `blue-500` → your primary color
   - `indigo-500` → your secondary color
3. Update any hardcoded hex codes (`#3B82F6` → your hex).
4. Test visually on all pages.

---

## Debugging

### How do I see server-side logs?

**Vercel:** Dashboard → Project → Logs → filter by "Function Logs".

**Local:** Terminal where `npm run dev` is running.

**Format:** Every log includes a prefix like `[queueEmail]`, `[stripe-webhook]`, etc.

---

### How do I see the actual Stripe webhook payload?

**Stripe Dashboard:** Developers → Webhooks → [your endpoint] → click a delivery → "Event" tab.

**Our logs:** `[stripe-webhook]` logs include the event type. Full payload is stored in `payment_transactions.webhook_events[].raw`.

**MongoDB query:**
```javascript
db.payment_transactions.findOne(
  { order_id: "your-order-id" },
  { webhook_events: 1 }
)
```

---

### How do I know if a user actually received an email?

**MongoDB `email_logs`:**
```javascript
db.email_logs.find({ email: "user@example.com" }).sort({ created_at: -1 })
```

Look for:
- `status: 'sent'` — Gmail accepted
- `status: 'failed'` — SMTP error (check `error` field)
- `status: 'queued'` — QStash hasn't processed yet

**Note:** `sent` doesn't guarantee delivery. For actual delivery status, enable Resend webhooks.

---

### How do I see what admins have been doing?

**Admin panel:** `/admin/audit` — table with all actions.

**MongoDB:**
```javascript
db.audit_logs.find({ actor_email: "admin@example.com" }).sort({ timestamp: -1 })
```

Every action includes: actor, action type, target, before/after state, IP hash.

---

### Why is MongoDB not saving my cart snapshot?

**Checklist:**
1. Are you logged in? Cart sync only runs for authenticated users.
2. Check `/api/cart/sync` in browser DevTools → Network tab.
3. Look for a MongoDB error in terminal.
4. Verify `MONGODB_URI` in `.env.local`.
5. Check MongoDB Atlas → Network Access → is your IP allowed?

---

## Extending

### Can I fork VESTIOR for my own store?

Yes. MIT license means you can:
- Use it commercially
- Modify it
- Distribute it

**Recommended steps:**
1. Fork the repo.
2. Update branding (logo, colors, footer contact).
3. Replace product catalog.
4. Update `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`.
5. Set up your own Supabase/MongoDB/Upstash accounts.
6. Deploy to your Vercel account.

**Attribution:** Not required, but appreciated.

---

### Can I use this for a different product type (not clothing)?

Yes. The core commerce logic is generic. You'll need to:
- Update categories (`category_main` values)
- Replace imagery and branding
- Adjust size options if not applicable (currently XS-3XL + Custom)
- Possibly modify the reviews form (clothing-specific questions)

---

### How do I add PayPal?

PayPal isn't available in Pakistan for merchants. If you're in a supported region:

1. Get PayPal Business account.
2. Copy the pattern from `stripe.ts`.
3. Implement `PaymentProvider` interface.
4. Register in `lib/payments/index.ts`.
5. Add a "PayPal" option in checkout.
6. Handle webhook signature verification.

**Estimated effort:** ~1 week.

---

### How do I add a new language?

1. Choose an i18n library (next-intl, react-i18next).
2. Set up locale routing.
3. Extract all strings to JSON files.
4. Add language switcher to navbar.
5. Update email templates to be language-aware.
6. Test RTL layout (if adding Urdu/Arabic).

**Estimated effort:** ~2-4 weeks (mostly translation).

---

### How do I add Slack notifications for new orders?

**Option A — Slack webhook:**
1. Create a Slack Incoming Webhook.
2. In `AdminNotificationsProvider`, after adding notification, POST to the webhook URL.
3. Format message with order details.

**Option B — Slack app:**
1. Create a Slack app with `chat:write` scope.
2. OAuth the app to your workspace.
3. POST to Slack API with token.

**Estimated effort:** ~2 hours (Option A).

---

### How do I add two-factor authentication?

**Option A — Supabase MFA:**
1. Enable MFA in Supabase dashboard.
2. Add MFA enrollment flow in profile page.
3. Enforce MFA challenge on login.

**Option B — TOTP library:**
1. Add `speakeasy` or `otpauth`.
2. Store TOTP secret in `profiles`.
3. Show QR code during enrollment.
4. Verify code on login.

**Estimated effort:** ~3-5 days.

---

### How do I add a chat widget?

**Option A — Third-party (Crisp, Intercom):**
1. Sign up for a service.
2. Add their script to `layout.tsx`.
3. Done in 10 minutes.

**Option B — Custom:**
1. Build a chat UI.
2. Use Supabase Realtime for messages.
3. Admin panel gets a "Chats" page.

**Estimated effort:** ~1 week (Option B).

---

## Still stuck?

- Search the [issues](https://github.com/zainshah3464/vestior-store/issues)
- Open a new [discussion](https://github.com/zainshah3464/vestior-store/discussions)
- Email **zainshahzs110@gmail.com** (for non-public questions)

---

<p align="center">
  <em>Last updated: 2026-10-12 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```