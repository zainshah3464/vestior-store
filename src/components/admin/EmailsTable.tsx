'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
} from 'lucide-react'
import toast from 'react-hot-toast'
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

// ─────────────────────────────────────────────
// Status styling — extended with icons + colors
// ─────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  {
    bg: string
    text: string
    border: string
    dot: string
    icon: React.ElementType
  }
> = {
  sent: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  failed: {
    bg: 'bg-red-500/[0.1]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
    icon: XCircle,
  },
  queued: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
    icon: Clock,
  },
}

const DEFAULT_STATUS = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
  icon: Mail,
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

export default function EmailsTable({
  rows,
  total,
  page,
  totalPages,
  initialFilters,
}: Props) {
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

  const hasActiveFilters =
    initialFilters.template !== 'all' ||
    initialFilters.status !== 'all' ||
    initialFilters.search !== ''

  const copyMessageId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Message ID copied')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* ─────────────────────────────────────────────
          Filter bar
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-9 pr-9 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Clear search"
            >
              <X size={11} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Template filter */}
        <select
          value={initialFilters.template}
          onChange={(e) => updateFilter('template', e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white"
          aria-label="Filter by template"
        >
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Templates' : t}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={initialFilters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white"
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {/* ─────────────────────────────────────────────
          Empty state or table
         ───────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-blue-500/[0.05] blur-[100px]"
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
              No emails found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Transactional emails will appear here once sent.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => router.replace('/admin/emails')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <X size={11} aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Template
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Recipient
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden md:table-cell">
                    Sent
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Message ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const status =
                    STATUS_STYLES[row.status] ?? DEFAULT_STATUS
                  const StatusIcon = status.icon

                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Template */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/[0.08] border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Mail
                              size={11}
                              className="text-blue-400"
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-[12px] text-white font-medium font-mono tracking-wide truncate">
                            {row.template}
                          </span>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="px-4 sm:px-5 py-3">
                        <span className="text-[12px] text-gray-300 truncate block max-w-[220px]">
                          {row.email}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
                        >
                          <StatusIcon size={9} aria-hidden="true" />
                          {row.status}
                        </span>
                      </td>

                      {/* Sent */}
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 tabular-nums">
                          <Clock
                            size={10}
                            className="text-gray-600 flex-shrink-0"
                            aria-hidden="true"
                          />
                          {new Date(row.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Message ID */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        {row.providerMessageId ? (
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <span className="text-[11px] text-gray-400 font-mono truncate">
                              {row.providerMessageId}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                copyMessageId(row.providerMessageId!)
                              }
                              className="flex-shrink-0 p-1 -m-1 rounded text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/[0.08] opacity-0 group-hover:opacity-100 transition-all duration-200"
                              aria-label="Copy message ID"
                            >
                              <Copy size={10} aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-600">—</span>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/[0.06]">
              <span className="text-[11px] text-gray-500 tabular-nums">
                Page <span className="text-gray-300 font-medium">{page}</span>{' '}
                of{' '}
                <span className="text-gray-300 font-medium">
                  {totalPages}
                </span>{' '}
                ·{' '}
                <span className="text-gray-300 font-medium">
                  {total.toLocaleString()}
                </span>{' '}
                total
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
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
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
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