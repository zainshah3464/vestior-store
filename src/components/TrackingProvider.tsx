'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTracker, track } from '@/lib/tracking/client'

/**
 * Mounts once at the app root. Fires `page_view` on every route change
 * (Next.js App Router client navigation).
 */
export default function TrackingProvider() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialise tracker (creates session cookie if needed)
    getTracker()
  }, [])

  useEffect(() => {
    // Fire a page_view for the current route
    track('page_view', { path: pathname })
  }, [pathname])

  return null
}