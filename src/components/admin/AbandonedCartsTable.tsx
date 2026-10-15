'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Mail,
  ShoppingCart,
  ExternalLink,
  CheckCircle2,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from 'lucide-react'
import type { CartSnapshotDoc } from '@/lib/carts/queries'

export default function AbandonedCartsTable({
  items,
  total,
  page,
  totalPages,
}: {
  items: CartSnapshotDoc[]
  total: number
  page: number
  totalPages: number
}) {
  const router = useRouter()

  // ─────────────────────────────────────────────
  // Compute "now" once on mount — avoids impure Date.now()
  // inside render (React purity rule).
  // Updates every 60s to keep "age" reasonably fresh.
  // ─────────────────────────────────────────────
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const changePage = (p: number) => {
    router.replace(`/admin/abandoned-carts?page=${p}`)
  }

  // ─────────────────────────────────────────────
  // Empty state
  // ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-rose-500/[0.06] blur-[100px]"
        />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <ShoppingCart
              size={22}
              className="text-gray-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-[14px] font-semibold text-white mb-1">
            No abandoned carts
          </h3>
          <p className="text-[12px] text-gray-500 max-w-xs">
            Looks like everyone's completing their purchases. Nice work!
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {items.map((cart, idx) => {
        const recovered = !!cart.recovered_at
        const ageHours =
          now === null
            ? 0
            : Math.round(
                (now - new Date(cart.updated_at).getTime()) / 3600000
              )

        const initial = cart.user_name.charAt(0).toUpperCase()
        const hasCoupon = !!cart.offered_coupon_code
        const visibleItems = cart.items.slice(0, 6)
        const hiddenCount = cart.items.length - visibleItems.length

        return (
          <motion.article
            key={String(cart._id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: Math.min(idx * 0.03, 0.2),
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`group relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
              recovered
                ? 'bg-gradient-to-b from-emerald-500/[0.03] to-[#0e0e0e] border-emerald-500/[0.15]'
                : 'bg-gradient-to-b from-[#131313] to-[#0e0e0e] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            {/* Ambient status glow */}
            {recovered && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-[200px] h-[200px] bg-emerald-500/[0.08] blur-[90px]"
              />
            )}

            <div className="relative p-4 sm:p-5">
              {/* ─────────────────────────────────────────────
                  Header — user + subtotal
                 ───────────────────────────────────────────── */}
              <header className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0 ring-1 ring-white/[0.08]"
                    aria-hidden="true"
                  >
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-white leading-tight truncate">
                        {cart.user_name}
                      </p>
                      {recovered && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/[0.12] text-emerald-300 px-1.5 py-[3px] rounded-md border border-emerald-500/25 flex-shrink-0">
                          <CheckCircle2 size={9} aria-hidden="true" />
                          Recovered
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {cart.user_email}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg sm:text-xl font-bold text-white tabular-nums tracking-tight">
                    ₹{cart.subtotal.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                    {cart.item_count} item
                    {cart.item_count === 1 ? '' : 's'}
                  </p>
                </div>
              </header>

              {/* ─────────────────────────────────────────────
                  Metrics grid
                 ───────────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
                {/* Abandoned age */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Clock size={10} aria-hidden="true" />
                    <span className="text-[9px] tracking-[0.15em] uppercase font-semibold">
                      Abandoned
                    </span>
                  </div>
                  <p className="text-[12px] text-white font-semibold tabular-nums">
                    {now === null
                      ? '—'
                      : ageHours < 1
                      ? '<1h ago'
                      : `${ageHours}h ago`}
                  </p>
                </div>

                {/* Emails sent */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Mail size={10} aria-hidden="true" />
                    <span className="text-[9px] tracking-[0.15em] uppercase font-semibold">
                      Emails Sent
                    </span>
                  </div>
                  <p className="text-[12px] text-white font-semibold tabular-nums">
                    {cart.recovery_email_count}
                    <span className="text-gray-600 font-normal"> / 3</span>
                  </p>
                </div>

                {/* Last reminder */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Mail size={10} aria-hidden="true" />
                    <span className="text-[9px] tracking-[0.15em] uppercase font-semibold">
                      Last Reminder
                    </span>
                  </div>
                  <p className="text-[12px] text-white font-semibold tabular-nums">
                    {cart.last_reminder_at
                      ? new Date(cart.last_reminder_at).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short' }
                        )
                      : 'Never'}
                  </p>
                </div>

                {/* Coupon */}
                {hasCoupon ? (
                  <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 p-2.5">
                    <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                      <Tag size={10} aria-hidden="true" />
                      <span className="text-[9px] tracking-[0.15em] uppercase font-semibold">
                        Coupon
                      </span>
                    </div>
                    <p className="text-[12px] text-indigo-300 font-mono font-semibold tracking-wide truncate">
                      {cart.offered_coupon_code}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <Tag size={10} aria-hidden="true" />
                      <span className="text-[9px] tracking-[0.15em] uppercase font-semibold">
                        Coupon
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-600 font-medium">
                      None offered
                    </p>
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────
                  Item preview chips
                 ───────────────────────────────────────────── */}
              <div className="mt-3.5 pt-3.5 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Cart Contents
                  </span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
                  {visibleItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-gray-400 hover:bg-white/[0.05] hover:border-white/[0.1] transition-colors"
                    >
                      <span className="truncate max-w-[140px]">
                        {item.name}
                      </span>
                      <span className="text-gray-600 font-medium tabular-nums">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {hiddenCount > 0 && (
                    <div className="flex-shrink-0 inline-flex items-center px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-gray-500 tabular-nums">
                      +{hiddenCount} more
                    </div>
                  )}
                </div>
              </div>

              {/* ─────────────────────────────────────────────
                  Recovered order link
                 ───────────────────────────────────────────── */}
              {recovered && cart.recovered_order_id && (
                <div className="mt-3.5 pt-3.5 border-t border-emerald-500/[0.1]">
                  <Link
                    href={`/admin/orders/${cart.recovered_order_id}`}
                    className="group/link inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink
                      size={11}
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      aria-hidden="true"
                    />
                    View recovered order
                  </Link>
                </div>
              )}
            </div>
          </motion.article>
        )
      })}

      {/* ─────────────────────────────────────────────
          Pagination
         ───────────────────────────────────────────── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          <span className="text-[11px] text-gray-500 tabular-nums">
            Page <span className="text-gray-300 font-medium">{page}</span> of{' '}
            <span className="text-gray-300 font-medium">{totalPages}</span> ·{' '}
            <span className="text-gray-300 font-medium">{total}</span> total
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
            >
              <ChevronLeft
                size={12}
                className="transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                aria-hidden="true"
              />
              Previous
            </button>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
            >
              Next
              <ChevronRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0"
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}