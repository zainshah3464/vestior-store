'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateOrderStatus } from '@/actions/updateOrderStatus'
import { motion } from 'framer-motion'

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setLoading(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      setStatus(newStatus)
      toast.success(`Status updated to ${newStatus}`)
    } catch (err: any) {
      toast.error('Update failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.select
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className="bg-[#1a1a1a] backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 [&>option]:bg-[#1a1a1a] [&>option]:text-white"
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </motion.select>
  )
}