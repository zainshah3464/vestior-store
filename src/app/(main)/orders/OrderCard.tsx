'use client'

import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  processing: 'text-blue-400',
  shipped: 'text-purple-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

const statusBg: Record<string, string> = {
  pending: 'bg-yellow-400/10',
  processing: 'bg-blue-400/10',
  shipped: 'bg-purple-400/10',
  delivered: 'bg-green-400/10',
  cancelled: 'bg-red-400/10',
}

export default function OrderCard({ order }: { order: any }) {
  const StatusIcon = statusIcons[order.status] || Package
  const color = statusColors[order.status] || 'text-gray-400'
  const bg = statusBg[order.status] || 'bg-gray-400/10'
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.2)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Subtle top gradient bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${bg}`} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <p className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className={`flex items-center gap-1.5 text-sm font-medium capitalize ${color} ${bg} px-3 py-1 rounded-full`}
          >
            <StatusIcon size={16} />
            {order.status}
          </motion.span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-gray-300 font-medium mb-2">Items</p>
        {Array.isArray(order.items) &&
          order.items.slice(0, expanded ? order.items.length : 2).map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm text-gray-400 py-1">
              <span>{item.product_name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        {Array.isArray(order.items) && order.items.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-indigo-400 mt-1 flex items-center gap-1 hover:underline"
          >
            {expanded ? 'Show less' : `+${order.items.length - 2} more`}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown size={14} /></motion.span>
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
        <span className="text-sm font-semibold text-white">Total</span>
        <span className="text-lg font-bold text-white">₹{order.total?.toLocaleString()}</span>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span className="capitalize">{order.payment_status}</span>
        <span className="w-1 h-1 rounded-full bg-gray-600" />
        <span>{order.payment_method || 'COD'}</span>
      </div>
    </motion.div>
  )
}