/**
 * Event ingestion endpoint.
 *
 * Security:
 *   • Zod-validated payload
 *   • Rate-limited (100 events/min per IP)
 *   • IP hashed (SHA-256 + salt) — never store raw IP
 *   • User-Agent parsed server-side
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { getDb as _getDbCheck } from '@/lib/mongodb' // keep import tidy
import { env } from '@/lib/env'
import { limiters } from '@/lib/ratelimit'
import { getClientKey } from '@/lib/ratelimit'
import { getCurrentUser } from '@/lib/tracking/server-user'
import { createHash } from 'crypto'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─────────────────────────────────────────────────────────────
// Payload schema
// ─────────────────────────────────────────────────────────────
const trackEventSchema = z.object({
  event: z.string().min(1).max(50),
  properties: z.record(z.string(), z.unknown()),
})

const payloadSchema = z.object({
  sessionId: z.string().min(1).max(100),
  events: z.array(trackEventSchema).min(1).max(20),
})

// ─────────────────────────────────────────────────────────────
// User-Agent parsing (no external dep)
// ─────────────────────────────────────────────────────────────
function parseUserAgent(ua: string): {
  type: string
  os: string
  browser: string
} {
  const lower = ua.toLowerCase()

  let type = 'desktop'
  if (/mobile|iphone|android.*mobile/.test(lower)) type = 'mobile'
  else if (/ipad|tablet/.test(lower)) type = 'tablet'

  let os = 'unknown'
  if (/windows/.test(lower)) os = 'Windows'
  else if (/mac os/.test(lower)) os = 'macOS'
  else if (/android/.test(lower)) os = 'Android'
  else if (/iphone|ipad|ios/.test(lower)) os = 'iOS'
  else if (/linux/.test(lower)) os = 'Linux'

  let browser = 'unknown'
  if (/edg\//.test(lower)) browser = 'Edge'
  else if (/chrome\//.test(lower)) browser = 'Chrome'
  else if (/safari\//.test(lower) && !/chrome/.test(lower)) browser = 'Safari'
  else if (/firefox\//.test(lower)) browser = 'Firefox'
  else if (/opera|opr\//.test(lower)) browser = 'Opera'

  return { type, os, browser }
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  try {
    const { success } = await limiters.track.limit(getClientKey(ip))
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limited' },
        { status: 429 }
      )
    }
  } catch {
    // Fail-open — tracker must never block UX
  }

  // 2. Parse + validate
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  // 3. Enrichment
  const userAgent = req.headers.get('user-agent') || ''
  const device = parseUserAgent(userAgent)

  const ipHash = createHash('sha256')
    .update(env.IP_HASH_SALT + ip)
    .digest('hex')

  const country = req.headers.get('x-vercel-ip-country') || null
  const city = req.headers.get('x-vercel-ip-city') || null

  // 4. Look up user (best-effort)
  const userId = await getCurrentUser()

  // 5. Persist
  try {
    const db = await getDb()
    const docs = parsed.data.events.map((e) => ({
      user_id: userId,
      session_id: parsed.data.sessionId,
      event_type: e.event,
      properties: e.properties,
      ip_hash: ipHash,
      country,
      city,
      device,
      referrer: (e.properties.referrer as string | null) ?? null,
      path: (e.properties.path as string) ?? '/',
      timestamp: new Date(),
    }))

    await db.collection(COLLECTIONS.EVENTS).insertMany(docs, {
      ordered: false,
    })

    return NextResponse.json({ received: docs.length })
  } catch (err) {
    console.error('[track] mongo insert failed:', err)
    return NextResponse.json({ error: 'Storage failed' }, { status: 500 })
  }
}