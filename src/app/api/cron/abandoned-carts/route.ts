/**
 * Cron: abandoned-cart recovery.
 * Window widened to 2–24h so daily cron actually finds carts.
 */

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

const MIN_AGE_HOURS = 2
const MAX_AGE_HOURS = 24
const BATCH_SIZE = 100

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const last = await redis.get<number>(THROTTLE_KEY)
  if (last && Date.now() - last < THROTTLE_MINUTES * 60 * 1000) {
    return NextResponse.json({
      skipped: true,
      reason: 'throttled',
      minutesSince: Math.round((Date.now() - last) / 60000),
    })
  }

  await ensureCartIndexes()

  const carts = await findAbandonedCarts(
    MIN_AGE_HOURS,
    MAX_AGE_HOURS,
    BATCH_SIZE
  )

  if (carts.length === 0) {
    await redis.set(THROTTLE_KEY, Date.now())
    return NextResponse.json({ processed: 0, sent: 0, failed: 0 })
  }

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const cart of carts) {
    try {
      const couponCode = await generateRecoveryCoupon(
        cart.user_id,
        cart.subtotal
      )

      const recoveryUrl = `${env.NEXT_PUBLIC_SITE_URL}/cart?recover=${cart.recovery_token}`

      const logId = await queueEmail({
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

      if (logId) {
        await markReminderSent(cart._id!, couponCode)
        sent++
      } else {
        failed++
        errors.push(`queue failed for ${cart.user_email}`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown'
      console.error('[abandoned-carts] failed for', cart.user_id, msg)
      errors.push(`${cart.user_email}: ${msg}`)
      failed++
    }
  }

  await redis.set(THROTTLE_KEY, Date.now())

  return NextResponse.json({
    processed: carts.length,
    sent,
    failed,
    ...(errors.length > 0 ? { errors: errors.slice(0, 5) } : {}),
  })
}

async function generateRecoveryCoupon(
  userId: string,
  _subtotal: number
): Promise<string> {
  const description = `Auto-generated recovery coupon for user ${userId}`

  const { data: existing } = await supabaseAdmin
    .from('coupons')
    .select('code')
    .eq('description', description)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (existing?.code) return existing.code

  const validUntil = new Date(Date.now() + 7 * 86400 * 1000).toISOString()

  const tryInsert = async (): Promise<string | null> => {
    const code = `COME5-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`

    const { error } = await supabaseAdmin.from('coupons').insert({
      code,
      description,
      discount_type: 'percent',
      discount_value: 5,
      min_order_amount: 0,
      max_discount_amount: 2000,
      usage_limit: null,
      per_user_limit: 1,
      valid_until: validUntil,
      is_active: true,
    })

    return error ? null : code
  }

  const first = await tryInsert()
  if (first) return first

  const second = await tryInsert()
  if (second) return second

  throw new Error(`Failed to generate coupon for user ${userId}`)
}