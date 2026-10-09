// Empty mock for the `server-only` marker package.
// In Next.js, importing 'server-only' throws if bundled client-side.
// In tests, we replace it with this empty module via vitest alias.
export {}