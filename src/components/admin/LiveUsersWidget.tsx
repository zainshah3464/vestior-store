'use client'

import { useEffect, useState } from 'react'
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
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  guest: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Eye },
  new: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Sparkles },
  returning: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: RotateCcw },
  admin: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', icon: Shield },
}

export default function LiveUsersWidget() {
  const [sessions, setSessions] = useState<StoredSession[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const fetchLive = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/live-users', { cache: 'no-store' })
      if (res.ok) {
        const data: { sessions: StoredSession[] } = await res.json()
        setSessions(data.sessions ?? [])
        setLastRefresh(new Date())
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLive()
    // Auto-refresh every 30 seconds
    const timer = setInterval(fetchLive, 30_000)
    return () => clearInterval(timer)
  }, [])

  const DeviceIcon = (type: string) =>
    type === 'mobile' ? Smartphone : type === 'tablet' ? Tablet : Monitor

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f0f0f]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live Users
            <span className="text-xs text-gray-500 font-normal">
              ({sessions.length} in last 5 min)
            </span>
          </h2>
        </div>
        <button
          onClick={fetchLive}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw
            size={14}
            className={refreshing ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No active sessions right now.
        </p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          <AnimatePresence>
            {sessions.map((s) => {
              const style = TYPE_STYLES[s.visitor_type] ?? TYPE_STYLES.guest
              const TypeIcon = style.icon
              const Device = DeviceIcon(s.device.type)

              return (
                <motion.div
                  key={s.session_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-lg hover:border-indigo-500/30 transition group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {s.user_name?.charAt(0)?.toUpperCase() ||
                        s.user_email?.charAt(0)?.toUpperCase() ||
                        '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">
                        {s.user_name || s.user_email || 'Guest'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
                        >
                          <TypeIcon size={8} />
                          {s.visitor_type}
                        </span>
                        <Device size={9} />
                        <span>{s.device.os}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                    <span title="Page views">
                      <Eye size={11} className="inline mr-0.5" />
                      {s.page_view_count}
                    </span>
                    <span title="Products viewed">
                      <ShoppingCart size={11} className="inline mr-0.5" />
                      {s.product_view_count}
                    </span>
                    <Link
                      href={`/admin/sessions?id=${s.session_id}`}
                      className="text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition text-xs"
                    >
                      View
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <p className="text-[10px] text-gray-600 text-center mt-3">
        Auto-refreshing every 30s · Last: {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </motion.div>
  )
}