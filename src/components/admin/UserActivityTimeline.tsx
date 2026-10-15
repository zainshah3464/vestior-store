'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Crown,
  Shield,
  User,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ShoppingCart,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  Timer,
  DollarSign,
  ExternalLink,
  MousePointerClick,
  Globe,
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

// ─────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─────────────────────────────────────────────
// Ended-with styling
// ─────────────────────────────────────────────
const ENDED_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  order: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
    label: 'Order',
  },
  abandon: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
    label: 'Abandoned',
  },
  bounce: {
    bg: 'bg-gray-500/[0.1]',
    text: 'text-gray-300',
    border: 'border-gray-500/25',
    dot: 'bg-gray-400',
    label: 'Bounced',
  },
}

const DEFAULT_ENDED = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
  label: 'Bounced',
}

// ─────────────────────────────────────────────
// Device icon resolver
// ─────────────────────────────────────────────
function getDeviceIcon(type: string): React.ElementType {
  const t = (type || '').toLowerCase()
  if (t === 'mobile') return Smartphone
  if (t === 'tablet') return Tablet
  return Monitor
}

export default function UserActivityTimeline({
  profile,
  sessions,
}: Props) {
  // Aggregate stats — preserved
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

  const initial =
    profile.full_name?.charAt(0)?.toUpperCase() ||
    profile.email.charAt(0).toUpperCase()

  const isAdmin = profile.role === 'admin'

  // ─────────────────────────────────────────────
  // Stat cards — 6 metrics
  // ─────────────────────────────────────────────
  const statCards = [
    {
      label: 'Sessions',
      value: totalSessions.toLocaleString(),
      icon: Layers,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Page Views',
      value: totalPages.toLocaleString(),
      icon: Eye,
      accent: 'border-l-blue-500',
      glow: 'bg-blue-500/[0.06]',
      iconBg: 'bg-blue-500/[0.1]',
      iconText: 'text-blue-400',
    },
    {
      label: 'Product Views',
      value: totalProducts.toLocaleString(),
      icon: MousePointerClick,
      accent: 'border-l-violet-500',
      glow: 'bg-violet-500/[0.06]',
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
    },
    {
      label: 'Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      accent: 'border-l-teal-500',
      glow: 'bg-teal-500/[0.06]',
      iconBg: 'bg-teal-500/[0.1]',
      iconText: 'text-teal-400',
    },
    {
      label: 'Time Spent',
      value: formatDuration(totalTimeMs),
      icon: Timer,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6"
    >
      {/* ═════════════════════════════════════════════
          Back link
         ═════════════════════════════════════════════ */}
      <motion.div variants={item}>
        <Link
          href="/admin/users"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Users
        </Link>
      </motion.div>

      {/* ═════════════════════════════════════════════
          Profile header hero
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="User overview"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-5 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-indigo-500/[0.06] blur-[110px]"
        />

        <div className="relative flex items-start gap-4 flex-wrap">
          {/* Avatar */}
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold ring-1 ring-white/[0.08] flex-shrink-0 shadow-2xl shadow-indigo-500/25"
            aria-hidden="true"
          >
            {initial}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#131313]" />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] leading-tight truncate">
              {profile.full_name || 'Unnamed User'}
            </h1>

            {/* Contact + join date row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1.5 truncate">
                <Mail
                  size={11}
                  className="text-gray-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{profile.email}</span>
              </span>
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone
                    size={11}
                    className="text-gray-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="tabular-nums">{profile.phone}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar
                  size={11}
                  className="text-gray-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="tabular-nums">
                  Joined{' '}
                  {new Date(profile.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-2 mt-3">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/[0.1] text-indigo-300 border border-indigo-500/25">
                  <Shield size={10} aria-hidden="true" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/[0.1] text-emerald-300 border border-emerald-500/25">
                  <span
                    className="w-1 h-1 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  Customer
                </span>
              )}
            </div>
          </div>

          {/* Session count */}
          {totalSessions > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-600">
                Tracked Sessions
              </p>
              <p className="text-lg font-bold text-white mt-0.5 tabular-nums">
                {totalSessions.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ═════════════════════════════════════════════
          Stat cards (6)
         ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 rounded-2xl transition-colors duration-300"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full ${s.accent}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-12 -right-12 w-[100px] h-[100px] ${s.glow} blur-[60px]`}
              />
              <div className="relative pl-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${s.iconBg} border border-white/[0.06] flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={12} className={s.iconText} aria-hidden="true" />
                </div>
                <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                  {s.label}
                </p>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5 tabular-nums tracking-tight truncate">
                  {s.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════
          Session History
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="Session history"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
              <Clock
                size={14}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Session History
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                Last {sessions.length} session
                {sessions.length === 1 ? '' : 's'} (max 50)
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <Layers
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <p className="text-[13px] font-semibold text-white mb-1">
              No tracked sessions yet
            </p>
            <p className="text-[12px] text-gray-500 max-w-xs">
              Activity will appear here once this user browses the storefront.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {sessions.map((s, idx) => {
              const Device = getDeviceIcon(s.device.type)
              const endedKey = s.ended_with ?? 'bounce'
              const endedStyle = ENDED_STYLES[endedKey] ?? DEFAULT_ENDED

              return (
                <motion.div
                  key={s.session_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(idx * 0.03, 0.25),
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    {/* Left: device + date */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <Device
                          size={14}
                          className="text-gray-400"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] text-white font-semibold tabular-nums">
                            {new Date(s.first_seen_at).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full bg-gray-700"
                            aria-hidden="true"
                          />
                          <span className="text-[11px] text-gray-500 tabular-nums">
                            {new Date(s.first_seen_at).toLocaleTimeString(
                              'en-GB',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>

                          {/* Ended-with badge */}
                          {s.ended_with && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${endedStyle.bg} ${endedStyle.text} ${endedStyle.border}`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${endedStyle.dot}`}
                                aria-hidden="true"
                              />
                              {endedStyle.label}
                            </span>
                          )}

                          {/* Returning badge */}
                          {s.visitor_type === 'returning' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-blue-500/[0.1] text-blue-300 border border-blue-500/25">
                              <Globe size={8} aria-hidden="true" />
                              Returning
                            </span>
                          )}
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 flex-wrap tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Eye
                              size={10}
                              className="text-indigo-400"
                              aria-hidden="true"
                            />
                            {s.page_view_count} page
                            {s.page_view_count === 1 ? '' : 's'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ShoppingCart
                              size={10}
                              className="text-blue-400"
                              aria-hidden="true"
                            />
                            {s.product_view_count} product
                            {s.product_view_count === 1 ? '' : 's'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Timer
                              size={10}
                              className="text-amber-400"
                              aria-hidden="true"
                            />
                            {formatDuration(s.duration_ms)}
                          </span>
                          {s.referrer_source &&
                            s.referrer_source !== 'direct' && (
                              <span className="inline-flex items-center gap-1 text-gray-500">
                                <Globe size={9} aria-hidden="true" />
                                via {s.referrer_source}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Right: order info */}
                    {s.order_count > 0 && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] font-semibold text-emerald-300 tabular-nums">
                          {s.order_count}× order
                          {s.order_count === 1 ? '' : 's'}
                        </p>
                        {s.revenue > 0 && (
                          <p className="text-[10px] text-emerald-400/70 mt-0.5 tabular-nums">
                            ₹{s.revenue.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Paths visited */}
                  {s.paths_visited && s.paths_visited.length > 0 && (
                    <div className="pl-12 flex flex-wrap gap-1.5">
                      {s.paths_visited.slice(0, 5).map((p, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 bg-white/[0.02] border border-white/[0.06] rounded-md text-[10px] text-gray-500 font-mono tracking-wide max-w-[240px] truncate"
                        >
                          {p}
                        </span>
                      ))}
                      {s.paths_visited.length > 5 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] text-gray-600 tabular-nums">
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
      </motion.section>
    </motion.div>
  )
}