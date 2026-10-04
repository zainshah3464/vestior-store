/**
 * Audit logging — records admin actions in MongoDB.
 *
 * Every privileged mutation (product create, order status update,
 * user role change) should call `logAudit()` so there's a full
 * trail for compliance and debugging.
 */

import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { env } from '@/lib/env'
import { createHash } from 'crypto'
import type { ObjectId } from 'mongodb'

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

/**
 * Persist an audit log entry. Never throws — logs to console on failure
 * so that a broken audit pipeline can't break a business operation.
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    const db = await getDb()

    const ipHash = input.ip
      ? createHash('sha256')
          .update(env.IP_HASH_SALT + input.ip)
          .digest('hex')
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
    // Audit must never break the calling operation
    console.error('[audit] failed to write log:', err)
  }
}

/**
 * Simple query helper for the future admin audit dashboard (Phase 5).
 */
export interface AuditLogQuery {
  actorId?: string
  targetType?: string
  targetId?: string
  action?: string
  from?: Date
  to?: Date
  limit?: number
}

export async function queryAuditLogs(query: AuditLogQuery) {
  const db = await getDb()
  const filter: Record<string, unknown> = {}

  if (query.actorId) filter.actor_id = query.actorId
  if (query.targetType) filter.target_type = query.targetType
  if (query.targetId) filter.target_id = query.targetId
  if (query.action) filter.action = query.action
  if (query.from || query.to) {
    filter.timestamp = {}
    if (query.from) (filter.timestamp as Record<string, Date>).$gte = query.from
    if (query.to) (filter.timestamp as Record<string, Date>).$lte = query.to
  }

  return db
    .collection(COLLECTIONS.AUDIT_LOGS)
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(query.limit ?? 100)
    .toArray()
}

export type AuditLogDoc = {
  _id: ObjectId
  actor_id: string
  actor_email: string
  action: string
  target_type: string
  target_id: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ip_hash: string | null
  metadata: Record<string, unknown>
  timestamp: Date
}