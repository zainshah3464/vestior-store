/**
 * Client-safe trend helpers.
 *
 * This file has NO `server-only` import, so it can be imported from
 * Client Components (e.g., ReportsDashboard). Do NOT add server-only
 * imports here or it will break client bundling.
 */

import type { SalesReport } from './types'

export interface TrendDeltas {
  revenueChange: number
  ordersChange: number
  aovChange: number
}

/**
 * Compare current period to previous period.
 * Returns percent change for revenue, orders, and AOV.
 */
export function computeTrends(
  current: SalesReport,
  previous: SalesReport
): TrendDeltas {
  const safePct = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0
    return ((curr - prev) / prev) * 100
  }

  return {
    revenueChange: safePct(
      current.totals.total_revenue,
      previous.totals.total_revenue
    ),
    ordersChange: safePct(
      current.totals.total_orders,
      previous.totals.total_orders
    ),
    aovChange: safePct(
      Number(current.totals.avg_order_value),
      Number(previous.totals.avg_order_value)
    ),
  }
}