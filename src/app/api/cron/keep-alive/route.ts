/**
 * Keep-Alive endpoint — prevents free-tier database pausing.
 *
 * Free tier behavior:
 *   • Supabase Free  → pauses after 7 days of inactivity
 *   • MongoDB M0     → pauses after 60 days of inactivity
 *
 * Hit every 12 hours via GitHub Actions. Pings both databases
 * with a real query so the "last activity" timestamp updates.
 *
 * Auth: Bearer CRON_SECRET
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    timestamp: new Date().toISOString(),
    supabase: { ok: false, latencyMs: 0, error: null as string | null },
    mongodb: { ok: false, latencyMs: 0, error: null as string | null },
  }

  // ─────────────────────────────────────────────
  // 1. Supabase ping — light query on products
  // ─────────────────────────────────────────────
  try {
    const start = Date.now()
    const { error } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      results.supabase.error = error.message
    } else {
      results.supabase.ok = true
      results.supabase.latencyMs = Date.now() - start
    }
  } catch (err) {
    results.supabase.error = err instanceof Error ? err.message : 'Unknown'
  }

  // ─────────────────────────────────────────────
  // 2. MongoDB ping — light count on events
  // ─────────────────────────────────────────────
  try {
    const start = Date.now()
    const db = await getDb()
    // A count with a tiny limit triggers MongoDB activity
    // without transferring data. Keeps the cluster warm.
    await db.collection(COLLECTIONS.EVENTS).estimatedDocumentCount()

    results.mongodb.ok = true
    results.mongodb.latencyMs = Date.now() - start
  } catch (err) {
    results.mongodb.error = err instanceof Error ? err.message : 'Unknown'
  }

  // ─────────────────────────────────────────────
  // 3. Response — 200 if both ok, 500 if any failed
  // ─────────────────────────────────────────────
  const allOk = results.supabase.ok && results.mongodb.ok

  return NextResponse.json(results, {
    status: allOk ? 200 : 500,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}