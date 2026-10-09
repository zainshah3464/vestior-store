/**
 * Event tracking — shared types between client SDK and server API.
 */

export const TRACK_EVENTS = [
  'page_view',
  'product_view',
  'add_to_cart',
  'remove_from_cart',
  'checkout_started',
  'checkout_completed',
  'order_placed',
  'login',
  'signup',
  'search',
  'wishlist_add',
  'wishlist_remove',
  'share_product',
] as const

export type TrackEventName = (typeof TRACK_EVENTS)[number]

export interface TrackEvent {
  event: TrackEventName
  properties: Record<string, unknown>
}

export interface TrackPayload {
  sessionId: string
  events: TrackEvent[]
}

/**
 * Server-enriched event as stored in MongoDB.
 */
export interface StoredEvent {
  _id?: unknown
  user_id: string | null
  session_id: string
  event_type: TrackEventName
  properties: Record<string, unknown>
  ip_hash: string
  country: string | null
  city: string | null
  device: { type: string; os: string; browser: string }
  referrer: string | null
  path: string
  timestamp: Date
}