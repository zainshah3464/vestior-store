import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrdersRealtime from '@/components/OrdersRealtime'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, payment_status, total, created_at, items')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Your Orders</h1>
        {orders && orders.length > 0 ? (
          <OrdersRealtime initialOrders={orders} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No orders yet.</p>
            <a href="/products" className="mt-4 inline-block text-blue-400 hover:underline">
              Start shopping
            </a>
          </div>
        )}
      </div>
    </div>
  )
}