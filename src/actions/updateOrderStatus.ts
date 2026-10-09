'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { queueEmail } from '@/lib/email/queue'
import type { EmailTemplate } from '@/lib/email/types'

const ALLOWED_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

type OrderStatus = (typeof ALLOWED_STATUSES)[number]

// Map order status → email template
const STATUS_EMAIL: Partial<Record<OrderStatus, EmailTemplate>> = {
  shipped: 'order-shipped',
  delivered: 'order-delivered',
  cancelled: 'order-cancelled',
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // 1. Validate
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Invalid order ID')
  }
  if (!ALLOWED_STATUSES.includes(newStatus as OrderStatus)) {
    throw new Error(`Invalid status: ${newStatus}`)
  }

  // 2. Verify admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized: Not logged in')

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileErr || profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  // 3. Fetch current order to compare status
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('status, user_email, user_id')
    .eq('id', orderId)
    .single()

  const previousStatus = order?.status

  // 4. Update
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  // 5. Queue status email (only if status actually changed)
  const emailTemplate = STATUS_EMAIL[newStatus as OrderStatus]
  if (emailTemplate && order?.user_email && previousStatus !== newStatus) {
    try {
      await queueEmail({
        template: emailTemplate,
        to: order.user_email,
        userId: order.user_id ?? undefined,
        data: {
          orderId,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        },
      })
    } catch (err) {
      console.error('[updateOrderStatus] email queue failed:', err)
    }
  }

  // 6. Revalidate
  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  revalidatePath('/admin')

  return { success: true }
}