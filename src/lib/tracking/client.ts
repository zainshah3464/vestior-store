'use client'

/**
 * Client-side tracking SDK with session aggregation.
 *
 * Features:
 *   • Batches events every 10s (fewer network calls)
 *   • sendBeacon on unload
 *   • Session ID in 24h cookie
 *   • In-memory session summary (counts + arrays)
 *   • Silent failure — never breaks the app
 *
 * Session summary is sent with every batch. The server merges it
 * into a MongoDB `sessions` document (upsert by session_id).
 */

import type { TrackEvent, TrackEventName, TrackPayload } from './types'
import type { SessionUpdate } from './session-types'

const SESSION_COOKIE = 'vst_sid'
const SESSION_TTL_DAYS = 1
const BATCH_SIZE = 10
const FLUSH_INTERVAL_MS = 10_000
const ENDPOINT = '/api/track'
const MAX_PATHS = 50
const MAX_PRODUCTS = 50
const MAX_ORDERS = 20

// ─────────────────────────────────────────────────────────────
// Cookie helpers
// ─────────────────────────────────────────────────────────────
function getOrCreateSessionId(): string {
  if (typeof document === 'undefined') return 'ssr'
  const existing = readCookie(SESSION_COOKIE)
  if (existing) return existing

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

// ─────────────────────────────────────────────────────────────
// Session summary accumulator
// ─────────────────────────────────────────────────────────────
interface SessionSummary {
  pageViewCount: number
  productViewCount: number
  cartAddCount: number
  orderCount: number
  revenue: number
  pathsVisited: Set<string>
  productsViewed: Set<string>
  ordersPlaced: Set<string>
  durationMs: number
  // Last time the tab was visible
  lastVisibleAt: number
}

function createEmptySummary(): SessionSummary {
  return {
    pageViewCount: 0,
    productViewCount: 0,
    cartAddCount: 0,
    orderCount: 0,
    revenue: 0,
    pathsVisited: new Set(),
    productsViewed: new Set(),
    ordersPlaced: new Set(),
    durationMs: 0,
    lastVisibleAt:
      typeof document !== 'undefined' && document.visibilityState === 'visible'
        ? Date.now()
        : 0,
  }
}

// ─────────────────────────────────────────────────────────────
// Tracker
// ─────────────────────────────────────────────────────────────
class Tracker {
  private sessionId: string
  private queue: TrackEvent[] = []
  private summary: SessionSummary = createEmptySummary()
  private timer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.sessionId = getOrCreateSessionId()
    this.timer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS)

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush(true))

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // Accrue time up to now
          if (this.summary.lastVisibleAt > 0) {
            this.summary.durationMs += Date.now() - this.summary.lastVisibleAt
            this.summary.lastVisibleAt = 0
          }
          this.flush(true)
        } else {
          // Tab became visible again
          this.summary.lastVisibleAt = Date.now()
        }
      })
    }
  }

  private accumulate(event: TrackEventName, props: Record<string, unknown>) {
    const s = this.summary

    switch (event) {
      case 'page_view': {
        s.pageViewCount++
        const path = props.path as string | undefined
        if (path) {
          if (s.pathsVisited.size < MAX_PATHS) s.pathsVisited.add(path)
        }
        break
      }
      case 'product_view': {
        s.productViewCount++
        const pid = props.productId as string | undefined
        if (pid) {
          if (s.productsViewed.size < MAX_PRODUCTS) s.productsViewed.add(pid)
        }
        break
      }
      case 'add_to_cart': {
        s.cartAddCount++
        const pid = props.productId as string | undefined
        if (pid) {
          if (s.productsViewed.size < MAX_PRODUCTS) s.productsViewed.add(pid)
        }
        break
      }
      case 'order_placed': {
        s.orderCount++
        const orderId = props.orderId as string | undefined
        const total = Number(props.total ?? 0)
        if (orderId && s.ordersPlaced.size < MAX_ORDERS) {
          s.ordersPlaced.add(orderId)
        }
        if (Number.isFinite(total) && total > 0) {
          s.revenue += total
        }
        break
      }
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

    this.accumulate(event, properties)

    if (this.queue.length >= BATCH_SIZE) this.flush()
  }

  private buildSessionUpdate(): SessionUpdate {
    const s = this.summary

    // Include current visible slice
    let durationMs = s.durationMs
    if (s.lastVisibleAt > 0) {
      durationMs += Date.now() - s.lastVisibleAt
    }

    return {
      sessionId: this.sessionId,
      pageViewCount: s.pageViewCount,
      productViewCount: s.productViewCount,
      cartAddCount: s.cartAddCount,
      orderCount: s.orderCount,
      revenue: s.revenue,
      pathsVisited: Array.from(s.pathsVisited),
      productsViewed: Array.from(s.productsViewed),
      ordersPlaced: Array.from(s.ordersPlaced),
      durationMs,
    }
  }

  async flush(sync = false) {
    if (this.queue.length === 0) return

    const payload: TrackPayload = {
      sessionId: this.sessionId,
      events: this.queue.splice(0),
      sessionUpdate: this.buildSessionUpdate(),
    }

    const body = JSON.stringify(payload)

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
      // never break the app
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