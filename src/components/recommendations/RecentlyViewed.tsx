'use client'

import { useEffect, useState } from 'react'
import RecommendedRow from './RecommendedRow'
import type { RecommendedProduct } from '@/lib/recommendations/queries'

const STORAGE_KEY = 'vestior-recently-viewed'
const MAX_RECENT = 12

export function trackViewed(productId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    const filtered = list.filter((id) => id !== productId)
    const next = [productId, ...filtered].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

export function getRecentlyViewedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Client-side Recently Viewed row.
 * Fetches product details for IDs from localStorage.
 */
export default function RecentlyViewed({
  excludeId,
}: {
  excludeId?: string
}) {
  const [products, setProducts] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getRecentlyViewedIds().filter((id) => id !== excludeId)
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    fetch(`/api/recommendations/recently-viewed?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data: { products: RecommendedProduct[] }) => {
        setProducts(data.products ?? [])
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [excludeId])

  if (loading || products.length === 0) return null

  return (
    <RecommendedRow
      title="Recently Viewed"
      subtitle="Pick up where you left off"
      products={products}
    />
  )
}