'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Clock,
  Package,
  CreditCard,
  Banknote,
  Minus,
} from 'lucide-react'
import type {
  SalesReport,
  CategoryStat,
  DailySeriesPoint,
} from '@/lib/analytics/types'
import { computeTrends } from '@/lib/analytics/trends'

// ─────────────────────────────────────────────
// Dynamic chart imports — preserved
// ─────────────────────────────────────────────
const RevenueChart = dynamic<{ data: DailySeriesPoint[] }>(
  () => import('./RevenueChart').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
    ),
  }
)

const CategoryChart = dynamic<{ data: CategoryStat[] }>(
  () => import('./CategoryChart').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
    ),
  }
)

interface Props {
  current: SalesReport
  previous: SalesReport
  preset: string
}

// ─────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Order status styling
// ─────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    bg: 'bg-amber-500/[0.08]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  processing: {
    bg: 'bg-blue-500/[0.08]',
    text: 'text-blue-300',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  shipped: {
    bg: 'bg-violet-500/[0.08]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    dot: 'bg-violet-400',
  },
  delivered: {
    bg: 'bg-emerald-500/[0.08]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    bg: 'bg-red-500/[0.08]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
  },
}

const STATUS_LIST = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export default function ReportsDashboard({
  current,
  previous,
  preset,
}: Props) {
  const trends = computeTrends(current, previous)

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${current.totals.total_revenue.toLocaleString()}`,
      sub: `${current.totals.total_orders.toLocaleString()} orders`,
      trend: trends.revenueChange,
      icon: DollarSign,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Total Orders',
      value: current.totals.total_orders.toLocaleString(),
      sub: `${(current.by_status.delivered ?? 0).toLocaleString()} delivered`,
      trend: trends.ordersChange,
      icon: ShoppingCart,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Avg Order Value',
      value: `₹${Number(current.totals.avg_order_value).toLocaleString(
        undefined,
        { maximumFractionDigits: 0 }
      )}`,
      sub: 'per order',
      trend: trends.aovChange,
      icon: BarChart3,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Pending Orders',
      value: (current.by_status.pending ?? 0).toString(),
      sub: 'awaiting action',
      trend: null,
      icon: Clock,
      accent: 'border-l-rose-500',
      glow: 'bg-rose-500/[0.06]',
      iconBg: 'bg-rose-500/[0.1]',
      iconText: 'text-rose-400',
    },
  ]

  const statusCounts = current.by_status
  const totalProviderRevenue = current.by_provider.reduce(
    (s, x) => s + x.revenue,
    0
  )

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6"
    >
      {/* ═════════════════════════════════════════════
          Stat cards with trends
         ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const hasTrend = stat.trend !== null
          const isPositive = hasTrend && stat.trend! > 0
          const isNegative = hasTrend && stat.trend! < 0
          const isNeutral = hasTrend && stat.trend === 0

          return (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-colors duration-300"
            >
              {/* Left accent bar */}
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${stat.accent}`}
              />

              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${stat.glow} blur-[70px]`}
              />

              <div className="relative pl-3">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-8 h-8 rounded-xl ${stat.iconBg} border border-white/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon
                      size={14}
                      className={stat.iconText}
                      aria-hidden="true"
                    />
                  </div>

                  {hasTrend && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums border ${
                        isPositive
                          ? 'bg-emerald-500/[0.1] text-emerald-300 border-emerald-500/25'
                          : isNegative
                          ? 'bg-red-500/[0.1] text-red-300 border-red-500/25'
                          : 'bg-gray-500/[0.08] text-gray-400 border-gray-500/20'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp size={9} aria-hidden="true" />
                      ) : isNegative ? (
                        <TrendingDown size={9} aria-hidden="true" />
                      ) : (
                        <Minus size={9} aria-hidden="true" />
                      )}
                      {isPositive ? '+' : ''}
                      {stat.trend!.toFixed(1)}%
                    </span>
                  )}
                </div>

                <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight truncate">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 truncate">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════
          Revenue Over Time
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="Revenue over time"
        className="space-y-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center">
            <TrendingUp
              size={14}
              className="text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white leading-tight">
              Revenue Over Time
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Daily breakdown for the selected range
            </p>
          </div>
        </div>
        <RevenueChart data={current.daily_series} />
      </motion.section>

      {/* ═════════════════════════════════════════════
          Category + Provider breakdown
         ═════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category chart */}
        <motion.section
          variants={item}
          aria-label="Revenue by category"
          className="space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
              <Package
                size={14}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Revenue by Category
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Top performing categories
              </p>
            </div>
          </div>
          <CategoryChart data={current.by_category} />
        </motion.section>

        {/* Provider breakdown */}
        <motion.section
          variants={item}
          aria-label="Revenue by payment method"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-violet-500/[0.05] blur-[100px]"
          />

          <div className="relative flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
              <CreditCard
                size={14}
                className="text-violet-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Revenue by Payment Method
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                COD vs Card breakdown
              </p>
            </div>
          </div>

          {current.by_provider.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <CreditCard
                  size={18}
                  className="text-gray-600"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[12px] text-gray-500">
                No paid orders in this range.
              </p>
            </div>
          ) : (
            <div className="relative space-y-5">
              {current.by_provider.map((p, idx) => {
                const pct =
                  totalProviderRevenue > 0
                    ? (p.revenue / totalProviderRevenue) * 100
                    : 0
                const Icon =
                  p.provider === 'stripe' ? CreditCard : Banknote
                const barColor =
                  p.provider === 'stripe'
                    ? 'from-indigo-500 to-violet-500'
                    : 'from-emerald-500 to-teal-500'
                const iconColor =
                  p.provider === 'stripe'
                    ? 'text-indigo-400'
                    : 'text-emerald-400'

                return (
                  <motion.div
                    key={p.provider}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + idx * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          size={14}
                          className={`${iconColor} flex-shrink-0`}
                          aria-hidden="true"
                        />
                        <span className="text-[12px] text-white font-semibold capitalize truncate">
                          {p.provider}
                        </span>
                        <span className="text-[10px] text-gray-500 tabular-nums flex-shrink-0">
                          {p.order_count} order
                          {p.order_count === 1 ? '' : 's'}
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-white tabular-nums flex-shrink-0">
                        ₹{p.revenue.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2 + idx * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                      />
                    </div>

                    <p className="text-[10px] text-gray-500 mt-1 tabular-nums">
                      {pct.toFixed(1)}% of revenue
                    </p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>
      </div>

      {/* ═════════════════════════════════════════════
          Orders by Status
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="Orders by status"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-amber-500/[0.05] blur-[100px]"
        />

        <div className="relative flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center">
            <BarChart3
              size={14}
              className="text-amber-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white leading-tight">
              Orders by Status
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Distribution across statuses
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-5 gap-3">
          {STATUS_LIST.map((status, idx) => {
            const count = statusCounts[status] ?? 0
            const style = STATUS_STYLES[status]

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + idx * 0.04,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative overflow-hidden rounded-xl ${style.bg} border ${style.border} p-4`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    {status}
                  </p>
                </div>
                <p
                  className={`text-2xl font-bold tabular-nums tracking-tight ${style.text}`}
                >
                  {count.toLocaleString()}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ═════════════════════════════════════════════
          Top Selling Products
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="Top selling products"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-rose-500/[0.05] blur-[100px]"
        />

        <div className="relative flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-rose-500/[0.1] border border-rose-500/25 flex items-center justify-center">
            <Package
              size={14}
              className="text-rose-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white leading-tight">
              Top Selling Products
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Based on shipped + delivered orders in this range
            </p>
          </div>
        </div>

        {current.top_products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <TrendingUp
                size={18}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12px] text-gray-500">
              No paid products in this range.
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
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden sm:table-cell">
                    Orders
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {current.top_products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(0.1 + i * 0.03, 0.4),
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
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
                    <td className="px-4 sm:px-5 py-3">
                      <span className="text-[12px] text-white font-medium truncate block max-w-[220px] sm:max-w-[320px]">
                        {p.name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span className="text-[12px] text-gray-300 tabular-nums">
                        {p.units_sold}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right hidden sm:table-cell">
                      <span className="text-[12px] text-gray-300 tabular-nums">
                        {p.order_count}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span className="text-[12px] text-emerald-400 font-semibold tabular-nums">
                        ₹{p.revenue.toLocaleString()}
                      </span>
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