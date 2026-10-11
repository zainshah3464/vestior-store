import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import {
  findAbandonedCarts,
  markReminderSent,
  ensureCartIndexes,
} from '@/lib/carts/queries'
import { queueEmail } from '@/lib/email/queue'
import { redis } from '@/lib/redis'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const THROTTLE_KEY = 'throttle:cron:abandoned-carts'
const THROTTLE_MINUTES = 50

export async function GET(req: NextRequest) {
  // Auth
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Throttle (Vercel cron runs hourly; we allow one execution per hour)
  const last = await redis.get<number>(THROTTLE_KEY)
  if (last && Date.now() - last < THROTTLE_MINUTES * 60 * 1000) {
    return NextResponse.json({
      skipped: true,
      reason: 'throttled',
      minutesSince: Math.round((Date.now() - last) / 60000),
    })
  }

  await ensureCartIndexes()

  const carts = await findAbandonedCarts(2, 3, 100)

  if (carts.length === 0) {
    await redis.set(THROTTLE_KEY, Date.now())
    return NextResponse.json({ processed: 0, sent: 0, failed: 0 })
  }

  let sent = 0
  let failed = 0

  for (const cart of carts) {
    try {
      // Generate 5% off coupon, per cart, unique code
      const couponCode = await generateRecoveryCoupon(cart.user_id, cart.subtotal)

      const recoveryUrl = `${env.NEXT_PUBLIC_SITE_URL}/cart?recover=${cart.recovery_token}`

      const result = await queueEmail({
        template: 'abandoned-cart',
        to: cart.user_email,
        userId: cart.user_id,
        data: {
          userName: cart.user_name,
          items: cart.items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          })),
          subtotal: cart.subtotal,
          discountPercent: 5,
          couponCode,
          recoveryUrl,
          siteUrl: env.NEXT_PUBLIC_SITE_URL,
        },
      })

      if (result) {
        await markReminderSent(cart._id!, couponCode)
        sent++
      } else {
        failed++
      }
    } catch (err) {
      console.error('[abandoned-carts] failed for cart', cart.user_id, err)
      failed++
    }
  }

  await redis.set(THROTTLE_KEY, Date.now())

  return NextResponse.json({
    processed: carts.length,
    sent,
    failed,
  })
}

/**
 * Generate a unique 5%-off single-use coupon for recovery.
 * Idempotent: if a code already exists for this user, reuse it.
 */
async function generateRecoveryCoupon(
  userId: string,
  _subtotal: number
): Promise<string> {
  // Check if we already created one for this user (based on a marker on coupons.description)
  const { data: existing } = await supabaseAdmin
    .from('coupons')
    .select('code')
    .eq('description', `Auto-generated recovery coupon for user ${userId}`)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (existing?.code) return existing.code

  // Generate short random code
  const code = `COME5-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const validUntil = new Date(Date.now() + 7 * 86400 * 1000).toISOString()

  const { error } = await supabaseAdmin.from('coupons').insert({
    code,
    description: `Auto-generated recovery coupon for user ${userId}`,
    discount_type: 'percent',
    discount_value: 5,
    min_order_amount: 0,
    max_discount_amount: 2000,
    usage_limit: null,
    per_user_limit: 1,
    valid_until: validUntil,
    is_active: true,
  })

  if (error) {
    // If insert failed (code collision), retry once with new random
    const retryCode = `COME5-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    await supabaseAdmin.from('coupons').insert({
      code: retryCode,
      description: `Auto-generated recovery coupon for user ${userId}`,
      discount_type: 'percent',
      discount_value: 5,
      min_order_amount: 0,
      max_discount_amount: 2000,
      per_user_limit: 1,
      valid_until: validUntil,
      is_active: true,
    })
    return retryCode
  }

  return code
}