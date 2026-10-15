'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Eye,
  ShoppingCart,
  Monitor,
  Smartphone,
  Tablet,
  Shield,
  Sparkles,
  RotateCcw,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

// ─────────────────────────────────────────────
// Visitor type styles — preserved map, refined look
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
    bg: 'bg-amber-500/[0.12]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    icon: Eye,
    label: 'Guest',
  },
  new: {
    bg: 'bg-violet-500/[0.12]',
    text: 'text-violet-300',
    border: 'border-violet-500/25',
    icon: Sparkles,
    label: 'New',
  },
  returning: {
    bg: 'bg-emerald-500/[0.12]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    icon: RotateCcw,
    label: 'Returning',
  },
  admin: {
    bg: 'bg-indigo-500/[0.12]',
    text: 'text-indigo-300',
    border: 'border-indigo-500/25',
    icon: Shield,
    label: 'Admin',
  },
}

// Device icon resolver — pure presentation
function deviceIcon(type: string) {
  const t = type?.toLowerCase() || ''
  if (t.includes('mobile')) return Smartphone
  if (t.includes('tablet')) return Tablet
  return Monitor
}

export default function LiveUsersWidget() {
  const [sessions, setSessions] = useState<StoredSession[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const fetchLive = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/live-users', { cache: 'no-store' })
      if (res.ok) {
        const data: { sessions: StoredSession[] } = await res.json()
        setSessions(data.sessions ?? [])
        setLastRefresh(new Date())
      }
    } catch {
      // silent — non-critical widget
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLive()
    // Auto-refresh every 30 seconds
    const timer = setInterval(fetchLive, 30_000)
    return () => clearInterval(timer)
  }, [fetchLive])

  const sessionCount = sessions.length

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Live users"
      className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-emerald-500/[0.05] blur-[100px]"
      />

      {/* ─────────────────────────────────────────────
          Header
         ───────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
            <Activity
              size={14}
              className="text-emerald-400"
              aria-hidden="true"
            />
            {sessionCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#131313] animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-white leading-tight flex items-center gap-2">
              Live Users
              {sessionCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-500/[0.1] border border-emerald-500/25 px-1.5 py-0.5 rounded-full tabular-nums">
                  {sessionCount}
                </span>
              )}
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Active in last 5 minutes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchLive}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-50 flex-shrink-0"
          aria-label="Refresh live users"
        >
          <RefreshCw
            size={14}
            className={refreshing ? 'animate-spin' : ''}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ─────────────────────────────────────────────
          Body
         ───────────────────────────────────────────── */}
      <div className="relative">
        {loading ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-white/[0.03] border border-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        ) : sessionCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <Activity
                size={18}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12px] text-gray-500">
              No active sessions right now.
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              Widget auto-refreshes every 30s
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-1.5 max-h-[400px] overflow-y-auto overscroll-contain">
            <AnimatePresence initial={false}>
              {sessions.map((s, idx) => {
                const style = TYPE_STYLES[s.visitor_type] ?? TYPE_STYLES.guest
                const TypeIcon = style.icon
                const Device = deviceIcon(s.device.type)
                const initial =
                  s.user_name?.charAt(0)?.toUpperCase() ||
                  s.user_email?.charAt(0)?.toUpperCase() ||
                  '?'

                return (
                  <motion.div
                    key={s.session_id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(idx * 0.03, 0.2),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div
                      className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 ring-1 ring-white/[0.08]"
                      aria-hidden="true"
                    >
                      {initial}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white font-medium truncate leading-tight">
                        {s.user_name || s.user_email || 'Guest visitor'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[9px] font-semibold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}
                        >
                          <TypeIcon size={8} aria-hidden="true" />
                          {style.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Device size={9} aria-hidden="true" />
                          {s.device.os}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span
                        className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums"
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
                        className="flex items-center gap-1 text-[10px] text-gray-400 tabular-nums"
                        title="Product views"
                      >
                        <ShoppingCart
                          size={10}
                          className="text-blue-400"
                          aria-hidden="true"
                        />
                        {s.product_view_count}
                      </span>

                      {/* View link — appears on hover */}
                      <Link
                        href={`/admin/sessions?id=${s.session_id}`}
                        className="flex items-center gap-0.5 text-[10px] font-medium text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label={`View session for ${
                          s.user_name || s.user_email || 'guest'
                        }`}
                      >
                        View
                        <ExternalLink size={9} aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          Footer
         ───────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-5 py-2.5 border-t border-white/[0.04] flex items-center justify-center gap-1.5">
        <span
          className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"
          aria-hidden="true"
        />
        <p className="text-[10px] text-gray-600 tabular-nums">
          Auto-refreshing every 30s · Last:{' '}
          {lastRefresh.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.section>
  )
}