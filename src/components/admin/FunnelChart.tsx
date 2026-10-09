'use client'

import { motion } from 'framer-motion'
import type { FunnelStep } from '@/lib/tracking/queries'

export default function FunnelChart({ funnel }: { funnel: FunnelStep[] }) {
  if (funnel.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No funnel data yet.
      </p>
    )
  }

  const max = funnel[0]?.count || 1

  return (
    <div className="space-y-3">
      {funnel.map((step, i) => (
        <motion.div
          key={step.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-300 font-medium">{step.name}</span>
            <span className="text-gray-500">
              {step.count.toLocaleString()} ·{' '}
              <span className="text-indigo-400">{step.pct.toFixed(1)}%</span>
            </span>
          </div>
          <div className="h-8 bg-black/30 rounded-lg overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step.count / max) * 100}%` }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 flex items-center justify-end pr-3"
            >
              <span className="text-xs text-white font-medium">
                {step.count}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}