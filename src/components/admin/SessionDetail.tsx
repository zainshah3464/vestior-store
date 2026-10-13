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
  Crown,
  Sparkles,
  RotateCcw,
  Shield,
  Hash,
} from 'lucide-react'
import type { StoredSession } from '@/lib/tracking/session-types'

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  guest: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Eye, label: 'Guest' },
  new: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Sparkles, label: 'New Visitor' },
  returning: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: RotateCcw, label: 'Returning' },
  admin: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', icon: Shield, label: 'Admin' },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function SessionDetail({ session }: { session: StoredSession }) {
  const style = TYPE_STYLES[session.visitor_type] ?? TYPE_STYLES.guest
  const TypeIcon = style.icon

  const deviceIcon =
    session.device.type === 'mobile'
      ? Smartphone
      : session.device.type === 'tablet'
      ? Tablet
      : Monitor
  const Device = deviceIcon

  const formatDuration = (ms: number) => {
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`
    const mins = Math.floor(ms / 60_000)
    const secs = Math.round((ms % 60_000) / 1000)
    return `${mins}m ${secs}s`
  }

  const firstSeen = new Date(session.first_seen_at)
  const lastSeen = new Date(session.last_seen_at)

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
          href="/admin/visitors"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-4 transition text-sm"
        >
          <ArrowLeft size={14} />
          Back to Visitors
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={item}
        className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {session.user_name?.charAt(0)?.toUpperCase() ||
                session.user_email?.charAt(0)?.toUpperCase() ||
                '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {session.user_name || session.user_email || 'Guest Visitor'}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                >
                  <TypeIcon size={11} />
                  {style.label}
                </span>
                {session.user_id && (
                  <Link
                    href={`/admin/users/${session.user_id}/activity`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                  >
                    <User size={11} />
                    View user profile
                    <ExternalLink size={9} />
                  </Link>
                )}
              </div>
              {session.user_email && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Mail size={11} />
                  {session.user_email}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Session ID</p>
            <p className="text-xs font-mono text-gray-300 mt-1">
              {session.session_id.slice(0, 8)}…{session.session_id.slice(-4)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Page Views', value: session.page_view_count, icon: Eye },
          { label: 'Products Viewed', value: session.product_view_count, icon: Eye },
          { label: 'Cart Adds', value: session.cart_add_count, icon: ShoppingCart },
          { label: 'Orders', value: session.order_count, icon: CheckCircle2 },
          {
            label: 'Revenue',
            value: `₹${(session.revenue ?? 0).toLocaleString()}`,
            icon: CheckCircle2,
          },
          { label: 'Duration', value: formatDuration(session.duration_ms), icon: Clock },
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

      {/* Session Meta */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl"
        >
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Session Timeline
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">First Seen</span>
              <span className="text-white">
                {firstSeen.toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Seen</span>
              <span className="text-white">
                {lastSeen.toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="text-white">{formatDuration(session.duration_ms)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ended With</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                  session.ended_with === 'order'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : session.ended_with === 'abandon'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {session.ended_with || 'bounce'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl"
        >
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Device className="w-4 h-4 text-indigo-400" />
            Device & Location
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Device</span>
              <span className="text-white capitalize flex items-center gap-1.5">
                <Device size={12} />
                {session.device.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">OS</span>
              <span className="text-white">{session.device.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Browser</span>
              <span className="text-white">{session.device.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Country</span>
              <span className="text-white flex items-center gap-1.5">
                <Globe size={12} />
                {session.country || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">City</span>
              <span className="text-white flex items-center gap-1.5">
                <MapPin size={12} />
                {session.city || 'Unknown'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referrer */}
      {session.referrer && (
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl"
        >
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            Referrer
          </h2>
          <div className="text-sm">
            <span className="text-gray-500">Source:</span>{' '}
            <span className="text-white capitalize">{session.referrer_source}</span>
          </div>
          <p className="text-xs text-gray-500 font-mono mt-2 break-all">
            {session.referrer}
          </p>
        </motion.div>
      )}

      {/* Paths visited */}
      {session.paths_visited && session.paths_visited.length > 0 && (
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-5 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              Paths Visited ({session.paths_visited.length})
            </h2>
          </div>
          <div className="p-5 space-y-2">
            {session.paths_visited.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm p-2 hover:bg-white/5 rounded-lg transition"
              >
                <span className="text-xs text-gray-600 font-mono w-6">
                  {i + 1}.
                </span>
                <span className="text-gray-300 font-mono text-xs break-all">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Products viewed */}
      {session.products_viewed && session.products_viewed.length > 0 && (
        <motion.div
          variants={item}
          className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-5 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              Products Viewed ({session.products_viewed.length})
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-2">
            {session.products_viewed.map((pid, i) => (
              <Link
                key={i}
                href={`/products/${pid}`}
                target="_blank"
                className="flex items-center justify-between p-2 bg-black/30 border border-white/5 rounded-lg hover:border-indigo-500/30 transition group"
              >
                <span className="text-xs text-gray-500 font-mono">
                  {pid.slice(0, 8)}…
                </span>
                <ExternalLink
                  size={12}
                  className="text-gray-600 group-hover:text-indigo-400 transition"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Orders placed */}
      {session.orders_placed && session.orders_placed.length > 0 && (
        <motion.div
          variants={item}
          className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-5 border-b border-emerald-500/20">
            <h2 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Orders Placed ({session.orders_placed.length})
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-2">
            {session.orders_placed.map((oid, i) => (
              <Link
                key={i}
                href={`/admin/orders/${oid}`}
                className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition group"
              >
                <span className="text-xs text-emerald-300 font-mono">
                  #{oid.slice(0, 8)}
                </span>
                <ExternalLink
                  size={12}
                  className="text-emerald-600 group-hover:text-emerald-400 transition"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}