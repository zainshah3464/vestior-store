'use client'

import { motion } from 'framer-motion'
import { Ticket, CheckCircle2, Clock, TrendingDown } from 'lucide-react'
import type { CouponStats as Stats } from '@/lib/coupons/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function CouponStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Total Coupons',
      value: stats.total,
      icon: Ticket,
      color: 'border-l-indigo-500',
      sub: `${stats.active} active`,
    },
    {
      label: 'Active',
      value: stats.active,
      icon: CheckCircle2,
      color: 'border-l-emerald-500',
      sub: 'usable now',
    },
    {
      label: 'Expired',
      value: stats.expired,
      icon: Clock,
      color: 'border-l-amber-500',
      sub: 'past validity',
    },
    {
      label: 'Discount Given',
      value: `₹${stats.totalDiscountGiven.toLocaleString()}`,
      icon: TrendingDown,
      color: 'border-l-rose-500',
      sub: `${stats.totalRedemptions} redemptions`,
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