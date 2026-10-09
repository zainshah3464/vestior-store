import 'server-only'
import { render } from '@react-email/render'
import type { EmailTemplate } from './types'
import WelcomeEmail from './templates/welcome'
import OrderPlacedEmail from './templates/order-placed'
import PaymentConfirmedEmail from './templates/payment-confirmed'
import PaymentFailedEmail from './templates/payment-failed'
import OrderShippedEmail from './templates/order-shipped'
import OrderDeliveredEmail from './templates/order-delivered'
import OrderCancelledEmail from './templates/order-cancelled'
import LowStockAlertEmail from './templates/low-stock-alert'

const SUBJECTS: Record<EmailTemplate, string> = {
  welcome: 'Welcome to VESTIOR',
  'order-placed': 'Your VESTIOR order is confirmed',
  'payment-confirmed': 'Payment received — thank you!',
  'payment-failed': 'Payment failed for your VESTIOR order',
  'order-shipped': 'Your VESTIOR order is on the way',
  'order-delivered': 'Your VESTIOR order has arrived',
  'order-cancelled': 'Your VESTIOR order was cancelled',
  'low-stock-alert': 'Low stock alert — action needed',
}

export async function renderEmail(
  template: EmailTemplate,
  data: Record<string, unknown>
): Promise<{ html: string; subject: string }> {
  const subject = SUBJECTS[template]
  let html = ''

  switch (template) {
    case 'welcome':
      html = await render(WelcomeEmail(data as never))
      break
    case 'order-placed':
      html = await render(OrderPlacedEmail(data as never))
      break
    case 'payment-confirmed':
      html = await render(PaymentConfirmedEmail(data as never))
      break
    case 'payment-failed':
      html = await render(PaymentFailedEmail(data as never))
      break
    case 'order-shipped':
      html = await render(OrderShippedEmail(data as never))
      break
    case 'order-delivered':
      html = await render(OrderDeliveredEmail(data as never))
      break
    case 'order-cancelled':
      html = await render(OrderCancelledEmail(data as never))
      break
    case 'low-stock-alert':
      html = await render(LowStockAlertEmail(data as never))
      break
    default:
      throw new Error(`No renderer for template: ${template}`)
  }

  return { html, subject }
}