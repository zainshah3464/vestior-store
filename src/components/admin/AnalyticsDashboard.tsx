'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  Users,
  Eye,
  ShoppingCart,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  BarChart3,
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
    <div className="h-80 bg-white/[0.03] rounded-2xl animate-pulse" />
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

// Device icon mapping
function deviceIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('mobile')) return Smartphone
  if (t.includes('tablet')) return Tablet
  return Monitor
}

export default function AnalyticsDashboard({
  live,
  today,
  funnel,
  topProducts,
  devices,
  referrers,
}: Props) {
  const conversionRate7d = (() => {
    const visited = funnel[0]?.count ?? 0
    const ordered = funnel[4]?.count ?? 0
    return visited > 0 ? ((ordered / visited) * 100).toFixed(1) : '—'
  })()

  const cards = [
    {
      label: 'Live Users',
      sub: '5-minute window',
      value: live,
      icon: Users,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
      dot: true,
    },
    {
      label: 'Page Views Today',
      sub: `${today.uniqueSessions} unique sessions`,
      value: today.pageViews,
      icon: Eye,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Orders Today',
      sub:
        today.uniqueSessions > 0
          ? `${((today.ordersPlaced / today.uniqueSessions) * 100).toFixed(1)}% conversion`
          : '—',
      value: today.ordersPlaced,
      icon: ShoppingCart,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Conversion Rate',
      sub: 'visit → order · 7 days',
      value: conversionRate7d === '—' ? '—' : `${conversionRate7d}%`,
      icon: TrendingUp,
      accent: 'border-l-rose-500',
      glow: 'bg-rose-500/[0.06]',
      iconBg: 'bg-rose-500/[0.1]',
      iconText: 'text-rose-400',
    },
  ]

  const totalDevices = devices.reduce((s, d) => s + d.count, 0)
  const totalReferrers = referrers.reduce((s, r) => s + r.count, 0)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-6"
    >
      {/* ─────────────────────────────────────────────
          Top stat cards
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  {c.dot && (
                    <span className="relative flex w-2 h-2" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </div>

                <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                  {c.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight">
                  {c.value}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 truncate">
                  {c.sub}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────
          Conversion Funnel
         ───────────────────────────────────────────── */}
      <motion.section
        variants={item}
        aria-label="Conversion funnel"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
        />

        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
              <BarChart3
                size={14}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Conversion Funnel
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Last 7 days
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-4 sm:p-5">
          <FunnelChart funnel={funnel} />
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────
          Top Products + Devices/Sources
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Products */}
        <motion.section
          variants={item}
          aria-label="Top products"
          className="relative min-w-0 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-xl bg-rose-500/[0.1] border border-rose-500/25 flex items-center justify-center">
              <TrendingUp
                size={14}
                className="text-rose-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Top Products
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Last 7 days
              </p>
            </div>
          </div>

          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <TrendingUp
                  size={18}
                  className="text-gray-600"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[12px] text-gray-500">
                No data yet — start browsing to generate events.
              </p>
            </div>
          ) : (
            <div className="p-3 max-h-[400px] overflow-y-auto overflow-x-hidden overscroll-contain space-y-1">
              {topProducts.map((p, i) => (
                <motion.div
                  key={p.productId || i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: Math.min(i * 0.03, 0.2),
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  {/* Rank badge */}
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold tabular-nums ${
                      i === 0
                        ? 'bg-amber-500/[0.15] text-amber-300 border border-amber-500/30'
                        : i === 1
                        ? 'bg-gray-400/[0.1] text-gray-300 border border-gray-400/25'
                        : i === 2
                        ? 'bg-orange-500/[0.1] text-orange-400 border border-orange-500/25'
                        : 'bg-white/[0.03] text-gray-500 border border-white/[0.06]'
                    }`}
                  >
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white font-medium truncate leading-tight">
                      {p.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 flex-wrap">
                      <span className="tabular-nums whitespace-nowrap">
                        <span className="text-indigo-400 font-medium">
                          {p.views}
                        </span>{' '}
                        views
                      </span>
                      <span
                        className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="tabular-nums whitespace-nowrap">
                        <span className="text-blue-400 font-medium">
                          {p.adds}
                        </span>{' '}
                        adds
                      </span>
                      <span
                        className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="tabular-nums whitespace-nowrap">
                        <span className="text-emerald-400 font-medium">
                          {p.orders}
                        </span>{' '}
                        orders
                      </span>
                    </div>
                  </div>

                  {p.productId && (
                    <a
                      href={`/admin/products/${p.productId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label={`View ${p.productName}`}
                    >
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Devices + Sources stacked */}
        <div className="space-y-4 sm:space-y-6 min-w-0">
          {/* Devices */}
          <motion.section
            variants={item}
            aria-label="Devices breakdown"
            className="relative min-w-0 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
          >
            <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                <Monitor
                  size={14}
                  className="text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-white leading-tight">
                  Devices
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Last 7 days
                </p>
              </div>
            </div>

            {devices.length === 0 ? (
              <p className="text-[12px] text-gray-500 text-center py-8 px-4">
                No data
              </p>
            ) : (
              <div className="p-4 sm:p-5 space-y-4">
                {devices.map((d) => {
                  const pct =
                    totalDevices > 0 ? (d.count / totalDevices) * 100 : 0
                  const DeviceIcon = deviceIcon(d.type)
                  return (
                    <div key={d.type} className="min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <DeviceIcon
                            size={12}
                            className="text-gray-500 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-[12px] text-gray-300 capitalize truncate font-medium">
                            {d.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-gray-500 tabular-nums">
                            {d.count}
                          </span>
                          <span className="text-[11px] text-white font-semibold tabular-nums">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.section>

          {/* Traffic Sources */}
          <motion.section
            variants={item}
            aria-label="Traffic sources"
            className="relative min-w-0 overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
          >
            <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
                <Eye
                  size={14}
                  className="text-violet-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-white leading-tight">
                  Traffic Sources
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Last 7 days
                </p>
              </div>
            </div>

            {referrers.length === 0 ? (
              <p className="text-[12px] text-gray-500 text-center py-8 px-4">
                No data
              </p>
            ) : (
              <div className="p-3 max-h-[280px] overflow-y-auto overflow-x-hidden overscroll-contain space-y-0.5">
                {referrers.map((r, i) => {
                  const pct =
                    totalReferrers > 0 ? (r.count / totalReferrers) * 100 : 0
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.03, 0.2),
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors min-w-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[12px] text-gray-300 truncate min-w-0">
                            {r.referrer}
                          </span>
                          <span className="text-[11px] text-gray-500 tabular-nums flex-shrink-0">
                            {r.count}
                          </span>
                        </div>
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.5,
                              delay: Math.min(i * 0.03, 0.15),
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}