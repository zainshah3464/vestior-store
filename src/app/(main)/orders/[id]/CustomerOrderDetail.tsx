'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  Receipt,
  Calendar,
  Download,
  Hash,
  User,
  Phone,
  Lock,
  RotateCcw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { OrderDetail } from '@/lib/orders/queries'

// ─────────────────────────────────────────────
// Status maps — preserved logic
// ─────────────────────────────────────────────
const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const STATUS_COLORS: Record<
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

const PAYMENT_STYLES: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  completed: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/[0.08]',
    border: 'border-emerald-500/25',
  },
  pending: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/[0.08]',
    border: 'border-amber-500/25',
  },
  failed: {
    text: 'text-red-300',
    bg: 'bg-red-500/[0.08]',
    border: 'border-red-500/25',
  },
  refunded: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/[0.08]',
    border: 'border-violet-500/25',
  },
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const

export default function CustomerOrderDetail({
  detail,
}: {
  detail: OrderDetail
}) {
  const [currentStatus, setCurrentStatus] = useState(detail.order.status)
  const supabase = createClient()

  // ─────────────────────────────────────────────
  // Realtime updates — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`order-${detail.order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${detail.order.id}`,
        },
        (payload) => {
          setCurrentStatus(payload.new.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, detail.order.id])

  const statusStyle = STATUS_COLORS[currentStatus] ?? STATUS_COLORS.pending
  const StatusIcon = STATUS_ICONS[currentStatus] ?? Package
  const currentStepIndex = STATUS_STEPS.indexOf(
    currentStatus as (typeof STATUS_STEPS)[number]
  )

  const paymentStyle =
    PAYMENT_STYLES[detail.order.paymentStatus] ?? PAYMENT_STYLES.pending

  const orderDate = new Date(detail.order.createdAt)

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/4 w-[500px] h-[400px] bg-indigo-500/[0.05] blur-[130px]" />
        <div className="absolute top-1/2 right-0 w-[380px] h-[380px] bg-violet-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Back link
           ───────────────────────────────────────────── */}
        <Link
          href="/orders"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white mb-6 md:mb-8 transition-colors"
        >
          <ChevronLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Orders
        </Link>

        {/* ─────────────────────────────────────────────
            Header
           ───────────────────────────────────────────── */}
        <header className="flex items-start justify-between gap-4 flex-wrap mb-6 md:mb-8">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
              <Hash size={10} className="text-blue-400" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
                Order
              </span>
              <span className="font-mono text-[11px] font-semibold text-white tracking-wider">
                {detail.order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] leading-tight">
              Order Details
            </h1>

            <p className="text-[11px] sm:text-[12px] text-gray-500 mt-2 flex items-center gap-1.5">
              <Calendar size={11} aria-hidden="true" />
              <span>
                {orderDate.toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status badge */}
            <motion.div
              key={currentStatus}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-[12px] font-semibold capitalize ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
            >
              <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
                {currentStatus !== 'delivered' &&
                  currentStatus !== 'cancelled' && (
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusStyle.dot} opacity-60`}
                    />
                  )}
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusStyle.dot}`}
                />
              </span>
              <StatusIcon size={13} aria-hidden="true" />
              {currentStatus}
            </motion.div>

            {/* Invoice button */}
            <Link
              href={`/orders/${detail.order.id}/invoice`}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 text-[12px] font-medium"
            >
              <Download
                size={13}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
              Invoice
            </Link>
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            Progress tracker
           ───────────────────────────────────────────── */}
        {currentStatus !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 mb-6 shadow-2xl shadow-black/20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-indigo-500/[0.06] blur-[100px]"
            />

            <div className="relative flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => {
                const Icon = STATUS_ICONS[step]
                const isActive = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                const isComplete = i < currentStepIndex

                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isActive
                            ? 'border-indigo-500 bg-indigo-500/[0.15] text-indigo-300'
                            : 'border-white/[0.08] bg-white/[0.02] text-gray-600'
                        }`}
                      >
                        {isComplete ? (
                          <motion.span
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 22,
                            }}
                          >
                            <CheckCircle
                              size={17}
                              aria-hidden="true"
                            />
                          </motion.span>
                        ) : (
                          <Icon
                            size={16}
                            aria-hidden="true"
                          />
                        )}

                        {/* Current step pulse ring */}
                        {isCurrent && !isComplete && (
                          <motion.span
                            aria-hidden="true"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="absolute inset-0 rounded-full bg-indigo-500/30"
                          />
                        )}
                      </div>

                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold tracking-wide capitalize hidden sm:block transition-colors ${
                          isActive ? 'text-indigo-300' : 'text-gray-600'
                        }`}
                      >
                        {step}
                      </span>
                    </div>

                    {i < STATUS_STEPS.length - 1 && (
                      <div className="relative flex-1 h-[2px] mx-1.5 sm:mx-3 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{
                            width: i < currentStepIndex ? '100%' : '0%',
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────
            Content grid
           ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* ═════════════════════════════════════════════
              LEFT — items + shipping
             ═════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-5">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/20"
            >
              <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
                  <Package
                    size={14}
                    className="text-indigo-400"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-[13px] font-semibold text-white">
                  Items
                  <span className="ml-1.5 text-gray-500 font-normal tabular-nums">
                    ({detail.items.length})
                  </span>
                </h2>
              </div>

              <ul className="divide-y divide-white/[0.04]">
                {detail.items.map((item, idx) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.15 + idx * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4"
                  >
                    {/* Image */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black border border-white/[0.06] flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package
                            size={18}
                            className="text-gray-600"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    {/* Name + qty */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate leading-tight">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1 tabular-nums">
                        Qty {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Line total */}
                    <p className="text-[13px] sm:text-[14px] font-semibold text-white tabular-nums flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Shipping address */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/20"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-[240px] h-[240px] bg-blue-500/[0.05] blur-[90px]"
              />

              <div className="relative flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                  <MapPin
                    size={14}
                    className="text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-[13px] font-semibold text-white">
                  Shipping Address
                </h2>
              </div>

              <div className="relative text-[13px] text-gray-300 space-y-1.5">
                <p className="font-semibold text-white flex items-center gap-2">
                  <User
                    size={12}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                  {String(detail.order.address.full_name ?? '')}
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <Phone
                    size={12}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                  {String(detail.order.address.phone ?? '')}
                </p>
                <div className="pt-1 pl-5 border-l-2 border-white/[0.06] space-y-0.5">
                  <p>{String(detail.order.address.line1 ?? '')}</p>
                  {Boolean(detail.order.address.line2) && (
                    <p>{String(detail.order.address.line2)}</p>
                  )}
                  <p>
                    {String(detail.order.address.city ?? '')},{' '}
                    {String(detail.order.address.state ?? '')} —{' '}
                    <span className="tabular-nums">
                      {String(detail.order.address.pincode ?? '')}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═════════════════════════════════════════════
              RIGHT — summary + payment
             ═════════════════════════════════════════════ */}
          <div className="space-y-5">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/20"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-[240px] h-[240px] bg-amber-500/[0.04] blur-[90px]"
              />

              <div className="relative flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center">
                  <Receipt
                    size={14}
                    className="text-amber-400"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-[13px] font-semibold text-white">
                  Summary
                </h2>
              </div>

              <div className="relative space-y-2.5 text-[12px]">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white tabular-nums">
                    ₹{detail.order.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span
                    className={`tabular-nums ${
                      detail.order.shipping === 0
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}
                  >
                    {detail.order.shipping === 0
                      ? 'Free'
                      : `₹${detail.order.shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-white/[0.08] pt-3 mt-1 flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold text-white">
                    Total
                  </span>
                  <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                    ₹{detail.order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/20"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-[240px] h-[240px] bg-emerald-500/[0.04] blur-[90px]"
              />

              <div className="relative flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center">
                  <CreditCard
                    size={14}
                    className="text-emerald-400"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-[13px] font-semibold text-white">
                  Payment
                </h2>
              </div>

              <div className="relative space-y-3 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white font-medium uppercase tracking-wide">
                    {detail.order.paymentProvider ??
                      detail.order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full capitalize border ${paymentStyle.bg} ${paymentStyle.border} ${paymentStyle.text}`}
                  >
                    {detail.order.paymentStatus}
                  </span>
                </div>

                {detail.order.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Paid on</span>
                    <span className="text-white tabular-nums">
                      {new Date(detail.order.paidAt).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}