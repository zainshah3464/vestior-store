'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Star,
  ShoppingBag,
  Package,
  Mail,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import type { DashboardSummary } from '@/lib/dashboard/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface Props {
  summary: DashboardSummary
}

export default function QuickActionsGrid({ summary }: Props) {
  const actions = [
    {
      label: 'Pending Reviews',
      count: summary.pendingReviews,
      href: '/admin/reviews',
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
      border: 'border-amber-500/25',
      glow: 'bg-amber-500/[0.12]',
      hint: 'awaiting approval',
    },
    {
      label: 'Pending Orders',
      count: summary.pendingOrders,
      href: '/admin/orders?status=pending',
      icon: Package,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/[0.08]',
      border: 'border-yellow-500/25',
      glow: 'bg-yellow-500/[0.12]',
      hint: 'need processing',
    },
    {
      label: 'Pending Payments',
      count: summary.pendingPayments,
      href: '/admin/payments',
      icon: CreditCard,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/[0.08]',
      border: 'border-indigo-500/25',
      glow: 'bg-indigo-500/[0.12]',
      hint: 'awaiting completion',
    },
    {
      label: 'Abandoned Carts',
      count: summary.abandonedCartsPending,
      href: '/admin/abandoned-carts',
      icon: ShoppingBag,
      color: 'text-rose-400',
      bg: 'bg-rose-500/[0.08]',
      border: 'border-rose-500/25',
      glow: 'bg-rose-500/[0.12]',
      hint: `₹${summary.abandonedCartValue.toLocaleString()} at risk`,
    },
    {
      label: 'Low Stock',
      count: summary.lowStockProducts,
      href: '/admin/products',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
      border: 'border-amber-500/25',
      glow: 'bg-amber-500/[0.12]',
      hint: 'under 10 units',
    },
    {
      label: 'Failed Emails',
      count: summary.emailsFailedToday,
      href: '/admin/emails?status=failed',
      icon: Mail,
      color: 'text-red-400',
      bg: 'bg-red-500/[0.08]',
      border: 'border-red-500/25',
      glow: 'bg-red-500/[0.12]',
      hint: 'today',
    },
  ]

  const totalPending = actions.reduce((s, a) => s + a.count, 0)
  const allClear = totalPending === 0

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      aria-label="Action Center"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center">
            <AlertTriangle
              size={14}
              className="text-amber-400"
              aria-hidden="true"
            />
            {!allClear && (
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0A0A0A] animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white leading-tight">
              Action Center
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {allClear
                ? 'Everything looks good'
                : `${totalPending} item${totalPending === 1 ? '' : 's'} need attention`}
            </p>
          </div>
        </div>

        {allClear ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/25 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={11} aria-hidden="true" />
            All caught up
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400 bg-amber-500/[0.08] border border-amber-500/25 px-2.5 py-1 rounded-full">
            <Sparkles size={11} aria-hidden="true" />
            {totalPending} pending
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((a) => {
          const isActive = a.count > 0
          const Icon = a.icon

          return (
            <motion.div key={a.label} variants={item}>
              <Link
                href={a.href}
                className={`group relative block overflow-hidden p-4 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? `${a.bg} ${a.border} hover:scale-[1.02] hover:shadow-lg`
                    : 'bg-gradient-to-b from-[#131313] to-[#0e0e0e] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {/* Ambient glow — active only */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-12 -right-12 w-[120px] h-[120px] ${a.glow} blur-[60px]`}
                  />
                )}

                <div className="relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? a.color
                          : 'text-gray-600 group-hover:text-gray-400 transition-colors'
                      }
                      aria-hidden="true"
                    />

                    {isActive && (
                      <ArrowUpRight
                        size={12}
                        className={`${a.color} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <p
                    className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
                      isActive ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {a.label}
                  </p>

                  <p
                    className={`text-2xl font-bold mt-1 tabular-nums tracking-tight ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 group-hover:text-gray-400 transition-colors'
                    }`}
                  >
                    {a.count}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    {isActive ? a.hint : 'All clear'}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}