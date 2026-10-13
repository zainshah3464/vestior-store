/**
 * Session tracking — shared types.
 *
 * A "session" is one browser tab's continuous interaction from
 * arrival to inactivity. We store one document per session in
 * MongoDB with a full activity summary.
 *
 * Sessions are the source of truth for:
 *   • User activity timeline (/admin/users/[id]/activity)
 *   • Visitors list (/admin/visitors)
 *   • Session drill-down (/admin/sessions)
 *   • Live users widget
 *   • New vs returning classification
 */

export type VisitorType = 'guest' | 'new' | 'returning' | 'admin'

export type ReferrerSource =
  | 'google'
  | 'bing'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'whatsapp'
  | 'linkedin'
  | 'youtube'
  | 'direct'
  | 'internal'
  | 'other'

export type SessionEndedWith = 'order' | 'abandon' | 'bounce' | null

/**
 * What the client sends to /api/track on each batch.
 * The server merges this into the session document.
 */
export interface SessionUpdate {
  sessionId: string
  pageViewCount: number
  productViewCount: number
  cartAddCount: number
  orderCount: number
  revenue: number
  /** Unique paths visited in this session */
  pathsVisited: string[]
  /** Unique product IDs viewed */
  productsViewed: string[]
  /** Order IDs placed this session */
  ordersPlaced: string[]
  /** Total active duration in ms (sum of visible time) */
  durationMs: number
}

/**
 * The full document stored in MongoDB `sessions`.
 */
export interface StoredSession {
  _id?: unknown
  session_id: string
  user_id: string | null
  user_email: string | null
  user_name: string | null
  visitor_type: VisitorType
  ip_hash: string
  country: string | null
  city: string | null
  device: { type: string; os: string; browser: string }
  referrer: string | null
  referrer_source: ReferrerSource
  first_seen_at: Date
  last_seen_at: Date
  duration_ms: number
  page_view_count: number
  product_view_count: number
  cart_add_count: number
  order_count: number
  revenue: number
  paths_visited: string[]
  products_viewed: string[]
  orders_placed: string[]
  ended_with: SessionEndedWith
}