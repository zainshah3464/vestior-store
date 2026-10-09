import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navbar links navigate correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await page.getByRole('link', { name: /^products$/i }).first().click()
    await expect(page).toHaveURL(/\/products$/, { timeout: 20_000 })

    await page.getByRole('link', { name: /^featured$/i }).first().click()
    await expect(page).toHaveURL(/\/featured$/, { timeout: 20_000 })

    await page.getByRole('link', { name: /^new arrivals$/i }).first().click()
    await expect(page).toHaveURL(/\/new-arrivals$/, { timeout: 20_000 })
  })

  test('search modal opens and closes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await page
      .locator('button')
      .filter({ has: page.locator('svg.lucide-search') })
      .first()
      .click()

    await expect(
      page.getByPlaceholder(/what are you looking for/i)
    ).toBeVisible({ timeout: 20_000 })

    await page.keyboard.press('Escape')

    await expect(
      page.getByPlaceholder(/what are you looking for/i)
    ).toBeHidden({ timeout: 10_000 })
  })
})