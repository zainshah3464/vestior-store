'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
} from 'lucide-react'
import type { ReviewAdminStats as Stats } from '@/lib/reviews/queries'

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

export default function ReviewAdminStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Total',
      value: stats.total,
      sub: `${stats.averageRating.toFixed(1)} avg rating`,
      icon: MessageSquare,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
      // Show star accent when there's an average
      showStar: stats.total > 0,
    },
    {
      label: 'Pending',
      value: stats.pending,
      sub: stats.pending > 0 ? 'need moderation' : 'nothing pending',
      icon: Clock,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Approved',
      value: stats.approved,
      sub: 'published',
      icon: CheckCircle2,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      sub: 'hidden from storefront',
      icon: XCircle,
      accent: 'border-l-red-500',
      glow: 'bg-red-500/[0.06]',
      iconBg: 'bg-red-500/[0.1]',
      iconText: 'text-red-400',
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
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-xl ${c.iconBg} border border-white/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={14}
                    className={c.iconText}
                    aria-hidden="true"
                  />
                </div>

                {/* Star accent for average rating */}
                {c.showStar && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/[0.1] border border-amber-500/25">
                    <Star
                      size={9}
                      className="fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-bold text-amber-300 tabular-nums">
                      {stats.averageRating.toFixed(1)}
                    </span>
                  </span>
                )}
              </div>

              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                {c.label}
              </p>

              <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight">
                {c.value.toLocaleString()}
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