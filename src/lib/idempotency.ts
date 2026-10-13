/**
 * Idempotency helper — prevents duplicate processing of the same operation.
 *
 * Used for:
 *   • Stripe webhooks (payment_intent.succeeded)
 *   • PayPal webhooks
 *   • Order placement retries
 *
 * Pattern: Redis SETNX + result cache, with owner-checked release
 * via atomic Lua script (compare-and-delete).
 *
 * ─── Why Lua, not GET-then-DEL? ──────────────────────────────
 * The naive release:
 *
 *     const current = await redis.get(lockKey)
 *     if (current === lockValue) await redis.del(lockKey)
 *
 * is a check-then-act race. Between the GET and the DEL, the lock
 * may expire and another process may acquire a NEW lock. We would
 * then delete the OTHER process's lock, breaking mutual exclusion
 * and allowing duplicate processing (e.g., a Stripe webhook firing
 * twice).
 *
 * The Lua script below performs GET and DEL atomically inside Redis,
 * so no other command can interleave between them.
 */

import { redis, redisKeys } from '@/lib/redis'
import { randomUUID } from 'crypto'

export interface IdempotencyOptions {
  /** Unique key suffix (e.g., webhook event ID) */
  key: string
  /** Logical scope (e.g., 'stripe', 'paypal', 'order') */
  scope: string
  /** TTL in seconds (default 24 hours) */
  ttlSeconds?: number
}

// ─────────────────────────────────────────────────────────────
// Atomic compare-and-delete
//
//   KEYS[1] = lock key
//   ARGV[1] = expected lock value (our random UUID)
//
// Returns 1 if we deleted our own lock, 0 if the lock is gone or
// owned by someone else (i.e., we no longer own it — safe to skip).
//
// This script executes as a single atomic unit in Redis, so no
// other command can run between the GET and the DEL.
// ─────────────────────────────────────────────────────────────
const RELEASE_LOCK_LUA = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`

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

  // ─────────────────────────────────────────────
  // 1. Try to acquire the lock atomically (SET NX EX)
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // 2. Run the operation, cache result
  // ─────────────────────────────────────────────
  try {
    const result = await fn()

    // Cache the result for future duplicate calls.
    // Uses the same TTL as the lock so cached results expire together.
    await redis.set(resultKey, result, { ex: ttlSeconds })

    return result
  } finally {
    // ─────────────────────────────────────────────
    // 3. Atomic compare-and-delete via Lua
    //
    //    Only deletes the lock if WE still own it.
    //    If our TTL already expired and another process holds the
    //    lock, the script returns 0 and does nothing.
    // ─────────────────────────────────────────────
    try {
      await redis.eval(RELEASE_LOCK_LUA, [lockKey], [lockValue])
    } catch (err) {
      // Non-fatal: the lock will expire on its own via TTL.
      // Logging so we don't hide a systematic Redis problem.
      console.error('[idempotency] failed to release lock:', err)
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