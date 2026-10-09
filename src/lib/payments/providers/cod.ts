/**
 * Cash on Delivery — the simplest provider.
 */

import type {
  PaymentProvider,
  CreatePaymentParams,
  PaymentIntent,
  PaymentResult,
  WebhookEvent,
} from '../types'

export const codProvider: PaymentProvider = {
  id: 'cod',

  async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
    return {
      id: `cod_${params.orderId}`,
      status: 'created',
      provider: 'cod',
    }
  },

  async retrievePayment(intentId: string): Promise<PaymentResult> {
    return {
      id: intentId,
      status: 'succeeded',
      amount: 0,
      provider: 'cod',
      raw: {},
    }
  },

  async capturePayment(intentId: string): Promise<PaymentResult> {
    return {
      id: intentId,
      status: 'succeeded',
      amount: 0,
      provider: 'cod',
      raw: {},
    }
  },

  async refundPayment(intentId: string): Promise<PaymentResult> {
    return {
      id: intentId,
      status: 'refunded',
      amount: 0,
      provider: 'cod',
      raw: {},
    }
  },

  async verifyWebhook(): Promise<WebhookEvent> {
    throw new Error('COD has no webhooks')
  },
}