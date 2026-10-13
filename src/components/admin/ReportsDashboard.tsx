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
} from 'lucide-react'
import type {
  SalesReport,
  CategoryStat,
  DailySeriesPoint,
} from '@/lib/analytics/types'
import { computeTrends } from '@/lib/analytics/trends'

const RevenueChart = dynamic<{ data: DailySeriesPoint[] }>(
  () => import('./RevenueChart').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
    ),
  }
)

const CategoryChart = dynamic<{ data: CategoryStat[] }>(
  () => import('./CategoryChart').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
    ),
  }
)

interface Props {
  current: SalesReport
  previous: SalesReport
  preset: string
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ReportsDashboard({ current, previous, preset }: Props) {
  const trends = computeTrends(current, previous)

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${current.totals.total_revenue.toLocaleString()}`,
      sub: `${current.totals.total_orders} orders`,
      trend: trends.revenueChange,
      icon: DollarSign,
      color: 'border-l-emerald-500',
    },
    {
      label: 'Total Orders',
      value: current.totals.total_orders.toLocaleString(),
      sub: `${current.by_status.delivered ?? 0} delivered`,
      trend: trends.ordersChange,
      icon: ShoppingCart,
      color: 'border-l-indigo-500',
    },
    {
      label: 'Avg Order Value',
      value: `₹${Number(current.totals.avg_order_value).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
      sub: 'per order',
      trend: trends.aovChange,
      icon: BarChart3,
      color: 'border-l-amber-500',
    },
    {
      label: 'Pending Orders',
      value: (current.by_status.pending ?? 0).toString(),
      sub: 'awaiting action',
      trend: null,
      icon: Clock,
      color: 'border-l-rose-500',
    },
  ]

  const statusCounts = current.by_status

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stat cards with trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${stat.color}`}
            />
            <div className="relative z-10 pl-3">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-white/60" />
                {stat.trend !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      stat.trend > 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : stat.trend < 0
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {stat.trend > 0 ? (
                      <TrendingUp size={11} />
                    ) : stat.trend < 0 ? (
                      <TrendingDown size={11} />
                    ) : null}
                    {stat.trend > 0 ? '+' : ''}
                    {stat.trend.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue over time */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Revenue Over Time
        </h2>
        <RevenueChart data={current.daily_series} />
      </motion.div>

      {/* Category + Provider breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Revenue by Category
          </h2>
          <CategoryChart data={current.by_category} />
        </motion.div>

        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            Revenue by Payment Method
          </h2>

          {current.by_provider.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No paid orders in this range.</p>
          ) : (
            <div className="space-y-4">
              {current.by_provider.map((p) => {
                const totalRevenue = current.by_provider.reduce(
                  (s, x) => s + x.revenue,
                  0
                )
                const pct =
                  totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0
                const Icon = p.provider === 'stripe' ? CreditCard : Banknote
                const color =
                  p.provider === 'stripe'
                    ? 'from-indigo-500 to-violet-500'
                    : 'from-emerald-500 to-teal-500'

                return (
                  <div key={p.provider}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-gray-400" />
                        <span className="text-sm text-white font-medium capitalize">
                          {p.provider}
                        </span>
                        <span className="text-xs text-gray-500">
                          {p.order_count} order{p.order_count === 1 ? '' : 's'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        ₹{p.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-full bg-gradient-to-r ${color}`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {pct.toFixed(1)}% of revenue
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Order status distribution */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          Orders by Status
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(
            [
              'pending',
              'processing',
              'shipped',
              'delivered',
              'cancelled',
            ] as const
          ).map((status) => {
            const count = statusCounts[status] ?? 0
            const colors: Record<string, string> = {
              pending: 'text-yellow-400 bg-yellow-400/10',
              processing: 'text-blue-400 bg-blue-400/10',
              shipped: 'text-purple-400 bg-purple-400/10',
              delivered: 'text-emerald-400 bg-emerald-400/10',
              cancelled: 'text-red-400 bg-red-400/10',
            }
            return (
              <div
                key={status}
                className="bg-black/30 rounded-xl p-4 border border-white/5"
              >
                <p className="text-xs text-gray-400 capitalize">{status}</p>
                <p
                  className={`text-2xl font-bold mt-1 inline-block px-2 py-0.5 rounded ${
                    colors[status]
                  }`}
                >
                  {count}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Top selling products */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-400" />
            Top Selling Products
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Based on shipped + delivered orders in this range
          </p>
        </div>

        {current.top_products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No paid products in this range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">#</th>
                  <th className="p-4 text-left text-sm text-gray-400">Product</th>
                  <th className="p-4 text-right text-sm text-gray-400">
                    Units Sold
                  </th>
                  <th className="p-4 text-right text-sm text-gray-400">
                    Orders
                  </th>
                  <th className="p-4 text-right text-sm text-gray-400">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {current.top_products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.03 }}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500 font-mono">
                      {i + 1}
                    </td>
                    <td className="p-4 text-sm text-white font-medium">
                      {p.name}
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">
                      {p.units_sold}
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">
                      {p.order_count}
                    </td>
                    <td className="p-4 text-sm text-emerald-400 font-semibold text-right">
                      ₹{p.revenue.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}