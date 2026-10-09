import 'server-only'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { env } from '@/lib/env'
import { createHash } from 'crypto'
import type { Filter } from 'mongodb'

export interface AuditLogInput {
  actorId: string
  actorEmail: string
  action: string
  targetType: string
  targetId: string
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
  ip?: string | null
  metadata?: Record<string, unknown>
}

export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    const db = await getDb()
    const ipHash = input.ip
      ? createHash('sha256').update(env.IP_HASH_SALT + input.ip).digest('hex')
      : null

    await db.collection(COLLECTIONS.AUDIT_LOGS).insertOne({
      actor_id: input.actorId,
      actor_email: input.actorEmail,
      action: input.action,
      target_type: input.targetType,
      target_id: input.targetId,
      before: input.before ?? null,
      after: input.after ?? null,
      ip_hash: ipHash,
      metadata: input.metadata ?? {},
      timestamp: new Date(),
    })
  } catch (err) {
    console.error('[audit] failed to write log:', err)
  }
}

// ─────────────────────────────────────────────────────────────
// Query helpers
// ─────────────────────────────────────────────────────────────
export interface AuditLogRow {
  id: string
  actorId: string
  actorEmail: string
  action: string
  targetType: string
  targetId: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ipHash: string | null
  metadata: Record<string, unknown>
  timestamp: string
}

export interface AuditFilters {
  actorEmail?: string
  action?: string
  targetType?: string
  targetId?: string
  search?: string
  page?: number
  perPage?: number
}

export async function fetchAuditLogs(filters: AuditFilters = {}): Promise<{
  rows: AuditLogRow[]
  total: number
  page: number
  perPage: number
  totalPages: number
}> {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.min(100, Math.max(10, filters.perPage ?? 25))
  const skip = (page - 1) * perPage

  const db = await getDb()
  const coll = db.collection(COLLECTIONS.AUDIT_LOGS)

  const filter: Filter<Record<string, unknown>> = {}

  if (filters.actorEmail && filters.actorEmail !== 'all') {
    filter.actor_email = filters.actorEmail
  }
  if (filters.action && filters.action !== 'all') {
    filter.action = filters.action
  }
  if (filters.targetType && filters.targetType !== 'all') {
    filter.target_type = filters.targetType
  }
  if (filters.targetId) {
    filter.target_id = filters.targetId
  }
  if (filters.search) {
    filter.$or = [
      { actor_email: { $regex: filters.search, $options: 'i' } },
      { action: { $regex: filters.search, $options: 'i' } },
      { target_id: { $regex: filters.search, $options: 'i' } },
    ]
  }

  const [docs, total] = await Promise.all([
    coll.find(filter).sort({ timestamp: -1 }).skip(skip).limit(perPage).toArray(),
    coll.countDocuments(filter),
  ])

  const rows: AuditLogRow[] = docs.map((d) => ({
    id: String(d._id),
    actorId: d.actor_id,
    actorEmail: d.actor_email,
    action: d.action,
    targetType: d.target_type,
    targetId: d.target_id,
    before: d.before ?? null,
    after: d.after ?? null,
    ipHash: d.ip_hash ?? null,
    metadata: d.metadata ?? {},
    timestamp:
      d.timestamp instanceof Date
        ? d.timestamp.toISOString()
        : String(d.timestamp),
  }))

  return {
    rows,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}

export interface AuditStats {
  total: number
  last24h: number
  byAction: Record<string, number>
  byActor: Array<{ email: string; count: number }>
}

export async function fetchAuditStats(): Promise<AuditStats> {
  const db = await getDb()
  const coll = db.collection(COLLECTIONS.AUDIT_LOGS)
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000)

  const [total, last24h, byActionAgg, byActorAgg] = await Promise.all([
    coll.countDocuments({}),
    coll.countDocuments({ timestamp: { $gte: dayAgo } }),
    coll
      .aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    coll
      .aggregate([
        { $group: { _id: '$actor_email', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray(),
  ])

  const byAction: Record<string, number> = {}
  for (const row of byActionAgg) {
    byAction[String(row._id)] = row.count
  }

  return {
    total,
    last24h,
    byAction,
    byActor: byActorAgg.map((r) => ({
      email: String(r._id),
      count: r.count,
    })),
  }
}