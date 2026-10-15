'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronRight,
  Hash,
  Calendar,
  CreditCard,
  Tag,
} from 'lucide-react'
import { useState } from 'react'

// ─────────────────────────────────────────────
// Status maps — preserved exactly
// ─────────────────────────────────────────────
const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusStyles: Record<
  string,
  { text: string; bg: string; border: string; dot: string }
> = {
  pending: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/[0.08]',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  processing: {
    text: 'text-blue-300',
    bg: 'bg-blue-500/[0.08]',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  shipped: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/[0.08]',
    border: 'border-violet-500/25',
    dot: 'bg-violet-400',
  },
  delivered: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/[0.08]',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    text: 'text-red-300',
    bg: 'bg-red-500/[0.08]',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
  },
}

const paymentStyles: Record<string, string> = {
  completed: 'text-emerald-300',
  pending: 'text-amber-300',
  failed: 'text-red-300',
  refunded: 'text-violet-300',
}

interface OrderItem {
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  status: string
  payment_status: string
  total: number
  created_at: string
  items: OrderItem[]
  payment_method?: string
}

export default function OrderCard({ order }: { order: Order }) {
  const StatusIcon = statusIcons[order.status] || Package
  const styles =
    statusStyles[order.status] || {
      text: 'text-gray-300',
      bg: 'bg-gray-500/[0.08]',
      border: 'border-gray-500/25',
      dot: 'bg-gray-400',
    }

  const [expanded, setExpanded] = useState(false)

  const items = Array.isArray(order.items) ? order.items : []
  const visibleItems = items.slice(0, expanded ? items.length : 2)
  const remainingCount = items.length - 2
  const hasMore = items.length > 2

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = orderDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const paymentLabel = order.payment_method || 'COD'
  const paymentStatusClass =
    paymentStyles[order.payment_status] || 'text-gray-400'

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-colors duration-300"
    >
      {/* Status accent line — subtle on hover only */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent ${styles.dot} to-transparent`}
      />

      {/* Soft ambient glow behind status */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-16 -right-16 w-[200px] h-[200px] ${styles.bg} blur-[90px] opacity-40`}
      />

      <div className="relative p-5 md:p-6">
        {/* ─────────────────────────────────────────────
            Header — order id + status badge
           ───────────────────────────────────────────── */}
        <header className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                <Hash size={10} aria-hidden="true" />
                Order
              </span>
              <span className="font-mono text-[13px] font-semibold text-white tracking-wider">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Calendar size={10} aria-hidden="true" />
              <span>{formattedDate}</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="tabular-nums">{formattedTime}</span>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize border ${styles.bg} ${styles.border} ${styles.text}`}
          >
            <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.dot} opacity-60`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`}
              />
            </span>
            <StatusIcon size={11} aria-hidden="true" />
            {order.status}
          </span>
        </header>

        {/* ─────────────────────────────────────────────
            Items
           ───────────────────────────────────────────── */}
        <div className="rounded-xl bg-black/30 border border-white/[0.04] p-3.5 md:p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 flex items-center gap-1.5">
              <Package size={10} aria-hidden="true" />
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </h3>
          </div>

          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {visibleItems.map((item, idx) => (
                <motion.li
                  key={`${item.product_name}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(idx * 0.03, 0.12),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start justify-between gap-3 text-[12px]"
                >
                  <span className="text-gray-300 leading-snug min-w-0">
                    <span className="line-clamp-1">{item.product_name}</span>
                    <span className="text-gray-500 text-[10px] ml-1">
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="text-gray-200 font-medium tabular-nums flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hasMore && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              className="group/expand mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>Show less</>
              ) : (
                <>
                  +{remainingCount} more{' '}
                  {remainingCount === 1 ? 'item' : 'items'}
                </>
              )}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex"
                aria-hidden="true"
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>
          )}
        </div>

        {/* ─────────────────────────────────────────────
            Total + payment info
           ───────────────────────────────────────────── */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500">
              Total
            </span>
            <span className="text-xl md:text-[22px] font-bold text-white tabular-nums tracking-tight">
              ₹{order.total?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Payment info */}
            <div className="flex items-center gap-2 text-[11px] min-w-0">
              <CreditCard
                size={11}
                className="text-gray-500 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-gray-400 font-medium uppercase tracking-wide truncate">
                {paymentLabel}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
              <span
                className={`${paymentStatusClass} font-medium capitalize truncate`}
              >
                {order.payment_status}
              </span>
            </div>

            {/* View details link */}
            <Link
              href={`/orders/${order.id}`}
              className="group/link inline-flex items-center gap-1 text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
            >
              View Details
              <ChevronRight
                size={13}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}