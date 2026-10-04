# Contributing to VESTIOR

Thanks for your interest! Here's how to contribute.

## Setup

1. Fork the repo
2. Clone locally: `git clone <your-fork>`
3. Install: `npm install`
4. Copy `.env.example` to `.env.local` and fill values
5. Run: `npm run dev`

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
- Run `npm run lint` before committing

## Commit Convention

- `feat:` new feature
- `fix:` bug fix
- `perf:` performance
- `docs:` documentation
- `refactor:` code refactor
- `chore:` tooling

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Questions?

Open a discussion or email zainshahzs110@gmail.com.