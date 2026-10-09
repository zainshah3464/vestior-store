/**
 * Server-side query helpers for the admin payments dashboard.
 *
 * Strategy:
 *   • Transactional data (orders, statuses) → Supabase
 *   • Enrichment (webhook events, refund metadata) → MongoDB
 */

import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type { PaymentProviderId } from './types'

// ─────────────────────────────────────────────────────────────
// Row shape returned to the UI
// ─────────────────────────────────────────────────────────────
export interface PaymentRow {
  orderId: string
  userEmail: string
  total: number
  currency: string
  provider: PaymentProviderId
  paymentStatus: string
  orderStatus: string
  paymentIntentId: string | null
  paidAt: string | null
  createdAt: string
  /** Number of webhook events recorded (from Mongo) */
  webhookEventCount: number
  /** Whether a Mongo transaction record exists */
  hasMongoRecord: boolean
}

// ─────────────────────────────────────────────────────────────
// Filters
// ─────────────────────────────────────────────────────────────
export interface PaymentFilters {
  provider?: PaymentProviderId | 'all'
  status?: string | 'all'
  search?: string
  fromDate?: string
  toDate?: string
  page?: number
  perPage?: number
}

// ─────────────────────────────────────────────────────────────
// Fetch paginated payments
// ─────────────────────────────────────────────────────────────
export async function fetchPayments(filters: PaymentFilters = {}): Promise<{
  rows: PaymentRow[]
  total: number
  page: number
  perPage: number
  totalPages: number
}> {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.min(100, Math.max(10, filters.perPage ?? 20))
  const offset = (page - 1) * perPage

  // Base query — Supabase orders table
  let query = supabaseAdmin
    .from('orders')
    .select(
      'id, user_email, total, status, payment_status, payment_provider, payment_intent_id, paid_at, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (filters.provider && filters.provider !== 'all') {
    query = query.eq('payment_provider', filters.provider)
  }

  if (filters.status && filters.status !== 'all') {
    query = query.eq('payment_status', filters.status)
  }

  if (filters.search) {
    // Search by order ID prefix or email
    const term = `%${filters.search}%`
    query = query.or(`id.ilike.${term},user_email.ilike.${term}`)
  }

  if (filters.fromDate) {
    query = query.gte('created_at', filters.fromDate)
  }
  if (filters.toDate) {
    query = query.lte('created_at', filters.toDate)
  }

  const { data: orders, count, error } = await query

  if (error) {
    console.error('[fetchPayments] supabase error:', error)
    return { rows: [], total: 0, page, perPage, totalPages: 0 }
  }

  const total = count ?? 0
  const totalPages = Math.ceil(total / perPage)

  if (!orders || orders.length === 0) {
    return { rows: [], total, page, perPage, totalPages }
  }

  // Enrich with MongoDB webhook events
  const orderIds = orders.map((o) => o.id)
  let mongoMap = new Map<string, { count: number }>()

  try {
    const db = await getDb()
    const mongoDocs = await db
      .collection(COLLECTIONS.PAYMENT_TRANSACTIONS)
      .find({ order_id: { $in: orderIds } })
      .project({ order_id: 1, webhook_events: 1 })
      .toArray()

    mongoMap = new Map(
      mongoDocs.map((doc) => [
        doc.order_id as string,
        { count: Array.isArray(doc.webhook_events) ? doc.webhook_events.length : 0 },
      ])
    )
  } catch (err) {
    // Mongo failure shouldn't break the dashboard
    console.error('[fetchPayments] mongo enrichment failed:', err)
  }

  const rows: PaymentRow[] = orders.map((o) => {
    const mongo = mongoMap.get(o.id)
    return {
      orderId: o.id,
      userEmail: o.user_email,
      total: o.total,
      currency: 'PKR',
      provider: (o.payment_provider as PaymentProviderId) || 'cod',
      paymentStatus: o.payment_status || 'pending',
      orderStatus: o.status || 'pending',
      paymentIntentId: o.payment_intent_id,
      paidAt: o.paid_at,
      createdAt: o.created_at,
      webhookEventCount: mongo?.count ?? 0,
      hasMongoRecord: !!mongo,
    }
  })

  return { rows, total, page, perPage, totalPages }
}

// ─────────────────────────────────────────────────────────────
// Stats for the top cards
// ─────────────────────────────────────────────────────────────
export interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  todayRevenue: number
  todayTransactions: number
  byProvider: Record<PaymentProviderId, { count: number; revenue: number }>
  byStatus: Record<string, number>
}

export async function fetchPaymentStats(): Promise<PaymentStats> {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [
    allOrdersResult,
    todayOrdersResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('orders')
      .select('total, payment_status, payment_provider, created_at'),
    supabaseAdmin
      .from('orders')
      .select('total, payment_status, payment_provider')
      .gte('created_at', startOfDay.toISOString()),
  ])

  const allOrders = allOrdersResult.data ?? []
  const todayOrders = todayOrdersResult.data ?? []

  const byProvider: PaymentStats['byProvider'] = {
    cod: { count: 0, revenue: 0 },
    stripe: { count: 0, revenue: 0 },
    paypal: { count: 0, revenue: 0 },
  }
  const byStatus: Record<string, number> = {}
  let totalRevenue = 0
  let completedCount = 0

  for (const o of allOrders) {
    const provider = (o.payment_provider as PaymentProviderId) || 'cod'
    const status = o.payment_status || 'pending'

    if (provider in byProvider) {
      byProvider[provider].count += 1
      if (status === 'completed') {
        byProvider[provider].revenue += o.total || 0
      }
    }

    byStatus[status] = (byStatus[status] || 0) + 1

    if (status === 'completed') {
      totalRevenue += o.total || 0
      completedCount += 1
    }
  }

  let todayRevenue = 0
  for (const o of todayOrders) {
    if (o.payment_status === 'completed') {
      todayRevenue += o.total || 0
    }
  }

  const successRate =
    allOrders.length > 0 ? (completedCount / allOrders.length) * 100 : 0

  return {
    totalRevenue,
    totalTransactions: allOrders.length,
    successRate,
    todayRevenue,
    todayTransactions: todayOrders.length,
    byProvider,
    byStatus,
  }
}

// ─────────────────────────────────────────────────────────────
// Single payment detail (modal)
// ─────────────────────────────────────────────────────────────
export interface PaymentDetail {
  orderId: string
  mongoDoc: {
    provider: string
    provider_txn_id: string
    amount: number
    currency: string
    status: string
    method?: string
    webhook_events: Array<{ event: string; at: Date; raw: unknown }>
    created_at: Date
    updated_at: Date
  } | null
}

export async function fetchPaymentDetail(
  orderId: string
): Promise<PaymentDetail> {
  try {
    const db = await getDb()
    const doc = await db
      .collection(COLLECTIONS.PAYMENT_TRANSACTIONS)
      .findOne({ order_id: orderId })

    if (!doc) {
      return { orderId, mongoDoc: null }
    }

    return {
      orderId,
      mongoDoc: {
        provider: doc.provider,
        provider_txn_id: doc.provider_txn_id,
        amount: doc.amount,
        currency: doc.currency,
        status: doc.status,
        method: doc.method,
        webhook_events: doc.webhook_events ?? [],
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      },
    }
  } catch (err) {
    console.error('[fetchPaymentDetail] error:', err)
    return { orderId, mongoDoc: null }
  }
}