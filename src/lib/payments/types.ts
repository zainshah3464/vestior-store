/**
 * Payment provider abstraction — common interface for all providers.
 */

export type PaymentProviderId = 'cod' | 'stripe' | 'paypal'

export type PaymentStatus =
  | 'created'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'

// ─────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────
export interface CreatePaymentParams {
  orderId: string
  amount: number
  currency: string
  customerEmail: string
  metadata?: Record<string, string>
}

// ─────────────────────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────────────────────
export interface PaymentIntent {
  id: string
  clientSecret?: string
  status: PaymentStatus
  provider: PaymentProviderId
  amount?: number
  currency?: string
  raw?: unknown
}

export interface PaymentResult {
  id: string
  status: PaymentStatus
  amount: number
  provider: PaymentProviderId
  raw: unknown
}

export interface WebhookEvent {
  id: string
  type: string
  data: Record<string, unknown>
  provider: PaymentProviderId
}

// ─────────────────────────────────────────────────────────────
// Provider interface
// ─────────────────────────────────────────────────────────────
export interface PaymentProvider {
  id: PaymentProviderId

  createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent>

  /**
   * Retrieve current state of a payment intent WITHOUT attempting capture.
   * This is the safe way to confirm — Stripe auto-captures by default.
   */
  retrievePayment(intentId: string): Promise<PaymentResult>

  /**
   * Explicit capture — only for manual-capture flows.
   * Most setups (including VESTIOR) don't need this.
   */
  capturePayment(intentId: string): Promise<PaymentResult>

  refundPayment(intentId: string, amount?: number): Promise<PaymentResult>

  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>
}