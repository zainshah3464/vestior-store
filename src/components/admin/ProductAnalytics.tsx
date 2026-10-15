'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Eye,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
  PackageX,
} from 'lucide-react'
import type {
  ProductSalesReport,
  ProductPerformanceRow,
} from '@/lib/analytics/product-types'

interface Props {
  salesReport: ProductSalesReport
  performance: ProductPerformanceRow[]
  days: number
}

type SortKey =
  | 'views'
  | 'cartAdds'
  | 'orders'
  | 'revenue'
  | 'conversionRate'

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

export default function ProductAnalytics({
  salesReport,
  performance,
  days,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('views')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showOnlyAbandoned, setShowOnlyAbandoned] = useState(false)

  const sortedPerformance = useMemo(() => {
    const filtered = showOnlyAbandoned
      ? performance.filter((p) => p.abandoned)
      : performance

    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      return sortDir === 'desc' ? bv - av : av - bv
    })

    return sorted
  }, [performance, sortKey, sortDir, showOnlyAbandoned])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const g = salesReport.global
  const abandonedCount = performance.filter((p) => p.abandoned).length

  const globalStats = [
    {
      label: 'Units Sold',
      value: g.total_units_sold.toLocaleString(),
      sub: `across ${g.total_orders_with_items} orders`,
      icon: TrendingUp,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Product Revenue',
      value: `₹${g.total_revenue.toLocaleString()}`,
      sub: 'from sold items only',
      icon: ShoppingCart,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Avg Units / Order',
      value: Number(g.avg_units_per_order).toFixed(2),
      sub: 'basket size',
      icon: Package,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Products Tracked',
      value: performance.length,
      sub: `${abandonedCount} abandoned`,
      icon: Eye,
      accent: 'border-l-violet-500',
      glow: 'bg-violet-500/[0.06]',
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-6 mt-6 sm:mt-8"
    >
      {/* ─────────────────────────────────────────────
          Section Header — Editorial
         ───────────────────────────────────────────── */}
      <motion.div
        variants={item}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="w-10 h-10 rounded-2xl bg-rose-500/[0.1] border border-rose-500/25 flex items-center justify-center flex-shrink-0">
          <Package
            size={18}
            className="text-rose-400"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] leading-tight">
            Product Analytics
          </h2>
          <p className="text-[11px] sm:text-[12px] text-gray-500 mt-0.5">
            Last {days} days · views, cart adds, orders, conversion
          </p>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────
          Global Stats
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {globalStats.map((c) => {
          const Icon = c.icon
          return (
            <motion.div
              key={c.label}
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-colors duration-300"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${c.accent}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${c.glow} blur-[70px]`}
              />
              <div className="relative pl-3">
                <div
                  className={`w-8 h-8 rounded-xl ${c.iconBg} border border-white/[0.06] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={14}
                    className={c.iconText}
                    aria-hidden="true"
                  />
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
          Product Performance Table
         ───────────────────────────────────────────── */}
      <motion.section
        variants={item}
        aria-label="Product performance"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06] flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-500/[0.1] border border-rose-500/25 flex items-center justify-center flex-shrink-0">
              <Package
                size={14}
                className="text-rose-400"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-white leading-tight">
                Product Performance
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Views · Cart adds · Orders · Conversion rate
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnlyAbandoned((v) => !v)}
            aria-pressed={showOnlyAbandoned}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 flex-shrink-0 border ${
              showOnlyAbandoned
                ? 'bg-amber-500/[0.12] border-amber-500/30 text-amber-300'
                : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-white/15'
            }`}
          >
            <AlertCircle size={11} aria-hidden="true" />
            {showOnlyAbandoned ? 'Showing Abandoned' : 'Show Abandoned'}
            {abandonedCount > 0 && !showOnlyAbandoned && (
              <span className="ml-0.5 px-1.5 py-px rounded-full text-[9px] font-bold bg-amber-500/[0.2] text-amber-300 tabular-nums">
                {abandonedCount}
              </span>
            )}
          </button>
        </div>

        {/* Table */}
        {sortedPerformance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <PackageX
                size={18}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12px] text-gray-500">
              {showOnlyAbandoned
                ? 'No abandoned products in this range.'
                : 'No product activity in this range.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Product
                  </th>
                  <SortHeader
                    label="Views"
                    icon={Eye}
                    active={sortKey === 'views'}
                    dir={sortDir}
                    onClick={() => handleSort('views')}
                  />
                  <SortHeader
                    label="Cart Adds"
                    icon={ShoppingCart}
                    active={sortKey === 'cartAdds'}
                    dir={sortDir}
                    onClick={() => handleSort('cartAdds')}
                  />
                  <SortHeader
                    label="Orders"
                    icon={Package}
                    active={sortKey === 'orders'}
                    dir={sortDir}
                    onClick={() => handleSort('orders')}
                  />
                  <SortHeader
                    label="Revenue"
                    active={sortKey === 'revenue'}
                    dir={sortDir}
                    onClick={() => handleSort('revenue')}
                  />
                  <SortHeader
                    label="Conv. Rate"
                    active={sortKey === 'conversionRate'}
                    dir={sortDir}
                    onClick={() => handleSort('conversionRate')}
                  />
                </tr>
              </thead>
              <tbody>
                {sortedPerformance.slice(0, 25).map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: Math.min(i * 0.02, 0.25),
                      duration: 0.3,
                    }}
                    className={`group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors ${
                      p.abandoned ? 'bg-amber-500/[0.03]' : ''
                    }`}
                  >
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-white font-medium">
                      <div className="flex items-center gap-2 min-w-0">
                        {p.abandoned && (
                          <span
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"
                            aria-label="Abandoned product"
                          />
                        )}
                        <span className="truncate max-w-[200px] sm:max-w-[260px]">
                          {p.name}
                        </span>
                        {p.id && (
                          <a
                            href={`/admin/products/${p.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 -m-1 rounded text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                            aria-label={`View ${p.name}`}
                          >
                            <ExternalLink
                              size={11}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 text-right tabular-nums">
                      {p.views}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 text-right tabular-nums">
                      {p.cartAdds}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 text-right tabular-nums">
                      {p.orders}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-emerald-400 font-semibold text-right tabular-nums">
                      ₹{p.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums border ${
                          p.conversionRate > 5
                            ? 'bg-emerald-500/[0.1] text-emerald-300 border-emerald-500/25'
                            : p.conversionRate > 1
                            ? 'bg-amber-500/[0.1] text-amber-300 border-amber-500/25'
                            : 'bg-red-500/[0.1] text-red-300 border-red-500/25'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            p.conversionRate > 5
                              ? 'bg-emerald-400'
                              : p.conversionRate > 1
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                          aria-hidden="true"
                        />
                        {p.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {/* ─────────────────────────────────────────────
          Top Products by Revenue
         ───────────────────────────────────────────── */}
      <motion.section
        variants={item}
        aria-label="Top products by revenue"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-emerald-500/[0.05] blur-[100px]"
        />

        <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center">
            <TrendingUp
              size={14}
              className="text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white leading-tight">
              Top Products by Revenue
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Based on shipped + delivered orders
            </p>
          </div>
        </div>

        {salesReport.top_products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <TrendingUp
                size={18}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12px] text-gray-500">
              No revenue-generating sales yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    #
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Product
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Units
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Orders
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesReport.top_products.slice(0, 10).map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(0.1 + i * 0.03, 0.4),
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 sm:px-5 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold tabular-nums ${
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
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-white font-medium">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate max-w-[220px] sm:max-w-[280px]">
                          {p.name}
                        </span>
                        {p.id && (
                          <a
                            href={`/admin/products/${p.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 -m-1 rounded text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                            aria-label={`View ${p.name}`}
                          >
                            <ExternalLink
                              size={11}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 text-right tabular-nums">
                      {p.units_sold}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 text-right tabular-nums">
                      {p.order_count}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-emerald-400 font-semibold text-right tabular-nums">
                      ₹{p.revenue.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Sortable table header
// ─────────────────────────────────────────────
function SortHeader({
  label,
  icon: Icon,
  active,
  dir,
  onClick,
}: {
  label: string
  icon?: React.ElementType
  active: boolean
  dir: 'asc' | 'desc'
  onClick: () => void
}) {
  return (
    <th className="px-4 sm:px-5 py-3 text-right">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase font-semibold transition-colors ${
          active
            ? 'text-indigo-300'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        {Icon && (
          <Icon
            size={11}
            className="flex-shrink-0"
            aria-hidden="true"
          />
        )}
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{label.split(' ')[0]}</span>
        <motion.span
          animate={{
            rotate: active && dir === 'desc' ? 180 : 0,
            opacity: active ? 1 : 0.4,
          }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
          aria-hidden="true"
        >
          <ArrowUpDown size={9} />
        </motion.span>
      </button>
    </th>
  )
}