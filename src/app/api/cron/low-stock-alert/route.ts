/**
 * Cron: check for low-stock products and alert admin.
 *
 * Throttled to once every 12 hours to avoid spam.
 * Only sends if there are products with stock between 1 and 9.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { queueEmail } from '@/lib/email/queue'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const THROTTLE_KEY = 'throttle:alert:low-stock'
const THROTTLE_HOURS = 12

export async function GET(req: NextRequest) {
  // 1. Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Throttle check
  const lastSent = await redis.get<number>(THROTTLE_KEY)
  if (lastSent && Date.now() - lastSent < THROTTLE_HOURS * 3600 * 1000) {
    return NextResponse.json({
      skipped: true,
      reason: 'throttled',
      lastSentAgo: Math.round((Date.now() - lastSent) / 1000 / 60) + 'm',
    })
  }

  // 3. Fetch low-stock products
  const { data: lowStock, error } = await supabaseAdmin
    .from('products')
    .select('id, name, stock, category_main')
    .eq('is_active', true)
    .gt('stock', 0)
    .lt('stock', 10)
    .order('stock', { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: 'DB error', detail: error.message },
      { status: 500 }
    )
  }

  if (!lowStock || lowStock.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'no low stock' })
  }

  // 4. Queue admin email
  await queueEmail({
    template: 'low-stock-alert',
    to: env.ADMIN_EMAIL,
    data: {
      products: lowStock,
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
    },
  })

  // 5. Mark throttle
  await redis.set(THROTTLE_KEY, Date.now())

  return NextResponse.json({
    sent: true,
    count: lowStock.length,
  })
}