'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Loader2,
  CreditCard,
  Banknote,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hash,
  Receipt,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { refundPayment } from '@/actions/refundPayment'

interface PaymentDetailPayload {
  orderId: string
  mongoDoc: {
    provider: string
    provider_txn_id: string
    amount: number
    currency: string
    status: string
    method?: string
    webhook_events: Array<{ event: string; at: string | Date; raw: unknown }>
    created_at: string | Date
    updated_at: string | Date
  } | null
}

// Status styling for the detail modal
const STATUS_BADGES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  succeeded: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  completed: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  processing: {
    bg: 'bg-blue-500/[0.1]',
    text: 'text-blue-300',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  pending: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  failed: {
    bg: 'bg-red-500/[0.1]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
  },
  refunded: {
    bg: 'bg-violet-500/[0.1]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    dot: 'bg-violet-400',
  },
}

const DEFAULT_BADGE = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
}

export default function PaymentDetailsModal({
  orderId,
  onClose,
}: {
  orderId: string
  onClose: () => void
}) {
  const [detail, setDetail] = useState<PaymentDetailPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [refunding, setRefunding] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `/api/admin/payment-detail?orderId=${encodeURIComponent(orderId)}`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Failed to load payment details')
        const data: PaymentDetailPayload = await res.json()
        setDetail(data)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load details'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [orderId])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this payment?')) return
    setRefunding(true)
    try {
      const result = await refundPayment(orderId)
      if (result.success) {
        toast.success('Refund processed')
        onClose()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Refund failed'
      toast.error(message)
    } finally {
      setRefunding(false)
    }
  }

  const mongoDoc = detail?.mongoDoc
  const statusStyle = mongoDoc
    ? STATUS_BADGES[mongoDoc.status] ?? DEFAULT_BADGE
    : DEFAULT_BADGE
  const ProviderIcon =
    mongoDoc?.provider === 'stripe' ? CreditCard : Banknote

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Payment details"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-lg bg-[#0f0f0f] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.08] blur-[100px]"
          />

          {/* Top gradient accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-60"
          />

          {/* ═════════════════════════════════════════════
              Header
             ═════════════════════════════════════════════ */}
          <div className="relative flex-shrink-0 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                  <Receipt
                    size={15}
                    className="text-indigo-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-white leading-tight">
                    Payment Details
                  </h2>
                  <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                    Order #{orderId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 flex-shrink-0"
                aria-label="Close"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════
              Body
             ═════════════════════════════════════════════ */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2
                  size={22}
                  className="animate-spin text-indigo-400"
                  aria-hidden="true"
                />
                <p className="text-[11px] text-gray-500 mt-3">
                  Loading payment details…
                </p>
              </div>
            ) : !mongoDoc ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                  <AlertCircle
                    size={22}
                    className="text-gray-600"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-1">
                  No payment record found
                </h3>
                <p className="text-[12px] text-gray-500 max-w-xs">
                  No MongoDB transaction log exists for this order. It may be
                  a COD order with no processor events.
                </p>
                <p className="text-[10px] text-gray-600 mt-3 font-mono">
                  {orderId.slice(0, 12)}…
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Provider + status hero */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.06]">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <ProviderIcon
                      size={18}
                      className="text-indigo-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-white uppercase tracking-wider">
                        {mongoDoc.provider}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${statusStyle.dot}`}
                          aria-hidden="true"
                        />
                        {mongoDoc.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(mongoDoc.created_at).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Amount hero */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                      Amount
                    </p>
                    <p className="text-[16px] font-bold text-white tabular-nums tracking-tight mt-0.5">
                      ₹{(mongoDoc.amount / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoBlock
                    label="Currency"
                    value={mongoDoc.currency.toUpperCase()}
                  />
                  <InfoBlock
                    label="Method"
                    value={mongoDoc.method ?? '—'}
                  />
                  <div className="col-span-2">
                    <InfoBlock
                      label="Transaction ID"
                      value={mongoDoc.provider_txn_id}
                      mono
                      icon={Hash}
                    />
                  </div>
                </div>

                {/* Webhook timeline */}
                {mongoDoc.webhook_events.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
                        <Clock
                          size={11}
                          className="text-indigo-400"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-[11px] font-semibold text-white tracking-wide">
                        Event Timeline
                        <span className="ml-2 text-[10px] font-normal text-gray-500 tabular-nums">
                          ({mongoDoc.webhook_events.length})
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto overscroll-contain pr-1">
                      {mongoDoc.webhook_events.map((evt, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: Math.min(idx * 0.04, 0.2),
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/[0.12] border border-emerald-500/25 flex items-center justify-center mt-0.5">
                            <CheckCircle2
                              size={10}
                              className="text-emerald-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-white font-mono break-all leading-snug">
                              {evt.event}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1 tabular-nums">
                              {new Date(evt.at).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═════════════════════════════════════════════
              Footer
             ═════════════════════════════════════════════ */}
          {!loading && mongoDoc && mongoDoc.status !== 'refunded' && (
            <div className="flex-shrink-0 flex gap-2.5 p-4 border-t border-white/[0.06] bg-black/20">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] text-gray-300 rounded-xl text-[12px] font-medium hover:bg-white/[0.06] hover:border-white/15 hover:text-white transition-all duration-200"
              >
                Close
              </button>

              <motion.button
                type="button"
                onClick={handleRefund}
                disabled={refunding}
                whileTap={refunding ? {} : { scale: 0.98 }}
                className="group/btn relative flex-1 py-2.5 rounded-xl text-[12px] font-semibold overflow-hidden border flex items-center justify-center gap-2 bg-red-500/[0.08] border-red-500/25 text-red-300 hover:bg-red-500/[0.15] hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {refunding ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <RotateCcw size={13} aria-hidden="true" />
                )}
                {refunding ? 'Refunding…' : 'Refund'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// InfoBlock — with optional icon
// ─────────────────────────────────────────────
function InfoBlock({
  label,
  value,
  mono,
  icon: Icon,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: React.ElementType
}) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && (
          <Icon
            size={10}
            className="text-gray-500 flex-shrink-0"
            aria-hidden="true"
          />
        )}
        <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
          {label}
        </p>
      </div>
      <p
        className={`text-[12px] text-white ${
          mono ? 'font-mono break-all' : 'font-medium capitalize'
        }`}
      >
        {value}
      </p>
    </div>
  )
}