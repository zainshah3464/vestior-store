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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-lg font-semibold text-white">
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 -mx-2 px-2">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : !detail?.mongoDoc ? (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  No MongoDB payment record found.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Order ID: {orderId.slice(0, 12)}…
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock
                    label="Provider"
                    value={detail.mongoDoc.provider.toUpperCase()}
                    icon={
                      detail.mongoDoc.provider === 'stripe' ? (
                        <CreditCard size={14} />
                      ) : (
                        <Banknote size={14} />
                      )
                    }
                  />
                  <InfoBlock
                    label="Status"
                    value={detail.mongoDoc.status}
                  />
                  <InfoBlock
                    label="Amount"
                    value={`₹${(detail.mongoDoc.amount / 100).toLocaleString()}`}
                  />
                  <InfoBlock
                    label="Currency"
                    value={detail.mongoDoc.currency.toUpperCase()}
                  />
                  <div className="col-span-2">
                    <InfoBlock
                      label="Transaction ID"
                      value={detail.mongoDoc.provider_txn_id}
                      mono
                    />
                  </div>
                </div>

                {/* Webhook timeline */}
                {detail.mongoDoc.webhook_events.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400" />
                      Event Timeline
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {detail.mongoDoc.webhook_events.map((evt, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-emerald-400 mt-0.5 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-mono break-all">
                              {evt.event}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(evt.at).toLocaleString('en-GB')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && detail?.mongoDoc && detail.mongoDoc.status !== 'refunded' && (
            <div className="mt-6 pt-5 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition"
              >
                Close
              </button>
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-300 hover:bg-red-500/30 disabled:opacity-50 transition flex items-center gap-2"
              >
                {refunding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw size={14} />
                )}
                {refunding ? 'Refunding…' : 'Refund'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function InfoBlock({
  label,
  value,
  icon,
  mono,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p
        className={`text-sm text-white ${
          mono ? 'font-mono break-all' : 'font-medium'
        }`}
      >
        {value}
      </p>
    </div>
  )
}