'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { stripeProvider } from '@/lib/payments'
import { withIdempotency } from '@/lib/idempotency'
import { revalidatePath } from 'next/cache'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type Stripe from 'stripe'

/**
 * Called by the client AFTER Stripe Elements reports success.
 *
 * Stripe auto-captures payments (capture_method: 'automatic_async'),
 * so we RETRIEVE the intent to confirm its status rather than
 * attempting to capture it (which would throw).
 *
 * Idempotent: if the webhook (or a prior call) already marked the
 * order paid, this is a no-op.
 */
export async function confirmPayment(
  orderId: string,
  paymentIntentId: string
): Promise<{ success: true; alreadyPaid: boolean }> {
  if (!orderId || !paymentIntentId) {
    throw new Error('Missing orderId or paymentIntentId')
  }

  // 1. Authenticate
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Load order + verify ownership
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('id, user_id, payment_status, payment_intent_id, total')
    .eq('id', orderId)
    .single()

  if (orderErr || !order) throw new Error('Order not found')
  if (order.user_id !== user.id) throw new Error('Forbidden')

  // 3. Already paid? Done.
  if (order.payment_status === 'completed') {
    return { success: true, alreadyPaid: true }
  }

  // 4. Intent must match what's on the order
  if (order.payment_intent_id && order.payment_intent_id !== paymentIntentId) {
    throw new Error('Payment intent mismatch')
  }

  // 5. Idempotency guard
  return withIdempotency(
    { scope: 'stripe-confirm', key: paymentIntentId, ttlSeconds: 86_400 },
    async () => {
      // 6. Retrieve (NOT capture) — safe status check
      const intent = await stripeProvider.retrievePayment(paymentIntentId)

      if (intent.status !== 'succeeded') {
        throw new Error(`Payment not completed (status: ${intent.status})`)
      }

      // 7. Update order
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      // 8. MongoDB log — skip if webhook already logged it
      try {
        const db = await getDb()
        const existing = await db
          .collection(COLLECTIONS.PAYMENT_TRANSACTIONS)
          .findOne({ provider_txn_id: paymentIntentId })

        if (!existing) {
          const raw = intent.raw as Stripe.PaymentIntent
          await db.collection(COLLECTIONS.PAYMENT_TRANSACTIONS).insertOne({
            order_id: orderId,
            user_id: user.id,
            provider: 'stripe',
            provider_txn_id: paymentIntentId,
            amount: intent.amount,
            currency: 'pkr',
            status: 'succeeded',
            method: 'card',
            webhook_events: [
              { event: 'client.confirmed', at: new Date(), raw },
            ],
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      } catch (err) {
        console.error('[confirmPayment] mongo log failed:', err)
      }

      revalidatePath('/orders')
      revalidatePath('/admin/orders')
      revalidatePath('/admin')

      return { success: true as const, alreadyPaid: false }
    }
  )
}