'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '@/actions/updateOrderStatus'
import { motion } from 'framer-motion'
import { Loader2, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value
    setLoading(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      setStatus(newStatus)
      toast.success(`Status updated to ${newStatus}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error('Update failed: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <motion.select
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        aria-label="Update order status"
        className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg pl-3 pr-8 py-1.5 text-[11px] font-medium text-white hover:bg-white/[0.06] hover:border-white/15 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 [&>option]:bg-[#1a1a1a] [&>option]:text-white cursor-pointer"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </motion.select>

      {/* Custom chevron / loading indicator */}
      <div
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center"
        aria-hidden="true"
      >
        {loading ? (
          <Loader2
            size={11}
            className="animate-spin text-indigo-400"
          />
        ) : (
          <ChevronDown size={11} className="text-gray-400" />
        )}
      </div>
    </div>
  )
}