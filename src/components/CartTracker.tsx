'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Silent cart snapshotter.
 *
 * Debounced — only syncs 2s after the last cart change to avoid
 * hammering the API when a user clicks +/- repeatedly.
 *
 * Skips entirely when:
 *   • user is not logged in
 *   • cart is empty (server deletes any existing snapshot)
 */
export default function CartTracker() {
  const { user, loading } = useAuth()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (loading || !user) return

    const sync = () => {
      try {
        const raw = localStorage.getItem('cart')
        const cart = raw ? JSON.parse(raw) : []

        const items = Array.isArray(cart)
          ? cart.map((i: { id: string; name: string; price: number; quantity: number; images?: string[]; image?: string; size?: string | null }) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image ?? i.images?.[0] ?? null,
              size: i.size ?? null,
            }))
          : []

        fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
          keepalive: true,
        }).catch(() => {})
      } catch {
        // ignore
      }
    }

    const debouncedSync = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(sync, 2000)
    }

    // Initial sync
    sync()

    // Listen for changes
    window.addEventListener('cartUpdated', debouncedSync)
    window.addEventListener('beforeunload', sync)

    return () => {
      window.removeEventListener('cartUpdated', debouncedSync)
      window.removeEventListener('beforeunload', sync)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [user, loading])

  return null
}