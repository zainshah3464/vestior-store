// ─────────────────────────────────────────────────────────────
// Product Analytics Types
// ─────────────────────────────────────────────────────────────

export interface ProductSalesStat {
  id: string
  name: string
  units_sold: number
  revenue: number
  order_count: number
  avg_unit_price: number | string
}

export interface ProductCategoryStat {
  category: string
  units_sold: number
  revenue: number
  order_count: number
}

export interface ProductGlobalStats {
  total_units_sold: number
  total_revenue: number
  total_orders_with_items: number
  avg_units_per_order: number | string
}

export interface ProductSalesReport {
  top_products: ProductSalesStat[]
  by_category: ProductCategoryStat[]
  global: ProductGlobalStats
}

// ─────────────────────────────────────────────────────────────
// Event-based product metrics (from tracking)
// ─────────────────────────────────────────────────────────────

export interface ProductEventMetric {
  productId: string
  productName: string
  views: number
  cartAdds: number
  orders: number
  conversionRate: number  // orders / views, as %
}

export interface ProductPerformanceRow {
  id: string
  name: string
  views: number
  cartAdds: number
  orders: number
  unitsSold: number
  revenue: number
  conversionRate: number     // orders / views
  cartToOrderRate: number    // orders / cartAdds
  abandoned: boolean          // high views, no orders
}