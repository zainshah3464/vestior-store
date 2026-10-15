'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Mail,
  ShieldCheck,
  Bell,
  Download,
  Hash,
  Phone,
  ExternalLink,
  Loader2,
  Send,
  Receipt,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '@/actions/updateOrderStatus'
import { refundPayment } from '@/actions/refundPayment'
import { resendOrderEmail } from '@/actions/resendOrderEmail'
import type { OrderDetail } from '@/lib/orders/queries'

// ─────────────────────────────────────────────
// Status styles — extended with dot + border
// ─────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  {
    bg: string
    text: string
    border: string
    dot: string
  }
> = {
  pending: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  processing: {
    bg: 'bg-blue-500/[0.1]',
    text: 'text-blue-300',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  shipped: {
    bg: 'bg-violet-500/[0.1]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    dot: 'bg-violet-400',
  },
  delivered: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    bg: 'bg-red-500/[0.1]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
  },
}

const DEFAULT_STATUS = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
}

// Payment status badge styling
const PAYMENT_BADGE: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  completed: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
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

const DEFAULT_PAYMENT_BADGE = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

const RESEND_TEMPLATES = [
  'order-placed',
  'order-shipped',
  'order-delivered',
] as const

type ResendTemplate = (typeof RESEND_TEMPLATES)[number]

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

  const handleResend = async (template: ResendTemplate) => {
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

  const currentStatusStyle = STATUS_STYLES[status] ?? DEFAULT_STATUS
  const paymentBadge =
    PAYMENT_BADGE[detail.order.paymentStatus] ?? DEFAULT_PAYMENT_BADGE
  const paymentMethodLabel = (
    detail.order.paymentProvider ?? detail.order.paymentMethod
  ).toUpperCase()
  const orderDate = new Date(detail.order.createdAt)

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ═════════════════════════════════════════════
          Header — Editorial
         ═════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="min-w-0">
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Orders
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2 backdrop-blur-sm">
            <Hash size={10} className="text-indigo-400" aria-hidden="true" />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Order
            </span>
            <span className="font-mono text-[11px] font-semibold text-white tracking-wider">
              {detail.order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
            Order Details
          </h1>
          <p className="text-[11px] sm:text-[12px] text-gray-500 mt-1.5 flex items-center gap-1.5">
            <Clock size={11} aria-hidden="true" />
            {orderDate.toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
          {/* Status badge */}
          <motion.span
            key={status}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-[12px] font-semibold capitalize ${currentStatusStyle.bg} ${currentStatusStyle.border} ${currentStatusStyle.text}`}
          >
            <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
              {status !== 'delivered' && status !== 'cancelled' && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatusStyle.dot} opacity-60`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentStatusStyle.dot}`}
              />
            </span>
            {status}
          </motion.span>

          {/* Invoice link */}
          <Link
            href={`/admin/orders/${detail.order.id}/invoice`}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
          >
            <Download
              size={13}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
            Invoice
          </Link>
        </div>
      </motion.header>

      {/* ═════════════════════════════════════════════
          Content grid
         ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ═════════════════════════════════════════════
            LEFT — order info
           ═════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Items card */}
          <Card title="Items" icon={Package} accent="indigo">
            <ul className="divide-y divide-white/[0.04] -mx-1">
              {detail.items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.03, 0.2),
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="py-3.5 px-1 flex items-center gap-3 sm:gap-4"
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
                          size={16}
                          className="text-gray-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  {/* Name + qty */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 text-[13px] font-medium text-white hover:text-indigo-400 transition-colors truncate max-w-full"
                    >
                      <span className="truncate">{item.productName}</span>
                      <ExternalLink
                        size={10}
                        className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </Link>
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

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2 text-[12px]">
              <Row
                label="Subtotal"
                value={`₹${detail.order.subtotal.toLocaleString()}`}
              />
              <Row
                label="Shipping"
                value={
                  detail.order.shipping === 0
                    ? 'Free'
                    : `₹${detail.order.shipping.toLocaleString()}`
                }
                valueColor={
                  detail.order.shipping === 0 ? 'emerald' : undefined
                }
              />
              <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                  ₹{detail.order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Customer card */}
          <Card title="Customer" icon={User} accent="violet">
            <div className="space-y-3 text-[12px]">
              <InfoRow
                icon={User}
                label="Name"
                value={detail.customer?.fullName ?? '—'}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={detail.order.userEmail}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={detail.customer?.phone ?? '—'}
              />
            </div>
          </Card>

          {/* Shipping card */}
          <Card title="Shipping Address" icon={MapPin} accent="blue">
            <div className="text-[13px] text-gray-300 space-y-1.5">
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
              <div className="pt-2 pl-5 border-l-2 border-white/[0.06] space-y-0.5">
                <p>{String(detail.order.address.line1 ?? '')}</p>
                {detail.order.address.line2 ? (
                  <p>{String(detail.order.address.line2)}</p>
                ) : null}
                <p>
                  {String(detail.order.address.city ?? '')},{' '}
                  {String(detail.order.address.state ?? '')} —{' '}
                  <span className="tabular-nums">
                    {String(detail.order.address.pincode ?? '')}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Payment timeline */}
          {detail.payment && detail.payment.webhookEvents.length > 0 && (
            <Card title="Payment Timeline" icon={Bell} accent="violet">
              <div className="space-y-2 max-h-72 overflow-y-auto overscroll-contain -mr-1 pr-1">
                {detail.payment.webhookEvents.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(i * 0.04, 0.2),
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Dot + line */}
                    <div className="relative flex-shrink-0 pt-0.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle
                          size={10}
                          className="text-emerald-400"
                          aria-hidden="true"
                        />
                      </div>
                      {i < detail.payment!.webhookEvents.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="absolute left-1/2 top-5 -translate-x-1/2 w-px h-[calc(100%+8px)] bg-white/[0.04]"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white font-mono break-all leading-snug">
                        {e.event}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 tabular-nums">
                        {new Date(e.at).toLocaleString('en-GB', {
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
            </Card>
          )}
        </div>

        {/* ═════════════════════════════════════════════
            RIGHT — actions
           ═════════════════════════════════════════════ */}
        <div className="space-y-4 sm:space-y-5">
          {/* Status changer */}
          <Card title="Status" icon={Package} accent="amber">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                aria-label="Update order status"
                className="appearance-none w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2.5 pr-9 text-[13px] font-medium text-white hover:bg-black/70 hover:border-white/15 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 [&>option]:bg-[#1a1a1a] [&>option]:text-white cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Loading / chevron indicator */}
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
                aria-hidden="true"
              >
                {updating ? (
                  <Loader2
                    size={13}
                    className="animate-spin text-indigo-400"
                  />
                ) : (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </div>
            </div>

            <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
              Customer is notified automatically on shipped / delivered /
              cancelled.
            </p>
          </Card>

          {/* Payment card */}
          <Card title="Payment" icon={CreditCard} accent="emerald">
            <div className="space-y-3 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Method</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-white">
                  {paymentMethodLabel}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border capitalize ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${paymentBadge.dot}`}
                    aria-hidden="true"
                  />
                  {detail.order.paymentStatus}
                </span>
              </div>

              {detail.order.paymentIntentId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400">Intent</span>
                  <span className="text-[10px] text-gray-300 font-mono truncate max-w-[140px]">
                    {detail.order.paymentIntentId.slice(0, 20)}…
                  </span>
                </div>
              )}
            </div>

            {detail.order.paymentStatus === 'completed' && (
              <motion.button
                type="button"
                onClick={handleRefund}
                disabled={refunding}
                whileTap={refunding ? {} : { scale: 0.98 }}
                className="mt-4 w-full py-2.5 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 border bg-red-500/[0.08] border-red-500/25 text-red-300 hover:bg-red-500/[0.15] hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                {refunding ? 'Processing…' : 'Refund Payment'}
              </motion.button>
            )}
          </Card>

          {/* Resend email */}
          <Card title="Resend Email" icon={Send} accent="violet">
            <div className="space-y-1.5">
              {RESEND_TEMPLATES.map((t, idx) => (
                <motion.button
                  key={t}
                  type="button"
                  onClick={() => handleResend(t)}
                  disabled={resending}
                  whileTap={resending ? {} : { scale: 0.98 }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.04,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[11px] font-mono text-gray-400 hover:text-white bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-left"
                  aria-label={`Resend ${t} email`}
                >
                  <span className="truncate">{t}</span>
                  <Send
                    size={10}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity"
                    aria-hidden="true"
                  />
                </motion.button>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
              Sends a fresh copy of the transactional email to the customer.
            </p>
          </Card>

          {/* Audit log */}
          {detail.auditLogs.length > 0 && (
            <Card title="Admin Actions" icon={ShieldCheck} accent="rose">
              <div className="space-y-1.5 max-h-72 overflow-y-auto overscroll-contain -mr-1 pr-1">
                {detail.auditLogs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(i * 0.04, 0.2),
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-1 rounded-full bg-indigo-400" aria-hidden="true" />
                      <p className="text-[11px] font-semibold text-white font-mono truncate">
                        {log.action}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">
                      {log.actorEmail}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5 tabular-nums">
                      {new Date(log.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Card wrapper — consistent with site-wide style
// ─────────────────────────────────────────────
type CardAccent = 'indigo' | 'violet' | 'blue' | 'amber' | 'emerald' | 'rose'

const CARD_ACCENTS: Record<
  CardAccent,
  { iconBg: string; iconText: string; glow: string }
> = {
  indigo: {
    iconBg: 'bg-indigo-500/[0.1]',
    iconText: 'text-indigo-400',
    glow: 'bg-indigo-500/[0.05]',
  },
  violet: {
    iconBg: 'bg-violet-500/[0.1]',
    iconText: 'text-violet-400',
    glow: 'bg-violet-500/[0.05]',
  },
  blue: {
    iconBg: 'bg-blue-500/[0.1]',
    iconText: 'text-blue-400',
    glow: 'bg-blue-500/[0.05]',
  },
  amber: {
    iconBg: 'bg-amber-500/[0.1]',
    iconText: 'text-amber-400',
    glow: 'bg-amber-500/[0.05]',
  },
  emerald: {
    iconBg: 'bg-emerald-500/[0.1]',
    iconText: 'text-emerald-400',
    glow: 'bg-emerald-500/[0.05]',
  },
  rose: {
    iconBg: 'bg-rose-500/[0.1]',
    iconText: 'text-rose-400',
    glow: 'bg-rose-500/[0.05]',
  },
}

function Card({
  title,
  icon: Icon,
  accent = 'indigo',
  children,
}: {
  title: string
  icon: React.ElementType
  accent?: CardAccent
  children: React.ReactNode
}) {
  const tokens = CARD_ACCENTS[accent]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-20 -right-20 w-[200px] h-[200px] ${tokens.glow} blur-[90px]`}
      />

      <div className="relative flex items-center gap-2.5 mb-4">
        <div
          className={`w-8 h-8 rounded-xl ${tokens.iconBg} border border-white/[0.06] flex items-center justify-center flex-shrink-0`}
        >
          <Icon
            size={14}
            className={tokens.iconText}
            aria-hidden="true"
          />
        </div>
        <h2 className="text-[13px] font-semibold text-white leading-tight">
          {title}
        </h2>
      </div>

      <div className="relative">{children}</div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────
// Info row — with icon support
// ─────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        size={12}
        className="text-gray-600 mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
          {label}
        </p>
        <p className="text-[12px] text-white mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Row — label/value pair (used in totals)
// ─────────────────────────────────────────────
function Row({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: 'emerald'
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span
        className={`tabular-nums ${
          valueColor === 'emerald' ? 'text-emerald-400 font-medium' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  )
}