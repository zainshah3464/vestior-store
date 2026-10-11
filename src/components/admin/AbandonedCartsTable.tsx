'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Mail, ShoppingCart, ExternalLink, CheckCircle2 } from 'lucide-react'
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

  if (items.length === 0) {
    return (
      <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-16 text-center">
        <ShoppingCart size={32} className="text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No abandoned carts found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-3">
        {items.map((cart) => {
          const recovered = !!cart.recovered_at
          // If `now` is null (first SSR render), fall back to updated_at so age is 0
          const ageHours =
            now === null
              ? 0
              : Math.round((now - new Date(cart.updated_at).getTime()) / 3600000)

          return (
            <div
              key={String(cart._id)}
              className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {cart.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">
                        {cart.user_name}
                      </p>
                      {recovered && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} />
                          Recovered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cart.user_email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    ₹{cart.subtotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {cart.item_count} item{cart.item_count === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5">Abandoned</p>
                  <p className="text-white font-medium">
                    {now === null
                      ? '—'
                      : ageHours < 1
                      ? '<1h ago'
                      : `${ageHours}h ago`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Emails Sent</p>
                  <p className="text-white font-medium">
                    {cart.recovery_email_count}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Last Reminder</p>
                  <p className="text-white font-medium">
                    {cart.last_reminder_at
                      ? new Date(cart.last_reminder_at).toLocaleDateString(
                          'en-GB'
                        )
                      : 'Never'}
                  </p>
                </div>
                {cart.offered_coupon_code && (
                  <div>
                    <p className="text-gray-500 mb-0.5">Coupon</p>
                    <p className="text-indigo-400 font-mono font-medium">
                      {cart.offered_coupon_code}
                    </p>
                  </div>
                )}
              </div>

              {/* Item preview */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex gap-2 overflow-x-auto">
                  {cart.items.slice(0, 6).map((item, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 px-2.5 py-1 bg-black/30 border border-white/5 rounded-lg text-xs text-gray-400"
                    >
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {cart.items.length > 6 && (
                    <div className="flex-shrink-0 px-2.5 py-1 bg-white/5 rounded-lg text-xs text-gray-500">
                      +{cart.items.length - 6} more
                    </div>
                  )}
                </div>
              </div>

              {recovered && cart.recovered_order_id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <Link
                    href={`/admin/orders/${cart.recovered_order_id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <ExternalLink size={12} />
                    View recovered order
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-[#0f0f0f]/60 border border-white/10 rounded-2xl">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}