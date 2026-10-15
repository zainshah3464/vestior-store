'use client'

import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'
import type { PaymentStats } from '@/lib/payments/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function PaymentsStats({ stats }: { stats: PaymentStats }) {
  const cards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      sub: `${stats.totalTransactions.toLocaleString()} transaction${
        stats.totalTransactions === 1 ? '' : 's'
      }`,
      icon: DollarSign,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Today Revenue',
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      sub: `${stats.todayTransactions.toLocaleString()} today`,
      icon: TrendingUp,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate.toFixed(1)}%`,
      sub: `${(stats.byStatus.completed ?? 0).toLocaleString()} completed`,
      icon: CheckCircle2,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Stripe Revenue',
      value: `₹${stats.byProvider.stripe.revenue.toLocaleString()}`,
      sub: `${stats.byProvider.stripe.count} order${
        stats.byProvider.stripe.count === 1 ? '' : 's'
      }`,
      icon: CreditCard,
      accent: 'border-l-rose-500',
      glow: 'bg-rose-500/[0.06]',
      iconBg: 'bg-rose-500/[0.1]',
      iconText: 'text-rose-400',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <motion.div
            key={c.label}
            variants={item}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-colors duration-300"
          >
            {/* Left accent bar */}
            <div
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${c.accent}`}
            />

            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${c.glow} blur-[70px]`}
            />

            <div className="relative pl-3">
              <div
                className={`w-8 h-8 rounded-xl ${c.iconBg} border border-white/[0.06] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={14} className={c.iconText} aria-hidden="true" />
              </div>

              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                {c.label}
              </p>

              <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight truncate">
                {c.value}
              </p>

              <p className="text-[10px] text-gray-500 mt-1 truncate">
                {c.sub}
              </p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}