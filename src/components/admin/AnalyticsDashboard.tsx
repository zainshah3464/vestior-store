'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  Users,
  Eye,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import type {
  FunnelStep,
  TopProduct,
  DeviceBreakdownRow,
  ReferrerRow,
} from '@/lib/tracking/queries'

const FunnelChart = dynamic(() => import('./FunnelChart'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
  ),
})

interface Props {
  live: number
  today: { pageViews: number; uniqueSessions: number; ordersPlaced: number }
  funnel: FunnelStep[]
  topProducts: TopProduct[]
  devices: DeviceBreakdownRow[]
  referrers: ReferrerRow[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AnalyticsDashboard({
  live,
  today,
  funnel,
  topProducts,
  devices,
  referrers,
}: Props) {
  const cards = [
    {
      label: 'Live Users (5m)',
      value: live,
      icon: Users,
      color: 'border-l-emerald-500',
      sub: 'active sessions',
    },
    {
      label: 'Page Views Today',
      value: today.pageViews,
      icon: Eye,
      color: 'border-l-indigo-500',
      sub: `${today.uniqueSessions} unique sessions`,
    },
    {
      label: 'Orders Today',
      value: today.ordersPlaced,
      icon: ShoppingCart,
      color: 'border-l-amber-500',
      sub:
        today.uniqueSessions > 0
          ? `${((today.ordersPlaced / today.uniqueSessions) * 100).toFixed(1)}% conversion`
          : '—',
    },
    {
      label: 'Conversion Rate (7d)',
      value: (() => {
        const visited = funnel[0]?.count ?? 0
        const ordered = funnel[4]?.count ?? 0
        return visited > 0 ? `${((ordered / visited) * 100).toFixed(1)}%` : '—'
      })(),
      icon: TrendingUp,
      color: 'border-l-rose-500',
      sub: 'visit → order',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Funnel */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Conversion Funnel (7 days)
        </h2>
        <FunnelChart funnel={funnel} />
      </motion.div>

      {/* Top products + Devices */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Top Products (7 days)
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No data yet — start browsing to generate events.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {topProducts.map((p, i) => (
                <div
                  key={p.productId || i}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">
                      {p.productName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.views} views · {p.adds} adds · {p.orders} orders
                    </p>
                  </div>
                  <span className="text-xs text-indigo-400 font-mono ml-3">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="space-y-6">
          <motion.div
            variants={item}
            className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Devices (7 days)
            </h2>
            {devices.length === 0 ? (
              <p className="text-gray-400 text-sm">No data</p>
            ) : (
              <div className="space-y-3">
                {devices.map((d) => {
                  const total = devices.reduce((s, x) => s + x.count, 0)
                  const pct = total > 0 ? (d.count / total) * 100 : 0
                  return (
                    <div key={d.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300 capitalize">
                          {d.type}
                        </span>
                        <span className="text-gray-400">
                          {d.count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={item}
            className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Traffic Sources (7 days)
            </h2>
            {referrers.length === 0 ? (
              <p className="text-gray-400 text-sm">No data</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {referrers.map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm p-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-gray-300 truncate max-w-[200px]">
                      {r.referrer}
                    </span>
                    <span className="text-gray-400">{r.count}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}