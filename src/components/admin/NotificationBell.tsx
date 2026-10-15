'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Inbox,
  Sparkles,
} from 'lucide-react'
import { useAdminNotifications } from './AdminNotificationsProvider'

export default function NotificationBell() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useAdminNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // ─────────────────────────────────────────────
  // Close on outside click — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ─────────────────────────────────────────────
  // ESC to close — new enhancement
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleClickNotification = (id: string, orderId: string) => {
    markAsRead(id)
    setOpen(false)
    router.push(`/admin/orders/${orderId}`)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* ═════════════════════════════════════════════
          Bell trigger button
         ═════════════════════════════════════════════ */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ''
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
      >
        <Bell size={18} aria-hidden="true" />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-lg shadow-red-500/40 border border-[#0A0A0A]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Live pulse when unread > 0 */}
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"
          />
        )}
      </motion.button>

      {/* ═════════════════════════════════════════════
          Dropdown panel
         ═════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            aria-label="Notifications"
            className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[72px] sm:top-auto mt-0 sm:mt-2 w-auto sm:w-[380px] z-[70] bg-[#0f0f0f]/98 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-[calc(100dvh-84px)] sm:max-h-none"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.06] blur-[100px]"
            />

            {/* Top accent line */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent opacity-60"
            />

            {/* ═════════════════════════════════════════════
                Header
               ═════════════════════════════════════════════ */}
            <header className="relative flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[13px] font-semibold text-white leading-tight">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-500/[0.15] text-indigo-300 border border-indigo-500/30 tabular-nums"
                  >
                    {unreadCount} new
                  </motion.span>
                )}
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    aria-label="Mark all as read"
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/[0.08] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                  >
                    <CheckCheck size={13} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    aria-label="Clear all notifications"
                    title="Clear all"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              )}
            </header>

            {/* ═════════════════════════════════════════════
                Notifications list
               ═════════════════════════════════════════════ */}
            <div className="relative max-h-[min(420px,calc(100dvh-200px))] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="relative mb-3">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-indigo-500/[0.1] blur-2xl"
                    />
                    <div className="relative w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <Bell
                        size={22}
                        className="text-gray-600"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <h4 className="text-[13px] font-semibold text-white mb-1">
                    No notifications yet
                  </h4>
                  <p className="text-[11px] text-gray-500 max-w-[240px] leading-relaxed">
                    You&apos;ll be notified here when new orders come in.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  <AnimatePresence initial={false}>
                    {notifications.map((n, idx) => (
                      <motion.button
                        key={n.id}
                        type="button"
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(idx * 0.02, 0.15),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        onClick={() =>
                          handleClickNotification(n.id, n.orderId)
                        }
                        role="menuitem"
                        className={`group relative w-full text-left p-3.5 hover:bg-white/[0.03] transition-colors duration-200 ${
                          !n.read ? 'bg-indigo-500/[0.04]' : ''
                        }`}
                      >
                        {/* Unread indicator bar */}
                        {!n.read && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                          />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Icon tile */}
                          <div
                            className={`relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                              n.type === 'order_placed'
                                ? 'bg-indigo-500/[0.1] border border-indigo-500/25'
                                : n.type === 'payment_completed'
                                ? 'bg-emerald-500/[0.1] border border-emerald-500/25'
                                : 'bg-red-500/[0.1] border border-red-500/25'
                            }`}
                          >
                            {n.type === 'order_placed' ? (
                              <Sparkles
                                size={13}
                                className="text-indigo-400"
                                aria-hidden="true"
                              />
                            ) : n.type === 'payment_completed' ? (
                              <CheckCheck
                                size={13}
                                className="text-emerald-400"
                                aria-hidden="true"
                              />
                            ) : (
                              <Bell
                                size={13}
                                className="text-red-400"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[12px] font-semibold text-white leading-snug pr-1">
                                {n.title}
                              </p>
                              {!n.read && (
                                <span
                                  aria-hidden="true"
                                  className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400"
                                />
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-snug mt-0.5">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-gray-600 mt-1.5 tabular-nums">
                              {new Date(n.createdAt).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ExternalLink
                            size={11}
                            className="flex-shrink-0 mt-1 text-gray-600 group-hover:text-indigo-400 transition-colors duration-200"
                            aria-hidden="true"
                          />
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════
                Footer
               ═════════════════════════════════════════════ */}
            {notifications.length > 0 && (
              <div className="relative px-3 py-2.5 border-t border-white/[0.06] bg-black/20">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    router.push('/admin/orders')
                  }}
                  className="group w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.06] transition-all duration-200"
                >
                  <Inbox size={11} aria-hidden="true" />
                  <span>View all orders</span>
                  <ExternalLink
                    size={10}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}