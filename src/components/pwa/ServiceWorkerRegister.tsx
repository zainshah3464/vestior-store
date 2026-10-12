'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker once on mount.
 *
 * • Only runs in production (SW can cause dev headaches with HMR)
 * • Skips registration if browser doesn't support it
 * • Checks for updates every hour
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return
    }

    let registration: ServiceWorkerRegistration | null = null
    let updateInterval: ReturnType<typeof setInterval> | null = null

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        console.log('[pwa] service worker registered')

        // Check for updates every hour
        updateInterval = setInterval(
          () => {
            registration?.update().catch(() => {})
          },
          60 * 60 * 1000
        )
      } catch (err) {
        console.error('[pwa] service worker registration failed:', err)
      }
    }

    // Wait for page load to avoid slowing down initial render
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
    }

    return () => {
      window.removeEventListener('load', register)
      if (updateInterval) clearInterval(updateInterval)
    }
  }, [])

  return null
}