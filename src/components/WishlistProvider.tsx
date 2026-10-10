'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/providers/AuthProvider'
import { toggleWishlist, mergeWishlist } from '@/actions/wishlist'

interface WishlistContextValue {
  ids: Set<string>
  count: number
  isInWishlist: (productId: string) => boolean
  toggle: (productId: string) => Promise<void>
  loading: boolean
}

const WishlistContext = createContext<WishlistContextValue>({
  ids: new Set(),
  count: 0,
  isInWishlist: () => false,
  toggle: async () => {},
  loading: true,
})

export const useWishlist = () => useContext(WishlistContext)

const GUEST_KEY = 'wishlist'

export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // ─────────────────────────────────────────────
  // Load wishlist on auth change
  // ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      if (authLoading) return

      if (!user) {
        // Guest → read localStorage
        try {
          const raw = localStorage.getItem(GUEST_KEY)
          const arr: string[] = raw ? JSON.parse(raw) : []
          if (!cancelled) setIds(new Set(arr))
        } catch {
          if (!cancelled) setIds(new Set())
        }
        if (!cancelled) setLoading(false)
        return
      }

      // Logged in → merge guest wishlist if any, then load from server
      try {
        const guestRaw = localStorage.getItem(GUEST_KEY)
        if (guestRaw) {
          const guestIds: string[] = JSON.parse(guestRaw)
          if (guestIds.length > 0) {
            await mergeWishlist(guestIds)
          }
          localStorage.removeItem(GUEST_KEY)
        }
      } catch {
        // ignore merge errors
      }

      try {
        const res = await fetch('/api/wishlist/ids', { cache: 'no-store' })
        if (res.ok) {
          const data: { ids: string[] } = await res.json()
          if (!cancelled) setIds(new Set(data.ids))
        }
      } catch {
        if (!cancelled) setIds(new Set())
      }

      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const isInWishlist = useCallback(
    (productId: string) => ids.has(productId),
    [ids]
  )

  const toggle = useCallback(
    async (productId: string) => {
      if (!productId) return

      // Optimistic update
      const currentlyIn = ids.has(productId)
      const next = new Set(ids)
      if (currentlyIn) next.delete(productId)
      else next.add(productId)
      setIds(next)

      if (!user) {
        // Guest mode — just localStorage
        try {
          localStorage.setItem(GUEST_KEY, JSON.stringify(Array.from(next)))
        } catch {
          // ignore quota errors
        }
        toast.success(
          currentlyIn ? 'Removed from wishlist' : 'Added to wishlist'
        )
        return
      }

      // Logged in — persist to DB
      try {
        const result = await toggleWishlist(productId)
        toast.success(
          result.inWishlist ? 'Added to wishlist' : 'Removed from wishlist'
        )
      } catch (err) {
        // Rollback on error
        setIds(ids)
        const message =
          err instanceof Error ? err.message : 'Failed to update wishlist'
        toast.error(message)
      }
    },
    [ids, user]
  )

  return (
    <WishlistContext.Provider
      value={{
        ids,
        count: ids.size,
        isInWishlist,
        toggle,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}