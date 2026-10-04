import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ────────────────────────────────────────────
// Redis client (edge-compatible)
// ────────────────────────────────────────────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// ────────────────────────────────────────────
// Tier definitions
// ────────────────────────────────────────────

// Brute-force protection for login/signup/oauth
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'ratelimit:auth',
})

// Admin panel — heavy operations
export const adminLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '60 s'),
  analytics: true,
  prefix: 'ratelimit:admin',
})

// Checkout / order placement — spam protection
export const orderLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: 'ratelimit:order',
})

// Search — DB query protection
export const searchLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'),
  analytics: true,
  prefix: 'ratelimit:search',
})

// Default — general page views
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'ratelimit:general',
})

// ────────────────────────────────────────────
// Helper: pick limiter + unique key based on route
// ────────────────────────────────────────────
export function getLimiterForPath(pathname: string) {
  if (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup') ||
    pathname.startsWith('/auth/callback')
  ) {
    return { limiter: authLimiter, name: 'auth' }
  }

  if (pathname.startsWith('/admin')) {
    return { limiter: adminLimiter, name: 'admin' }
  }

  if (pathname.startsWith('/checkout')) {
    return { limiter: orderLimiter, name: 'order' }
  }

  // Cart is stateful, treat like order-ish
  if (pathname.startsWith('/cart')) {
    return { limiter: orderLimiter, name: 'cart' }
  }

  // Any path with `?q=` query (search)
  // Fallback to general for other paths

  return { limiter: generalLimiter, name: 'general' }
}

// ────────────────────────────────────────────
// Extract stable client identifier from request
// Prefers user ID if authenticated, falls back to IP
// ────────────────────────────────────────────
export function getClientKey(
  ip: string | null,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`
  return `ip:${ip || 'unknown'}`
}