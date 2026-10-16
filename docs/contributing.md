# Contributing to VESTIOR

> **Audience:** Developers who want to contribute code, docs, or ideas to VESTIOR.
>
> **Time to first contribution:** ~15 minutes.
>
> **Version:** This document reflects **v3.2.0** (Editorial redesign + PDF export + cron hardening).

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Design System Standards (v3.2)](#design-system-standards-v32)
- [Testing Requirements](#testing-requirements)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [What We're Looking For](#what-were-looking-for)
- [What We Don't Accept](#what-we-dont-accept)
- [Getting Help](#getting-help)
- [What's New in v3.2](#whats-new-in-v32)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. We pledge to make participation in our project and community a harassment-free experience for all, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Expected Behavior

- **Be respectful** of differing viewpoints and experiences.
- **Give constructive feedback** on code, not on people.
- **Accept constructive criticism** gracefully.
- **Focus on what's best for the community.**
- **Show empathy** toward other community members.

### Unacceptable Behavior

- Harassment, trolling, insulting comments
- Publishing others' private information
- Sexualized language or imagery
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Violations can be reported to **zainshahzs110@gmail.com**. All reports are reviewed and investigated promptly. Maintainers reserve the right to remove, edit, or reject comments, commits, code, and other contributions that don't align with this Code of Conduct.

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **Git**
- **Supabase account** (free)
- **MongoDB Atlas account** (free)
- **Upstash account** (free — Redis + QStash)
- **Stripe account** (test mode)
- **Gmail account** (App password for SMTP)
- **Groq account** (free tier, for AI chatbot — optional if you're not working on AI)

### Setup (5 minutes)

**1. Fork and clone:**

```bash
git clone https://github.com/YOUR-USERNAME/vestior-store.git
cd vestior-store
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up `.env.local`:**

```bash
cp .env.example .env.local
# Fill in the values (see docs/deployment.md for details)
```

For **quick local testing**, you can use test credentials (don't use these in production):
- Supabase: Free tier is enough
- MongoDB: M0 free tier is enough
- Upstash Redis + QStash: Free tier is enough
- Stripe: Test mode keys
- Gmail: App password from your personal account
- Groq: Free tier (1,000 requests/day)

**4. Run migrations:**

Open Supabase SQL Editor and run all **13 files** in `supabase/migrations/` **in order**:

```
20261003_fix_rls_policies.sql
20261004_add_indexes.sql
20261004_dashboard_stats.sql
20261005_add_payment_fields.sql
20261011_add_product_reviews.sql
20261012_add_wishlists.sql
20261013_add_coupons.sql
20261014_add_last_login.sql
20261015_add_super_admin.sql
20261016_normalize_user_roles.sql
20261017_sales_report_rpc.sql
20261018_product_analytics_rpc.sql
20261019_place_order_atomic_v2.sql
```

**⚠️ Migration #13 is critical** — it replaces `place_order_atomic` with v2 (atomic coupon + provider).

**v3.2 note:** No new migrations were added in v3.2. Migration #13 remains the last migration.

**5. Enable Realtime on `order_items`:**

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
```

**v3.2 addition:** This enables real-time item updates on the customer order detail page.

**6. Start dev server:**

```bash
npm run dev
```

**7. Verify everything works:**

```bash
npm run typecheck   # Clean
npm run lint        # Clean
npm run test        # 53 unit tests pass
```

---

## Development Workflow

### Branching

Always branch off `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Branch naming:**

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feature/` | `feature/multi-currency` |
| Bug fix | `fix/` | `fix/cart-dedup` |
| Performance | `perf/` | `perf/image-optimization` |
| Docs | `docs/` | `docs/api-reference` |
| Refactor | `refactor/` | `refactor/payments-module` |
| Test | `test/` | `test/coupon-edge-cases` |
| **UI/Design (v3.2)** | `ui/` | `ui/editorial-cards` |
| **Export (v3.2)** | `export/` | `export/pdf-print-orders` |

### Committing

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `revert`

**Examples:**

```
feat(checkout): add express checkout button
fix(cart): prevent duplicate items after tab close
perf(images): switch to AVIF format
docs(readme): update lighthouse scores
feat(ai): add semantic search tool
feat(ui): redesign admin dashboard with bento cards        ← v3.2
feat(exports): add PDF print view for orders               ← v3.2
fix(cron): set throttle only on success                    ← v3.2
fix(auth): use token_hash flow for reset/confirm           ← v3.2
```

### Pushing

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub.

---

## Coding Standards

### TypeScript

- **Strict mode is enabled.** No `any` without a comment explaining why.
- Prefer `type` over `interface` unless you need declaration merging.
- Use discriminated unions for complex types.
- Export types from dedicated `types.ts` files when shared.

**Good:**
```typescript
type PaymentResult =
  | { status: 'success'; transactionId: string }
  | { status: 'failed'; error: string }

function handleResult(result: PaymentResult) {
  if (result.status === 'success') {
    console.log(result.transactionId)  // TypeScript narrows correctly
  }
}
```

**Bad:**
```typescript
function handleResult(result: any) {
  if (result.status === 'success') {
    console.log(result.transactionId)
  }
}
```

### React

- **Server Components by default.** Reach for `'use client'` only when you need interactivity.
- **No prop drilling** for cross-cutting concerns — use Context.
- **Keys must be stable** (use `id`, not `index`).
- **useEffect cleanup is mandatory** for subscriptions, timers.

**Good:**
```typescript
'use client'
export function CartCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handler = () => setCount(prev => prev + 1)
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  return <span>{count}</span>
}
```

### Server Actions

Every Server Action must:

1. Be `'use server'` at the top of the file
2. Validate inputs with Zod
3. Re-authenticate on every call
4. Authorize against DB state (not JWT claims)
5. Fail closed (throw on error)

**Template:**

```typescript
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  id: z.string().uuid(),
  value: z.number().int().min(0).max(100),
})

export async function myAction(input: unknown) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ... logic
}
```

### Server Components (v3.2 pattern)

Print routes are Server Components that must verify auth **before** any data fetch:

```typescript
// src/app/admin/exports/print/[type]/page.tsx
export default async function ExportPrintPage({ params, searchParams }) {
  const { type } = await params

  // 1. Type whitelist (before anything else)
  if (!VALID_TYPES.includes(type as ExportType)) notFound()

  // 2. Auth check — before any data fetch
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // 3. Authorization — before any data fetch
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/')

  // 4. Only NOW fetch sensitive data
  const rows = await getOrdersForExport(filters)
  // ...
}
```

**Rule:** Never fetch data before verifying authorization. This pattern applies to every Server Component that reads sensitive data.

### Database

- **All new tables require RLS.**
- **Every policy must be explicit** — no "authenticated all".
- **RPCs use `SET search_path = public, pg_temp`.** Always.
- **`SECURITY DEFINER` only when necessary.** Document why.
- **Migrations are idempotent** — use `IF NOT EXISTS`, `DROP POLICY IF EXISTS`.
- **Multi-step mutations** wrap in a `DO $$ ... $$` block (atomic).
- **Reversible migrations** — create a backup table before mutating. Example: `_role_normalization_backup`.
- **Never edit an existing migration.** Always add a new one.

### Redis Keys (v3.2)

If your change introduces a new Redis key, follow these conventions:

| Prefix | Purpose | TTL |
|--------|---------|-----|
| `rl:{tier}:{clientKey}` | Rate limits | Per window (typically 1 min) |
| `idem:{scope}:{key}` | Idempotency lock | 24h |
| `idem:result:{scope}:{key}` | Idempotency result cache | 24h |
| `throttle:cron:{name}` | Cron throttle | 12h / 50min depending on job |

**Rule:** Never write a Redis key without a TTL. Ephemeral state must auto-expire.

**Cron pattern (v3.2):** Set the throttle **only on real success**:

```typescript
const logId = await queueEmail(...)
if (!logId) {
  // Do NOT set throttle — retry next tick
  return NextResponse.json({ error: '...' }, { status: 500 })
}
await redis.set(THROTTLE_KEY, Date.now())  // ← Only on success
```

### Server-Only Modules

Anything that touches secrets must import `server-only`:

```typescript
import 'server-only'
// Next.js will fail the build if this is imported from a client component.
```

**Modules that must be server-only:**
- `lib/supabase/admin.ts`
- `lib/mongodb.ts`, `lib/redis.ts`
- `lib/payments/providers/stripe.ts`
- `lib/email/mailer.ts`, `queue.ts`, `render.tsx`
- `lib/audit.ts`
- `lib/ai/groq.ts`, `system-prompt.ts`, `tools.ts`
- `lib/qstash/verify.ts`
- All `queries.ts` files
- All Server Actions

**v3.2 note:** `ExportPrintView.tsx` is a **Client Component** (for the print button), but it receives data as **props from a Server Component**. The data is already fetched server-side. No secrets, no DB access from the client. This pattern is safe.

### AI-Specific Standards

If you're contributing to the AI chatbot:

- **Tools are read-only.** Never `INSERT`/`UPDATE`/`DELETE`.
- **Tools use the user session client** (RLS-enforced), not `supabaseAdmin`.
- **`inputSchema` is required** for every tool — validates LLM output.
- **`description` is descriptive** — the LLM reads it to decide when to call.
- **System prompt is server-only.** Never expose to client.
- **Never accept `system` role from client.** Zod enum: `['user', 'assistant']`.

See [Developer FAQ → AI & Chatbot](./faq-developer.md#ai--chatbot) for detailed rationale.

### CSS

- **Tailwind utility classes by default.**
- **`@apply` only for repeated patterns** (>3 occurrences).
- **No inline styles** except for dynamic values (e.g., `style={{ width: pct }}`).
- **v3.2:** Use design tokens for colors, spacing, and motion (see below).

### File organization

```
src/
├── app/           # Routes (RSC pages + layouts)
├── components/    # Reusable React components
├── actions/       # Server Actions
├── lib/           # Business logic, queries, utils
└── providers/     # React Context providers
```

**Rule:** If a component is used in 2+ places, it goes in `components/`. If it's route-specific, it stays next to the route.

---

## Design System Standards (v3.2)

v3.2 introduced a **formal editorial design system** documented in `docs/architecture.md`. Every new UI component must follow these standards.

### Design Tokens

**Surfaces:**
```css
--background: #0A0A0A;           /* Base canvas */
--card-top: #131313;              /* Card gradient start */
--card-bottom: #0E0E0E;          /* Card gradient end */
--card-border: rgba(255,255,255,0.06);
--card-border-hover: rgba(255,255,255,0.12);
```

**Card base classes (copy exactly):**
```tsx
className="bg-gradient-to-b from-[#131313] to-[#0e0e0e] 
  border border-white/[0.06] hover:border-white/[0.12] 
  p-4 sm:p-5 rounded-2xl transition-colors duration-300"
```

**Semantic accent colors:**

| Purpose | Color | Usage |
|---------|-------|-------|
| **Primary** | Indigo | CTAs, active states |
| **Success** | Emerald | Delivered, approved, payment received |
| **Warning** | Amber | Pending, low stock, throttle |
| **Danger** | Red | Cancelled, failed, refunded |
| **Info** | Violet | Shipped, abandoned cart, AI |
| **Secondary** | Teal | Emails, secondary metrics |

### Signature Patterns

**1. Bento stat card** — left accent bar + ambient glow + icon tile + eyebrow + big number

```tsx
<div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] p-5 rounded-2xl">
  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${accent}`} />
  <div className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${glow} blur-[70px]`} />
  <div className="relative pl-3">
    <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">{label}</p>
    <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums">{value}</p>
    <p className="text-[10px] text-gray-500 mt-1 truncate">{sub}</p>
  </div>
</div>
```

**2. Empty state** — icon tile + halo glow + title + description + CTA (never a bare "No data")

**3. Status pill** — `w-1 h-1 rounded-full` dot + icon + label

**4. Eyebrow pill** — `text-[10px] tracking-[0.18em] uppercase`

**5. Shine sweep on CTAs** — `pointer-events-none` gradient that translates on hover

### Typography Rules

- **Numbers:** Always `tabular-nums`
- **Eyebrows:** Always `text-[10px] tracking-[0.18em] uppercase`
- **Headlines:** Always `tracking-tight font-bold`
- **IDs:** Always `ui-monospace tabular-nums`

### Motion Rules

- **Duration:** 0.4s (normal), 0.2s (fast), 0.6s (slow)
- **Easing:** `[0.22, 1, 0.36, 1]` — smooth-out cubic
- **Stagger children:** 0.06s per child, capped at 0.5s total
- **Hover lift:** `y: -3` for cards, `scale: 1.02` for buttons
- **Respect `prefers-reduced-motion`** — use Tailwind's `motion-reduce:` utility

### Design System Checklist

When adding a new UI component:

- [ ] Uses design tokens (colors, spacing, rounded)
- [ ] Matches the card base classes
- [ ] Uses `tabular-nums` for numbers
- [ ] Uses semantic accent color for status
- [ ] Uses `[0.22, 1, 0.36, 1]` easing
- [ ] Has an empty state (if list/grid)
- [ ] Has a skeleton loader matching final shape
- [ ] Respects `prefers-reduced-motion`
- [ ] Passes a11y (contrast, labels, focus)

### What We Don't Add

- **CSS-in-JS** (styled-components, Emotion) — runtime cost, no RSC compatibility
- **Design system libraries** (shadcn/ui, Radix) — adds bundle size, own aesthetic
- **Component libraries** (Chakra, MUI, Ant Design) — opinionated, doesn't fit
- **Animation libraries** beyond Framer Motion — Framer covers 95% of needs

See [Architecture → Editorial UI Design System](./architecture.md#editorial-ui-design-system) for full rationale.

---

## Testing Requirements

### What needs tests?

| Change type | Test required |
|-------------|---------------|
| New Server Action | E2E test |
| New API route | E2E test |
| New pure function | Unit test |
| New React component with logic | Component test |
| New RPC | E2E test |
| New AI tool | Unit test (Zod schema validation) |
| New Zod schema | Unit test |
| New DB trigger / policy | Manual SQL test (documented) |
| Bug fix | Regression test (proves the bug) |
| Docs only | No test |
| **v3.2: New print formatter** | Unit test |
| **v3.2: New print export type** | E2E test (admin guard) |
| **v3.2: New cron job** | Unit test + manual curl |
| **v3.2: New design pattern** | Documented in `docs/architecture.md` |

### Running tests before PR

```bash
npm run test           # Must pass
npm run test:e2e       # Must pass
npm run typecheck      # Must be clean
npm run lint           # Must be clean
```

**Tip:** Run `npm run test` in watch mode while developing.

### Coverage

Coverage thresholds are enforced in CI:

- Lines: 55%
- Functions: 55%
- Branches: 50%
- Statements: 55%

New code should not lower coverage below these thresholds.

### Test file naming

| Type | Location | Pattern |
|------|----------|---------|
| Unit | `test/unit/` | `feature.test.ts` |
| Component | `test/components/` | `Component.test.tsx` |
| E2E | `e2e/` | `flow.spec.ts` |

### Testing non-deterministic code (AI)

The AI chatbot is non-deterministic — the same input produces different outputs.

**Test boundaries, not content:**

```typescript
// GOOD — test schema validation
it('rejects system role', () => {
  const result = chatRequestSchema.safeParse({
    messages: [{ role: 'system', content: 'Hi' }],
  })
  expect(result.success).toBe(false)
})

// BAD — test LLM response content (flaky!)
it('responds with "I can help with that"', async () => {
  const response = await callChat('Show me suits')
  expect(response).toContain('I can help with that')
})
```

**What to test:**
- Zod schemas (input validation, role whitelist, message caps)
- Tool `inputSchema` (accepts valid, rejects invalid)
- System prompt content (contains security instructions)
- Rate limit behavior (429 after N requests)

**What not to test:**
- Specific LLM wording
- Tool call order
- Chat content

### Testing cron jobs (v3.2)

**Test the throttle pattern, not email delivery:**

```typescript
// GOOD — test throttle-on-success
it('does not set throttle when queue fails', async () => {
  mockQueueEmail.mockResolvedValueOnce(null)
  // ... simulate cron run
  expect(mockRedis.set).not.toHaveBeenCalled()
})

// BAD — test that Gmail received a specific message (flaky, network-dependent)
```

**What to test:**
- Throttle set only on success (v3.2 pattern)
- Response shape includes `timestamp`, `sent`, `failed`, `errors[]`
- Auth check (`CRON_SECRET` required)
- Param order (`findAbandonedCarts(minAgeHours, maxReminders, limit)`)

**Manual verification:**
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.com/api/cron/daily
```

### Testing print exports (v3.2)

**Test formatters, not PDF bytes:**

```typescript
// GOOD — test format helpers
it('formats currency with rupee symbol', () => {
  expect(fmt(18999, 'currency')).toBe('₹18,999')
})

// BAD — test PDF page count (brittle)
```

**What to test:**
- Format helpers (`fmt`) — currency, date, null handling
- Type whitelist — rejects path traversal attempts
- Admin guard — E2E test that non-admins redirect to `/`
- Row limit — verify query has `.limit(10000)`

**What to verify manually:**
- Print CSS in browser (DevTools → Rendering → Emulate CSS media → Print)
- A4 landscape orientation
- Multi-page header repetition
- Currency symbol rendering

---

## Commit Convention

We use **Conventional Commits** with scopes matching our top-level directories.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Meaning |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `docs` | Documentation only |
| `refactor` | Code change (no feature, no fix) |
| `test` | Adding or fixing tests |
| `chore` | Tooling, dependencies, config |
| `build` | Build system changes |
| `ci` | CI configuration |
| `revert` | Revert a previous commit |

### Scopes

| Scope | Module |
|-------|--------|
| `cart` | Cart logic |
| `checkout` | Checkout flow |
| `payments` | Payment providers |
| `email` | Email templates + queue |
| `admin` | Admin panel |
| `auth` | Authentication |
| `db` | Database / migrations |
| `api` | API routes |
| `analytics` | Tracking + dashboards |
| `reviews` | Product reviews |
| `wishlist` | Wishlist |
| `coupons` | Coupon system |
| `invoices` | Invoice generation |
| `ai` | AI chatbot, tools, system prompt |
| `pwa` | Service worker, manifest, offline |
| `sessions` | Session tracking |
| `audit` | Audit logs |
| **`ui`** | **Editorial design system (v3.2)** |
| **`exports`** | **PDF print export + CSV export (v3.2)** |
| **`cron`** | **Cron endpoints + throttles (v3.2)** |

### Examples

**Feature:**
```
feat(coupons): add per-user limit enforcement

Implements per_user_limit on coupon validation and redemption.
Uses SELECT FOR UPDATE to prevent race conditions.

Closes #42
```

**Bug fix:**
```
fix(email): prevent duplicate payment-confirmed emails

The Stripe webhook now checks `orders.payment_status` before
queueing the email. If client-side `confirmPayment` already
ran, the webhook skips the email.

Closes #58
```

**AI feature:**
```
feat(ai): add semantic product search tool

Adds a new tool that converts natural language queries into
product filters. Uses the existing `searchProducts` tool under
the hood with query rewriting.

Note: read-only tool. Does not modify DB state.
```

**Refactor:**
```
refactor(payments): extract provider interface

Moved PaymentProvider type to lib/payments/types.ts.
No behavioral changes.
```

**v3.2 examples:**

```
feat(ui): redesign entire app with editorial theme

Introduces design tokens, bento cards, glass morphism, grouped
sidebar, and motion-first micro-interactions across 120 files.

See docs/architecture.md → Editorial UI Design System.
```

```
feat(exports): add PDF print views for all 5 export types

Zero-dependency implementation using browser-native print.
Routes: /admin/exports/print/[type]
- A4 landscape
- Filter-aware
- 10K row limit
- Admin verification before data fetch

See docs/architecture.md → PDF Print Export Pipeline.
```

```
fix(cron): set throttle only on success

Previously, a failed queueEmail still set the throttle key,
causing the next cron run to skip — the alert never fired.
Now the throttle is set only after a successful queue.

Verified via curl: {"lowStock":{"sent":true,"count":4},...}

Closes #82
```

```
fix(auth): use token_hash flow for reset/confirm email

The old code-based flow was leaving users without a session
after clicking the reset link. Switched to verifyOtp({ token_hash, type })
which creates a real session in one atomic call.

Callback now handles both flows:
- token_hash + type → password reset + email confirm (v3.2)
- code → OAuth Google login (legacy, still supported)

Closes #91
```

---

## Pull Request Process

### Before Opening a PR

- [ ] All tests pass (`npm run test && npm run test:e2e`)
- [ ] TypeScript is clean (`npm run typecheck`)
- [ ] ESLint is clean (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No `console.log` left in code (use `console.error`/`console.warn`)
- [ ] No `.env` files committed
- [ ] No changes to `package-lock.json` unless adding/updating deps
- [ ] New migrations are idempotent and tested in dev
- [ ] New RPCs use `SET search_path` and `REVOKE ALL FROM PUBLIC`
- [ ] New AI tools are read-only and use user-session client
- [ ] **v3.2:** New UI follows the editorial design system (tokens, patterns, motion)
- [ ] **v3.2:** New print export types use the whitelist pattern (Server Component, admin verify before fetch)
- [ ] **v3.2:** New cron jobs use the throttle-on-success pattern

### PR Title

Follow the same convention as commits:

```
feat(checkout): add express checkout button
feat(ui): add bento card pattern for admin stats      ← v3.2
fix(cron): set throttle only on success                ← v3.2
```

### PR Description Template

```markdown
## What does this PR do?
Brief description of the change.

## Why?
Link to issue or describe motivation.

## How?
Key implementation details (a paragraph, not a novel).

## Screenshots / GIFs
For UI changes only.
Required if you're changing the editorial design system.

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated (if user-facing)
- [ ] Migrations added (if DB change)
- [ ] Env vars documented (if new config)
- [ ] Server-only modules marked with `import 'server-only'`
- [ ] AI tools (if applicable) are read-only + use user session client
- [ ] (v3.2) UI follows editorial design system (tokens, patterns, motion)
- [ ] (v3.2) Print exports use admin verify + whitelist pattern
- [ ] (v3.2) Cron jobs use throttle-on-success pattern
- [ ] (v3.2) No new dependencies added (unless justified in PR description)
```

### Review Process

1. **Automated checks** run (CI: lint, typecheck, tests, E2E).
2. **Maintainer review** — I aim to respond within 48 hours.
3. **Feedback cycle** — usually 1-2 rounds.
4. **Merge** — squash-merge into `main`.

### What to expect in review

- **Positive feedback first** — I appreciate every contribution.
- **Specific, actionable comments** — no vague "this is wrong".
- **Questions for clarity** — not rhetorical criticism.
- **Suggestions, not demands** — unless it's a security issue.

### After merge

- Your name appears in the commit history.
- The feature deploys to production automatically (via Vercel).
- If it breaks something, we can revert quickly.

---

## What We're Looking For

### High-priority contributions

- **Bug fixes** — especially in cart, checkout, payments, email, **cron**
- **Performance improvements** — with Lighthouse benchmarks
- **Security hardening** — with CVE-style reasoning
- **Accessibility improvements** — WCAG AA compliance
- **Test coverage** — new tests, edge cases
- **AI improvements** — better tool descriptions, prompt refinements, new tools
- **PWA improvements** — offline UX, cache strategy, install flow
- **Documentation** — clearer explanations, better examples
- **v3.2: UI polish** — consistent with editorial design system
- **v3.2: Print export improvements** — new export types, filters, columns
- **v3.2: Design system extensions** — new patterns (with documentation)

### Feature requests

Open an issue first. Some features we've deliberately not built (see `docs/roadmap.md`). We prioritize:

- Features that benefit all users
- Features that don't add complexity
- Features that align with VESTIOR's focus (premium men's fashion, single-vendor)

### Code review

If you spot a bug but don't want to fix it, open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Environment (browser, device)

I'll triage it.

---

## What We Don't Accept

### Code style preferences without rationale

Don't reformat existing code "for consistency" without discussing first. Use Prettier or leave it alone.

### Dependencies without justification

Every dependency is a liability. If you want to add one:
- Explain what it does that we can't do in 50 lines.
- Show its maintenance status (stars, last commit, size).
- Consider bundle size impact.

We've avoided: Redux, Zustand, Prisma, tRPC, GraphQL, next-pwa.

**v3.2 additions to avoid:**
- **Puppeteer** — 300MB Chromium, not serverless-compatible
- **PDF libraries** (pdfkit, pdfmake, jspdf) — 200-500KB, manual layout
- **CSS-in-JS** (styled-components, Emotion) — runtime cost, no RSC
- **Design system libraries** (shadcn/ui, Radix) — own aesthetic, bundle size
- **Component libraries** (Chakra, MUI, Ant Design) — opinionated, hard to customize

Don't add them without a strong case.

### Breaking changes

Avoid breaking changes in minor versions. If a breaking change is necessary, it goes in a major version bump with a migration guide.

### Tests that just test mocks

A test that only verifies "we called the mock" is not a test — it's a mirror. Test the behavior.

### LLM output tests

Don't test the LLM's actual response text. It's non-deterministic and will make CI flaky. Test the boundaries (schemas, rate limits, tool contracts) instead.

### Changes without tests

New features need tests. Bug fixes need regression tests. This is non-negotiable.

### AI-generated PRs without review

You can use AI tools to write code, but you must:
- Understand every line
- Test it thoroughly
- Be able to explain it in review

Blind `copilot` PRs will be rejected.

### v3.2: Design system bypasses

Don't add UI components that don't use the design tokens. If a pattern doesn't exist, propose it first (open an issue), then add it to the design system docs before using it in code.

### v3.2: Print exports with external dependencies

Don't add Puppeteer or a PDF library to the print export. Browser-native print is deliberate. If you need server-side PDFs (email attachments), open an issue first — that's a separate feature.

### v3.2: Cron jobs without throttle

Every cron job must use the throttle-on-success pattern. Don't add a cron without throttling — it will hit rate limits and cost money.

---

## Getting Help

### Where to ask

| Channel | Use for |
|---------|---------|
| **GitHub Issues** | Bug reports, feature requests |
| **GitHub Discussions** | Questions, ideas, show-and-tell |
| **Email** | Security disclosures, private matters |

### Response time

I'm a solo maintainer. Realistic expectations:

- **Bug reports:** 24-72 hours
- **Feature requests:** 3-7 days
- **PR reviews:** 48 hours
- **Security disclosures:** 24 hours

### Before asking

1. Check the docs (`docs/` folder).
2. Search existing issues.
3. Read the README.

If you've done all three, ask away.

### How to ask good questions

**Bad:**
> It doesn't work.

**Good:**
> When I add a product to cart, then refresh, the cart count resets to 0 in the navbar. Expected: count persists. Browser: Chrome 120. OS: Ubuntu 22.04. Steps: 1) Navigate to /products, 2) Click "Add to Cart" on any card, 3) Refresh page, 4) Observe navbar shows 0 but cart page shows 1 item.

The second version lets me help you in 30 seconds instead of 30 minutes.

### v3.2: Where to look for design system questions

If you're contributing UI:

1. **Read `docs/architecture.md` → Editorial UI Design System**
2. **Look at an existing page** (e.g., `/admin/reviews` for cards, `/admin/analytics` for charts)
3. **Copy the pattern** — don't invent a new one
4. **If a pattern doesn't exist**, propose it first in an issue

---

## What's New in v3.2

This section documents v3.2-specific contribution guidelines.

### New Commit Scopes

- **`ui`** — Editorial design system changes
- **`exports`** — Print export + CSV export
- **`cron`** — Cron endpoints + throttles

### New Coding Standards

- **Server Components** — Auth check before data fetch (print routes)
- **Redis keys** — Naming conventions + TTL requirements
- **Cron pattern** — Throttle-on-success (never set throttle before work)
- **Design system** — Use tokens, patterns, and motion principles

### New Testing Requirements

| Change type | v3.2 requirement |
|-------------|------------------|
| New print formatter | Unit test |
| New print export type | E2E test (admin guard) |
| New cron job | Unit test + manual curl |
| New design pattern | Documented in `docs/architecture.md` |

### New PR Checklist Items

- [ ] UI follows editorial design system
- [ ] Print exports use admin verify + whitelist
- [ ] Cron jobs use throttle-on-success
- [ ] No new dependencies (unless justified)

### New "What We Don't Accept"

- Design system bypasses
- Print exports with external dependencies
- Cron jobs without throttle

### New Contributions to Prioritize

- UI polish consistent with editorial design system
- Print export improvements
- Design system extensions (with documentation)

### Key v3.2 References for Contributors

- **Editorial design system** → `docs/architecture.md#editorial-ui-design-system`
- **PDF print pipeline** → `docs/architecture.md#pdf-print-export-pipeline`
- **Cron job pipeline** → `docs/architecture.md#cron-job-pipeline`
- **Print route security** → `docs/security.md#print-route-security-new-v32`
- **Cron job security** → `docs/security.md#cron-job-security-v32`
- **Print export testing** → `docs/testing.md#testing-pdf-print-export-v32`
- **Cron testing** → `docs/testing.md#testing-cron-jobs-v32`
- **Editorial UI testing** → `docs/testing.md#testing-editorial-ui-v32`
- **Print export extension** → `docs/faq-developer.md#print-export--editorial-ui-v32`
- **Deployment verification** → `docs/deployment.md#whats-new-in-v32`

---

## Thank You

Every contribution — code, docs, bug reports, or kind words — makes VESTIOR better. Thank you for being part of this.

If you're new to open source, welcome. If you're experienced, welcome back. Let's build something great.

---

<p align="center">
  <em>Last updated: 2026-10-16 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>

---
