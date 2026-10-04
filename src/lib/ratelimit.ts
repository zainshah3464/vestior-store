/**
 * Rate limiters — sliding-window algorithm via Upstash Redis.
 *
 * Design:
 *   • Different tiers for different route groups:
 *     auth, admin, orders, cart, search, track, general
 *   • Centralized Redis client from @/lib/redis (single source of truth)
 *   • Type-safe tier keys via LimiterTier
 *   • User-aware client identifier (user ID preferred over IP)
 *   • Fail-open: if Redis is down, requests are allowed (site stays up)
 *   • Direct limiter access for non-middleware usage (API routes)
 */

import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

// ─────────────────────────────────────────────────────────────
// Limiter tiers
// ─────────────────────────────────────────────────────────────
const limiters = {
  // ── Auth: strict brute-force protection (login/signup/oauth)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  // ── Admin: heavy operations
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '60 s'),
    analytics: true,
    prefix: 'ratelimit:admin',
  }),

  // ── Orders / checkout: strict spam protection
  orders: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: 'ratelimit:orders',
  }),

  // ── Cart: stateful but user-friendly (add/remove/update items)
  cart: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: true,
    prefix: 'ratelimit:cart',
  }),

  // ── Search: DB query protection
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: true,
    prefix: 'ratelimit:search',
  }),

  // ── Tracking ingestion (Phase 4): analytics events
  track: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '60 s'),
    analytics: true,
    prefix: 'ratelimit:track',
  }),

  // ── General: default page views (lenient)
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, '60 s'),
    analytics: true,
    prefix: 'ratelimit:general',
  }),
} as const

export type LimiterTier = keyof typeof limiters

// ─────────────────────────────────────────────────────────────
// Backward-compat named exports (purani File 1 style)
// ─────────────────────────────────────────────────────────────
export const authLimiter = limiters.auth
export const adminLimiter = limiters.admin
export const orderLimiter = limiters.orders
export const cartLimiter = limiters.cart
export const searchLimiter = limiters.search
export const trackLimiter = limiters.track
export const generalLimiter = limiters.general

// ─────────────────────────────────────────────────────────────
// Route → limiter mapping
// Order matters: most-specific routes first, general last
// ─────────────────────────────────────────────────────────────
export function getLimiterForPath(pathname: string): {
  limiter: Ratelimit
  name: LimiterTier
} {
  // Auth routes — strict (covers /auth/login, /auth/signup, /auth/callback, etc.)
  if (pathname.startsWith('/auth')) {
    return { limiter: limiters.auth, name: 'auth' }
  }

  // Admin routes — heavy operations
  if (pathname.startsWith('/admin')) {
    return { limiter: limiters.admin, name: 'admin' }
  }

  // Checkout + order placement — strict spam protection
  if (
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/api/orders') ||
    pathname.startsWith('/api/checkout')
  ) {
    return { limiter: limiters.orders, name: 'orders' }
  }

  // Cart — stateful, more lenient than orders
  if (pathname.startsWith('/cart') || pathname.startsWith('/api/cart')) {
    return { limiter: limiters.cart, name: 'cart' }
  }

  // Tracking ingestion (Phase 4)
  if (pathname.startsWith('/api/track')) {
    return { limiter: limiters.track, name: 'track' }
  }

  // Search — DB query protection
  if (
    pathname.startsWith('/search') ||
    pathname.startsWith('/api/search') ||
    pathname.startsWith('/api/products/search')
  ) {
    return { limiter: limiters.search, name: 'search' }
  }

  // Everything else — general browsing
  return { limiter: limiters.general, name: 'general' }
}

// ─────────────────────────────────────────────────────────────
// Client identifier — user-aware, falls back to IP
//
//   • Logged-in user → `user:<id>`  (fair across shared IPs)
//   • Anonymous     → `ip:<addr>`   (or `ip:unknown` fallback)
// ─────────────────────────────────────────────────────────────
export function getClientKey(
  ip: string | null,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`
  return `ip:${ip && ip.length > 0 ? ip : 'unknown'}`
}

// ─────────────────────────────────────────────────────────────
// Direct limiter access (for non-middleware usage — e.g., API routes)
//   Example:
//     const { success } = await limiters.track.limit(userKey)
// ─────────────────────────────────────────────────────────────
export { limiters }