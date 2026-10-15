'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  ShoppingCart,
  Shield,
  Sparkles,
  RotateCcw,
  Users2,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Timer,
  CheckCircle2,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

const VISITOR_TYPES = ['all', 'guest', 'new', 'returning', 'admin'] as const

// ─────────────────────────────────────────────
// Visitor type styling
// ─────────────────────────────────────────────
const TYPE_STYLES: Record<
  string,
  {
    bg: string
    text: string
    border: string
    icon: React.ElementType
    label: string
  }
> = {
  guest: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    icon: Eye,
    label: 'Guest',
  },
  new: {
    bg: 'bg-violet-500/[0.1]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    icon: Sparkles,
    label: 'New',
  },
  returning: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    icon: RotateCcw,
    label: 'Returning',
  },
  admin: {
    bg: 'bg-indigo-500/[0.1]',
    text: 'text-indigo-300',
    border: 'border-indigo-500/25',
    icon: Shield,
    label: 'Admin',
  },
}

const DEFAULT_TYPE = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  icon: Eye,
  label: 'Unknown',
}

// Tab specific styles
const TAB_STYLES: Record<string, { active: string; icon: React.ElementType }> = {
  all: {
    active:
      'bg-indigo-500/[0.15] text-indigo-300 border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]',
    icon: Users2,
  },
  guest: {
    active:
      'bg-amber-500/[0.15] text-amber-300 border-amber-500/40 shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
    icon: Eye,
  },
  new: {
    active:
      'bg-violet-500/[0.15] text-violet-300 border-violet-500/40 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]',
    icon: Sparkles,
  },
  returning: {
    active:
      'bg-emerald-500/[0.15] text-emerald-300 border-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]',
    icon: RotateCcw,
  },
  admin: {
    active:
      'bg-indigo-500/[0.15] text-indigo-300 border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]',
    icon: Shield,
  },
}

interface Props {
  rows: StoredSession[]
  total: number
  page: number
  totalPages: number
  initialFilters: {
    visitorType: string
    search: string
  }
}

export default function VisitorsTable({
  rows,
  total,
  page,
  totalPages,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialFilters.search)

  // Compute "now" once on mount — preserved logic
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('q', search)
      else params.delete('q')
      params.set('page', '1')
      router.replace(`/admin/visitors?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || !value) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    router.replace(`/admin/visitors?${params.toString()}`)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`/admin/visitors?${params.toString()}`)
  }

  const formatDuration = (ms: number) => {
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`
    const mins = Math.floor(ms / 60_000)
    const secs = Math.round((ms % 60_000) / 1000)
    return `${mins}m ${secs}s`
  }

  // Uses `now` state instead of Date.now() — preserved
  const formatRelative = (date: Date) => {
    if (now === null) return '—'
    const diff = now - new Date(date).getTime()
    if (diff < 60_000) return 'just now'
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`
    return `${Math.floor(diff / 86400_000)}d ago`
  }

  const getDeviceIcon = (type: string) => {
    const t = (type || '').toLowerCase()
    if (t === 'mobile') return Smartphone
    if (t === 'tablet') return Tablet
    return Monitor
  }

  const hasActiveFilters = initialFilters.search !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* ═════════════════════════════════════════════
          Visitor type tabs
         ═════════════════════════════════════════════ */}
      <div
        role="tablist"
        aria-label="Visitor type filter"
        className="flex flex-wrap gap-2"
      >
        {VISITOR_TYPES.map((tab) => {
          const tabStyle = TAB_STYLES[tab]
          const Icon = tabStyle.icon
          const active = initialFilters.visitorType === tab

          return (
            <motion.button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => updateFilter('type', tab)}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium capitalize transition-all duration-200 border ${
                active
                  ? tabStyle.active
                  : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-white/15'
              }`}
            >
              <Icon
                size={12}
                className={active ? '' : 'text-gray-500'}
                aria-hidden="true"
              />
              {tab === 'all' ? 'All' : tab}
            </motion.button>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════
          Search
         ═════════════════════════════════════════════ */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by email, name, or session ID…"
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

      {/* ═════════════════════════════════════════════
          Empty state or table
         ═════════════════════════════════════════════ */}
      {rows.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-emerald-500/[0.05] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Users2
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No sessions found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Visitor sessions will appear here as they happen.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => router.replace('/admin/visitors')}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Type
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Visitor
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden md:table-cell">
                    Activity
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Device
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden lg:table-cell">
                    Duration
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Last Seen
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => {
                  const typeStyle =
                    TYPE_STYLES[s.visitor_type] ?? DEFAULT_TYPE
                  const TypeIcon = typeStyle.icon
                  const Device = getDeviceIcon(s.device.type)
                  const initial =
                    s.user_name?.charAt(0)?.toUpperCase() ||
                    s.user_email?.charAt(0)?.toUpperCase() ||
                    '?'

                  return (
                    <motion.tr
                      key={s.session_id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Type */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                        >
                          <TypeIcon size={9} aria-hidden="true" />
                          {typeStyle.label}
                        </span>
                      </td>

                      {/* Visitor */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-semibold ring-1 ring-white/[0.08] flex-shrink-0"
                            aria-hidden="true"
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] text-white font-medium truncate max-w-[180px] leading-tight">
                              {s.user_name || s.user_email || 'Guest'}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[180px] mt-0.5 font-mono tabular-nums">
                              {s.user_email || `${s.session_id.slice(0, 8)}…`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 tabular-nums">
                          <span
                            className="inline-flex items-center gap-1"
                            title="Page views"
                          >
                            <Eye
                              size={10}
                              className="text-indigo-400"
                              aria-hidden="true"
                            />
                            {s.page_view_count}
                          </span>
                          <span
                            className="inline-flex items-center gap-1"
                            title="Product views"
                          >
                            <ShoppingCart
                              size={10}
                              className="text-blue-400"
                              aria-hidden="true"
                            />
                            {s.product_view_count}
                          </span>
                          {s.order_count > 0 && (
                            <span
                              className="inline-flex items-center gap-1 text-emerald-300 font-semibold"
                              title="Orders"
                            >
                              <CheckCircle2
                                size={10}
                                aria-hidden="true"
                              />
                              {s.order_count}×
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Device */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Device
                            size={11}
                            className="text-gray-500"
                            aria-hidden="true"
                          />
                          <span className="truncate max-w-[100px]">
                            {s.device.os}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        <div className="inline-flex items-center gap-1 text-[11px] text-gray-400 tabular-nums">
                          <Timer
                            size={10}
                            className="text-amber-400"
                            aria-hidden="true"
                          />
                          {formatDuration(s.duration_ms)}
                        </div>
                      </td>

                      {/* Last seen */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 tabular-nums">
                          <Globe
                            size={10}
                            className="text-gray-600"
                            aria-hidden="true"
                          />
                          {formatRelative(s.last_seen_at)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3 text-right">
                        <Link
                          href={`/admin/sessions?id=${s.session_id}`}
                          className="group/details inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.08] transition-all duration-200"
                          aria-label={`View session details for ${
                            s.user_name || s.user_email || 'guest'
                          }`}
                        >
                          Details
                          <ExternalLink
                            size={11}
                            className="transition-transform duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ═════════════════════════════════════════════
              Pagination
             ═════════════════════════════════════════════ */}
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