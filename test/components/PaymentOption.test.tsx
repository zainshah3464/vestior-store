import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Local test-only component that mirrors PaymentOption
// (PaymentOption is a private component in checkout/page.tsx,
// so we test the pattern via a local implementation.)
function PaymentOption({
  active,
  onClick,
  title,
  subtitle,
  disabled,
}: {
  active: boolean
  onClick: () => void
  title: string
  subtitle: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid="payment-option"
      data-active={active}
    >
      <span>{title}</span>
      <span>{subtitle}</span>
    </button>
  )
}

describe('PaymentOption pattern', () => {
  it('renders title and subtitle', () => {
    render(
      <PaymentOption
        active={false}
        onClick={() => {}}
        title="Cash on Delivery"
        subtitle="Pay on arrival"
      />
    )
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument()
    expect(screen.getByText('Pay on arrival')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <PaymentOption
        active={false}
        onClick={onClick}
        title="Test"
        subtitle="Test"
      />
    )
    await user.click(screen.getByTestId('payment-option'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <PaymentOption
        active={false}
        onClick={onClick}
        title="Test"
        subtitle="Test"
        disabled
      />
    )
    await user.click(screen.getByTestId('payment-option'))
    expect(onClick).not.toHaveBeenCalled()
  })
})