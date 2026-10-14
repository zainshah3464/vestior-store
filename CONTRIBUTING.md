# Contributing to VESTIOR

Thanks for your interest! Here's how to contribute.

> 📖 **Full guide:** [docs/contributing.md](./docs/contributing.md) — code of conduct, detailed standards, testing requirements, review process.

## Setup

1. Fork the repo
2. Clone locally: `git clone <your-fork>`
3. Install: `npm install`
4. Copy `.env.example` to `.env.local` and fill values
5. Run Supabase migrations (all 13 files in `supabase/migrations/`, in order)
6. Run: `npm run dev`

**Prerequisites:** Supabase, MongoDB Atlas, Upstash (Redis + QStash), Stripe (test mode), Gmail app password, Groq API key (for AI chatbot).

## Workflow

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test: `npm run build` must pass
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## Code Style

- TypeScript strict mode — no `any` without a comment
- Prefer Server Components unless interactivity needed
- All mutations via Server Actions with authorization
- Never trust client input
- Mark secret-touching modules with `import 'server-only'`
- New DB migrations must be idempotent (use `IF NOT EXISTS`)
- AI tools must be read-only and use the user-session client (RLS-enforced)
- Run `npm run lint` before committing

## Commit Convention

- `feat:` new feature
- `fix:` bug fix
- `perf:` performance
- `docs:` documentation
- `refactor:` code refactor
- `chore:` tooling
- `test:` tests

**Scopes:** `cart`, `checkout`, `payments`, `email`, `admin`, `auth`, `db`, `api`, `analytics`, `reviews`, `wishlist`, `coupons`, `invoices`, `ai`, `pwa`, `sessions`, `audit`

## Before Submitting

- [ ] `npm run test` — unit tests pass
- [ ] `npm run test:e2e` — E2E tests pass
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — succeeds
- [ ] New features have tests; bug fixes have regression tests

## Security

See [SECURITY.md](./docs/SECURITY.md) for vulnerability reporting. **Do not open public issues for security bugs.**

## Questions?

Open a discussion or email **zainshahzs110@gmail.com**.