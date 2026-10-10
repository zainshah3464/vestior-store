import { test, expect } from '@playwright/test'

test.describe('Auth guards', () => {
  test('logged-out user visiting /admin is redirected to login', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 })
  })

  test('logged-out user visiting /orders is redirected to login', async ({ page }) => {
    await page.goto('/orders', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 })
  })

  test('logged-out user visiting /checkout is redirected to login', async ({ page }) => {
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 })
  })

  test('logged-out user visiting /profile is redirected to login', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 })
  })

  test('login page loads with email and password fields', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' })

    // Wait for React hydration first — the login form renders client-side
    await page.waitForSelector('input[type="email"]', { timeout: 30_000 })

    await expect(
      page.getByPlaceholder('you@example.com')
    ).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /continue with google/i })
    ).toBeVisible()
  })

  test('signup page loads with all fields', async ({ page }) => {
    await page.goto('/auth/signup', { waitUntil: 'domcontentloaded' })

    await page.waitForSelector('input[type="email"]', { timeout: 30_000 })

    await expect(
      page.getByPlaceholder('you@example.com')
    ).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.getByPlaceholder(/john doe/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible()
  })
})