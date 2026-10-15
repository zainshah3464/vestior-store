'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import OrderStatusUpdater from './OrderStatusUpdater'

interface Order {
  id: string
  user_email: string
  total: number
  status: string
  payment_status: string
  created_at: string
  [key: string]: unknown
}

// ─────────────────────────────────────────────
// Status styling — refined with dot + border
// ─────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  {
    bg: string
    text: string
    border: string
    dot: string
  }
> = {
  pending: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  processing: {
    bg: 'bg-blue-500/[0.1]',
    text: 'text-blue-300',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  shipped: {
    bg: 'bg-violet-500/[0.1]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    dot: 'bg-violet-400',
  },
  delivered: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    bg: 'bg-red-500/[0.1]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
  },
}

const DEFAULT_STATUS = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
}

const PAYMENT_STYLES: Record<
  string,
  { text: string; dot: string }
> = {
  completed: { text: 'text-emerald-300', dot: 'bg-emerald-400' },
  pending: { text: 'text-amber-300', dot: 'bg-amber-400' },
  failed: { text: 'text-red-300', dot: 'bg-red-400' },
  refunded: { text: 'text-violet-300', dot: 'bg-violet-400' },
}

const DEFAULT_PAYMENT = {
  text: 'text-gray-400',
  dot: 'bg-gray-400',
}

const STATUSES = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export default function OrdersTable({
  orders,
  fetchError,
}: {
  orders: Order[]
  fetchError?: string
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const filtered = orders.filter((order) => {
    const q = search.toLowerCase()
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      order.user_email.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const hasActiveFilters = search !== '' || statusFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5 sm:space-y-6"
    >
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <ShoppingCart
            size={11}
            className="text-emerald-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Fulfillment
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Orders
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Track, filter, and update every customer order in one place.
            </p>
          </div>

          {orders.length > 0 && (
            <p className="text-[11px] sm:text-[12px] text-gray-500 font-medium tabular-nums flex-shrink-0">
              {orders.length.toLocaleString()} total
            </p>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          Filter bar
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by order ID or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-9 pr-9 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCurrentPage(1)
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Clear search"
            >
              <X size={11} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by status"
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white capitalize min-w-[140px]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {/* ─────────────────────────────────────────────
          Fetch error
         ───────────────────────────────────────────── */}
      {fetchError && (
        <div className="relative flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-red-500/[0.06] border border-red-500/20">
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-500/[0.15] border border-red-500/25 flex items-center justify-center">
            <AlertCircle
              size={12}
              className="text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-red-300">
              Error loading orders
            </p>
            <p className="text-[11px] text-red-400/80 mt-0.5 break-words">
              {fetchError}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          Empty state
         ───────────────────────────────────────────── */}
      {!fetchError && filtered.length === 0 && (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-emerald-500/[0.05] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Filter
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No orders found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Orders will appear here as customers place them.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <X size={11} aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          Table
         ───────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
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
                    Total
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden md:table-cell">
                    Payment
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => {
                  const status = STATUS_STYLES[order.status] ?? DEFAULT_STATUS
                  const payment =
                    PAYMENT_STYLES[order.payment_status] ?? DEFAULT_PAYMENT

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-[12px] font-mono font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            #{order.id.slice(0, 8)}
                          </Link>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-1 -m-1 rounded text-gray-600 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all duration-200"
                            aria-label={`View order ${order.id.slice(0, 8)}`}
                          >
                            <ExternalLink
                              size={10}
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 sm:px-5 py-3">
                        <span className="text-[12px] text-gray-300 truncate block max-w-[220px]">
                          {order.user_email}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-4 sm:px-5 py-3 text-right">
                        <span className="text-[12px] font-semibold text-white tabular-nums">
                          ₹{order.total?.toLocaleString() ?? '0'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border capitalize ${status.bg} ${status.text} ${status.border}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${status.dot}`}
                            aria-hidden="true"
                          />
                          {order.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1 h-1 rounded-full ${payment.dot}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[11px] font-medium capitalize ${payment.text}`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 sm:px-5 py-3 hidden sm:table-cell">
                        <span className="text-[11px] text-gray-400 tabular-nums">
                          {new Date(order.created_at).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3">
                        <OrderStatusUpdater
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ─────────────────────────────────────────────
              Pagination
             ───────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/[0.06]">
              <span className="text-[11px] text-gray-500 tabular-nums">
                Page{' '}
                <span className="text-gray-300 font-medium">
                  {currentPage}
                </span>{' '}
                of{' '}
                <span className="text-gray-300 font-medium">
                  {totalPages}
                </span>{' '}
                ·{' '}
                <span className="text-gray-300 font-medium">
                  {filtered.length.toLocaleString()}
                </span>{' '}
                filtered
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  <ChevronLeft
                    size={12}
                    className="transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  Next
                  <ChevronRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}