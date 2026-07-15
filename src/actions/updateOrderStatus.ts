'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  // Revalidate the page so the table refreshes (optional)
  // revalidatePath('/admin/orders')   // import from 'next/cache' if needed
}