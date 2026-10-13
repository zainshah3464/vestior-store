import 'server-only'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type { StoredSession, VisitorType, ReferrerSource } from './session-types'
import type { Filter } from 'mongodb'

export const SESSIONS_COLLECTION = 'sessions'

// ─────────────────────────────────────────────────────────────
// Ensure indexes (idempotent)
// ─────────────────────────────────────────────────────────────
let indexesEnsured = false
export async function ensureSessionIndexes() {
  if (indexesEnsured) return
  try {
    const db = await getDb()
    const coll = db.collection(SESSIONS_COLLECTION)

    await coll.createIndex({ session_id: 1 }, { unique: true })
    await coll.createIndex({ user_id: 1, last_seen_at: -1 }, { sparse: true })
    await coll.createIndex({ ip_hash: 1, last_seen_at: -1 })
    await coll.createIndex({ last_seen_at: -1 })
    await coll.createIndex({ visitor_type: 1, last_seen_at: -1 })
    await coll.createIndex(
      { last_seen_at: -1 },
      { expireAfterSeconds: 90 * 86400, name: 'session_ttl_90d' }
    )

    indexesEnsured = true
  } catch (err) {
    console.error('[ensureSessionIndexes] failed:', err)
  }
}

// ─────────────────────────────────────────────────────────────
// Visitor classification
// ─────────────────────────────────────────────────────────────
export async function classifyVisitor(opts: {
  userId: string | null
  isAdmin: boolean
  ipHash: string
}): Promise<VisitorType> {
  if (opts.userId) {
    return opts.isAdmin ? 'admin' : 'returning'
  }

  // Guest — check if this IP hash has been seen before
  try {
    const db = await getDb()
    const existing = await db
      .collection(SESSIONS_COLLECTION)
      .findOne(
        { ip_hash: opts.ipHash },
        { projection: { _id: 1 }, sort: { last_seen_at: -1 } }
      )
    return existing ? 'returning' : 'new'
  } catch {
    return 'new'
  }
}

// ─────────────────────────────────────────────────────────────
// Upsert session on each batch
// ─────────────────────────────────────────────────────────────
export async function upsertSession(input: {
  sessionId: string
  userId: string | null
  userEmail: string | null
  userName: string | null
  visitorType: VisitorType
  ipHash: string
  country: string | null
  city: string | null
  device: { type: string; os: string; browser: string }
  referrer: string | null
  referrerSource: ReferrerSource
  pageViewCount: number
  productViewCount: number
  cartAddCount: number
  orderCount: number
  revenue: number
  pathsVisited: string[]
  productsViewed: string[]
  ordersPlaced: string[]
  durationMs: number
}): Promise<void> {
  const db = await getDb()
  const coll = db.collection<StoredSession>(SESSIONS_COLLECTION)
  const now = new Date()

  // Decide ended_with heuristic:
  //   • if order placed this session → 'order'
  //   • else if duration >= 30s → 'abandon'
  //   • else → 'bounce'
  let endedWith: 'order' | 'abandon' | 'bounce' | null = null
  if (input.orderCount > 0) endedWith = 'order'
  else if (input.durationMs >= 30_000) endedWith = 'abandon'
  else endedWith = 'bounce'

  await coll.updateOne(
    { session_id: input.sessionId },
    {
      $set: {
        user_id: input.userId,
        user_email: input.userEmail,
        user_name: input.userName,
        visitor_type: input.visitorType,
        ip_hash: input.ipHash,
        country: input.country,
        city: input.city,
        device: input.device,
        referrer: input.referrer,
        referrer_source: input.referrerSource,
        last_seen_at: now,
        duration_ms: input.durationMs,
        page_view_count: input.pageViewCount,
        product_view_count: input.productViewCount,
        cart_add_count: input.cartAddCount,
        order_count: input.orderCount,
        revenue: input.revenue,
        paths_visited: input.pathsVisited,
        products_viewed: input.productsViewed,
        orders_placed: input.ordersPlaced,
        ended_with: endedWith,
      },
      $setOnInsert: {
        session_id: input.sessionId,
        first_seen_at: now,
      },
    },
    { upsert: true }
  )
}

// ─────────────────────────────────────────────────────────────
// Live users (active in last 5 min)
// ─────────────────────────────────────────────────────────────
export async function getLiveSessions(minutes = 5) {
  const db = await getDb()
  const since = new Date(Date.now() - minutes * 60_000)
  return db
    .collection<StoredSession>(SESSIONS_COLLECTION)
    .find({ last_seen_at: { $gte: since } })
    .sort({ last_seen_at: -1 })
    .limit(50)
    .toArray()
}

// ─────────────────────────────────────────────────────────────
// List sessions with filters
// ─────────────────────────────────────────────────────────────
export interface SessionFilters {
  visitorType?: VisitorType | 'all'
  search?: string
  page?: number
  perPage?: number
}

export async function fetchSessions(filters: SessionFilters = {}) {
  await ensureSessionIndexes()

  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.min(100, Math.max(10, filters.perPage ?? 25))
  const skip = (page - 1) * perPage

  const db = await getDb()
  const coll = db.collection<StoredSession>(SESSIONS_COLLECTION)

  const filter: Filter<StoredSession> = {}
  if (filters.visitorType && filters.visitorType !== 'all') {
    filter.visitor_type = filters.visitorType
  }
  if (filters.search) {
    filter.$or = [
      { user_email: { $regex: filters.search, $options: 'i' } },
      { user_name: { $regex: filters.search, $options: 'i' } },
      { session_id: { $regex: filters.search, $options: 'i' } },
    ]
  }

  const [rows, total] = await Promise.all([
    coll.find(filter).sort({ last_seen_at: -1 }).skip(skip).limit(perPage).toArray(),
    coll.countDocuments(filter),
  ])

  return {
    rows,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}

// ─────────────────────────────────────────────────────────────
// User activity timeline
// ─────────────────────────────────────────────────────────────
export async function fetchUserSessions(userId: string) {
  await ensureSessionIndexes()

  const db = await getDb()
  return db
    .collection<StoredSession>(SESSIONS_COLLECTION)
    .find({ user_id: userId })
    .sort({ last_seen_at: -1 })
    .limit(50)
    .toArray()
}

// ─────────────────────────────────────────────────────────────
// Visitors overview stats
// ─────────────────────────────────────────────────────────────
export interface VisitorOverview {
  live: number
  todayGuests: number
  todayUsers: number
  todayNew: number
  todayReturning: number
  todayOrders: number
}

export async function getVisitorOverview(): Promise<VisitorOverview> {
  const db = await getDb()
  const coll = db.collection<StoredSession>(SESSIONS_COLLECTION)

  const fiveMinAgo = new Date(Date.now() - 5 * 60_000)
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [live, todaySessions] = await Promise.all([
    coll.countDocuments({ last_seen_at: { $gte: fiveMinAgo } }),
    coll
      .find({ last_seen_at: { $gte: startOfDay } })
      .project({
        visitor_type: 1,
        order_count: 1,
        user_id: 1,
      })
      .toArray(),
  ])

  let todayGuests = 0
  let todayUsers = 0
  let todayNew = 0
  let todayReturning = 0
  let todayOrders = 0

  for (const s of todaySessions) {
    if (s.user_id) todayUsers++
    else todayGuests++
    if (s.visitor_type === 'new') todayNew++
    if (s.visitor_type === 'returning') todayReturning++
    todayOrders += s.order_count ?? 0
  }

  return {
    live,
    todayGuests,
    todayUsers,
    todayNew,
    todayReturning,
    todayOrders,
  }
}