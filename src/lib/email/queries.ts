import 'server-only'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type { Filter } from 'mongodb'

export interface EmailLogRow {
  id: string
  userId: string | null
  email: string
  template: string
  status: string
  providerMessageId: string | null
  error: string | null
  createdAt: string
  updatedAt: string
}

export interface EmailFilters {
  template?: string
  status?: string
  search?: string
  page?: number
  perPage?: number
}

export async function fetchEmailLogs(filters: EmailFilters = {}): Promise<{
  rows: EmailLogRow[]
  total: number
  page: number
  perPage: number
  totalPages: number
}> {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.min(100, Math.max(10, filters.perPage ?? 20))
  const skip = (page - 1) * perPage

  const db = await getDb()
  const coll = db.collection(COLLECTIONS.EMAIL_LOGS)

  const filter: Filter<Record<string, unknown>> = {}

  if (filters.template && filters.template !== 'all') {
    filter.template = filters.template
  }
  if (filters.status && filters.status !== 'all') {
    filter.status = filters.status
  }
  if (filters.search) {
    filter.email = { $regex: filters.search, $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    coll
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(perPage)
      .toArray(),
    coll.countDocuments(filter),
  ])

  const rows: EmailLogRow[] = docs.map((d) => ({
    id: String(d._id),
    userId: d.user_id ?? null,
    email: d.email,
    template: d.template,
    status: d.status,
    providerMessageId: d.provider_message_id ?? null,
    error: d.error ?? null,
    createdAt:
      d.created_at instanceof Date
        ? d.created_at.toISOString()
        : String(d.created_at),
    updatedAt:
      d.updated_at instanceof Date
        ? d.updated_at.toISOString()
        : String(d.updated_at),
  }))

  return {
    rows,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}

export interface EmailStats {
  total: number
  sent: number
  failed: number
  queued: number
  successRate: number
  byTemplate: Record<string, number>
}

export async function fetchEmailStats(): Promise<EmailStats> {
  const db = await getDb()
  const coll = db.collection(COLLECTIONS.EMAIL_LOGS)

  const [total, sent, failed, queued, byTemplateAgg] = await Promise.all([
    coll.countDocuments({}),
    coll.countDocuments({ status: 'sent' }),
    coll.countDocuments({ status: 'failed' }),
    coll.countDocuments({ status: 'queued' }),
    coll
      .aggregate([
        { $group: { _id: '$template', count: { $sum: 1 } } },
      ])
      .toArray(),
  ])

  const byTemplate: Record<string, number> = {}
  for (const row of byTemplateAgg) {
    byTemplate[String(row._id)] = row.count
  }

  return {
    total,
    sent,
    failed,
    queued,
    successRate: total > 0 ? (sent / total) * 100 : 0,
    byTemplate,
  }
}