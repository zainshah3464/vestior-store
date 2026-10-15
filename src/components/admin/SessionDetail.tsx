'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Mail,
  Eye,
  ShoppingCart,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Shield,
  Hash,
  Crown,
  Activity,
  Timer,
  DollarSign,
  MousePointerClick,
  Layers,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

// ─────────────────────────────────────────────
// Visitor type styling — extended with border + label
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
    label: 'New Visitor',
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
// Device icon resolver — module-level component
// (avoids react-hooks/static-components violation)
// ─────────────────────────────────────────────
function DeviceIcon({
  type,
  size = 14,
  className,
}: {
  type: string
  size?: number
  className?: string
}) {
  const t = (type || '').toLowerCase()
  if (t === 'mobile') {
    return <Smartphone size={size} className={className} aria-hidden="true" />
  }
  if (t === 'tablet') {
    return <Tablet size={size} className={className} aria-hidden="true" />
  }
  return <Monitor size={size} className={className} aria-hidden="true" />
}

// ─────────────────────────────────────────────
// Ended with styling
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
    label: 'Order placed',
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

export default function SessionDetail({
  session,
}: {
  session: StoredSession
}) {
  const typeStyle = TYPE_STYLES[session.visitor_type] ?? TYPE_STYLES.guest
  const TypeIcon = typeStyle.icon

  const formatDuration = (ms: number) => {
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`
    const mins = Math.floor(ms / 60_000)
    const secs = Math.round((ms % 60_000) / 1000)
    return `${mins}m ${secs}s`
  }

  const firstSeen = new Date(session.first_seen_at)
  const lastSeen = new Date(session.last_seen_at)

  const endedKey = session.ended_with ?? 'bounce'
  const endedStyle = ENDED_STYLES[endedKey] ?? DEFAULT_ENDED

  const displayName =
    session.user_name || session.user_email || 'Guest Visitor'
  const initial =
    session.user_name?.charAt(0)?.toUpperCase() ||
    session.user_email?.charAt(0)?.toUpperCase() ||
    '?'

  // ─────────────────────────────────────────────
  // Stat cards — 6 key metrics
  // ─────────────────────────────────────────────
  const statCards = [
    {
      label: 'Page Views',
      value: session.page_view_count,
      icon: Eye,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Products Viewed',
      value: session.product_view_count,
      icon: MousePointerClick,
      accent: 'border-l-blue-500',
      glow: 'bg-blue-500/[0.06]',
      iconBg: 'bg-blue-500/[0.1]',
      iconText: 'text-blue-400',
    },
    {
      label: 'Cart Adds',
      value: session.cart_add_count,
      icon: ShoppingCart,
      accent: 'border-l-violet-500',
      glow: 'bg-violet-500/[0.06]',
      iconBg: 'bg-violet-500/[0.1]',
      iconText: 'text-violet-400',
    },
    {
      label: 'Orders',
      value: session.order_count,
      icon: CheckCircle2,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Revenue',
      value: `₹${(session.revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      accent: 'border-l-teal-500',
      glow: 'bg-teal-500/[0.06]',
      iconBg: 'bg-teal-500/[0.1]',
      iconText: 'text-teal-400',
    },
    {
      label: 'Duration',
      value: formatDuration(session.duration_ms),
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
          href="/admin/visitors"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Visitors
        </Link>
      </motion.div>

      {/* ═════════════════════════════════════════════
          Header hero
         ═════════════════════════════════════════════ */}
      <motion.section
        variants={item}
        aria-label="Session overview"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-5 sm:p-6"
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-indigo-500/[0.06] blur-[110px]"
        />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          {/* Left: avatar + identity */}
          <div className="flex items-start gap-4 min-w-0">
            {/* Avatar */}
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold ring-1 ring-white/[0.08] flex-shrink-0 shadow-2xl shadow-indigo-500/25"
              aria-hidden="true"
            >
              {initial}
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#131313]" />
            </div>

            {/* Identity */}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] leading-tight truncate">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* Visitor type badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                >
                  <TypeIcon size={10} aria-hidden="true" />
                  {typeStyle.label}
                </span>

                {/* View profile link */}
                {session.user_id && (
                  <Link
                    href={`/admin/users/${session.user_id}/activity`}
                    className="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/[0.1] text-blue-300 border border-blue-500/25 hover:bg-blue-500/[0.15] hover:border-blue-500/40 transition-all duration-200"
                  >
                    <User size={10} aria-hidden="true" />
                    View Profile
                    <ExternalLink
                      size={9}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>

              {session.user_email && (
                <p className="text-[11px] sm:text-[12px] text-gray-500 mt-2 flex items-center gap-1.5 truncate">
                  <Mail
                    size={11}
                    className="text-gray-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{session.user_email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right: session ID */}
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-600">
              Session ID
            </p>
            <p className="text-[11px] font-mono text-gray-400 mt-1 tabular-nums">
              {session.session_id.slice(0, 8)}
              <span className="text-gray-600">…</span>
              {session.session_id.slice(-4)}
            </p>
          </div>
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
              {/* Left accent */}
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full ${s.accent}`}
              />
              {/* Glow */}
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
          Timeline + Device
         ═════════════════════════════════════════════ */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Timeline */}
        <motion.section
          variants={item}
          aria-label="Session timeline"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-[200px] h-[200px] bg-indigo-500/[0.05] blur-[90px]"
          />

          <div className="relative flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center">
              <Clock
                size={14}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-white leading-tight">
                Session Timeline
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                When this visit happened
              </p>
            </div>
          </div>

          <div className="relative space-y-3 text-[12px]">
            <InfoRow
              label="First Seen"
              value={firstSeen.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
            <InfoRow
              label="Last Seen"
              value={lastSeen.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
            <InfoRow
              label="Duration"
              value={formatDuration(session.duration_ms)}
            />
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="text-gray-500">Ended With</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${endedStyle.bg} ${endedStyle.text} ${endedStyle.border}`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${endedStyle.dot}`}
                  aria-hidden="true"
                />
                {endedStyle.label}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Device & Location */}
        <motion.section
          variants={item}
          aria-label="Device and location"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-[200px] h-[200px] bg-blue-500/[0.05] blur-[90px]"
          />

          <div className="relative flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
              <DeviceIcon
                type={session.device.type}
                size={14}
                className="text-blue-400"
              />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-white leading-tight">
                Device &amp; Location
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Environment this session ran in
              </p>
            </div>
          </div>

          <div className="relative space-y-3 text-[12px]">
            <InfoRow
              label="Device"
              value={session.device.type}
              capitalize
              iconNode={
                <DeviceIcon
                  type={session.device.type}
                  size={11}
                  className="text-gray-500"
                />
              }
            />
            <InfoRow label="OS" value={session.device.os} />
            <InfoRow label="Browser" value={session.device.browser} />
            <InfoRow
              label="Country"
              value={session.country || 'Unknown'}
              icon={Globe}
            />
            <InfoRow
              label="City"
              value={session.city || 'Unknown'}
              icon={MapPin}
            />
          </div>
        </motion.section>
      </div>

      {/* ═════════════════════════════════════════════
          Referrer
         ═════════════════════════════════════════════ */}
      {session.referrer && (
        <motion.section
          variants={item}
          aria-label="Referrer"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-4 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-[200px] h-[200px] bg-violet-500/[0.05] blur-[90px]"
          />

          <div className="relative flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/[0.1] border border-violet-500/25 flex items-center justify-center">
              <ExternalLink
                size={14}
                className="text-violet-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-white leading-tight">
                Referrer
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                How this visitor arrived
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
              Source
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-violet-500/[0.1] text-violet-300 border border-violet-500/25 capitalize">
              <Globe size={9} aria-hidden="true" />
              {session.referrer_source}
            </span>
          </div>

          <p className="relative text-[11px] text-gray-400 font-mono bg-black/30 border border-white/[0.04] rounded-xl p-3 break-all leading-relaxed">
            {session.referrer}
          </p>
        </motion.section>
      )}

      {/* ═════════════════════════════════════════════
          Paths Visited
         ═════════════════════════════════════════════ */}
      {session.paths_visited && session.paths_visited.length > 0 && (
        <motion.section
          variants={item}
          aria-label="Paths visited"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                <Layers
                  size={14}
                  className="text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-white leading-tight">
                  Paths Visited
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                  {session.paths_visited.length} unique path
                  {session.paths_visited.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-3 sm:p-4 space-y-1 max-h-72 overflow-y-auto overscroll-contain">
            {session.paths_visited.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.25),
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[10px] font-mono text-gray-500 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-[11px] text-gray-300 font-mono break-all leading-relaxed">
                  {p}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ═════════════════════════════════════════════
          Products Viewed
         ═════════════════════════════════════════════ */}
      {session.products_viewed && session.products_viewed.length > 0 && (
        <motion.section
          variants={item}
          aria-label="Products viewed"
          className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
        >
          <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                <ShoppingCart
                  size={14}
                  className="text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-white leading-tight">
                  Products Viewed
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                  {session.products_viewed.length} unique product
                  {session.products_viewed.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {session.products_viewed.map((pid, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.25),
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/products/${pid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-200"
                  aria-label={`View product ${pid.slice(0, 8)}`}
                >
                  <span className="text-[11px] text-gray-400 font-mono tabular-nums truncate">
                    {pid.slice(0, 8)}
                    <span className="text-gray-600">…</span>
                  </span>
                  <ExternalLink
                    size={11}
                    className="flex-shrink-0 text-gray-600 group-hover:text-blue-400 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ═════════════════════════════════════════════
          Orders Placed
         ═════════════════════════════════════════════ */}
      {session.orders_placed && session.orders_placed.length > 0 && (
        <motion.section
          variants={item}
          aria-label="Orders placed"
          className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.03] to-[#0e0e0e]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-emerald-500/[0.08] blur-[100px]"
          />

          <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-emerald-500/[0.15]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/[0.12] border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-emerald-300 leading-tight">
                  Orders Placed
                </h2>
                <p className="text-[10px] text-emerald-400/70 mt-0.5 tabular-nums">
                  {session.orders_placed.length} order
                  {session.orders_placed.length === 1 ? '' : 's'} from this
                  session
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {session.orders_placed.map((oid, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.25),
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/admin/orders/${oid}`}
                  className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 hover:bg-emerald-500/[0.15] hover:border-emerald-500/40 transition-all duration-200"
                  aria-label={`View order ${oid.slice(0, 8)}`}
                >
                  <span className="text-[11px] text-emerald-300 font-mono font-semibold tabular-nums truncate">
                    #{oid.slice(0, 8)}
                  </span>
                  <ExternalLink
                    size={11}
                    className="flex-shrink-0 text-emerald-600 group-hover:text-emerald-300 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// InfoRow helper — used in timeline + device
// ─────────────────────────────────────────────
function InfoRow({
  label,
  value,
  icon: Icon,
  iconNode,
  capitalize,
}: {
  label: string
  value: string | number
  icon?: React.ElementType
  iconNode?: React.ReactNode
  capitalize?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 text-white font-medium tabular-nums truncate ${
          capitalize ? 'capitalize' : ''
        }`}
      >
        {iconNode}
        {Icon && (
          <Icon
            size={11}
            className="text-gray-500 flex-shrink-0"
            aria-hidden="true"
          />
        )}
        {value}
      </span>
    </div>
  )
}