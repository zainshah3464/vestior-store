/**
 * Stripe provider — test mode compatible.
 *
 * Note: Stripe's default capture_method is 'automatic_async' — payments
 * are captured as soon as they succeed. Calling .capture() afterwards
 * throws 'payment_intent_unexpected_state'. Use retrievePayment() to
 * check the current status instead.
 */

import 'server-only'
import Stripe from 'stripe'
import { env } from '@/lib/env'
import type {
  PaymentProvider,
  CreatePaymentParams,
  PaymentIntent,
  PaymentResult,
  WebhookEvent,
  PaymentStatus,
} from '../types'

// ─────────────────────────────────────────────────────────────
// Lazy singleton
// ─────────────────────────────────────────────────────────────
let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (_stripe) return _stripe

  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      'Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local'
    )
  }

  _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: { name: 'VESTIOR', version: '2.1.0' },
  })

  return _stripe
}

// ─────────────────────────────────────────────────────────────
// Status mapping
// ─────────────────────────────────────────────────────────────
function mapStripeStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
  switch (status) {
    case 'succeeded':
      return 'succeeded'
    case 'processing':
    case 'requires_capture':
      return 'processing'
    case 'canceled':
      return 'failed'
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
    default:
      return 'created'
  }
}

// ─────────────────────────────────────────────────────────────
// Provider implementation
// ─────────────────────────────────────────────────────────────
export const stripeProvider: PaymentProvider = {
  id: 'stripe',

  async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
    const stripe = getStripe()

    const intent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: params.customerEmail,
      metadata: {
        orderId: params.orderId,
        ...params.metadata,
      },
    })

    return {
      id: intent.id,
      clientSecret: intent.client_secret ?? undefined,
      status: mapStripeStatus(intent.status),
      provider: 'stripe',
      amount: intent.amount,
      currency: intent.currency,
      raw: intent,
    }
  },

  /**
   * Safe status check — never mutates the intent.
   * Use this after Stripe Elements reports success.
   */
  async retrievePayment(intentId: string): Promise<PaymentResult> {
    const stripe = getStripe()
    const intent = await stripe.paymentIntents.retrieve(intentId)
    return {
      id: intent.id,
      status: mapStripeStatus(intent.status),
      amount: intent.amount,
      provider: 'stripe',
      raw: intent,
    }
  },

  /**
   * Explicit capture. Only for manual-capture flows.
   * VESTIOR uses automatic capture, so this is rarely called.
   */
  async capturePayment(intentId: string): Promise<PaymentResult> {
    const stripe = getStripe()
    const intent = await stripe.paymentIntents.capture(intentId)
    return {
      id: intent.id,
      status: mapStripeStatus(intent.status),
      amount: intent.amount,
      provider: 'stripe',
      raw: intent,
    }
  },

  async refundPayment(intentId: string, amount?: number): Promise<PaymentResult> {
    const stripe = getStripe()
    const refund = await stripe.refunds.create({
      payment_intent: intentId,
      ...(amount ? { amount } : {}),
    })
    return {
      id: refund.id,
      status: 'refunded',
      amount: refund.amount ?? 0,
      provider: 'stripe',
      raw: refund,
    }
  },

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent> {
    const stripe = getStripe()

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new Error(
        'STRIPE_WEBHOOK_SECRET is not set. Cannot verify webhook signature.'
      )
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )

    return {
      id: event.id,
      type: event.type,
      data: event.data.object as unknown as Record<string, unknown>,
      provider: 'stripe',
    }
  },
}