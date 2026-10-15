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
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function VisitorsStats({
  overview,
}: {
  overview: VisitorOverview
}) {
  const cards = [
    {
      label: 'Live Now',
      value: overview.live,
      icon: Activity,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
      sub: 'active in last 5 min',
      showLiveDot: overview.live > 0,
    },
    {
      label: 'Guests Today',
      value: overview.todayGuests,
      icon: UserX,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
      sub: 'not logged in',
    },
    {
      label: 'Users Today',
      value: overview.todayUsers,
      icon: UserCheck,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
      sub: 'logged in',
    },
    {
      label: 'New Visitors',
      value: overview.todayNew,
      icon: Sparkles,
      accent: 'border-l-violet-500',
      glow: 'bg-violet-500/[0.06]',
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
      sub: 'first-time sessions',
    },
    {
      label: 'Returning',
      value: overview.todayReturning,
      icon: RotateCcw,
      accent: 'border-l-rose-500',
      glow: 'bg-rose-500/[0.06]',
      iconBg: 'bg-rose-500/[0.1]',
      iconText: 'text-rose-400',
      sub: 'seen before',
    },
    {
      label: 'Orders Today',
      value: overview.todayOrders,
      icon: ShoppingCart,
      accent: 'border-l-teal-500',
      glow: 'bg-teal-500/[0.06]',
      iconBg: 'bg-teal-500/[0.1]',
      iconText: 'text-teal-400',
      sub: 'placed in sessions',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4"
    >
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <motion.div
            key={c.label}
            variants={item}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 rounded-2xl transition-colors duration-300"
          >
            {/* Left accent bar */}
            <div
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${c.accent}`}
            />

            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -top-12 -right-12 w-[100px] h-[100px] ${c.glow} blur-[60px]`}
            />

            <div className="relative pl-2.5">
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${c.iconBg} border border-white/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={12} className={c.iconText} aria-hidden="true" />
                </div>

                {/* Live dot for "Live Now" card */}
                {c.showLiveDot && (
                  <span className="relative flex w-2 h-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </div>

              <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                {c.label}
              </p>

              <p className="text-lg sm:text-xl font-bold text-white mt-0.5 tabular-nums tracking-tight">
                {c.value.toLocaleString()}
              </p>

              <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                {c.sub}
              </p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}