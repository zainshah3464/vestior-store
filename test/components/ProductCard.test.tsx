import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from '@/components/ProductCard'

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockProduct = {
  id: 'p1',
  name: 'Khaki Twill Shirt',
  price: 1999,
  compare_at_price: 2499,
  images: ['https://example.com/shirt.jpg'],
  is_new_arrival: true,
  stock: 10,
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Khaki Twill Shirt')).toBeInTheDocument()
    expect(screen.getByText('₹1,999')).toBeInTheDocument()
  })

  it('shows NEW badge when is_new_arrival is true', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('shows discount percentage when compare_at_price > price', () => {
    render(<ProductCard product={mockProduct} />)
    // (2499 - 1999) / 2499 = 20%
    expect(screen.getByText('20% OFF')).toBeInTheDocument()
  })

  it('shows "Out of Stock" when stock is 0', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />)
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('adds product to cart when Add to Cart is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /add to cart/i })
    await user.click(button)

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    expect(cart).toHaveLength(1)
    expect(cart[0].id).toBe('p1')
    expect(cart[0].quantity).toBe(1)
  })

  it('increments quantity when product already in cart', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...mockProduct, quantity: 1 }])
    )
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    expect(cart[0].quantity).toBe(2)
  })
})