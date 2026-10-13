/**
 * Event ingestion endpoint.
 *
 * Accepts a batch of events + an optional session summary.
 * - Events → MongoDB `events` collection
 * - Session summary → MongoDB `sessions` collection (upsert)
 *
 * Security:
 *   • Rate-limited (100 events/min per IP)
 *   • Zod-validated payload
 *   • IP hashed (SHA-256 + salt)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { env } from '@/lib/env'
import { limiters, getClientKey } from '@/lib/ratelimit'
import { getCurrentUser } from '@/lib/tracking/server-user'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  classifyVisitor,
  upsertSession,
  ensureSessionIndexes,
} from '@/lib/tracking/session-queries'
import { classifyReferrer } from '@/lib/tracking/referrer'
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

const sessionUpdateSchema = z.object({
  sessionId: z.string().min(1).max(100),
  pageViewCount: z.number().int().min(0).max(10_000),
  productViewCount: z.number().int().min(0).max(10_000),
  cartAddCount: z.number().int().min(0).max(10_000),
  orderCount: z.number().int().min(0).max(1_000),
  revenue: z.number().min(0),
  pathsVisited: z.array(z.string()).max(100),
  productsViewed: z.array(z.string()).max(100),
  ordersPlaced: z.array(z.string()).max(50),
  durationMs: z.number().int().min(0),
})

const payloadSchema = z.object({
  sessionId: z.string().min(1).max(100),
  events: z.array(trackEventSchema).min(1).max(20),
  sessionUpdate: sessionUpdateSchema.optional(),
})

// ─────────────────────────────────────────────────────────────
// User-Agent parsing
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
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }
  } catch {
    // fail-open
  }

  // 2. Parse
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

  // 4. Auth (best-effort)
  const userId = await getCurrentUser()

  let userEmail: string | null = null
  let userName: string | null = null
  let isAdmin = false

  if (userId) {
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name, role')
        .eq('id', userId)
        .single()

      if (profile) {
        userEmail = profile.email ?? null
        userName = profile.full_name ?? null
        isAdmin = profile.role === 'admin'
      }
    } catch {
      // ignore
    }
  }

  // 5. Extract referrer from first event
  const firstEvent = parsed.data.events[0]
  const referrer =
    (firstEvent.properties.referrer as string | null | undefined) ?? null
  const referrerSource = classifyReferrer(referrer, env.NEXT_PUBLIC_SITE_URL)

  // 6. Persist events
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

    await db
      .collection(COLLECTIONS.EVENTS)
      .insertMany(docs, { ordered: false })
  } catch (err) {
    console.error('[track] events insert failed:', err)
  }

  // 7. Upsert session (if provided)
  if (parsed.data.sessionUpdate) {
    try {
      await ensureSessionIndexes()

      const visitorType = await classifyVisitor({
        userId,
        isAdmin,
        ipHash,
      })

      await upsertSession({
        sessionId: parsed.data.sessionId,
        userId,
        userEmail,
        userName,
        visitorType,
        ipHash,
        country,
        city,
        device,
        referrer,
        referrerSource,
        pageViewCount: parsed.data.sessionUpdate.pageViewCount,
        productViewCount: parsed.data.sessionUpdate.productViewCount,
        cartAddCount: parsed.data.sessionUpdate.cartAddCount,
        orderCount: parsed.data.sessionUpdate.orderCount,
        revenue: parsed.data.sessionUpdate.revenue,
        pathsVisited: parsed.data.sessionUpdate.pathsVisited,
        productsViewed: parsed.data.sessionUpdate.productsViewed,
        ordersPlaced: parsed.data.sessionUpdate.ordersPlaced,
        durationMs: parsed.data.sessionUpdate.durationMs,
      })
    } catch (err) {
      console.error('[track] session upsert failed:', err)
    }
  }

  return NextResponse.json({ received: parsed.data.events.length })
}