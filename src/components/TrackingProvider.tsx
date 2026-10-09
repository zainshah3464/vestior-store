'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTracker, track } from '@/lib/tracking/client'

// Routes that should NOT be tracked (admin, api, auth callbacks)
const SKIP_PREFIXES = ['/admin', '/api/', '/auth/callback']

export default function TrackingProvider() {
  const pathname = usePathname()

  useEffect(() => {
    getTracker()
  }, [])

  useEffect(() => {
    // Skip tracking for admin and internal routes
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return

    track('page_view', { path: pathname })
  }, [pathname])

  return null
}