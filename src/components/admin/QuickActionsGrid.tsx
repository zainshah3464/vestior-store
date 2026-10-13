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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import type { DashboardSummary } from '@/lib/dashboard/queries'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

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
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hint: 'awaiting approval',
    },
    {
      label: 'Pending Orders',
      count: summary.pendingOrders,
      href: '/admin/orders?status=pending',
      icon: Package,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      hint: 'need processing',
    },
    {
      label: 'Pending Payments',
      count: summary.pendingPayments,
      href: '/admin/payments',
      icon: CreditCard,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      hint: 'awaiting completion',
    },
    {
      label: 'Abandoned Carts',
      count: summary.abandonedCartsPending,
      href: '/admin/abandoned-carts',
      icon: ShoppingBag,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      hint: `₹${summary.abandonedCartValue.toLocaleString()} at risk`,
    },
    {
      label: 'Low Stock',
      count: summary.lowStockProducts,
      href: '/admin/products',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hint: 'under 10 units',
    },
    {
      label: 'Failed Emails',
      count: summary.emailsFailedToday,
      href: '/admin/emails?status=failed',
      icon: Mail,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      hint: 'today',
    },
  ]

  // If nothing pending, show all-good message
  const totalPending = actions.reduce((s, a) => s + a.count, 0)

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Action Center
        </h2>
        {totalPending === 0 ? (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} />
            All caught up
          </span>
        ) : (
          <span className="text-xs text-amber-400">
            {totalPending} item{totalPending === 1 ? '' : 's'} need attention
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((a) => (
          <motion.div key={a.label} variants={item}>
            <Link
              href={a.href}
              className={`block p-4 rounded-xl border transition-all group ${
                a.count > 0
                  ? `${a.bg} ${a.border} hover:scale-[1.02]`
                  : 'bg-[#0f0f0f]/40 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <a.icon
                  size={18}
                  className={a.count > 0 ? a.color : 'text-gray-600'}
                />
                {a.count > 0 && (
                  <ArrowRight
                    size={12}
                    className={`${a.color} opacity-0 group-hover:opacity-100 transition`}
                  />
                )}
              </div>
              <p className="text-xs text-gray-400">{a.label}</p>
              <p
                className={`text-2xl font-bold mt-0.5 ${
                  a.count > 0 ? 'text-white' : 'text-gray-600'
                }`}
              >
                {a.count}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                {a.count > 0 ? a.hint : 'nothing pending'}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}