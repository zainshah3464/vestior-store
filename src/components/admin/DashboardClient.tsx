'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Ticket,
  ShoppingBag,
  Mail,
  AlertTriangle,
  Activity,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type {
  DashboardSummary,
  RecentActivityItem,
} from '@/lib/dashboard/queries'
import QuickActionsGrid from './QuickActionsGrid'

const AdminCharts = dynamic(() => import('./AdminCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-[360px] animate-pulse"
        />
      ))}
    </div>
  ),
})

interface Props {
  // Existing
  productCount: number
  orderCount: number
  userCount: number
  totalRevenue: number
  avgOrderValue: number
  chartData: { date: string; total: number }[]
  statusChartData: { name: string; value: number }[]
  recentOrders: {
    id: string
    user_email: string
    total: number
    status: string
    created_at: string
  }[]
  revenueTrend: number
  orderTrend: number
  // New
  summary: DashboardSummary
  recentActivity: RecentActivityItem[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const STATUS_COLORS: Record<string, string> = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#a855f7',
  delivered: '#22c55e',
  cancelled: '#ef4444',
}

const ACTION_LABELS: Record<string, string> = {
  'payment.refund': 'issued a refund',
  'coupon.create': 'created a coupon',
  'coupon.update': 'updated a coupon',
  'coupon.delete': 'deleted a coupon',
  'product.create': 'created a product',
  'product.update': 'updated a product',
  'product.delete': 'deleted a product',
  'order.refund': 'refunded an order',
  'review.approved': 'approved a review',
  'review.rejected': 'rejected a review',
  'review.delete': 'deleted a review',
  'user.change_role': 'changed a user role',
}

export default function DashboardClient({
  productCount,
  orderCount,
  userCount,
  totalRevenue,
  avgOrderValue,
  chartData,
  statusChartData,
  recentOrders,
  revenueTrend,
  orderTrend,
  summary,
  recentActivity,
}: Props) {
  const [shapes, setShapes] = useState<
    { x: number; y: number; size: number; duration: number; delay: number }[]
  >([])

  useEffect(() => {
    setShapes(
      Array.from({ length: 6 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 60,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
      }))
    )
  }, [])

  const formatTrend = (trend: number) => {
    if (trend === 0) return null
    const abs = Math.abs(trend).toFixed(1)
    return trend > 0 ? `+${abs}%` : `-${abs}%`
  }

  // ─────────────────────────────────────────────
  // Top stat row (existing 5 + new live users)
  // ─────────────────────────────────────────────
  const topStats = [
    {
      label: 'Total Products',
      value: productCount,
      icon: Package,
      trend: null as string | null,
      color: 'border-l-indigo-500',
      href: '/admin/products',
      sub: `${summary.outOfStockProducts} out of stock`,
    },
    {
      label: 'Total Orders',
      value: orderCount,
      icon: ShoppingCart,
      trend: formatTrend(orderTrend),
      color: 'border-l-emerald-500',
      href: '/admin/orders',
      sub: `${summary.pendingOrders} pending`,
    },
    {
      label: 'Total Users',
      value: userCount,
      icon: Users,
      trend: null,
      color: 'border-l-purple-500',
      href: '/admin/users',
      sub: `${summary.todayNewVisitors} new visitors`,
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: formatTrend(revenueTrend),
      color: 'border-l-amber-500',
      href: '/admin/reports',
      sub: `₹${summary.stripeRevenue.toLocaleString()} via Stripe`,
    },
    {
      label: 'Avg Order Value',
      value: `₹${avgOrderValue.toFixed(0)}`,
      icon: TrendingUp,
      trend: null,
      color: 'border-l-rose-500',
      href: '/admin/reports',
      sub: 'per order',
    },
    {
      label: 'Live Users',
      value: summary.liveUsers,
      icon: Activity,
      trend: null,
      color: 'border-l-teal-500',
      href: '/admin/visitors',
      sub: `${summary.todayVisitors} today`,
    },
  ]

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-white/5"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: shape.duration,
              delay: shape.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Complete overview of your business — commerce, payments, reviews,
          analytics, all in one place.
        </p>
      </motion.div>

      {/* Top stat cards (6) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10"
      >
        {topStats.map((stat) => (
          <motion.div key={stat.label} variants={item} whileHover={{ y: -3 }}>
            <Link
              href={stat.href}
              className="block relative bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-indigo-500/30 transition"
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${stat.color}`}
              />
              <div className="relative z-10 pl-3">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-white/60" />
                  {stat.trend && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                        stat.trend.startsWith('+')
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {stat.trend.startsWith('+') ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 truncate">
                  {stat.sub}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Center — pending items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <QuickActionsGrid summary={summary} />
      </motion.div>

      {/* Business health — new section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
      >
        <Link
          href="/admin/reviews"
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl hover:border-indigo-500/30 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Star size={16} className="text-amber-400" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-600 group-hover:text-amber-400 transition"
            />
          </div>
          <p className="text-xs text-gray-400">Total Reviews</p>
          <p className="text-xl font-bold text-white mt-1">
            {summary.totalReviews}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {summary.approvedReviews} approved · {summary.pendingReviews} pending
          </p>
        </Link>

        <Link
          href="/admin/coupons"
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl hover:border-indigo-500/30 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Ticket size={16} className="text-purple-400" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-600 group-hover:text-purple-400 transition"
            />
          </div>
          <p className="text-xs text-gray-400">Coupons</p>
          <p className="text-xl font-bold text-white mt-1">
            {summary.activeCoupons}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {summary.couponRedemptions} total redemptions
          </p>
        </Link>

        <Link
          href="/admin/abandoned-carts"
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl hover:border-indigo-500/30 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <ShoppingBag size={16} className="text-rose-400" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-600 group-hover:text-rose-400 transition"
            />
          </div>
          <p className="text-xs text-gray-400">Cart Recovery</p>
          <p className="text-xl font-bold text-white mt-1">
            {summary.abandonedCartsRecovered}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {summary.abandonedCartsPending} still pending
          </p>
        </Link>

        <Link
          href="/admin/emails"
          className="bg-[#0f0f0f]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl hover:border-indigo-500/30 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Mail size={16} className="text-teal-400" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-600 group-hover:text-teal-400 transition"
            />
          </div>
          <p className="text-xs text-gray-400">Emails Today</p>
          <p className="text-xl font-bold text-white mt-1">
            {summary.emailsSentToday}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {summary.emailsFailedToday} failed
          </p>
        </Link>
      </motion.div>

      {/* Charts */}
      <div className="relative z-10">
        <AdminCharts chartData={chartData} statusChartData={statusChartData} />
      </div>

      {/* Recent Orders + Recent Activity side by side */}
      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Recent Orders (spans 2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              View all →
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left text-sm text-gray-400">
                      Order
                    </th>
                    <th className="p-4 text-left text-sm text-gray-400">
                      Customer
                    </th>
                    <th className="p-4 text-left text-sm text-gray-400">
                      Amount
                    </th>
                    <th className="p-4 text-left text-sm text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-sm text-indigo-400 font-mono">
                        <Link href={`/admin/orders/${order.id}`}>
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-white truncate max-w-[180px]">
                        {order.user_email}
                      </td>
                      <td className="p-4 text-sm text-white font-medium">
                        ₹{order.total?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className="px-2.5 py-1 text-xs rounded-full capitalize"
                          style={{
                            background: `${STATUS_COLORS[order.status]}20`,
                            color: STATUS_COLORS[order.status],
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No orders yet.</p>
          )}
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#0f0f0f]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h2>
            <Link
              href="/admin/audit"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              View all →
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-sm">
              No admin activity yet.
            </p>
          ) : (
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {recentActivity.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300">
                      <span className="text-white font-medium truncate">
                        {a.actorEmail.split('@')[0]}
                      </span>{' '}
                      {ACTION_LABELS[a.action] ?? a.action}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(a.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}