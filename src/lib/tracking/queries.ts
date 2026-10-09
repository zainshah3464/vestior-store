import 'server-only'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type { StoredEvent } from './types'

// ─────────────────────────────────────────────────────────────
// Live metrics
// ─────────────────────────────────────────────────────────────
export async function getLiveUsers(): Promise<number> {
  const db = await getDb()
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)

  const sessions = await db
    .collection(COLLECTIONS.EVENTS)
    .distinct('session_id', { timestamp: { $gte: fiveMinAgo } })

  return sessions.length
}

export async function getTodayStats(): Promise<{
  pageViews: number
  uniqueSessions: number
  ordersPlaced: number
}> {
  const db = await getDb()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const coll = db.collection(COLLECTIONS.EVENTS)

  const [pageViews, sessions, orders] = await Promise.all([
    coll.countDocuments({
      event_type: 'page_view',
      timestamp: { $gte: startOfDay },
    }),
    coll.distinct('session_id', { timestamp: { $gte: startOfDay } }),
    coll.countDocuments({
      event_type: 'order_placed',
      timestamp: { $gte: startOfDay },
    }),
  ])

  return {
    pageViews,
    uniqueSessions: sessions.length,
    ordersPlaced: orders,
  }
}

// ─────────────────────────────────────────────────────────────
// Conversion funnel (last N days)
// ─────────────────────────────────────────────────────────────
export interface FunnelStep {
  name: string
  count: number
  pct: number
}

export async function getConversionFunnel(days = 7): Promise<FunnelStep[]> {
  const db = await getDb()
  const since = new Date(Date.now() - days * 86_400_000)

  const pipeline = [
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: '$session_id',
        events: { $addToSet: '$event_type' },
      },
    },
    {
      $project: {
        visited: { $in: ['page_view', '$events'] },
        viewedProduct: { $in: ['product_view', '$events'] },
        addedToCart: { $in: ['add_to_cart', '$events'] },
        startedCheckout: { $in: ['checkout_started', '$events'] },
        ordered: { $in: ['order_placed', '$events'] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        visited: { $sum: { $cond: ['$visited', 1, 0] } },
        viewedProduct: { $sum: { $cond: ['$viewedProduct', 1, 0] } },
        addedToCart: { $sum: { $cond: ['$addedToCart', 1, 0] } },
        startedCheckout: { $sum: { $cond: ['$startedCheckout', 1, 0] } },
        ordered: { $sum: { $cond: ['$ordered', 1, 0] } },
      },
    },
  ]

  const [result] = await db
    .collection(COLLECTIONS.EVENTS)
    .aggregate(pipeline)
    .toArray()

  if (!result) return []

  const total = result.total || 1

  return [
    { name: 'Visited', count: result.visited, pct: (result.visited / total) * 100 },
    {
      name: 'Product View',
      count: result.viewedProduct,
      pct: (result.viewedProduct / total) * 100,
    },
    {
      name: 'Add to Cart',
      count: result.addedToCart,
      pct: (result.addedToCart / total) * 100,
    },
    {
      name: 'Checkout',
      count: result.startedCheckout,
      pct: (result.startedCheckout / total) * 100,
    },
    {
      name: 'Order Placed',
      count: result.ordered,
      pct: (result.ordered / total) * 100,
    },
  ]
}

// ─────────────────────────────────────────────────────────────
// Top products (by views / adds / orders)
// ─────────────────────────────────────────────────────────────
export interface TopProduct {
  productId: string
  productName: string
  views: number
  adds: number
  orders: number
}

export async function getTopProducts(days = 7, limit = 10): Promise<TopProduct[]> {
  const db = await getDb()
  const since = new Date(Date.now() - days * 86_400_000)

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: since },
        event_type: { $in: ['product_view', 'add_to_cart', 'order_placed'] },
      },
    },
    {
      $group: {
        _id: {
          productId: '$properties.productId',
          productName: '$properties.productName',
        },
        eventCounts: {
          $push: '$event_type',
        },
      },
    },
    {
      $project: {
        productId: '$_id.productId',
        productName: '$_id.productName',
        views: {
          $size: {
            $filter: {
              input: '$eventCounts',
              as: 'e',
              cond: { $eq: ['$$e', 'product_view'] },
            },
          },
        },
        adds: {
          $size: {
            $filter: {
              input: '$eventCounts',
              as: 'e',
              cond: { $eq: ['$$e', 'add_to_cart'] },
            },
          },
        },
        orders: {
          $size: {
            $filter: {
              input: '$eventCounts',
              as: 'e',
              cond: { $eq: ['$$e', 'order_placed'] },
            },
          },
        },
      },
    },
    { $match: { productId: { $ne: null } } },
    { $sort: { views: -1 } },
    { $limit: limit },
  ]

  const rows = await db
    .collection(COLLECTIONS.EVENTS)
    .aggregate(pipeline)
    .toArray()

  return rows.map((r) => ({
    productId: String(r.productId ?? ''),
    productName: String(r.productName ?? 'Unknown'),
    views: r.views || 0,
    adds: r.adds || 0,
    orders: r.orders || 0,
  }))
}

// ─────────────────────────────────────────────────────────────
// Device breakdown
// ─────────────────────────────────────────────────────────────
export interface DeviceBreakdownRow {
  type: string
  count: number
}

export async function getDeviceBreakdown(days = 7): Promise<DeviceBreakdownRow[]> {
  const db = await getDb()
  const since = new Date(Date.now() - days * 86_400_000)

  const pipeline = [
    { $match: { timestamp: { $gte: since }, event_type: 'page_view' } },
    {
      $group: {
        _id: '$device.type',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]

  const rows = await db
    .collection(COLLECTIONS.EVENTS)
    .aggregate(pipeline)
    .toArray()

  return rows.map((r) => ({
    type: String(r._id ?? 'unknown'),
    count: r.count || 0,
  }))
}

// ─────────────────────────────────────────────────────────────
// Traffic sources (top referrers)
// ─────────────────────────────────────────────────────────────
export interface ReferrerRow {
  referrer: string
  count: number
}

export async function getTrafficSources(days = 7): Promise<ReferrerRow[]> {
  const db = await getDb()
  const since = new Date(Date.now() - days * 86_400_000)

  const pipeline = [
    { $match: { timestamp: { $gte: since }, event_type: 'page_view' } },
    {
      $group: {
        _id: { $ifNull: ['$referrer', 'direct'] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]

  const rows = await db
    .collection(COLLECTIONS.EVENTS)
    .aggregate(pipeline)
    .toArray()

  return rows.map((r) => ({
    referrer: String(r._id ?? 'direct'),
    count: r.count || 0,
  }))
}