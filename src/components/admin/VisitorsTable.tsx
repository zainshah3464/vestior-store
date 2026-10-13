'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  ShoppingCart,
  Shield,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

const VISITOR_TYPES = ['all', 'guest', 'new', 'returning', 'admin']

const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  guest: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Eye },
  new: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Sparkles },
  returning: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: RotateCcw,
  },
  admin: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', icon: Shield },
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

  const formatRelative = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    if (diff < 60_000) return 'just now'
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`
    return `${Math.floor(diff / 86400_000)}d ago`
  }

  const DeviceIcon = (type: string) => {
    if (type === 'mobile') return Smartphone
    if (type === 'tablet') return Tablet
    return Monitor
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {VISITOR_TYPES.map((tab) => (
          <button
            key={tab}
            onClick={() => updateFilter('type', tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              initialFilters.visitorType === tab
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by email, name, or session ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-16 text-center">
          <Eye className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No sessions found.</p>
        </div>
      ) : (
        <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-sm text-gray-400">Type</th>
                  <th className="p-4 text-left text-sm text-gray-400">Visitor</th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden md:table-cell">
                    Activity
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">
                    Device
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400 hidden lg:table-cell">
                    Duration
                  </th>
                  <th className="p-4 text-left text-sm text-gray-400">
                    Last Seen
                  </th>
                  <th className="p-4 text-right text-sm text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => {
                  const style = TYPE_STYLES[s.visitor_type] ?? TYPE_STYLES.guest
                  const TypeIcon = style.icon
                  const Device = DeviceIcon(s.device.type)

                  return (
                    <motion.tr
                      key={s.session_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style.bg} ${style.text}`}
                        >
                          <TypeIcon size={11} />
                          {s.visitor_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-white font-medium truncate max-w-[180px]">
                          {s.user_name || s.user_email || 'Guest'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px]">
                          {s.user_email || s.session_id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span title="Page views">
                            <Eye size={11} className="inline mr-1" />
                            {s.page_view_count}
                          </span>
                          <span title="Product views">
                            <ShoppingCart size={11} className="inline mr-1" />
                            {s.product_view_count}
                          </span>
                          {s.order_count > 0 && (
                            <span
                              className="text-emerald-400 font-semibold"
                              title="Orders"
                            >
                              {s.order_count}× ✓
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Device size={12} />
                          <span>{s.device.os}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-sm text-gray-400">
                        {formatDuration(s.duration_ms)}
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {formatRelative(s.last_seen_at)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/sessions?id=${s.session_id}`}
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                        >
                          Details
                          <ExternalLink size={11} />
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
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
    </motion.div>
  )
}