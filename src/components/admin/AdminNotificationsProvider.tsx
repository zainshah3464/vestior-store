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
import { Bell } from 'lucide-react'

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

const AdminNotificationsContext = createContext<AdminNotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
})

export const useAdminNotifications = () =>
  useContext(AdminNotificationsContext)

const STORAGE_KEY = 'vestior-admin-notifications'
const MAX_NOTIFICATIONS = 30

/**
 * Play a short notification beep using the Web Audio API.
 * No external file needed — pure browser synthesis.
 */
function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    // Two-tone chime: C5 → E5
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

    // Close the context after the sound finishes
    setTimeout(() => ctx.close().catch(() => {}), 800)
  } catch {
    // Silent fail — sound is a nice-to-have
  }
}

/**
 * Ask for browser notification permission once.
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
  // Hydrate from localStorage
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
  // Persist on change
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
  // Browser permission
  // ─────────────────────────────────────────────
  useEffect(() => {
    ensureNotificationPermission().then((granted) => {
      setPermissionGranted(granted)
    })
  }, [])

  const addNotification = useCallback(
    (n: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
      const notification: AdminNotification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        read: false,
      }

      setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS))

      // Toast
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-[#0f0f0f] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-white/10 border-l-4 border-indigo-500`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Bell className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/10">
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  router.push(`/admin/orders/${notification.orderId}`)
                }}
                className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-xs font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none"
              >
                View
              </button>
            </div>
          </div>
        ),
        { duration: 8000, position: 'top-right' }
      )

      // Sound
      playNotificationSound()

      // Browser notification
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
  // Realtime subscription
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

          // Only notify on payment_status → completed transitions
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
  // Actions
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