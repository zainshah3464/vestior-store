# Contributing to VESTIOR

> **Audience:** Developers who want to contribute code, docs, or ideas to VESTIOR.
>
> **Time to first contribution:** ~15 minutes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [What We're Looking For](#what-were-looking-for)
- [What We Don't Accept](#what-we-dont-accept)
- [Getting Help](#getting-help)

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

**5. Start dev server:**

```bash
npm run dev
```

**6. Verify everything works:**

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

### Committing

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `perf`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`

**Examples:**

```
feat(checkout): add express checkout button
fix(cart): prevent duplicate items after tab close
perf(images): switch to AVIF format
docs(readme): update lighthouse scores
feat(ai): add semantic search tool
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

### Database

- **All new tables require RLS.**
- **Every policy must be explicit** — no "authenticated all".
- **RPCs use `SET search_path = public, pg_temp`.** Always.
- **`SECURITY DEFINER` only when necessary.** Document why.
- **Migrations are idempotent** — use `IF NOT EXISTS`, `DROP POLICY IF EXISTS`.
- **Multi-step mutations** wrap in a `DO $$ ... $$` block (atomic).
- **Reversible migrations** — create a backup table before mutating. Example: `_role_normalization_backup`.
- **Never edit an existing migration.** Always add a new one.

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

### PR Title

Follow the same convention as commits:

```
feat(checkout): add express checkout button
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

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated (if user-facing)
- [ ] Migrations added (if DB change)
- [ ] Env vars documented (if new config)
- [ ] Server-only modules marked with `import 'server-only'`
- [ ] AI tools (if applicable) are read-only + use user session client
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

- **Bug fixes** — especially in cart, checkout, payments, email
- **Performance improvements** — with Lighthouse benchmarks
- **Security hardening** — with CVE-style reasoning
- **Accessibility improvements** — WCAG AA compliance
- **Test coverage** — new tests, edge cases
- **AI improvements** — better tool descriptions, prompt refinements, new tools
- **PWA improvements** — offline UX, cache strategy, install flow
- **Documentation** — clearer explanations, better examples

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

We've avoided: Redux, Zustand, Prisma, tRPC, GraphQL, next-pwa. Don't add them without a strong case.

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

---

## Thank You

Every contribution — code, docs, bug reports, or kind words — makes VESTIOR better. Thank you for being part of this.

If you're new to open source, welcome. If you're experienced, welcome back. Let's build something great.

---

<p align="center">
  <em>Last updated: 2026-10-14 · Maintained by <a href="https://github.com/zainshah3464">@zainshah3464</a></em>
</p>
```