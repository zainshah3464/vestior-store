import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import type {
  ProductSalesReport,
  ProductSalesStat,
  ProductCategoryStat,
  ProductGlobalStats,
  ProductPerformanceRow,
} from './product-types'

// ─────────────────────────────────────────────────────────────
// Sales-based stats (from Supabase)
// ─────────────────────────────────────────────────────────────

const EMPTY_SALES: ProductSalesReport = {
  top_products: [],
  by_category: [],
  global: {
    total_units_sold: 0,
    total_revenue: 0,
    total_orders_with_items: 0,
    avg_units_per_order: 0,
  },
}

export async function getProductSalesStats(
  limit = 20
): Promise<ProductSalesReport> {
  const { data, error } = await supabaseAdmin.rpc('get_product_sales_stats', {
    p_limit: limit,
  })

  if (error) {
    console.error('[getProductSalesStats] rpc error:', error)
    return EMPTY_SALES
  }

  if (!data) return EMPTY_SALES

  const raw = data as Record<string, unknown>

  const topProducts = Array.isArray(raw.top_products)
    ? (raw.top_products as ProductSalesStat[]).map((p) => ({
        id: String(p.id ?? ''),
        name: String(p.name ?? 'Unknown'),
        units_sold: Number(p.units_sold ?? 0),
        revenue: Number(p.revenue ?? 0),
        order_count: Number(p.order_count ?? 0),
        avg_unit_price: Number(p.avg_unit_price ?? 0),
      }))
    : []

  const byCategory = Array.isArray(raw.by_category)
    ? (raw.by_category as ProductCategoryStat[]).map((c) => ({
        category: String(c.category ?? 'Uncategorized'),
        units_sold: Number(c.units_sold ?? 0),
        revenue: Number(c.revenue ?? 0),
        order_count: Number(c.order_count ?? 0),
      }))
    : []

  const globalRaw = (raw.global ?? {}) as Record<string, unknown>

  return {
    top_products: topProducts,
    by_category: byCategory,
    global: {
      total_units_sold: Number(globalRaw.total_units_sold ?? 0),
      total_revenue: Number(globalRaw.total_revenue ?? 0),
      total_orders_with_items: Number(globalRaw.total_orders_with_items ?? 0),
      avg_units_per_order: Number(globalRaw.avg_units_per_order ?? 0),
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Event-based metrics (from MongoDB)
//   • Views (product_view)
//   • Cart adds (add_to_cart)
//   • Orders (order_placed)
// ─────────────────────────────────────────────────────────────

interface ProductEventAgg {
  _id: string  // productId
  productName: string
  views: number
  cartAdds: number
  orders: number
}

export async function getProductEventMetrics(days = 30): Promise<ProductEventAgg[]> {
  try {
    const db = await getDb()
    const since = new Date(Date.now() - days * 86400000)

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: since },
          event_type: { $in: ['product_view', 'add_to_cart', 'order_placed'] },
          'properties.productId': { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$properties.productId',
          productName: { $first: '$properties.productName' },
          views: {
            $sum: { $cond: [{ $eq: ['$event_type', 'product_view'] }, 1, 0] },
          },
          cartAdds: {
            $sum: { $cond: [{ $eq: ['$event_type', 'add_to_cart'] }, 1, 0] },
          },
          orders: {
            $sum: { $cond: [{ $eq: ['$event_type', 'order_placed'] }, 1, 0] },
          },
        },
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { views: -1 } },
      { $limit: 100 },
    ]

    const rows = await db
      .collection(COLLECTIONS.EVENTS)
      .aggregate(pipeline)
      .toArray()

    return rows.map((r) => ({
      _id: String(r._id ?? ''),
      productName: String(r.productName ?? 'Unknown'),
      views: Number(r.views ?? 0),
      cartAdds: Number(r.cartAdds ?? 0),
      orders: Number(r.orders ?? 0),
    }))
  } catch (err) {
    console.error('[getProductEventMetrics] failed:', err)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// Combined product performance — merges events + sales
// ─────────────────────────────────────────────────────────────

export async function getProductPerformance(
  days = 30
): Promise<ProductPerformanceRow[]> {
  const [eventMetrics, salesReport] = await Promise.all([
    getProductEventMetrics(days),
    getProductSalesStats(100),
  ])

  // Build sales lookup (by product_id)
  const salesMap = new Map<
    string,
    { unitsSold: number; revenue: number; orders: number }
  >()
  for (const p of salesReport.top_products) {
    salesMap.set(p.id, {
      unitsSold: p.units_sold,
      revenue: p.revenue,
      orders: p.order_count,
    })
  }

  // Merge
  const rows: ProductPerformanceRow[] = eventMetrics.map((e) => {
    const sales = salesMap.get(e._id)
    const orders = e.orders || sales?.orders || 0
    const views = e.views
    const cartAdds = e.cartAdds

    const conversionRate = views > 0 ? (orders / views) * 100 : 0
    const cartToOrderRate = cartAdds > 0 ? (orders / cartAdds) * 100 : 0

    // "Abandoned" heuristic:
    //   • High views (>= 20) but zero orders
    const abandoned = views >= 20 && orders === 0

    return {
      id: e._id,
      name: e.productName,
      views,
      cartAdds,
      orders,
      unitsSold: sales?.unitsSold ?? 0,
      revenue: sales?.revenue ?? 0,
      conversionRate,
      cartToOrderRate,
      abandoned,
    }
  })

  // Sort by views desc
  return rows.sort((a, b) => b.views - a.views)
}