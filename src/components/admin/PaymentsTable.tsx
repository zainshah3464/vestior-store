'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Eye, Filter, RefreshCw } from 'lucide-react'
import type { PaymentRow } from '@/lib/payments/queries'
import PaymentDetailsModal from './PaymentDetailsModal'

interface PaymentsTableProps {
  rows: PaymentRow[]
  total: number
  page: number
  totalPages: number
  initialFilters: {
    provider: string
    status: string
    search: string
  }
}

const PROVIDERS = ['all', 'cod', 'stripe'] as const
const STATUSES = ['all', 'completed', 'pending', 'failed', 'refunded'] as const

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-500/20 text-emerald-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400',
  refunded: 'bg-purple-500/20 text-purple-400',
}

export default function PaymentsTable({
  rows,
  total,
  page,
  totalPages,
  initialFilters,
}: PaymentsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialFilters.search)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Sync search input with URL (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('q', search)
      else params.delete('q')
      params.set('page', '1')
      router.replace(`/admin/payments?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || !value) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    router.replace(`/admin/payments?${params.toString()}`)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`/admin/payments?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        <select
          value={initialFilters.provider}
          onChange={(e) => updateFilter('provider', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p} className="bg-[#1a1a1a]">
              {p === 'all' ? 'All Providers' : p.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={initialFilters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a]">
              {s === 'all' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center">
          <Filter className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No payments match your filters.</p>
        </div>
      ) : (
        <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">
                    Order
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">
                    Customer
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400">
                    Amount
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden sm:table-cell">
                    Provider
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="p-4 text-right text-sm text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-indigo-400 font-mono">
                      #{row.orderId.slice(0, 8)}
                    </td>
                    <td className="p-4 text-sm text-gray-300 hidden md:table-cell">
                      {row.userEmail}
                    </td>
                    <td className="p-4 text-sm text-white font-medium">
                      ₹{row.total.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-300 uppercase hidden sm:table-cell">
                      {row.provider}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${
                          STATUS_COLORS[row.paymentStatus] ||
                          'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {row.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400 hidden lg:table-cell">
                      {new Date(row.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(row.orderId)}
                        className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages} · {total} total
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail modal */}
      {selectedOrder && (
        <PaymentDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  )
}