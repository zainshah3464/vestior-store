/**
 * Idempotency helper — prevents duplicate processing of the same operation.
 *
 * Used in Phase 2 for:
 *   • Stripe webhooks (payment_intent.succeeded)
 *   • PayPal webhooks
 *   • Order placement retries
 *
 * Pattern: Redis SETNX + result cache, with owner-checked release.
 */

import { redis } from '@/lib/redis'
import { redisKeys } from '@/lib/redis'
import { randomUUID } from 'crypto'

export interface IdempotencyOptions {
  /** Unique key suffix (e.g., webhook event ID) */
  key: string
  /** Logical scope (e.g., 'stripe', 'paypal', 'order') */
  scope: string
  /** TTL in seconds (default 24 hours) */
  ttlSeconds?: number
}

/**
 * Execute `fn` at most once per (scope, key) within the TTL window.
 *
 *   const result = await withIdempotency(
 *     { scope: 'stripe', key: event.id },
 *     async () => {
 *       await updateOrder(event.data.metadata.orderId)
 *       return { ok: true }
 *     }
 *   )
 */
export async function withIdempotency<T>(
  { key, scope, ttlSeconds = 86_400 }: IdempotencyOptions,
  fn: () => Promise<T>
): Promise<T> {
  const lockKey = redisKeys.idempotency(scope, key)
  const resultKey = redisKeys.idempotencyResult(scope, key)
  const lockValue = randomUUID()

  // Try to acquire the lock
  const acquired = await redis.set(lockKey, lockValue, {
    nx: true,
    ex: ttlSeconds,
  })

  if (acquired !== 'OK') {
    // Someone else processed (or is processing) this operation.
    // If a cached result exists, return it. Otherwise throw.
    const cached = await redis.get<T>(resultKey)
    if (cached !== null && cached !== undefined) return cached

    throw new Error(
      `Operation already in progress or processed (scope=${scope}, key=${key})`
    )
  }

  try {
    const result = await fn()
    // Cache the result for future duplicate calls
    await redis.set(resultKey, result, { ex: ttlSeconds })
    return result
  } finally {
    // Release lock only if we still own it (avoid race with TTL expiry)
    const current = await redis.get<string>(lockKey)
    if (current === lockValue) {
      await redis.del(lockKey)
    }
  }
}

/**
 * Check if a key was already processed — without running anything.
 */
export async function wasProcessed(
  scope: string,
  key: string
): Promise<boolean> {
  const result = await redis.get(redisKeys.idempotencyResult(scope, key))
  return result !== null && result !== undefined
}