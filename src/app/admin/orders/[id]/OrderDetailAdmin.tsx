'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Package, MapPin, CreditCard, User, Clock, CheckCircle,
  AlertCircle, RotateCcw, Mail, ShieldCheck, Bell,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '@/actions/updateOrderStatus'
import { refundPayment } from '@/actions/refundPayment'
import { resendOrderEmail } from '@/actions/resendOrderEmail'
import type { OrderDetail } from '@/lib/orders/queries'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function OrderDetailAdmin({ detail }: { detail: OrderDetail }) {
  const router = useRouter()
  const [status, setStatus] = useState(detail.order.status)
  const [updating, setUpdating] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [resending, setResending] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return
    setUpdating(true)
    try {
      await updateOrderStatus(detail.order.id, newStatus)
      setStatus(newStatus)
      toast.success(`Status → ${newStatus}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handleRefund = async () => {
    if (!confirm('Refund this payment? This cannot be undone.')) return
    setRefunding(true)
    try {
      await refundPayment(detail.order.id)
      toast.success('Refund processed')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Refund failed')
    } finally {
      setRefunding(false)
    }
  }

  const handleResend = async (template: 'order-placed' | 'order-shipped' | 'order-delivered') => {
    setResending(true)
    try {
      await resendOrderEmail(detail.order.id, template)
      toast.success(`Resent: ${template}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Resend failed')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-3 transition text-sm"
          >
            <ArrowLeft size={14} />
            Back to Orders
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-mono">
            #{detail.order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Clock size={14} />
            {new Date(detail.order.createdAt).toLocaleString('en-GB')}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full border text-sm font-medium capitalize ${
            STATUS_COLORS[status] ?? 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card title="Items" icon={Package}>
            <div className="divide-y divide-white/5">
              {detail.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 border border-white/10">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.productName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      className="text-sm font-medium text-white hover:text-indigo-400 truncate block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-sm">
              <Row label="Subtotal" value={`₹${detail.order.subtotal.toLocaleString()}`} />
              <Row
                label="Shipping"
                value={
                  detail.order.shipping === 0
                    ? 'Free'
                    : `₹${detail.order.shipping.toLocaleString()}`
                }
              />
              <Row
                label="Total"
                value={`₹${detail.order.total.toLocaleString()}`}
                bold
              />
            </div>
          </Card>

          {/* Customer */}
          <Card title="Customer" icon={User}>
            <div className="space-y-2 text-sm">
              <Row label="Name" value={detail.customer?.fullName ?? '—'} />
              <Row label="Email" value={detail.order.userEmail} />
              <Row label="Phone" value={detail.customer?.phone ?? '—'} />
            </div>
          </Card>

          {/* Shipping */}
          <Card title="Shipping Address" icon={MapPin}>
            <div className="text-sm text-gray-300 space-y-1">
              <p className="font-medium text-white">
                {String(detail.order.address.full_name ?? '')}
              </p>
              <p>{String(detail.order.address.phone ?? '')}</p>
              <p>{String(detail.order.address.line1 ?? '')}</p>
              {detail.order.address.line2 ? (
                <p>{String(detail.order.address.line2)}</p>
              ) : null}
              <p>
                {String(detail.order.address.city ?? '')},{' '}
                {String(detail.order.address.state ?? '')} —{' '}
                {String(detail.order.address.pincode ?? '')}
              </p>
            </div>
          </Card>

          {/* Webhook timeline */}
          {detail.payment && detail.payment.webhookEvents.length > 0 && (
            <Card title="Payment Timeline" icon={Bell}>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {detail.payment.webhookEvents.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-white/5"
                  >
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-mono break-all">
                        {e.event}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {new Date(e.at).toLocaleString('en-GB')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: actions */}
        <div className="space-y-6">
          {/* Status changer */}
          <Card title="Status" icon={Package}>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 [&>option]:bg-[#1a1a1a]"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Customer is notified automatically on shipped / delivered /
              cancelled.
            </p>
          </Card>

          {/* Payment */}
          <Card title="Payment" icon={CreditCard}>
            <div className="space-y-2 text-sm">
              <Row
                label="Method"
                value={(detail.order.paymentProvider ?? detail.order.paymentMethod).toUpperCase()}
              />
              <Row
                label="Status"
                value={detail.order.paymentStatus}
                badge={
                  detail.order.paymentStatus === 'completed'
                    ? 'success'
                    : detail.order.paymentStatus === 'refunded'
                    ? 'neutral'
                    : 'warn'
                }
              />
              {detail.order.paymentIntentId && (
                <Row
                  label="Intent"
                  value={detail.order.paymentIntentId.slice(0, 20) + '…'}
                  mono
                />
              )}
            </div>

            {detail.order.paymentStatus === 'completed' && (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="mt-4 w-full py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {refunding ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw size={14} />
                )}
                {refunding ? 'Processing...' : 'Refund Payment'}
              </button>
            )}
          </Card>

          {/* Resend email */}
          <Card title="Resend Email" icon={Mail}>
            <div className="space-y-2">
              {(['order-placed', 'order-shipped', 'order-delivered'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleResend(t)}
                  disabled={resending}
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 disabled:opacity-50 transition text-left px-3"
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          {/* Audit */}
          {detail.auditLogs.length > 0 && (
            <Card title="Admin Actions" icon={ShieldCheck}>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {detail.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="text-xs p-2 bg-black/30 rounded border border-white/5"
                  >
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-gray-500 mt-0.5">
                      {log.actorEmail} ·{' '}
                      {new Date(log.timestamp).toLocaleString('en-GB')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5"
    >
      <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
        <Icon size={16} className="text-indigo-400" />
        {title}
      </h2>
      {children}
    </motion.div>
  )
}

function Row({
  label,
  value,
  bold,
  mono,
  badge,
}: {
  label: string
  value: string
  bold?: boolean
  mono?: boolean
  badge?: 'success' | 'warn' | 'neutral'
}) {
  const badgeClass =
    badge === 'success'
      ? 'bg-emerald-500/20 text-emerald-400'
      : badge === 'warn'
      ? 'bg-yellow-500/20 text-yellow-400'
      : badge === 'neutral'
      ? 'bg-purple-500/20 text-purple-400'
      : ''

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      {badge ? (
        <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass}`}>
          {value}
        </span>
      ) : (
        <span
          className={`${bold ? 'font-bold' : ''} ${
            mono ? 'font-mono text-xs' : ''
          } text-white`}
        >
          {value}
        </span>
      )}
    </div>
  )
}