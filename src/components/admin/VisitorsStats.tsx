'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  UserCheck,
  UserX,
  Sparkles,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react'
import type { VisitorOverview } from '@/lib/tracking/session-queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function VisitorsStats({ overview }: { overview: VisitorOverview }) {
  const cards = [
    {
      label: 'Live Now',
      value: overview.live,
      icon: Activity,
      color: 'border-l-emerald-500',
      sub: 'active in last 5 min',
    },
    {
      label: 'Guests Today',
      value: overview.todayGuests,
      icon: UserX,
      color: 'border-l-amber-500',
      sub: 'not logged in',
    },
    {
      label: 'Users Today',
      value: overview.todayUsers,
      icon: UserCheck,
      color: 'border-l-indigo-500',
      sub: 'logged in',
    },
    {
      label: 'New Visitors',
      value: overview.todayNew,
      icon: Sparkles,
      color: 'border-l-purple-500',
      sub: 'first-time sessions',
    },
    {
      label: 'Returning',
      value: overview.todayReturning,
      icon: RotateCcw,
      color: 'border-l-rose-500',
      sub: 'seen before',
    },
    {
      label: 'Orders Today',
      value: overview.todayOrders,
      icon: ShoppingCart,
      color: 'border-l-teal-500',
      sub: 'placed in sessions',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
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