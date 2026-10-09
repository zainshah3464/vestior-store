/**
 * Email system — shared types.
 */

export type EmailTemplate =
  | 'welcome'
  | 'order-placed'
  | 'payment-confirmed'
  | 'payment-failed'
  | 'order-shipped'
  | 'order-delivered'
  | 'order-cancelled'
  | 'low-stock-alert'

export interface QueueEmailParams {
  template: EmailTemplate
  to: string
  subject?: string
  userId?: string
  data: Record<string, unknown>
  /** Delay before sending (e.g., '10m' for abandoned cart) */
  delay?: string
}

export interface EmailJobPayload extends QueueEmailParams {
  logId: string
}