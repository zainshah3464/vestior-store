'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { queueEmail } from '@/lib/email/queue'
import type { EmailTemplate } from '@/lib/email/types'

const ALLOWED: EmailTemplate[] = ['order-placed', 'order-shipped', 'order-delivered']

export async function resendOrderEmail(orderId: string, template: EmailTemplate) {
  // 1. Auth + admin check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  if (!ALLOWED.includes(template)) {
    throw new Error(`Template not allowed: ${template}`)
  }

  // 2. Fetch order
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('user_email, user_id, subtotal, shipping, total, payment_method')
    .eq('id', orderId)
    .single()

  if (!order?.user_email) throw new Error('Order not found')

  // 3. Build payload
  const data: Record<string, unknown> = {
    orderId,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  }

  if (template === 'order-placed') {
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('product_name, quantity, price')
      .eq('order_id', orderId)

    data.items = items ?? []
    data.subtotal = order.subtotal
    data.shipping = order.shipping
    data.total = order.total
    data.paymentMethod = order.payment_method
  }

  // 4. Queue
  await queueEmail({
    template,
    to: order.user_email,
    userId: order.user_id ?? undefined,
    data,
  })

  return { success: true }
}