'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react'
import type { ReviewAdminStats as Stats } from '@/lib/reviews/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function ReviewAdminStats({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Total', value: stats.total, icon: MessageSquare, color: 'border-l-indigo-500', sub: `${stats.averageRating.toFixed(1)} avg rating` },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'border-l-amber-500', sub: 'need moderation' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'border-l-emerald-500', sub: 'published' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'border-l-red-500', sub: 'hidden' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <motion.div
          key={c.label}
          variants={item}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${c.color}`} />
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