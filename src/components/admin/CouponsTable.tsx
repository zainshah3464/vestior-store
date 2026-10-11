'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus, Trash2, Edit2, Copy, Power, Loader2, Ticket, X, Check,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          All Coupons ({coupons.length})
        </h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-500 hover:to-violet-500 transition text-sm font-medium shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16} />
          New Coupon
        </button>
      </div>

      {/* Form Modal */}
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

      {/* Table */}
      {coupons.length === 0 ? (
        <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-16 text-center">
          <Ticket className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No coupons yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">Code</th>
                  <th className="p-4 text-left text-sm text-gray-400">Discount</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">Min Order</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">Usage</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">Expiry</th>
                  <th className="p-4 text-left text-sm text-gray-400">Status</th>
                  <th className="p-4 text-right text-sm text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const expired =
                    c.validUntil && new Date(c.validUntil) < new Date()
                  const usageLimited =
                    c.usageLimit !== null && c.timesUsed >= c.usageLimit

                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-white">
                            {c.code}
                          </span>
                          <button
                            onClick={() => copyCode(c.code)}
                            className="text-gray-500 hover:text-indigo-400 transition"
                            aria-label="Copy code"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                            {c.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-sm text-white">
                        {c.discountType === 'percent'
                          ? `${c.discountValue}%`
                          : `₹${c.discountValue.toLocaleString()}`}
                        {c.maxDiscountAmount && (
                          <span className="text-xs text-gray-500 block">
                            max ₹{c.maxDiscountAmount.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden md:table-cell">
                        {c.minOrderAmount > 0
                          ? `₹${c.minOrderAmount.toLocaleString()}`
                          : '—'}
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden lg:table-cell">
                        <span className={usageLimited ? 'text-red-400' : ''}>
                          {c.timesUsed}
                          {c.usageLimit !== null ? ` / ${c.usageLimit}` : ' / ∞'}
                        </span>
                        <span className="text-xs text-gray-600 block">
                          {c.perUserLimit}/user
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden lg:table-cell">
                        {c.validUntil
                          ? new Date(c.validUntil).toLocaleDateString('en-GB')
                          : 'No expiry'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            !c.isActive || expired || usageLimited
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {!c.isActive
                            ? 'Disabled'
                            : expired
                            ? 'Expired'
                            : usageLimited
                            ? 'Limit Reached'
                            : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggle(c)}
                            disabled={busy === c.id}
                            className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                              c.isActive
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-gray-500 hover:bg-white/5'
                            }`}
                            aria-label={c.isActive ? 'Disable' : 'Enable'}
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                            aria-label="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            disabled={busy === c.id}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {busy === c.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
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

// ─────────────────────────────────────────────
// Form modal
// ─────────────────────────────────────────────
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f0f0f]/95 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {editing ? 'Edit Coupon' : 'New Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="WELCOME10"
              required
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="10% off for new customers"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Type *
              </label>
              <select
                value={form.discount_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount_type: e.target.value as DiscountType,
                  })
                }
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-[#1a1a1a]"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Value *
              </label>
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
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Min Order (₹)
              </label>
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
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Max Discount (₹)
              </label>
              <input
                type="number"
                value={form.max_discount_amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_discount_amount:
                      e.target.value === '' ? '' : parseFloat(e.target.value),
                  })
                }
                placeholder="Optional"
                min={0}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Total Limit
              </label>
              <input
                type="number"
                value={form.usage_limit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usage_limit:
                      e.target.value === '' ? '' : parseInt(e.target.value),
                  })
                }
                placeholder="∞"
                min={1}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Per User
              </label>
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
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Valid Until
            </label>
            <input
              type="datetime-local"
              value={form.valid_until}
              onChange={(e) =>
                setForm({ ...form, valid_until: e.target.value })
              }
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Leave empty for no expiry
            </p>
          </div>

          <label className="flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded-lg cursor-pointer">
            <div>
              <span className="text-sm text-white">Active</span>
              <p className="text-[10px] text-gray-500">
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
            <div className="w-10 h-6 bg-gray-600 rounded-full peer-checked:bg-indigo-600 relative transition-colors">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
            </div>
          </label>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}