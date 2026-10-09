/**
 * Stripe webhook handler.
 *
 * Endpoint: POST /api/webhooks/stripe
 *
 * Security:
 *   • Signature verification via STRIPE_WEBHOOK_SECRET
 *   • Idempotency via Redis (24h TTL)
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripeProvider } from '@/lib/payments'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { withIdempotency } from '@/lib/idempotency'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { revalidatePath } from 'next/cache'
import type Stripe from 'stripe'
import type { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────
// MongoDB document type
// ─────────────────────────────────────────────────────────────
interface PaymentTransactionDoc {
  _id?: ObjectId
  order_id: string
  user_id: string | null
  provider: string
  provider_txn_id: string
  amount: number
  currency: string
  status: string
  method?: string
  card_last4?: string | null
  card_brand?: string | null
  webhook_events: Array<{ event: string; at: Date; raw: unknown }>
  created_at: Date
  updated_at: Date
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = await stripeProvider.verifyWebhook(body, signature)
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    await withIdempotency(
      { scope: 'stripe-webhook', key: event.id, ttlSeconds: 86_400 },
      async () => {
        await handleEvent(event.type, event.data)
      }
    )
  } catch (err) {
    const message = (err as Error).message || ''
    if (message.includes('already in progress or processed')) {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('[stripe-webhook] handler failed:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleEvent(type: string, data: Record<string, unknown>) {
  const db = await getDb()
  const transactions = db.collection<PaymentTransactionDoc>(
    COLLECTIONS.PAYMENT_TRANSACTIONS
  )

  switch (type) {
    case 'payment_intent.succeeded': {
      const intent = data as unknown as Stripe.PaymentIntent
      const orderId = intent.metadata?.orderId
      if (!orderId) return

      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
          payment_intent_id: intent.id,
        })
        .eq('id', orderId)

      await transactions.insertOne({
        order_id: orderId,
        user_id: intent.metadata?.userId ?? null,
        provider: 'stripe',
        provider_txn_id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: 'succeeded',
        method: 'card',
        webhook_events: [{ event: type, at: new Date(), raw: data }],
        created_at: new Date(),
        updated_at: new Date(),
      })

      // ────────────────────────────────────────────
      // Queue payment-confirmed email (non-blocking)
      // ────────────────────────────────────────────
      try {
        const { queueEmail } = await import('@/lib/email/queue')
        const email = (data as { receipt_email?: string }).receipt_email
        if (email) {
          await queueEmail({
            template: 'payment-confirmed',
            to: email,
            data: {
              orderId,
              total: Math.round(intent.amount / 100),
              siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
            },
          })
        }
      } catch (err) {
        console.error('[stripe-webhook] email queue failed:', err)
      }

      revalidatePath('/orders')
      revalidatePath('/admin/orders')
      revalidatePath('/admin')
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = data as unknown as Stripe.PaymentIntent
      const orderId = intent.metadata?.orderId
      if (!orderId) return

      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_metadata: {
            failure_reason: intent.last_payment_error?.message ?? 'unknown',
          },
        })
        .eq('id', orderId)

      await transactions.insertOne({
        order_id: orderId,
        user_id: intent.metadata?.userId ?? null,
        provider: 'stripe',
        provider_txn_id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: 'failed',
        method: 'card',
        webhook_events: [{ event: type, at: new Date(), raw: data }],
        created_at: new Date(),
        updated_at: new Date(),
      })

      // ────────────────────────────────────────────
      // Queue payment-failed email (non-blocking)
      // ────────────────────────────────────────────
      try {
        const { queueEmail } = await import('@/lib/email/queue')
        const email = (data as { receipt_email?: string }).receipt_email
        if (email) {
          await queueEmail({
            template: 'payment-failed',
            to: email,
            data: {
              orderId,
              reason:
                intent.last_payment_error?.message ||
                'Your payment could not be processed',
              siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
            },
          })
        }
      } catch (err) {
        console.error('[stripe-webhook] payment-failed email queue failed:', err)
      }

      revalidatePath('/orders')
      revalidatePath('/admin/orders')
      break
    }

    case 'charge.refunded': {
      const charge = data as unknown as Stripe.Charge
      const intentId =
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id
      if (!intentId) return

      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('payment_intent_id', intentId)
        .single()

      if (order) {
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'refunded' })
          .eq('id', order.id)

        revalidatePath('/orders')
        revalidatePath('/admin/orders')
      }

      await transactions.updateOne(
        { provider_txn_id: intentId },
        {
          $set: { status: 'refunded', updated_at: new Date() },
          $push: {
            webhook_events: {
              event: type,
              at: new Date(),
              raw: data,
            },
          },
        }
      )
      break
    }

    default:
      break
  }
}