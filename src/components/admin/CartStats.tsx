'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, TrendingUp, DollarSign, Mail } from 'lucide-react'
import type { CartStats as Stats } from '@/lib/carts/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function CartStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Abandoned',
      value: stats.totalAbandoned,
      icon: ShoppingCart,
      color: 'border-l-amber-500',
      sub: 'awaiting recovery',
    },
    {
      label: 'Recovered',
      value: stats.recovered,
      icon: TrendingUp,
      color: 'border-l-emerald-500',
      sub: `${stats.recoveryRate.toFixed(1)}% rate`,
    },
    {
      label: 'Lost Value',
      value: `₹${Math.round(stats.totalValue).toLocaleString()}`,
      icon: DollarSign,
      color: 'border-l-red-500',
      sub: 'total cart value',
    },
    {
      label: 'Emails Sent',
      value: stats.emailsSent,
      icon: Mail,
      color: 'border-l-indigo-500',
      sub: 'reminders delivered',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((c) => (
        <motion.div
          key={c.label}
          variants={item}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${c.color}`}
          />
          <div className="relative z-10 pl-3">
            <div className="flex items-center justify-between mb-2">
              <c.icon className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-sm text-gray-400">{c.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}