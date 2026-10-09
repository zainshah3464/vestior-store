'use client'

/**
 * Client-side tracking SDK.
 *
 * Features:
 *   • Batches events every 10s (fewer network calls)
 *   • sendBeacon on unload so nothing is lost
 *   • Session ID stored in 24h cookie
 *   • Silent failure — never breaks the app
 */

import type { TrackEvent, TrackEventName, TrackPayload } from './types'

const SESSION_COOKIE = 'vst_sid'
const SESSION_TTL_DAYS = 1
const BATCH_SIZE = 10
const FLUSH_INTERVAL_MS = 10_000
const ENDPOINT = '/api/track'

function getOrCreateSessionId(): string {
  if (typeof document === 'undefined') return 'ssr'
  const existing = readCookie(SESSION_COOKIE)
  if (existing) return existing

  // crypto.randomUUID is supported in all modern browsers
  const sid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  writeCookie(SESSION_COOKIE, sid, SESSION_TTL_DAYS)
  return sid
}

function writeCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  )
  return match ? decodeURIComponent(match[1]) : null
}

class Tracker {
  private sessionId: string
  private queue: TrackEvent[] = []
  private timer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.sessionId = getOrCreateSessionId()
    this.timer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS)

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush(true))
      // Also flush when tab is hidden (mobile background)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.flush(true)
      })
    }
  }

  track(event: TrackEventName, properties: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return

    this.queue.push({
      event,
      properties: {
        ...properties,
        path: window.location.pathname,
        referrer: document.referrer || null,
        screen: `${window.screen.width}x${window.screen.height}`,
      },
    })

    if (this.queue.length >= BATCH_SIZE) this.flush()
  }

  async flush(sync = false) {
    if (this.queue.length === 0) return

    const payload: TrackPayload = {
      sessionId: this.sessionId,
      events: this.queue.splice(0),
    }

    const body = JSON.stringify(payload)

    // On page unload: use sendBeacon (survives navigation)
    if (sync && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon(ENDPOINT, body)
      } catch {
        // ignore
      }
      return
    }

    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      })
    } catch {
      // Never break the app because tracking failed
    }
  }

  destroy() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }
}

// Singleton (client-side only)
let trackerInstance: Tracker | null = null

export function getTracker(): Tracker | null {
  if (typeof window === 'undefined') return null
  if (!trackerInstance) {
    trackerInstance = new Tracker()
  }
  return trackerInstance
}

export function track(
  event: TrackEventName,
  properties: Record<string, unknown> = {}
) {
  getTracker()?.track(event, properties)
}

export type { Tracker }