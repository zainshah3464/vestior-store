import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',

  timeout: 60_000,

  expect: {
    timeout: 15_000,
  },

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /**
   * Auto-start the app before running E2E tests.
   *
   * • Local: uses `next dev` (fast enough).
   * • CI: uses `next start` against the production build (more stable
   *   in the sandbox, and mirrors what users actually see).
   *
   * The CI workflow builds the app in a previous step, so `next start`
   * picks up `.next/` immediately.
   */
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: process.env.CI ? 'pipe' : 'ignore',
    stderr: 'pipe',
  },
})