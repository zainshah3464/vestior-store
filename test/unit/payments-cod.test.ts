import { describe, it, expect } from 'vitest'
import { codProvider } from '@/lib/payments/providers/cod'

describe('COD provider', () => {
  it('has the correct id', () => {
    expect(codProvider.id).toBe('cod')
  })

  it('creates a payment intent with order id', async () => {
    const intent = await codProvider.createPaymentIntent({
      orderId: 'order-123',
      amount: 50000,
      currency: 'pkr',
      customerEmail: 'test@example.com',
    })
    expect(intent.id).toBe('cod_order-123')
    expect(intent.provider).toBe('cod')
    expect(intent.status).toBe('created')
  })

  it('retrieves a payment as succeeded', async () => {
    const result = await codProvider.retrievePayment('cod_abc')
    expect(result.status).toBe('succeeded')
    expect(result.provider).toBe('cod')
  })

  it('capture returns succeeded', async () => {
    const result = await codProvider.capturePayment('cod_abc')
    expect(result.status).toBe('succeeded')
  })

  it('refund returns refunded', async () => {
    const result = await codProvider.refundPayment('cod_abc')
    expect(result.status).toBe('refunded')
  })

  it('verifyWebhook throws', async () => {
    // COD has no webhooks — verifyWebhook should throw.
    // The signature requires payload + signature args; pass empty strings.
    await expect(
      codProvider.verifyWebhook('', '')
    ).rejects.toThrow('COD has no webhooks')
  })
})