'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ALLOWED_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

type OrderStatus = (typeof ALLOWED_STATUSES)[number]

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // 1. Validate inputs
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Invalid order ID')
  }
  if (!ALLOWED_STATUSES.includes(newStatus as OrderStatus)) {
    throw new Error(`Invalid status: ${newStatus}`)
  }

  // 2. Verify the caller is an authenticated admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized: Not logged in')
  }

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileErr || profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  // 3. Perform the update using service role (bypasses RLS)
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  // 4. Revalidate affected routes so UI shows fresh data
  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  revalidatePath('/admin')

  return { success: true }
}