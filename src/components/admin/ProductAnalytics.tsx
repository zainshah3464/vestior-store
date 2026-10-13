'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Eye,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpDown,
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <Package size={18} className="text-rose-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Product Analytics</h2>
          <p className="text-xs text-gray-500">
            Last {days} days · views, cart adds, orders, conversion
          </p>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full border-l-emerald-500" />
          <div className="relative z-10 pl-3">
            <TrendingUp className="w-5 h-5 text-white/60 mb-2" />
            <p className="text-sm text-gray-400">Units Sold</p>
            <p className="text-2xl font-bold text-white mt-1">
              {g.total_units_sold.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              across {g.total_orders_with_items} orders
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full border-l-indigo-500" />
          <div className="relative z-10 pl-3">
            <ShoppingCart className="w-5 h-5 text-white/60 mb-2" />
            <p className="text-sm text-gray-400">Product Revenue</p>
            <p className="text-2xl font-bold text-white mt-1">
              ₹{g.total_revenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              from sold items only
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full border-l-amber-500" />
          <div className="relative z-10 pl-3">
            <Package className="w-5 h-5 text-white/60 mb-2" />
            <p className="text-sm text-gray-400">Avg Units / Order</p>
            <p className="text-2xl font-bold text-white mt-1">
              {Number(g.avg_units_per_order).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">basket size</p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full border-l-purple-500" />
          <div className="relative z-10 pl-3">
            <Eye className="w-5 h-5 text-white/60 mb-2" />
            <p className="text-sm text-gray-400">Products Tracked</p>
            <p className="text-2xl font-bold text-white mt-1">
              {performance.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {performance.filter((p) => p.abandoned).length} abandoned
            </p>
          </div>
        </motion.div>
      </div>

      {/* Product Performance Table */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-400" />
              Product Performance
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Views · Cart adds · Orders · Conversion rate
            </p>
          </div>
          <button
            onClick={() => setShowOnlyAbandoned((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
              showOnlyAbandoned
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <AlertCircle size={12} className="inline mr-1" />
            {showOnlyAbandoned ? 'Showing Abandoned' : 'Show Abandoned Only'}
          </button>
        </div>

        {sortedPerformance.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No product activity in this range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider">
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
                    transition={{ delay: i * 0.02 }}
                    className={`border-t border-white/5 hover:bg-white/5 transition-colors ${
                      p.abandoned ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="p-4 text-sm text-white font-medium">
                      <div className="flex items-center gap-2">
                        {p.abandoned && (
                          <AlertCircle
                            size={12}
                            className="text-amber-400 flex-shrink-0"
                          />
                        )}
                        <span className="truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">
                      {p.views}
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">
                      {p.cartAdds}
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">
                      {p.orders}
                    </td>
                    <td className="p-4 text-sm text-emerald-400 font-semibold text-right">
                      ₹{p.revenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          p.conversionRate > 5
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.conversionRate > 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {p.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Top Products by Revenue */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Products by Revenue
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Based on shipped + delivered orders
          </p>
        </div>

        {salesReport.top_products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No revenue-generating sales yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="p-4 text-right text-xs text-gray-400 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="p-4 text-right text-xs text-gray-400 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="p-4 text-right text-xs text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesReport.top_products.slice(0, 10).map((p, i) => (
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
    <th className="p-4 text-right">
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-xs uppercase tracking-wider transition ${
          active ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {Icon && <Icon size={12} />}
        {label}
        <ArrowUpDown
          size={10}
          className={
            active
              ? dir === 'desc'
                ? 'rotate-180 text-indigo-400'
                : 'text-indigo-400'
              : 'opacity-40'
          }
        />
      </button>
    </th>
  )
}