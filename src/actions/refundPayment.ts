'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { stripeProvider } from '@/lib/payments/providers/stripe'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type { ObjectId } from 'mongodb'

// ─────────────────────────────────────────────────────────────
// Explicit MongoDB document type — required for $push operator
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
  webhook_events: Array<{
    event: string
    at: Date
    raw: Record<string, unknown>
  }>
  created_at: Date
  updated_at: Date
}

/**
 * Admin-only action: refund a payment.
 *
 * For Stripe: calls Stripe refund API, then marks the order refunded.
 * For COD: just marks the order refunded (no external call).
 *
 * Idempotent: refunding an already-refunded order is a no-op.
 */
export async function refundPayment(
  orderId: string,
  reason?: string
): Promise<{ success: true; refundId?: string }> {
  if (!orderId) throw new Error('Missing orderId')

  // 1. Verify caller is admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  // 2. Load order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select(
      'id, total, payment_status, payment_provider, payment_intent_id, user_email'
    )
    .eq('id', orderId)
    .single()

  if (orderErr || !order) throw new Error('Order not found')

  // 3. Already refunded? Done.
  if (order.payment_status === 'refunded') {
    return { success: true }
  }

  // 4. Must be completed to refund
  if (order.payment_status !== 'completed') {
    throw new Error(
      `Cannot refund order with payment status "${order.payment_status}"`
    )
  }

  let refundId: string | undefined

  // 5. Stripe path — call API
  if (order.payment_provider === 'stripe') {
    if (!order.payment_intent_id) {
      throw new Error('Missing Stripe payment intent ID')
    }

    const result = await stripeProvider.refundPayment(order.payment_intent_id)
    refundId = result.id

    // Log to MongoDB (typed collection fixes $push inference)
    try {
      const db = await getDb()
      const coll = db.collection<PaymentTransactionDoc>(
        COLLECTIONS.PAYMENT_TRANSACTIONS
      )

      await coll.updateOne(
        { provider_txn_id: order.payment_intent_id },
        {
          $set: { status: 'refunded', updated_at: new Date() },
          $push: {
            webhook_events: {
              event: 'admin.refund',
              at: new Date(),
              raw: {
                refundId: refundId ?? null,
                reason: reason ?? null,
                by: user.id,
              },
            },
          },
        }
      )
    } catch (err) {
      console.error('[refundPayment] mongo log failed:', err)
    }
  }

  // 6. Update order
  await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'refunded',
      status: 'cancelled',
    })
    .eq('id', orderId)

  // 7. Audit log
  await logAudit({
    actorId: user.id,
    actorEmail: profile.email || user.email || '',
    action: 'payment.refund',
    targetType: 'order',
    targetId: orderId,
    before: { payment_status: order.payment_status },
    after: { payment_status: 'refunded', refundId: refundId ?? null },
    metadata: { reason, provider: order.payment_provider },
  })

  // 8. Revalidate
  revalidatePath('/admin/payments')
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  revalidatePath('/orders')

  return { success: true, refundId }
}