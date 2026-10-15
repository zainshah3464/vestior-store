/**
 * Combined daily cron — runs both jobs, surfaces real status.
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const origin = req.nextUrl.origin
  const headers = { authorization: `Bearer ${env.CRON_SECRET}` }

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  }

  try {
    const res = await fetch(`${origin}/api/cron/low-stock-alert`, {
      headers,
      cache: 'no-store',
    })
    const body = await res.json().catch(() => ({}))
    results.lowStock = { httpStatus: res.status, ...body }
  } catch (err) {
    results.lowStock = {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }

  try {
    const res = await fetch(`${origin}/api/cron/abandoned-carts`, {
      headers,
      cache: 'no-store',
    })
    const body = await res.json().catch(() => ({}))
    results.abandonedCarts = { httpStatus: res.status, ...body }
  } catch (err) {
    results.abandonedCarts = {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }

  return NextResponse.json({ success: true, ...results })
}