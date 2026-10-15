/**
 * Cron: low-stock alert to admin.
 * Throttle is set ONLY on real success.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { queueEmail } from '@/lib/email/queue'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const THROTTLE_KEY = 'throttle:alert:low-stock'
const THROTTLE_HOURS = 12
const MAX_LOW_STOCK = 200

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lastSent = await redis.get<number>(THROTTLE_KEY)
  if (lastSent && Date.now() - lastSent < THROTTLE_HOURS * 3600 * 1000) {
    return NextResponse.json({
      skipped: true,
      reason: 'throttled',
      minutesSince: Math.round((Date.now() - lastSent) / 60000),
    })
  }

  if (!env.ADMIN_EMAIL || !env.ADMIN_EMAIL.includes('@')) {
    console.error('[low-stock-alert] ADMIN_EMAIL missing or invalid')
    return NextResponse.json(
      { error: 'ADMIN_EMAIL not configured' },
      { status: 500 }
    )
  }

  const { data: lowStock, error } = await supabaseAdmin
    .from('products')
    .select('id, name, stock, category_main')
    .eq('is_active', true)
    .gt('stock', 0)
    .lt('stock', 10)
    .order('stock', { ascending: true })
    .limit(MAX_LOW_STOCK)

  if (error) {
    console.error('[low-stock-alert] DB error:', error.message)
    return NextResponse.json(
      { error: 'DB error', detail: error.message },
      { status: 500 }
    )
  }

  if (!lowStock || lowStock.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'no low stock' })
  }

  const logId = await queueEmail({
    template: 'low-stock-alert',
    to: env.ADMIN_EMAIL,
    data: {
      products: lowStock,
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
    },
  })

  if (!logId) {
    console.error(
      '[low-stock-alert] queueEmail failed — throttle NOT set (will retry next run)'
    )
    return NextResponse.json(
      { error: 'Failed to queue email', count: lowStock.length },
      { status: 500 }
    )
  }

  await redis.set(THROTTLE_KEY, Date.now())

  return NextResponse.json({
    sent: true,
    count: lowStock.length,
    logId,
  })
}