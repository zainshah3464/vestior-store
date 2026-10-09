import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'

// ─────────────────────────────────────────────────────────────
// Common filters
// ─────────────────────────────────────────────────────────────
export interface ExportFilters {
  fromDate?: string // ISO
  toDate?: string // ISO
  status?: string
  provider?: string
}

function applyDateFilter(
  query: ReturnType<typeof supabaseAdmin.from>['select'] extends never
    ? never
    : ReturnType<typeof supabaseAdmin.from>,
  column = 'created_at',
  filters: ExportFilters
) {
  // Type gymnastics because Supabase query builder chains
  // We'll write it explicitly in each function instead
  return query
}

// ─────────────────────────────────────────────────────────────
// Orders export
// ─────────────────────────────────────────────────────────────
export interface OrderExportRow {
  order_id: string
  created_at: string
  customer_email: string
  status: string
  payment_status: string
  payment_provider: string
  subtotal: number
  shipping: number
  total: number
  items_count: number
  shipping_name: string
  shipping_phone: string
  shipping_city: string
  shipping_state: string
}

export async function getOrdersForExport(
  filters: ExportFilters
): Promise<OrderExportRow[]> {
  let query = supabaseAdmin
    .from('orders')
    .select(
      'id, created_at, user_email, status, payment_status, payment_provider, subtotal, shipping, total, items, address'
    )
    .order('created_at', { ascending: false })
    .limit(10_000)

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters.provider && filters.provider !== 'all') {
    query = query.eq('payment_provider', filters.provider)
  }
  if (filters.fromDate) {
    query = query.gte('created_at', filters.fromDate)
  }
  if (filters.toDate) {
    query = query.lte('created_at', filters.toDate)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data ?? []).map((o) => {
    const address = (o.address ?? {}) as Record<string, string>
    const items = (o.items ?? []) as unknown[]
    return {
      order_id: o.id,
      created_at: o.created_at,
      customer_email: o.user_email,
      status: o.status,
      payment_status: o.payment_status,
      payment_provider: o.payment_provider ?? 'cod',
      subtotal: o.subtotal,
      shipping: o.shipping,
      total: o.total,
      items_count: Array.isArray(items) ? items.length : 0,
      shipping_name: address.full_name ?? '',
      shipping_phone: address.phone ?? '',
      shipping_city: address.city ?? '',
      shipping_state: address.state ?? '',
    }
  })
}

// ─────────────────────────────────────────────────────────────
// Payments export (from MongoDB)
// ─────────────────────────────────────────────────────────────
export interface PaymentExportRow {
  order_id: string
  provider: string
  provider_txn_id: string
  amount: number
  currency: string
  status: string
  method: string
  created_at: string
}

export async function getPaymentsForExport(
  filters: ExportFilters
): Promise<PaymentExportRow[]> {
  const db = await getDb()
  const filter: Record<string, unknown> = {}

  if (filters.fromDate || filters.toDate) {
    const dateFilter: Record<string, Date> = {}
    if (filters.fromDate) dateFilter.$gte = new Date(filters.fromDate)
    if (filters.toDate) dateFilter.$lte = new Date(filters.toDate)
    filter.created_at = dateFilter
  }
  if (filters.provider && filters.provider !== 'all') {
    filter.provider = filters.provider
  }
  if (filters.status && filters.status !== 'all') {
    filter.status = filters.status
  }

  const docs = await db
    .collection(COLLECTIONS.PAYMENT_TRANSACTIONS)
    .find(filter)
    .sort({ created_at: -1 })
    .limit(10_000)
    .toArray()

  return docs.map((d) => ({
    order_id: d.order_id,
    provider: d.provider,
    provider_txn_id: d.provider_txn_id,
    amount: d.amount,
    currency: d.currency,
    status: d.status,
    method: d.method ?? '',
    created_at:
      d.created_at instanceof Date
        ? d.created_at.toISOString()
        : String(d.created_at),
  }))
}

// ─────────────────────────────────────────────────────────────
// Emails export
// ─────────────────────────────────────────────────────────────
export interface EmailExportRow {
  sent_at: string
  template: string
  recipient: string
  status: string
  message_id: string
  error: string
}

export async function getEmailsForExport(
  filters: ExportFilters
): Promise<EmailExportRow[]> {
  const db = await getDb()
  const filter: Record<string, unknown> = {}

  if (filters.fromDate || filters.toDate) {
    const dateFilter: Record<string, Date> = {}
    if (filters.fromDate) dateFilter.$gte = new Date(filters.fromDate)
    if (filters.toDate) dateFilter.$lte = new Date(filters.toDate)
    filter.created_at = dateFilter
  }
  if (filters.status && filters.status !== 'all') {
    filter.status = filters.status
  }

  const docs = await db
    .collection(COLLECTIONS.EMAIL_LOGS)
    .find(filter)
    .sort({ created_at: -1 })
    .limit(10_000)
    .toArray()

  return docs.map((d) => ({
    sent_at:
      d.created_at instanceof Date
        ? d.created_at.toISOString()
        : String(d.created_at),
    template: d.template ?? '',
    recipient: d.email ?? '',
    status: d.status ?? '',
    message_id: d.provider_message_id ?? '',
    error: d.error ?? '',
  }))
}

// ─────────────────────────────────────────────────────────────
// Users export
// ─────────────────────────────────────────────────────────────
export interface UserExportRow {
  user_id: string
  full_name: string
  email: string
  phone: string
  role: string
  city: string
  state: string
  created_at: string
}

export async function getUsersForExport(): Promise<UserExportRow[]> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, full_name, email, phone, role, city, state, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(10_000)

  if (error) throw new Error(error.message)

  return (data ?? []).map((u) => ({
    user_id: u.id,
    full_name: u.full_name ?? '',
    email: u.email ?? '',
    phone: u.phone ?? '',
    role: u.role ?? 'customer',
    city: u.city ?? '',
    state: u.state ?? '',
    created_at: u.created_at,
  }))
}

// ─────────────────────────────────────────────────────────────
// Audit logs export
// ─────────────────────────────────────────────────────────────
export interface AuditExportRow {
  timestamp: string
  actor_email: string
  action: string
  target_type: string
  target_id: string
  ip_hash: string
}

export async function getAuditForExport(
  filters: ExportFilters
): Promise<AuditExportRow[]> {
  const db = await getDb()
  const filter: Record<string, unknown> = {}

  if (filters.fromDate || filters.toDate) {
    const dateFilter: Record<string, Date> = {}
    if (filters.fromDate) dateFilter.$gte = new Date(filters.fromDate)
    if (filters.toDate) dateFilter.$lte = new Date(filters.toDate)
    filter.timestamp = dateFilter
  }

  const docs = await db
    .collection(COLLECTIONS.AUDIT_LOGS)
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(10_000)
    .toArray()

  return docs.map((d) => ({
    timestamp:
      d.timestamp instanceof Date
        ? d.timestamp.toISOString()
        : String(d.timestamp),
    actor_email: d.actor_email ?? '',
    action: d.action ?? '',
    target_type: d.target_type ?? '',
    target_id: d.target_id ?? '',
    ip_hash: d.ip_hash ?? '',
  }))
}