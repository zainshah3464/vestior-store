'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Crown,
  Shield,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ShoppingCart,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  phone: string | null
  created_at: string
}

interface Props {
  profile: Profile
  sessions: StoredSession[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function UserActivityTimeline({ profile, sessions }: Props) {
  // Aggregate stats across sessions
  const totalSessions = sessions.length
  const totalPages = sessions.reduce((s, x) => s + (x.page_view_count ?? 0), 0)
  const totalProducts = sessions.reduce(
    (s, x) => s + (x.product_view_count ?? 0),
    0
  )
  const totalOrders = sessions.reduce((s, x) => s + (x.order_count ?? 0), 0)
  const totalRevenue = sessions.reduce((s, x) => s + (x.revenue ?? 0), 0)
  const totalTimeMs = sessions.reduce((s, x) => s + (x.duration_ms ?? 0), 0)

  const formatDuration = (ms: number) => {
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`
    const mins = Math.floor(ms / 60_000)
    const secs = Math.round((ms % 60_000) / 1000)
    return `${mins}m ${secs}s`
  }

  const DeviceIcon = (type: string) => {
    if (type === 'mobile') return Smartphone
    if (type === 'tablet') return Tablet
    return Monitor
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Back */}
      <motion.div variants={item}>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-4 transition text-sm"
        >
          <ArrowLeft size={14} />
          Back to Users
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {profile.full_name?.charAt(0)?.toUpperCase() ||
              profile.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">
              {profile.full_name || 'Unnamed User'}
            </h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Mail size={12} />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {profile.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Joined{' '}
                {new Date(profile.created_at).toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.role === 'admin'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {profile.role === 'admin' && <Crown size={10} />}
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Sessions', value: totalSessions, icon: Clock },
          { label: 'Page Views', value: totalPages, icon: Eye },
          { label: 'Product Views', value: totalProducts, icon: TrendingUp },
          { label: 'Orders', value: totalOrders, icon: ShoppingCart },
          {
            label: 'Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: CheckCircle2,
          },
          { label: 'Time Spent', value: formatDuration(totalTimeMs), icon: Clock },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-xl p-4"
          >
            <s.icon size={16} className="text-white/50 mb-2" />
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-lg font-bold text-white mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Session Timeline */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Session History
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Last {sessions.length} sessions (max 50)
          </p>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No tracked sessions yet.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {sessions.map((s, idx) => {
              const Device = DeviceIcon(s.device.type)
              const ended = s.ended_with
              const endedColors: Record<string, string> = {
                order: 'bg-emerald-500/20 text-emerald-400',
                abandon: 'bg-amber-500/20 text-amber-400',
                bounce: 'bg-gray-500/20 text-gray-400',
              }
              const endedStyle = ended
                ? endedColors[ended] ?? endedColors.bounce
                : endedColors.bounce

              return (
                <motion.div
                  key={s.session_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Device size={15} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-white font-medium">
                            {new Date(s.first_seen_at).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}{' '}
                            ·{' '}
                            {new Date(s.first_seen_at).toLocaleTimeString(
                              'en-GB',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                          {ended && (
                            <span
                              className={`px-2 py-0.5 text-[10px] rounded-full capitalize ${endedStyle}`}
                            >
                              {ended}
                            </span>
                          )}
                          {s.visitor_type === 'returning' && (
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-400">
                              returning
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                          <span>
                            <Eye size={10} className="inline mr-1" />
                            {s.page_view_count} pages
                          </span>
                          <span>
                            <ShoppingCart size={10} className="inline mr-1" />
                            {s.product_view_count} products
                          </span>
                          <span>
                            <Clock size={10} className="inline mr-1" />
                            {formatDuration(s.duration_ms)}
                          </span>
                          {s.referrer_source && s.referrer_source !== 'direct' && (
                            <span className="text-gray-500">
                              via {s.referrer_source}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {s.order_count > 0 && (
                      <span className="text-sm text-emerald-400 font-semibold">
                        {s.order_count}× order
                        {s.revenue > 0 &&
                          ` · ₹${s.revenue.toLocaleString()}`}
                      </span>
                    )}
                  </div>

                  {/* Paths visited (collapsed) */}
                  {s.paths_visited && s.paths_visited.length > 0 && (
                    <div className="mt-3 pl-12 flex flex-wrap gap-1.5">
                      {s.paths_visited.slice(0, 5).map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-black/30 border border-white/5 rounded text-[10px] text-gray-500 font-mono"
                        >
                          {p}
                        </span>
                      ))}
                      {s.paths_visited.length > 5 && (
                        <span className="text-[10px] text-gray-600">
                          +{s.paths_visited.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}