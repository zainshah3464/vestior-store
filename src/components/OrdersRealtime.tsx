'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import OrderCard from '@/app/(main)/orders/OrderCard'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, Filter } from 'lucide-react'

const statusFilters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersRealtime({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Real-time subscription (original UPDATE logic)
  useEffect(() => {
    const channel = supabase
      .channel('orders-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((current) =>
            current.map((order) =>
              order.id === payload.new.id ? { ...order, ...payload.new } : order
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filtered = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter)

  const refreshOrders = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('orders')
      .select('id, status, payment_status, total, created_at, items, payment_method')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  return (
    <div className="relative">
      {/* Subtle animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <motion.div
          animate={{ x: [0, 200, 0] }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJsaW5lcyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCA0MEw0MCAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2xpbmVzKSIvPjwvc3ZnPg==')] opacity-30"
        />
      </div>

      <div className="relative z-10">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide items-center">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-medium capitalize whitespace-nowrap transition ${
                activeFilter === status
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={refreshOrders}
            className="ml-auto p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 text-gray-500"
            >
              No orders found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}