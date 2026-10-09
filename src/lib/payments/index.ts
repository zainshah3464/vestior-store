/**
 * Payment provider factory.
 *
 *   const provider = getPaymentProvider('stripe')
 *   const intent = await provider.createPaymentIntent({...})
 */

import { codProvider } from './providers/cod' 
import { stripeProvider } from './providers/stripe'
import type { PaymentProvider, PaymentProviderId } from './types'

const providers: Record<PaymentProviderId, PaymentProvider> = {
  cod: codProvider,
  stripe: stripeProvider,
  // PayPal added in Phase 2C
  paypal: stripeProvider as unknown as PaymentProvider, // placeholder, will be replaced
}

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  const provider = providers[id]
  if (!provider) {
    throw new Error(`Unknown payment provider: ${id}`)
  }
  return provider
}

export function isPaymentProviderId(value: unknown): value is PaymentProviderId {
  return value === 'cod' || value === 'stripe' || value === 'paypal'
}

// Re-exports for convenience
export type {
  PaymentProvider,
  PaymentProviderId,
  PaymentIntent,
  PaymentResult,
  PaymentStatus,
  WebhookEvent,
  CreatePaymentParams,
} from './types'

export { codProvider, stripeProvider }