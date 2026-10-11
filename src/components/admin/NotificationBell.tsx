'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
import { useAdminNotifications } from './AdminNotificationsProvider'

export default function NotificationBell() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useAdminNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
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

  const handleClickNotification = (id: string, orderId: string) => {
    markAsRead(id)
    setOpen(false)
    router.push(`/admin/orders/${orderId}`)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-[#0f0f0f]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs text-indigo-400">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="p-1.5 text-gray-400 hover:text-emerald-400 transition rounded-lg hover:bg-white/5 disabled:opacity-30"
                      aria-label="Mark all as read"
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition rounded-lg hover:bg-white/5"
                      aria-label="Clear all"
                      title="Clear all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell
                    size={28}
                    className="text-gray-600 mx-auto mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    You&apos;ll be notified when new orders come in
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleClickNotification(n.id, n.orderId)}
                      className={`w-full text-left p-4 hover:bg-white/5 transition group ${
                        !n.read ? 'bg-indigo-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white mb-0.5">
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1">
                            {new Date(n.createdAt).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <ExternalLink
                          size={12}
                          className="text-gray-600 group-hover:text-indigo-400 transition flex-shrink-0 mt-1"
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 bg-black/30">
                <button
                  onClick={() => {
                    setOpen(false)
                    router.push('/admin/orders')
                  }}
                  className="w-full text-xs text-indigo-400 hover:text-indigo-300 transition py-1"
                >
                  View all orders →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}