import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { getVisitorOverview } from '@/lib/tracking/session-queries'

// ─────────────────────────────────────────────────────────────
// Dashboard Summary — single object with everything the
// main dashboard needs. All queries run in parallel.
// ─────────────────────────────────────────────────────────────

export interface DashboardSummary {
  // Core commerce (existing)
  productCount: number
  orderCount: number
  userCount: number
  totalRevenue: number

  // Payments
  pendingPayments: number
  refundedPayments: number
  stripeRevenue: number
  codRevenue: number

  // Reviews
  pendingReviews: number
  approvedReviews: number
  totalReviews: number

  // Coupons
  activeCoupons: number
  totalCoupons: number
  couponRedemptions: number

  // Abandoned carts
  abandonedCartsPending: number
  abandonedCartsRecovered: number
  abandonedCartValue: number

  // Emails
  emailsSentToday: number
  emailsFailedToday: number

  // Low stock
  lowStockProducts: number
  outOfStockProducts: number

  // Visitors (from sessions)
  liveUsers: number
  todayVisitors: number
  todayNewVisitors: number
  todayReturning: number

  // Pending orders
  pendingOrders: number
  processingOrders: number
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [
    productsRes,
    ordersRes,
    profilesRes,
    reviewsRes,
    couponsRes,
    redemptionsRes,
    lowStockRes,
    outOfStockRes,
  ] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('orders')
      .select('total, status, payment_status, payment_provider'),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('product_reviews')
      .select('status', { count: 'exact' }),
    supabaseAdmin.from('coupons').select('is_active', { count: 'exact' }),
    supabaseAdmin
      .from('coupon_redemptions')
      .select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('stock', 0)
      .lt('stock', 10),
    supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('stock', 0),
  ])

  // ── Commerce aggregates ────────────────────────────────────
  const orders = ordersRes.data ?? []
  const revenueStatuses = new Set(['shipped', 'delivered'])

  let totalRevenue = 0
  let stripeRevenue = 0
  let codRevenue = 0
  let pendingPayments = 0
  let refundedPayments = 0
  let pendingOrders = 0
  let processingOrders = 0

  for (const o of orders) {
    const status = o.status as string
    const paymentStatus = o.payment_status as string
    const provider = (o.payment_provider as string) ?? 'cod'
    const total = Number(o.total ?? 0)

    if (revenueStatuses.has(status)) {
      totalRevenue += total
      if (provider === 'stripe') stripeRevenue += total
      else codRevenue += total
    }
    if (paymentStatus === 'pending') pendingPayments++
    if (paymentStatus === 'refunded') refundedPayments++
    if (status === 'pending') pendingOrders++
    if (status === 'processing') processingOrders++
  }

  // ── Reviews ────────────────────────────────────────────────
  const reviews = reviewsRes.data ?? []
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length
  const approvedReviews = reviews.filter((r) => r.status === 'approved').length

  // ── Coupons ────────────────────────────────────────────────
  const coupons = couponsRes.data ?? []
  const activeCoupons = coupons.filter((c) => c.is_active === true).length

  // ── Abandoned carts (MongoDB) ─────────────────────────────
  let abandonedCartsPending = 0
  let abandonedCartsRecovered = 0
  let abandonedCartValue = 0
  try {
    const db = await getDb()
    const coll = db.collection(COLLECTIONS.CART_SNAPSHOTS)
    const [pendingAgg, recoveredAgg] = await Promise.all([
      coll
        .aggregate<{ _id: null; count: number; value: number }>([
          { $match: { item_count: { $gt: 0 }, recovered_at: null } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              value: { $sum: '$subtotal' },
            },
          },
        ])
        .toArray(),
      coll.countDocuments({ recovered_at: { $ne: null } }),
    ])
    abandonedCartsPending = pendingAgg[0]?.count ?? 0
    abandonedCartValue = pendingAgg[0]?.value ?? 0
    abandonedCartsRecovered = recoveredAgg
  } catch (err) {
    console.error('[dashboard] abandoned carts failed:', err)
  }

  // ── Emails today (MongoDB) ─────────────────────────────────
  let emailsSentToday = 0
  let emailsFailedToday = 0
  try {
    const db = await getDb()
    const coll = db.collection(COLLECTIONS.EMAIL_LOGS)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [sent, failed] = await Promise.all([
      coll.countDocuments({
        status: 'sent',
        created_at: { $gte: startOfDay },
      }),
      coll.countDocuments({
        status: 'failed',
        created_at: { $gte: startOfDay },
      }),
    ])
    emailsSentToday = sent
    emailsFailedToday = failed
  } catch (err) {
    console.error('[dashboard] email stats failed:', err)
  }

  // ── Visitors (sessions) ────────────────────────────────────
  let liveUsers = 0
  let todayVisitors = 0
  let todayNewVisitors = 0
  let todayReturning = 0
  try {
    const overview = await getVisitorOverview()
    liveUsers = overview.live
    todayVisitors = overview.todayGuests + overview.todayUsers
    todayNewVisitors = overview.todayNew
    todayReturning = overview.todayReturning
  } catch (err) {
    console.error('[dashboard] visitor overview failed:', err)
  }

  return {
    productCount: productsRes.count ?? 0,
    orderCount: orders.length,
    userCount: profilesRes.count ?? 0,
    totalRevenue,

    pendingPayments,
    refundedPayments,
    stripeRevenue,
    codRevenue,

    pendingReviews,
    approvedReviews,
    totalReviews: reviewsRes.count ?? reviews.length,

    activeCoupons,
    totalCoupons: couponsRes.count ?? coupons.length,
    couponRedemptions: redemptionsRes.count ?? 0,

    abandonedCartsPending,
    abandonedCartsRecovered,
    abandonedCartValue,

    emailsSentToday,
    emailsFailedToday,

    lowStockProducts: lowStockRes.count ?? 0,
    outOfStockProducts: outOfStockRes.count ?? 0,

    liveUsers,
    todayVisitors,
    todayNewVisitors,
    todayReturning,

    pendingOrders,
    processingOrders,
  }
}

// ─────────────────────────────────────────────────────────────
// Recent audit activity — for the timeline on the dashboard
// ─────────────────────────────────────────────────────────────
export interface RecentActivityItem {
  id: string
  actorEmail: string
  action: string
  targetType: string
  targetId: string
  timestamp: string
}

export async function getRecentActivity(
  limit = 10
): Promise<RecentActivityItem[]> {
  try {
    const db = await getDb()
    const docs = await db
      .collection(COLLECTIONS.AUDIT_LOGS)
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    return docs.map((d) => ({
      id: String(d._id),
      actorEmail: String(d.actor_email ?? ''),
      action: String(d.action ?? ''),
      targetType: String(d.target_type ?? ''),
      targetId: String(d.target_id ?? ''),
      timestamp:
        d.timestamp instanceof Date
          ? d.timestamp.toISOString()
          : String(d.timestamp),
    }))
  } catch (err) {
    console.error('[dashboard] recent activity failed:', err)
    return []
  }
}