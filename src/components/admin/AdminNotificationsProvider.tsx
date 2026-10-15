'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Bell, Sparkles, CheckCheck, ExternalLink } from 'lucide-react'

export interface AdminNotification {
  id: string
  orderId: string
  type: 'order_placed' | 'payment_completed' | 'order_cancelled'
  title: string
  message: string
  createdAt: string
  read: boolean
}

interface AdminNotificationsContextValue {
  notifications: AdminNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const AdminNotificationsContext = createContext<AdminNotificationsContextValue>(
  {
    notifications: [],
    unreadCount: 0,
    markAsRead: () => {},
    markAllAsRead: () => {},
    clearAll: () => {},
  }
)

export const useAdminNotifications = () =>
  useContext(AdminNotificationsContext)

const STORAGE_KEY = 'vestior-admin-notifications'
const MAX_NOTIFICATIONS = 30

/**
 * Play a short notification beep using the Web Audio API.
 * Preserved exactly.
 */
function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    const notes = [
      { freq: 523.25, start: 0, dur: 0.15 },
      { freq: 659.25, start: 0.13, dur: 0.22 },
    ]

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + start)
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + dur
      )
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur)
    })

    setTimeout(() => ctx.close().catch(() => {}), 800)
  } catch {
    // Silent fail
  }
}

/**
 * Ask for browser notification permission once.
 * Preserved exactly.
 */
async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  try {
    const result = await Notification.requestPermission()
    return result === 'granted'
  } catch {
    return false
  }
}

export default function AdminNotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabaseRef = useRef(createClient())
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [permissionGranted, setPermissionGranted] = useState(false)

  // ─────────────────────────────────────────────
  // Hydrate from localStorage — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: AdminNotification[] = JSON.parse(raw)
        setNotifications(parsed.slice(0, MAX_NOTIFICATIONS))
      }
    } catch {
      // ignore
    }
  }, [])

  // ─────────────────────────────────────────────
  // Persist on change — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS))
      )
    } catch {
      // ignore quota
    }
  }, [notifications])

  // ─────────────────────────────────────────────
  // Browser permission — preserved
  // ─────────────────────────────────────────────
  useEffect(() => {
    ensureNotificationPermission().then((granted) => {
      setPermissionGranted(granted)
    })
  }, [])

  // ─────────────────────────────────────────────
  // Add notification — REDESIGNED toast
  // ─────────────────────────────────────────────
  const addNotification = useCallback(
    (n: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
      const notification: AdminNotification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        read: false,
      }

      setNotifications((prev) =>
        [notification, ...prev].slice(0, MAX_NOTIFICATIONS)
      )

      // ─────────────────────────────────────────────
      // Premium custom toast
      // ─────────────────────────────────────────────
      const isOrderPlaced = notification.type === 'order_placed'
      const isPayment = notification.type === 'payment_completed'

      const toastIconBg = isOrderPlaced
        ? 'bg-indigo-500/[0.12] border-indigo-500/30'
        : isPayment
        ? 'bg-emerald-500/[0.12] border-emerald-500/30'
        : 'bg-red-500/[0.12] border-red-500/30'

      const toastIconColor = isOrderPlaced
        ? 'text-indigo-400'
        : isPayment
        ? 'text-emerald-400'
        : 'text-red-400'

      const toastBorder = isOrderPlaced
        ? 'border-l-indigo-500'
        : isPayment
        ? 'border-l-emerald-500'
        : 'border-l-red-500'

      const ToastIcon = isOrderPlaced
        ? Sparkles
        : isPayment
        ? CheckCheck
        : Bell

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-[#0f0f0f]/98 backdrop-blur-xl shadow-2xl shadow-black/60 rounded-2xl pointer-events-auto flex ring-1 ring-white/[0.08] border-l-[3px] ${toastBorder} overflow-hidden`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start gap-3">
                {/* Icon tile */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl ${toastIconBg} border flex items-center justify-center`}
                >
                  <ToastIcon
                    size={15}
                    className={toastIconColor}
                    aria-hidden="true"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white leading-tight">
                    {notification.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>

            {/* View action */}
            <div className="flex border-l border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id)
                  router.push(`/admin/orders/${notification.orderId}`)
                }}
                className="group w-full px-4 flex items-center justify-center text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.06] transition-all duration-200 focus:outline-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  View
                  <ExternalLink
                    size={10}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
          </div>
        ),
        { duration: 8000, position: 'top-right' }
      )

      // Sound — preserved
      playNotificationSound()

      // Browser notification — preserved
      if (permissionGranted && typeof Notification !== 'undefined') {
        try {
          const bn = new Notification(notification.title, {
            body: notification.message,
            icon: '/icon-192.png',
            tag: notification.orderId,
            requireInteraction: false,
          })
          bn.onclick = () => {
            window.focus()
            router.push(`/admin/orders/${notification.orderId}`)
            bn.close()
          }
        } catch {
          // ignore
        }
      }
    },
    [permissionGranted, router]
  )

  // ─────────────────────────────────────────────
  // Realtime subscription — preserved exactly
  // ─────────────────────────────────────────────
  useEffect(() => {
    const supabase = supabaseRef.current

    const channel = supabase
      .channel('admin-order-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as {
            id: string
            user_email: string
            total: number
            payment_provider: string | null
          }

          addNotification({
            orderId: order.id,
            type: 'order_placed',
            title: '🎉 New Order Received',
            message: `${order.user_email} placed order #${order.id
              .slice(0, 8)
              .toUpperCase()} · ₹${order.total.toLocaleString()}`,
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const old = payload.old as { payment_status?: string }
          const next = payload.new as {
            id: string
            payment_status: string
            user_email: string
            total: number
          }

          if (
            old?.payment_status !== 'completed' &&
            next.payment_status === 'completed'
          ) {
            addNotification({
              orderId: next.id,
              type: 'payment_completed',
              title: '✅ Payment Received',
              message: `Order #${next.id
                .slice(0, 8)
                .toUpperCase()} · ₹${next.total.toLocaleString()} paid`,
            })
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn(
            '[admin-notifications] realtime channel error — check that `orders` table has realtime enabled'
          )
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addNotification])

  // ─────────────────────────────────────────────
  // Actions — preserved
  // ─────────────────────────────────────────────
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AdminNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </AdminNotificationsContext.Provider>
  )
}