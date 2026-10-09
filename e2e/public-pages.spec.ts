import { test, expect } from '@playwright/test'

test.describe('Public pages', () => {
  test('homepage loads with navbar and hero', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(
      page.getByRole('link', { name: 'VESTIOR' }).first()
    ).toBeVisible({ timeout: 20_000 })

    await expect(page.getByText('ART OF', { exact: true })).toBeVisible()
    await expect(page.getByText('ELEGANCE', { exact: true })).toBeVisible()
  })

  test('products page loads and shows product grid', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' })

    await expect(
      page.getByRole('heading', { name: /all products/i })
    ).toBeVisible({ timeout: 20_000 })

    const productLinks = page.locator('a[href^="/products/"]')
    await expect(productLinks.first()).toBeVisible({ timeout: 20_000 })
  })

  test('category page filters products', async ({ page }) => {
    await page.goto('/category/Pants', { waitUntil: 'domcontentloaded' })

    await expect(
      page.locator('h1').filter({ hasText: /^Pants$/ })
    ).toBeVisible({ timeout: 20_000 })
  })

  test('featured page loads', async ({ page }) => {
    await page.goto('/featured', { waitUntil: 'domcontentloaded' })

    await expect(
      page.getByRole('heading', { name: /featured collection/i })
    ).toBeVisible({ timeout: 20_000 })
  })

  test('new arrivals page loads', async ({ page }) => {
    await page.goto('/new-arrivals', { waitUntil: 'domcontentloaded' })

    await expect(
      page.getByRole('heading', { name: /new arrivals/i })
    ).toBeVisible({ timeout: 20_000 })
  })

  test('cart page shows empty state initially', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.clear())

    await page.goto('/cart', { waitUntil: 'domcontentloaded' })

    await expect(page.getByText(/your cart is empty/i)).toBeVisible({
      timeout: 20_000,
    })
  })

  test('404 page shows for unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz', {
      waitUntil: 'domcontentloaded',
    })

    await expect(page.getByText('Page Not Found')).toBeVisible({
      timeout: 20_000,
    })
  })

  test('robots.txt is served', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const text = await res.text()
    expect(text).toContain('User-Agent')
    expect(text).toContain('sitemap.xml')
  })

  test('sitemap.xml is served', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const text = await res.text()
    expect(text).toContain('<urlset')
  })
})