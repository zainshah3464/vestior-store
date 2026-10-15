'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Power,
  Loader2,
  Ticket,
  X,
  Check,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Percent,
  IndianRupee,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  type CreateCouponInput,
} from '@/actions/coupons'
import type { Coupon, DiscountType } from '@/lib/coupons/types'

export default function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const openNew = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (c: Coupon) => {
    setEditing(c)
    setShowForm(true)
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}" permanently?`)) return
    setBusy(id)
    try {
      await deleteCoupon(id)
      toast.success('Coupon deleted')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleToggle = async (c: Coupon) => {
    setBusy(c.id)
    try {
      await toggleCouponActive(c.id, !c.isActive)
      toast.success(c.isActive ? 'Coupon disabled' : 'Coupon enabled')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Copied: ${code}`)
  }

  // Status resolver — same logic as before, just returns style tokens
  const getStatus = (c: Coupon) => {
    const expired = c.validUntil && new Date(c.validUntil) < new Date()
    const usageLimited = c.usageLimit !== null && c.timesUsed >= c.usageLimit

    if (!c.isActive) {
      return {
        label: 'Disabled',
        bg: 'bg-gray-500/[0.1]',
        text: 'text-gray-300',
        border: 'border-gray-500/25',
        dot: 'bg-gray-400',
      }
    }
    if (expired) {
      return {
        label: 'Expired',
        bg: 'bg-amber-500/[0.1]',
        text: 'text-amber-300',
        border: 'border-amber-500/25',
        dot: 'bg-amber-400',
      }
    }
    if (usageLimited) {
      return {
        label: 'Limit Reached',
        bg: 'bg-red-500/[0.1]',
        text: 'text-red-300',
        border: 'border-red-500/25',
        dot: 'bg-red-400',
      }
    }
    return {
      label: 'Active',
      bg: 'bg-emerald-500/[0.1]',
      text: 'text-emerald-300',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-400',
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* ─────────────────────────────────────────────
          Header — Section title + New button
         ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
            <Ticket
              size={14}
              className="text-violet-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white leading-tight">
              All Coupons
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
              {coupons.length} coupon{coupons.length === 1 ? '' : 's'}{' '}
              configured
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={openNew}
          whileTap={{ scale: 0.98 }}
          className="group/btn relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
          />
          <Plus size={14} className="relative z-10" aria-hidden="true" />
          <span className="relative z-10">New Coupon</span>
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────
          Form Modal
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <CouponFormModal
            editing={editing}
            onClose={() => {
              setShowForm(false)
              setEditing(null)
            }}
            onSuccess={() => {
              setShowForm(false)
              setEditing(null)
              router.refresh()
            }}
          />
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          Empty state / Table
         ───────────────────────────────────────────── */}
      {coupons.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-violet-500/[0.06] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Ticket
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No coupons yet
            </h3>
            <p className="text-[12px] text-gray-500 mb-5 max-w-xs">
              Create your first coupon to start offering discounts to your
              customers.
            </p>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
            >
              <Plus size={12} aria-hidden="true" />
              Create First Coupon
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Code
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Discount
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden md:table-cell">
                    Min Order
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Usage
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Expiry
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const status = getStatus(c)
                  const isPercent = c.discountType === 'percent'
                  const DiscountIcon = isPercent ? Percent : IndianRupee

                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Code */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[12px] font-semibold text-white tracking-wide truncate">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(c.code)}
                            className="flex-shrink-0 p-1 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/[0.08] transition-all duration-200"
                            aria-label={`Copy coupon code ${c.code}`}
                          >
                            <Copy size={11} aria-hidden="true" />
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-[10px] text-gray-500 mt-0.5 max-w-[200px] truncate">
                            {c.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/[0.08] border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <DiscountIcon
                              size={11}
                              className="text-indigo-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] text-white font-semibold tabular-nums leading-tight">
                              {isPercent
                                ? `${c.discountValue}%`
                                : `₹${c.discountValue.toLocaleString()}`}
                            </p>
                            {c.maxDiscountAmount && (
                              <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                                max ₹{c.maxDiscountAmount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Min Order */}
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <span className="text-[12px] text-gray-300 tabular-nums">
                          {c.minOrderAmount > 0
                            ? `₹${c.minOrderAmount.toLocaleString()}`
                            : '—'}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        <div className="space-y-0.5">
                          <p
                            className={`text-[12px] tabular-nums ${
                              c.usageLimit !== null &&
                              c.timesUsed >= c.usageLimit
                                ? 'text-red-300 font-semibold'
                                : 'text-gray-200'
                            }`}
                          >
                            {c.timesUsed}
                            <span className="text-gray-600">
                              {c.usageLimit !== null
                                ? ` / ${c.usageLimit}`
                                : ' / ∞'}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-500 tabular-nums">
                            {c.perUserLimit}/user
                          </p>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        {c.validUntil ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 tabular-nums">
                            <Calendar
                              size={10}
                              className="text-gray-600 flex-shrink-0"
                              aria-hidden="true"
                            />
                            {new Date(c.validUntil).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">
                            No expiry
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${status.dot}`}
                            aria-hidden="true"
                          />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggle(c)}
                            disabled={busy === c.id}
                            className={`p-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                              c.isActive
                                ? 'text-emerald-400 hover:bg-emerald-500/[0.08]'
                                : 'text-gray-500 hover:bg-white/[0.06] hover:text-gray-300'
                            }`}
                            aria-label={c.isActive ? 'Disable' : 'Enable'}
                          >
                            <Power size={13} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/[0.08] transition-all duration-200"
                            aria-label={`Edit coupon ${c.code}`}
                          >
                            <Edit2 size={13} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.code)}
                            disabled={busy === c.id}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 disabled:opacity-50"
                            aria-label={`Delete coupon ${c.code}`}
                          >
                            {busy === c.id ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2 size={13} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ═════════════════════════════════════════════
// Form Modal — completely redesigned
// ═════════════════════════════════════════════
function CouponFormModal({
  editing,
  onClose,
  onSuccess,
}: {
  editing: Coupon | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: editing?.code ?? '',
    description: editing?.description ?? '',
    discount_type: (editing?.discountType ?? 'percent') as DiscountType,
    discount_value: editing?.discountValue ?? 10,
    min_order_amount: editing?.minOrderAmount ?? 0,
    max_discount_amount: editing?.maxDiscountAmount ?? ('' as number | ''),
    usage_limit: editing?.usageLimit ?? ('' as number | ''),
    per_user_limit: editing?.perUserLimit ?? 1,
    valid_until: editing?.validUntil
      ? new Date(editing.validUntil).toISOString().slice(0, 16)
      : '',
    is_active: editing?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: CreateCouponInput = {
        code: form.code.trim(),
        description: form.description.trim() || undefined,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_amount: Number(form.min_order_amount),
        max_discount_amount:
          form.max_discount_amount === ''
            ? null
            : Number(form.max_discount_amount),
        usage_limit: form.usage_limit === '' ? null : Number(form.usage_limit),
        per_user_limit: Number(form.per_user_limit),
        valid_until: form.valid_until
          ? new Date(form.valid_until).toISOString()
          : null,
        is_active: form.is_active,
      }

      if (editing) {
        await updateCoupon(editing.id, payload)
        toast.success('Coupon updated')
      } else {
        await createCoupon(payload)
        toast.success('Coupon created')
      }
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit coupon' : 'New coupon'}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg bg-[#0f0f0f] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col"
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.08] blur-[100px]"
        />

        {/* ─────────────────────────────────────────────
            Header
           ───────────────────────────────────────────── */}
        <div className="relative flex-shrink-0 px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                <Ticket
                  size={15}
                  className="text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-white leading-tight">
                  {editing ? 'Edit Coupon' : 'New Coupon'}
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                  {editing
                    ? `Update ${editing.code}`
                    : 'Create a new discount code'}
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

        {/* ─────────────────────────────────────────────
            Scrollable body
           ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <form id="coupon-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Code */}
            <Field
              label="Code"
              required
              hint="Letters, numbers, _ and - only"
            >
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="WELCOME10"
                required
                className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white font-mono tracking-wide placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
              />
            </Field>

            {/* Description */}
            <Field label="Description" hint="Optional">
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="10% off for new customers"
                className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
              />
            </Field>

            {/* Type + Value */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type" required>
                <select
                  value={form.discount_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discount_type: e.target.value as DiscountType,
                    })
                  }
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] cursor-pointer [&>option]:bg-[#1a1a1a] transition-all duration-200"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </Field>

              <Field label="Value" required>
                <input
                  type="number"
                  value={form.discount_value}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discount_value: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={1}
                  required
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                />
              </Field>
            </div>

            {/* Min Order + Max Discount */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min Order (₹)">
                <input
                  type="number"
                  value={form.min_order_amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      min_order_amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                />
              </Field>

              <Field label="Max Discount (₹)" hint="Optional cap">
                <input
                  type="number"
                  value={form.max_discount_amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      max_discount_amount:
                        e.target.value === ''
                          ? ''
                          : parseFloat(e.target.value),
                    })
                  }
                  placeholder="No cap"
                  min={0}
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                />
              </Field>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Limit" hint="Leave empty for unlimited">
                <input
                  type="number"
                  value={form.usage_limit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      usage_limit:
                        e.target.value === ''
                          ? ''
                          : parseInt(e.target.value),
                    })
                  }
                  placeholder="∞"
                  min={1}
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                />
              </Field>

              <Field label="Per User">
                <input
                  type="number"
                  value={form.per_user_limit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      per_user_limit: parseInt(e.target.value) || 1,
                    })
                  }
                  min={1}
                  className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                />
              </Field>
            </div>

            {/* Valid Until */}
            <Field label="Valid Until" hint="Leave empty for no expiry">
              <input
                type="datetime-local"
                value={form.valid_until}
                onChange={(e) =>
                  setForm({ ...form, valid_until: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [color-scheme:dark] transition-all duration-200"
              />
            </Field>

            {/* Active toggle */}
            <label className="group flex items-center justify-between gap-3 p-3.5 bg-black/30 border border-white/[0.08] rounded-xl cursor-pointer hover:bg-black/50 hover:border-white/[0.12] transition-colors duration-200">
              <div className="min-w-0">
                <p className="text-[13px] text-white font-medium leading-tight">
                  Active
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Coupon is usable immediately
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="relative w-10 h-6 bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors duration-200 flex-shrink-0">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform duration-200" />
              </div>
            </label>
          </form>
        </div>

        {/* ─────────────────────────────────────────────
            Footer actions
           ───────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex gap-2.5 p-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] text-gray-300 rounded-xl text-[13px] font-medium hover:bg-white/[0.06] hover:border-white/15 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="coupon-form"
            disabled={loading}
            className="group/btn relative flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {!loading && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {loading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Check size={14} aria-hidden="true" />
              )}
              {editing ? 'Update Coupon' : 'Create Coupon'}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Field helper
// ─────────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <label className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400">
          {label}
          {required && (
            <span className="text-red-400 ml-0.5">*</span>
          )}
        </label>
        {hint && (
          <span className="text-[10px] text-gray-600 truncate">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}