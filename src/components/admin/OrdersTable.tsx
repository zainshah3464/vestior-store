'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import OrderStatusUpdater from './OrderStatusUpdater'

interface Order {
  id: string
  user_email: string
  total: number
  status: string
  payment_status: string
  created_at: string
  [key: string]: any
}

export default function OrdersTable({ orders, fetchError }: { orders: Order[], fetchError?: string }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  const filtered = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.user_email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search order ID or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            {statuses.map(s => (
              <option key={s} value={s} className="bg-[#1a1a1a]">{s === 'all' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">Error loading orders: {fetchError}</p>
        </div>
      )}

      {!fetchError && filtered.length === 0 && (
        <div className="text-gray-500 text-center py-16">No orders found.</div>
      )}

      {filtered.length > 0 && (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">Order ID</th>
                  <th className="p-4 text-left text-sm text-gray-400">Customer</th>
                  <th className="p-4 text-left text-sm text-gray-400">Total</th>
                  <th className="p-4 text-left text-sm text-gray-400">Status</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">Payment</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden sm:table-cell">Date</th>
                  <th className="p-4 text-left text-sm text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-blue-400 font-mono">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 text-sm text-white">{order.user_email}</td>
                    <td className="p-4 text-sm text-white font-medium">₹{order.total?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white hidden md:table-cell">{order.payment_status}</td>
                    <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4">
                      <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
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
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}