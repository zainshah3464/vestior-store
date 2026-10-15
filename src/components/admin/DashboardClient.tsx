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
  Activity,
  CreditCard,
  Star,
  Ticket,
  ShoppingBag,
  Mail,
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
    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl h-[360px] animate-pulse"
        />
      ))}
    </div>
  ),
})

interface Props {
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
  summary: DashboardSummary
  recentActivity: RecentActivityItem[]
}

// ─────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

// ─────────────────────────────────────────────
// Status colors
// ─────────────────────────────────────────────
const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; hex: string }
> = {
  pending: { bg: 'bg-amber-500/[0.1]', text: 'text-amber-300', hex: '#eab308' },
  processing: { bg: 'bg-blue-500/[0.1]', text: 'text-blue-300', hex: '#3b82f6' },
  shipped: { bg: 'bg-violet-500/[0.1]', text: 'text-violet-300', hex: '#a855f7' },
  delivered: { bg: 'bg-emerald-500/[0.1]', text: 'text-emerald-300', hex: '#22c55e' },
  cancelled: { bg: 'bg-red-500/[0.1]', text: 'text-red-300', hex: '#ef4444' },
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

// Action → accent color for the timeline dots
const ACTION_COLORS: Record<string, string> = {
  'payment.refund': 'text-red-400',
  'coupon.create': 'text-violet-400',
  'coupon.update': 'text-violet-400',
  'coupon.delete': 'text-red-400',
  'product.create': 'text-emerald-400',
  'product.update': 'text-blue-400',
  'product.delete': 'text-red-400',
  'order.refund': 'text-red-400',
  'review.approved': 'text-emerald-400',
  'review.rejected': 'text-red-400',
  'review.delete': 'text-red-400',
  'user.change_role': 'text-amber-400',
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
      Array.from({ length: 5 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 30 + Math.random() * 60,
        duration: 18 + Math.random() * 20,
        delay: Math.random() * 5,
      }))
    )
  }, [])

  const formatTrend = (trend: number) => {
    if (trend === 0) return null
    const abs = Math.abs(trend).toFixed(1)
    return trend > 0 ? `+${abs}%` : `-${abs}%`
  }

  const topStats = [
    {
      label: 'Total Products',
      value: productCount,
      icon: Package,
      trend: null as string | null,
      color: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      href: '/admin/products',
      sub: `${summary.outOfStockProducts} out of stock`,
    },
    {
      label: 'Total Orders',
      value: orderCount,
      icon: ShoppingCart,
      trend: formatTrend(orderTrend),
      color: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      href: '/admin/orders',
      sub: `${summary.pendingOrders} pending`,
    },
    {
      label: 'Total Users',
      value: userCount,
      icon: Users,
      trend: null,
      color: 'border-l-purple-500',
      glow: 'bg-purple-500/[0.06]',
      href: '/admin/users',
      sub: `${summary.todayNewVisitors} new visitors`,
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: formatTrend(revenueTrend),
      color: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      href: '/admin/reports',
      sub: `₹${summary.stripeRevenue.toLocaleString()} via Stripe`,
    },
    {
      label: 'Avg Order Value',
      value: `₹${avgOrderValue.toFixed(0)}`,
      icon: TrendingUp,
      trend: null,
      color: 'border-l-rose-500',
      glow: 'bg-rose-500/[0.06]',
      href: '/admin/reports',
      sub: 'per order',
    },
    {
      label: 'Live Users',
      value: summary.liveUsers,
      icon: Activity,
      trend: null,
      color: 'border-l-teal-500',
      glow: 'bg-teal-500/[0.06]',
      href: '/admin/visitors',
      sub: `${summary.todayVisitors} today`,
    },
  ]

  const businessHealth = [
    {
      label: 'Total Reviews',
      value: summary.totalReviews,
      sub: `${summary.approvedReviews} approved · ${summary.pendingReviews} pending`,
      href: '/admin/reviews',
      icon: Star,
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
      hoverText: 'group-hover:text-amber-400',
    },
    {
      label: 'Active Coupons',
      value: summary.activeCoupons,
      sub: `${summary.couponRedemptions} total redemptions`,
      href: '/admin/coupons',
      icon: Ticket,
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
      hoverText: 'group-hover:text-violet-400',
    },
    {
      label: 'Cart Recovered',
      value: summary.abandonedCartsRecovered,
      sub: `${summary.abandonedCartsPending} still pending`,
      href: '/admin/abandoned-carts',
      icon: ShoppingBag,
      iconBg: 'bg-rose-500/[0.1]',
      iconText: 'text-rose-400',
      hoverText: 'group-hover:text-rose-400',
    },
    {
      label: 'Emails Today',
      value: summary.emailsSentToday,
      sub: `${summary.emailsFailedToday} failed`,
      href: '/admin/emails',
      icon: Mail,
      iconBg: 'bg-teal-500/[0.1]',
      iconText: 'text-teal-400',
      hoverText: 'group-hover:text-teal-400',
    },
  ]

  return (
    <div className="relative space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Ambient animated shapes (subtle, background)
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
      >
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03] blur-[60px]"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
            }}
            animate={{
              x: [0, 20, -15, 0],
              y: [0, -25, 15, 0],
              opacity: [0.5, 0.8, 0.5],
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

      {/* ─────────────────────────────────────────────
          Header
         ───────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Activity
            size={11}
            className="text-blue-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Command Center
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Dashboard
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-xl leading-relaxed">
              Complete overview of your business — commerce, payments,
              reviews, analytics, all in one place.
            </p>
          </div>
        </div>
      </motion.header>

      {/* ─────────────────────────────────────────────
          Top stat cards
         ───────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4"
      >
        {topStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={stat.href}
              className="group relative block overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-all duration-300"
            >
              {/* Left accent bar */}
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${stat.color}`}
              />

              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${stat.glow} blur-[70px]`}
              />

              <div className="relative pl-3">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <stat.icon
                      size={14}
                      className="text-gray-500 group-hover:text-white transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>

                  {stat.trend && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums ${
                        stat.trend.startsWith('+')
                          ? 'bg-emerald-500/[0.1] text-emerald-300'
                          : 'bg-red-500/[0.1] text-red-300'
                      }`}
                    >
                      {stat.trend.startsWith('+') ? (
                        <ArrowUpRight size={10} aria-hidden="true" />
                      ) : (
                        <ArrowDownRight size={10} aria-hidden="true" />
                      )}
                      {stat.trend}
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
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ─────────────────────────────────────────────
          Action Center
         ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <QuickActionsGrid summary={summary} />
      </motion.div>

      {/* ─────────────────────────────────────────────
          Business health cards
         ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {businessHealth.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25 + idx * 0.05,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={item.href}
              className="group relative block overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl ${item.iconBg} border border-white/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <item.icon
                    size={15}
                    className={item.iconText}
                    aria-hidden="true"
                  />
                </div>
                <ArrowUpRight
                  size={14}
                  className={`text-gray-600 transition-all duration-300 ${item.hoverText} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                  aria-hidden="true"
                />
              </div>

              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                {item.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight">
                {item.value}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 truncate">
                {item.sub}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ─────────────────────────────────────────────
          Charts
         ───────────────────────────────────────────── */}
      <div className="relative">
        <AdminCharts
          chartData={chartData}
          statusChartData={statusChartData}
        />
      </div>

      {/* ─────────────────────────────────────────────
          Recent Orders + Activity
         ───────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
                <Clock
                  size={14}
                  className="text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-white leading-tight">
                  Recent Orders
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Last {recentOrders.length} order
                  {recentOrders.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <Link
              href="/admin/orders"
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all
              <ArrowUpRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Table */}
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                      Order
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                      Customer
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => {
                    const statusStyle =
                      STATUS_COLORS[order.status] ?? STATUS_COLORS.pending
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.35 + i * 0.04,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 sm:px-5 py-3 text-[12px] font-mono">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            #{order.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-[12px] text-gray-300 truncate max-w-[180px]">
                          {order.user_email}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right text-[12px] text-white font-semibold tabular-nums">
                          ₹{order.total?.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <span
                              className="w-1 h-1 rounded-full"
                              style={{ background: statusStyle.hex }}
                              aria-hidden="true"
                            />
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <ShoppingCart
                  size={18}
                  className="text-gray-600"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[12px] text-gray-500">No orders yet.</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
                <Activity
                  size={14}
                  className="text-violet-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-white leading-tight">
                  Recent Activity
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Admin actions
                </p>
              </div>
            </div>

            <Link
              href="/admin/audit"
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all
              <ArrowUpRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* List */}
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <Activity
                  size={18}
                  className="text-gray-600"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[12px] text-gray-500">
                No admin activity yet.
              </p>
            </div>
          ) : (
            <div className="relative p-3 space-y-0.5 max-h-[420px] overflow-y-auto overscroll-contain">
              {recentActivity.map((a, i) => {
                const dotColor =
                  ACTION_COLORS[a.action] ?? 'text-blue-400'
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.03,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0 pt-0.5">
                      <div
                        className="w-2 h-2 rounded-full bg-current mt-1.5"
                        style={{ color: 'currentColor' }}
                        aria-hidden="true"
                      >
                        <span
                          className={`block w-2 h-2 rounded-full ${dotColor}`}
                        />
                      </div>
                      {/* Connector line */}
                      {i < recentActivity.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="absolute left-1/2 top-4 -translate-x-1/2 w-px h-[calc(100%+4px)] bg-white/[0.04]"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] text-gray-400 leading-snug">
                        <span className="text-white font-medium truncate">
                          {a.actorEmail.split('@')[0]}
                        </span>{' '}
                        {ACTION_LABELS[a.action] ?? a.action}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5 tabular-nums">
                        {new Date(a.timestamp).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}