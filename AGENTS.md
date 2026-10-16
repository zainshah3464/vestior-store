# AGENTS.md — VESTIOR

> **For AI coding agents (Cursor, Claude Code, Copilot, Windsurf, Codex).**
> 
> Read this file before making any changes. For deep dives, follow the
> linked docs. If you're unsure about a pattern, check `docs/` first —
> don't invent a new one.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Project Overview

**VESTIOR** is a production-grade, single-vendor men's fashion e-commerce platform.

- **Stack:** Next.js 16 (App Router, RSC, Turbopack) · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · Framer Motion 12
- **Backend:** Supabase (Postgres + Auth + Storage + Realtime) + MongoDB Atlas (events/sessions/logs) + Upstash Redis (rate limits/idempotency) + Upstash QStash (email queue)
- **Integrations:** Stripe (payments) · Gmail SMTP (email) · Groq (AI chatbot)
- **Current version:** v3.2.0

**Reference docs (read before deep work):**
- `README.md` — overview + setup
- `docs/architecture.md` — design philosophy, dual-DB, editorial UI, PDF pipeline, cron pipeline
- `docs/security.md` — threat model, RLS, print route security, cron security
- `docs/api-reference.md` — Server Actions, RPCs, REST routes, print routes
- `docs/database.md` — schema, RLS, indexes, migrations, Redis keys
- `docs/testing.md` — unit, E2E, print, cron, editorial UI testing
- `docs/contributing.md` — coding standards, design system, PR process
- `docs/faq-developer.md` — architecture decisions, debugging
- `docs/deployment.md` — Vercel, Docker, VPS deployment

---

## Non-Negotiable Rules

**Read these first. Violating them will get your PR rejected.**

### 1. Server Components by default

- RSC is the default. Only add `'use client'` when you need interactivity (state, effects, browser APIs, event handlers).
- **Auth checks come BEFORE data fetch** in Server Components. Never fetch data first, then check role — that's a data leak.

### 2. Every Server Action must:

1. Be `'use server'` at the top
2. Validate inputs with Zod (`safeParse` + throw on failure)
3. Re-authenticate with `auth.getUser()` on every call
4. Authorize against `profiles` table (not JWT claims)
5. Fail closed — throw on error, no silent success

### 3. Every admin route / action:

- Re-verify `role === 'admin'` from `profiles` table
- For role changes: verify `is_super_admin` (via `admin_change_user_role` RPC)
- Never trust client-supplied role

### 4. AI chatbot (Groq) rules:

- Tools are **read-only** — no INSERT/UPDATE/DELETE
- `getMyOrders` uses the **user session client** (RLS-enforced), not service role
- Client can only send `user` / `assistant` roles — Zod enum rejects `system`
- System prompt is **server-only** (`lib/ai/system-prompt.ts`)
- Fail-closed if `GROQ_API_KEY` missing (return 503, no fallback)
- `stopWhen: stepCountIs(3)` — bounded tool calls
- `maxOutputTokens: 800` — bounded response size

### 5. Database:

- **RLS on every table.** No exceptions.
- **RPCs use `SET search_path = public, pg_temp`** always.
- **`SECURITY DEFINER` only when necessary** — document why.
- **Migrations are idempotent** (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`).
- **Never edit an existing migration.** Add a new one.
- **Never drop a table without a backup.**

### 6. Redis keys:

- **Never write a key without a TTL.**
- Naming conventions:
  - `rl:{tier}:{key}` — rate limits
  - `idem:{scope}:{key}` — idempotency
  - `throttle:cron:{name}` — cron throttles
- **Cron throttle: set ONLY on real success** (v3.2 pattern). Never set before work.

### 7. Print export (v3.2):

- Server Component with **admin verify BEFORE data fetch**
- Type whitelist (`orders` / `payments` / `emails` / `users` / `audit`)
- 10,000 row cap
- **No Puppeteer. No PDF library.** Browser-native print only.
- Service worker skips `/admin/*` (print routes covered by prefix)

### 8. Editorial design system (v3.2):

- Use design tokens — no ad-hoc colors/spacing
- Card base: `bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] p-5 rounded-2xl`
- Semantic accents: Indigo (primary), Emerald (success), Amber (warning), Red (danger), Violet (info), Teal (secondary)
- Numbers: always `tabular-nums`
- Eyebrows: `text-[10px] tracking-[0.18em] uppercase`
- Motion: easing `[0.22, 1, 0.36, 1]`, duration `0.4s`, stagger `0.06s`
- Respect `prefers-reduced-motion`
- **If a pattern doesn't exist, propose it first (open an issue) — don't invent a new one**

### 9. Server-only modules:

Import `'server-only'` at the top of any file that touches secrets:

```typescript
import 'server-only'
```

Modules that MUST be server-only:
- `lib/supabase/admin.ts`
- `lib/mongodb.ts`, `lib/redis.ts`
- `lib/payments/providers/stripe.ts`
- `lib/email/*.ts`, `lib/email/templates/*.tsx`
- `lib/audit.ts`
- `lib/ai/groq.ts`, `lib/ai/system-prompt.ts`, `lib/ai/tools.ts`
- `lib/qstash/verify.ts`
- All Server Actions
- All `queries.ts` files

---

## Testing Requirements

**Run before every PR:**
```bash
npm run typecheck   # Must be clean
npm run lint        # Must be clean
npm run test        # 53 unit tests, all pass
npm run test:e2e    # 21 E2E tests, all pass
npm run build       # Must succeed
```

**Coverage thresholds (enforced in CI):** Lines 55%, Functions 55%, Branches 50%, Statements 55%.

**What requires tests:**
| Change | Test |
|--------|------|
| New Server Action | E2E |
| New API route | E2E |
| New pure function | Unit |
| New React component with logic | Component |
| New Zod schema | Unit |
| New AI tool | Unit (schema validation) |
| Bug fix | Regression test |
| New print formatter | Unit (v3.2) |
| New cron job | Unit + manual curl (v3.2) |

**Never test:**
- LLM output content (non-deterministic — test boundaries instead)
- Mocks (test the behavior, not the mock)
- Third-party services directly

---

## Commit Convention

**Format:** `<type>(<scope>): <subject>`

**Types:** `feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `revert`

**Scopes:** `cart`, `checkout`, `payments`, `email`, `admin`, `auth`, `db`, `api`, `analytics`, `reviews`, `wishlist`, `coupons`, `invoices`, `ai`, `pwa`, `sessions`, `audit`, `ui`, `exports`, `cron`

**Examples:**
```
feat(checkout): add express checkout button
fix(cron): set throttle only on success
feat(ui): add bento card pattern for admin stats
feat(exports): add PDF print view for orders
docs(readme): update lighthouse scores
```

**No Co-Authored-By for AI tools.** Only the human submitting the PR is the author.

---

## What NOT to Do

- ❌ Add a state management library (Redux, Zustand, Jotai) — Context is enough
- ❌ Add a component library (shadcn/ui, Radix, MUI, Chakra, Ant Design) — we have our own design system
- ❌ Add CSS-in-JS (styled-components, Emotion) — runtime cost, no RSC support
- ❌ Add Puppeteer or a PDF library — browser-native print is deliberate
- ❌ Add Prisma, tRPC, or GraphQL — we don't need them
- ❌ Break Server Action auth pattern (must re-auth on every call)
- ❌ Fetch data before checking auth in Server Components
- ❌ Test LLM response content (flaky)
- ❌ Write Redis keys without TTL
- ❌ Set cron throttle before work succeeds
- ❌ Add a new migration without testing in dev
- ❌ Add `console.log` — use `console.error` / `console.warn` only
- ❌ Use `any` without a comment explaining why

---

## Common Tasks

**Add a new admin page:**
1. `src/app/admin/my-page/page.tsx` (Server Component)
2. `loading.tsx` with skeleton loader
3. Add to `menuItems` in `src/components/admin/AdminSidebar.tsx`
4. Follow bento card + editorial pattern (see `/admin/reviews`)
5. E2E test for auth guard

**Add a new email template:**
1. `src/lib/email/templates/my-template.tsx` (React Email)
2. Add to `EmailTemplate` type in `lib/email/types.ts`
3. Add to `SUBJECTS` map in `lib/email/render.tsx`
4. Add `case` in `renderEmail` switch
5. Trigger via `queueEmail({ template: 'my-template', ... })`
6. Follow editorial style (dark bg, brand masthead, semantic accent)

**Add a new print export type:**
1. Add to `VALID_TYPES` in `src/app/admin/exports/print/[type]/page.tsx`
2. Add columns to `COLUMNS` record
3. Add data fetcher
4. Add case in main render
5. Add Print button in `/admin/exports`

**Add a new cron job:**
1. `src/app/api/cron/my-job/route.ts`
2. Check `Authorization: Bearer ${CRON_SECRET}`
3. Check throttle key
4. Do work — **only set throttle on success** (v3.2 pattern)
5. Return structured response with `timestamp`
6. Add to `/api/cron/daily` for Hobby plan compatibility

**Add a new migration:**
1. `supabase/migrations/YYYYMMDD_description.sql`
2. Idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`)
3. Test in dev Supabase
4. Never edit existing migrations
5. For reversible: create backup table first

---

## Debugging

**Where to look:**

| Issue | Log prefix / Location |
|-------|----------------------|
| Email failures | `[email]` in Vercel logs, MongoDB `email_logs` |
| Payment issues | `[stripe-webhook]` in logs, MongoDB `payment_transactions` |
| AI chatbot | `[chat]` in logs, Groq dashboard usage |
| Cron failures | `[cron]` in logs, Redis `throttle:*` keys |
| Admin actions | MongoDB `audit_logs`, `/admin/audit` |
| Print route issues | `[print]` in logs (Vercel) |

**Manual curl tests:**
```bash
# Cron (auth check)
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/cron/daily

# Force reset throttle
# (via Upstash console)
DEL throttle:cron:abandoned-carts
DEL throttle:alert:low-stock
```

---

## Environment

**Required env vars (see `.env.example`):**
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Site: `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`
- Redis: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- MongoDB: `MONGODB_URI`, `MONGODB_DB_NAME`
- Security: `IP_HASH_SALT`, `CRON_SECRET` (min 32 chars each)
- Email: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EMAIL_FROM`
- QStash: `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- AI: `GROQ_API_KEY`

**Never commit `.env.local`.** Already in `.gitignore`.

---

## When in Doubt

1. **Check existing code** — patterns are consistent. Copy an existing example.
2. **Read the docs** — `docs/` has deep dives for every subsystem.
3. **Ask in GitHub Discussions** — don't guess on architecture.
4. **Propose before building** — if a pattern doesn't exist, open an issue first.

**Do not** invent new patterns, add new dependencies, or bypass security checks without discussion.