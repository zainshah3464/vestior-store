/**
 * Upstash Redis client — HTTP-based, serverless-safe.
 *
 * Used for:
 *   • Rate limiting
 *   • Idempotency keys (payments, webhooks)
 *   • Dashboard cache
 *   • Live presence
 *   • Session/state that needs to survive function cold starts
 */

import { Redis } from '@upstash/redis'
import { env } from '@/lib/env'

// ─────────────────────────────────────────────────────────────
// Singleton — Upstash Redis client is safe to reuse.
// It's stateless HTTP; no connection pool to manage.
// ─────────────────────────────────────────────────────────────
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
  // Automatically deserialize JSON values
  automaticDeserialization: true,
})

// ─────────────────────────────────────────────────────────────
// Key builders — central place to avoid collisions & typos
// ─────────────────────────────────────────────────────────────
export const redisKeys = {
  // Rate limiting
  rateLimit: (route: string, key: string) => `rl:${route}:${key}`,

  // Idempotency (payments, webhooks)
  idempotency: (scope: string, id: string) => `idem:${scope}:${id}`,
  idempotencyResult: (scope: string, id: string) => `idem:result:${scope}:${id}`,

  // Cache
  dashboardCache: (metric: string) => `cache:dashboard:${metric}`,
  productCache: (id: string) => `cache:product:${id}`,

  // Presence
  onlineSession: (sid: string) => `online:${sid}`,

  // Throttling
  emailThrottle: (template: string, userId: string) =>
    `throttle:email:${template}:${userId}`,
  alertThrottle: (name: string) => `throttle:alert:${name}`,

  // Counters
  productViewCount: (productId: string) => `pv:${productId}`,
} as const

// ─────────────────────────────────────────────────────────────
// Convenience helpers (used across the app)
// ─────────────────────────────────────────────────────────────

/**
 * Set a value only if the key does NOT already exist.
 * Returns true if the key was newly set, false if it already existed.
 *
 *   const isFirst = await setNx('idem:order:123', '1', 86400)
 *   if (!isFirst) return { duplicate: true }
 */
export async function setNx(
  key: string,
  value: string | number,
  ttlSeconds?: number
): Promise<boolean> {
  const result = ttlSeconds
    ? await redis.set(key, value, { nx: true, ex: ttlSeconds })
    : await redis.set(key, value, { nx: true })
  return result === 'OK'
}

/**
 * Read + parse a JSON value with a fallback.
 */
export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await redis.get<T>(key)
  return raw ?? null
}

/**
 * Cache with automatic TTL. Returns the cached value or the fresh value.
 *
 *   const stats = await cached('dashboard:today', 300, () => fetchStats())
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await redis.get<T>(key)
  if (hit !== null && hit !== undefined) return hit

  const fresh = await fetcher()
  // Fire-and-forget write; don't block the response
  redis.set(key, fresh, { ex: ttlSeconds }).catch((err) => {
    console.error('[redis] cache write failed:', err)
  })
  return fresh
}

/**
 * Invalidate one or more cache keys.
 */
export async function invalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return
  await redis.del(...keys)
}