// src/app/admin/orders/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin'
import OrdersTable from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('❌ Orders fetch error:', error)

  return <OrdersTable orders={orders || []} fetchError={error?.message} />
}