'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import type { EmailLogRow } from '@/lib/email/queries'

interface Props {
  rows: EmailLogRow[]
  total: number
  page: number
  totalPages: number
  initialFilters: {
    template: string
    status: string
    search: string
  }
}

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-emerald-500/20 text-emerald-400',
  failed: 'bg-red-500/20 text-red-400',
  queued: 'bg-yellow-500/20 text-yellow-400',
}

const TEMPLATES = [
  'all',
  'welcome',
  'order-placed',
  'payment-confirmed',
  'payment-failed',
  'order-shipped',
  'order-delivered',
  'order-cancelled',
  'low-stock-alert',
]

const STATUSES = ['all', 'sent', 'failed', 'queued']

export default function EmailsTable({ rows, total, page, totalPages, initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialFilters.search)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('q', search)
      else params.delete('q')
      params.set('page', '1')
      router.replace(`/admin/emails?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || !value) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    router.replace(`/admin/emails?${params.toString()}`)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`/admin/emails?${params.toString()}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
          />
        </div>
        <select
          value={initialFilters.template}
          onChange={(e) => updateFilter('template', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          {TEMPLATES.map((t) => (
            <option key={t} value={t} className="bg-[#1a1a1a]">
              {t === 'all' ? 'All Templates' : t}
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

      {rows.length === 0 ? (
        <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center">
          <Filter className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No emails match your filters.</p>
        </div>
      ) : (
        <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">Template</th>
                  <th className="p-4 text-left text-sm text-gray-400">Recipient</th>
                  <th className="p-4 text-left text-sm text-gray-400">Status</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">Sent</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">Message ID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-white font-medium">{row.template}</td>
                    <td className="p-4 text-sm text-gray-300">{row.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full ${STATUS_COLORS[row.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400 hidden md:table-cell">
                      {new Date(row.createdAt).toLocaleString('en-GB')}
                    </td>
                    <td className="p-4 text-xs text-gray-500 font-mono hidden lg:table-cell truncate max-w-[200px]">
                      {row.providerMessageId || '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

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
    </motion.div>
  )
}