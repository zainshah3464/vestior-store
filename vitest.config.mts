import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: [
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    exclude: ['node_modules/**', 'e2e/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      exclude: [
        'node_modules/**',
        'test/**',
        'e2e/**',
        '**/*.config.*',
        '**/*.d.ts',
        'src/app/**/loading.tsx',
        'src/app/**/error.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/page.tsx',
        // ─────────────────────────────────────────────
        // Integration-only modules — covered by E2E tests,
        // not by unit tests. Excluding them keeps the unit
        // coverage signal meaningful.
        // ─────────────────────────────────────────────
        'src/lib/supabase/**',      // DB clients (integration)
        'src/providers/**',          // React Contexts (integration)
        'src/actions/**',            // Server Actions (E2E-covered)
        'src/components/WishlistProvider.tsx',
      ],
      thresholds: {
        lines: 55,
        functions: 55,
        branches: 50,
        statements: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Mock server-only so it resolves in tests
      'server-only': path.resolve(__dirname, './test/mocks/server-only.ts'),
    },
  },
})