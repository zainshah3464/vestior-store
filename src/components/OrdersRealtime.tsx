'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import OrderCard from '@/app/(main)/orders/OrderCard'
import { AnimatePresence, motion } from 'framer-motion'
import {
  RefreshCw,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Layers,
} from 'lucide-react'

type StatusFilter =
  | 'all'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

interface FilterChip {
  key: StatusFilter
  label: string
  Icon: React.ElementType
}

const FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'All', Icon: Layers },
  { key: 'pending', label: 'Pending', Icon: Clock },
  { key: 'processing', label: 'Processing', Icon: Package },
  { key: 'shipped', label: 'Shipped', Icon: Truck },
  { key: 'delivered', label: 'Delivered', Icon: CheckCircle },
  { key: 'cancelled', label: 'Cancelled', Icon: XCircle },
]

export default function OrdersRealtime({
  initialOrders,
}: {
  initialOrders: any[]
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  // ─────────────────────────────────────────────
  // Realtime subscription — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('orders-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((current) =>
            current.map((order) =>
              order.id === payload.new.id
                ? { ...order, ...payload.new }
                : order
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filtered =
    activeFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === activeFilter)

  const refreshOrders = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('orders')
        .select(
          'id, status, payment_status, total, created_at, items, payment_method'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  // Count per filter (derived from current orders)
  const counts = useMemo(() => {
    const map: Record<StatusFilter, number> = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
    for (const o of orders) {
      const s = o.status as StatusFilter
      if (s in map && s !== 'all') map[s]++
    }
    return map
  }, [orders])

  return (
    <div className="relative">
      {/* ─────────────────────────────────────────────
          Filter toolbar — sticky on mobile scroll
         ───────────────────────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 bg-[#0A0A0A]/80 backdrop-blur-xl border-y border-white/[0.06]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_CHIPS.map(({ key, label, Icon }) => {
            const active = activeFilter === key
            const count = counts[key]
            const isAll = key === 'all'

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                aria-pressed={active}
                className={`relative flex-shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-[11px] sm:text-[12px] font-medium whitespace-nowrap border transition-all duration-200 ${
                  active
                    ? 'bg-indigo-500/[0.15] text-indigo-300 border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]'
                    : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-white hover:border-white/15'
                }`}
              >
                <Icon
                  size={12}
                  className={active ? 'text-indigo-400' : 'text-gray-500'}
                  aria-hidden="true"
                />
                {label}
                {/* Count badge — only when > 0 */}
                {count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-[1px] rounded-full text-[9px] font-bold tabular-nums ${
                      active
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : isAll
                        ? 'bg-white/[0.08] text-gray-400'
                        : 'bg-white/[0.05] text-gray-500'
                    }`}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            )
          })}

          {/* Refresh button */}
          <motion.button
            type="button"
            onClick={refreshOrders}
            disabled={loading}
            whileTap={{ scale: 0.92 }}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="ml-auto flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          </motion.button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Orders list
         ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative h-44 rounded-2xl bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </motion.div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={`list-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filtered.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.04, 0.25),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-indigo-500/[0.06] blur-[100px]"
            />

            <div className="relative px-6 max-w-sm">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                <Package
                  size={26}
                  className="text-indigo-400/70"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-[15px] sm:text-base font-semibold text-white mb-1.5">
                No{' '}
                {activeFilter !== 'all' ? activeFilter : ''}{' '}
                {activeFilter !== 'all' ? 'orders' : 'orders'} found
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {activeFilter === 'all'
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${activeFilter} orders right now.`}
              </p>

              {activeFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
                >
                  Show all orders
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}