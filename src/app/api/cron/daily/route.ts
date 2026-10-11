/**
 * Combined daily cron — runs low-stock alert + abandoned-cart recovery.
 *
 * Vercel Hobby plan only allows 1 cron per project. This endpoint
 * runs both jobs in sequence and aggregates the results.
 *
 * Schedule: 0 9 * * *  → 9 AM UTC daily (2 PM PKT)
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // 1. Auth
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const origin = req.nextUrl.origin
  const headers = { authorization: `Bearer ${env.CRON_SECRET}` }

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  }

  // 2. Low-stock alert (has its own 12h throttle inside)
  try {
    const res = await fetch(`${origin}/api/cron/low-stock-alert`, { headers })
    results.lowStock = await res.json()
  } catch (err) {
    results.lowStock = {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }

  // 3. Abandoned carts (has its own 50min throttle inside)
  try {
    const res = await fetch(`${origin}/api/cron/abandoned-carts`, { headers })
    results.abandonedCarts = await res.json()
  } catch (err) {
    results.abandonedCarts = {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }

  return NextResponse.json({ success: true, ...results })
}