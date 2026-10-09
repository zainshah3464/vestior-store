import { test, expect } from '@playwright/test'

test.describe('Cart flow (no auth required)', () => {
  test('add to cart persists in localStorage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.clear())

    await page.goto('/products', { waitUntil: 'domcontentloaded' })

    const addButton = page
      .getByRole('button', { name: /add to cart/i })
      .first()
    await expect(addButton).toBeVisible({ timeout: 20_000 })

    await addButton.click({ force: true })

    // Wait for localStorage to be populated (more reliable than toast)
    await page.waitForFunction(
      () => {
        const raw = localStorage.getItem('cart')
        if (!raw) return false
        try {
          const arr = JSON.parse(raw)
          return Array.isArray(arr) && arr.length > 0
        } catch {
          return false
        }
      },
      undefined,
      { timeout: 10_000 }
    )

    const cartJson = await page.evaluate(() => localStorage.getItem('cart'))
    const cart = JSON.parse(cartJson as string)
    expect(cart.length).toBeGreaterThan(0)
    expect(cart[0].quantity).toBeGreaterThanOrEqual(1)
  })

  test('cart page shows items after adding', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.clear())
    await page.evaluate(() => {
      localStorage.setItem(
        'cart',
        JSON.stringify([
          {
            id: 'test-product-1',
            name: 'Test Product',
            price: 1999,
            compare_at_price: 2499,
            images: ['https://placehold.co/100x100'],
            stock: 10,
            quantity: 2,
          },
        ])
      )
    })

    await page.goto('/cart', { waitUntil: 'domcontentloaded' })

    await expect(page.getByText('Test Product').first()).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.getByText(/₹\s*3,998/).first()).toBeVisible()
  })

  test('quantity can be updated in cart', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      localStorage.setItem(
        'cart',
        JSON.stringify([
          {
            id: 'test-product-1',
            name: 'Qty Test',
            price: 1000,
            images: ['https://placehold.co/100x100'],
            stock: 10,
            quantity: 1,
          },
        ])
      )
    })

    await page.goto('/cart', { waitUntil: 'domcontentloaded' })

    const plusButton = page
      .locator('button')
      .filter({ has: page.locator('svg.lucide-plus') })
      .first()
    await expect(plusButton).toBeVisible({ timeout: 20_000 })
    await plusButton.click()

    await page.waitForFunction(
      () => {
        const raw = localStorage.getItem('cart')
        if (!raw) return false
        try {
          const arr = JSON.parse(raw)
          return arr[0]?.quantity === 2
        } catch {
          return false
        }
      },
      undefined,
      { timeout: 10_000 }
    )

    const cartJson = await page.evaluate(() => localStorage.getItem('cart'))
    const cart = JSON.parse(cartJson as string)
    expect(cart[0].quantity).toBe(2)
  })

  test('remove from cart works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      localStorage.setItem(
        'cart',
        JSON.stringify([
          {
            id: 'test-product-1',
            name: 'Remove Me',
            price: 500,
            images: ['https://placehold.co/100x100'],
            stock: 10,
            quantity: 1,
          },
        ])
      )
    })

    await page.goto('/cart', { waitUntil: 'domcontentloaded' })

    // The "Clear" button at top has a Trash icon too.
    // Per-item remove button is the LAST trash icon (inside item row).
    const removeButton = page
      .locator('button')
      .filter({ has: page.locator('svg.lucide-trash-2') })
      .last()
    await expect(removeButton).toBeVisible({ timeout: 20_000 })
    await removeButton.click()

    await page.waitForFunction(
      () => {
        const raw = localStorage.getItem('cart')
        if (!raw) return true
        try {
          const arr = JSON.parse(raw)
          return Array.isArray(arr) && arr.length === 0
        } catch {
          return true
        }
      },
      undefined,
      { timeout: 10_000 }
    )

    const cartJson = await page.evaluate(() => localStorage.getItem('cart'))
    const cart = JSON.parse(cartJson as string)
    expect(cart.length).toBe(0)
  })
})