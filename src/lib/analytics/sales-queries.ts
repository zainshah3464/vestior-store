import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  SalesReport,
  DateRange,
  ProviderStat,
  CategoryStat,
  TopProduct,
  DailySeriesPoint,
} from './types'

const EMPTY_REPORT: SalesReport = {
  totals: {
    total_orders: 0,
    total_revenue: 0,
    avg_order_value: 0,
  },
  by_status: {},
  by_provider: [],
  by_category: [],
  top_products: [],
  daily_series: [],
}

/**
 * Fetch the sales report for the given date range.
 * One RPC call — all aggregation happens in Postgres.
 */
export async function getSalesReport(
  range: DateRange
): Promise<SalesReport> {
  const { data, error } = await supabaseAdmin.rpc('get_sales_report', {
    p_from_date: range.from?.toISOString() ?? null,
    p_to_date: range.to?.toISOString() ?? null,
  })

  if (error) {
    console.error('[getSalesReport] rpc error:', error)
    return EMPTY_REPORT
  }

  if (!data) return EMPTY_REPORT

  const raw = data as Record<string, unknown>

  const totalsRaw = (raw.totals ?? {}) as Record<string, unknown>

  const byProvider = Array.isArray(raw.by_provider)
    ? (raw.by_provider as ProviderStat[]).map((p) => ({
        provider: String(p.provider ?? 'unknown'),
        order_count: Number(p.order_count ?? 0),
        revenue: Number(p.revenue ?? 0),
      }))
    : []

  const byCategory = Array.isArray(raw.by_category)
    ? (raw.by_category as CategoryStat[]).map((c) => ({
        category: String(c.category ?? 'Uncategorized'),
        revenue: Number(c.revenue ?? 0),
        units_sold: Number(c.units_sold ?? 0),
        order_count: Number(c.order_count ?? 0),
      }))
    : []

  const topProducts = Array.isArray(raw.top_products)
    ? (raw.top_products as TopProduct[]).map((p) => ({
        id: String(p.id ?? ''),
        name: String(p.name ?? 'Unknown'),
        units_sold: Number(p.units_sold ?? 0),
        revenue: Number(p.revenue ?? 0),
        order_count: Number(p.order_count ?? 0),
      }))
    : []

  const dailySeries = Array.isArray(raw.daily_series)
    ? (raw.daily_series as DailySeriesPoint[]).map((d) => ({
        day: String(d.day ?? ''),
        revenue: Number(d.revenue ?? 0),
        order_count: Number(d.order_count ?? 0),
      }))
    : []

  return {
    totals: {
      total_orders: Number(totalsRaw.total_orders ?? 0),
      total_revenue: Number(totalsRaw.total_revenue ?? 0),
      avg_order_value: Number(totalsRaw.avg_order_value ?? 0),
    },
    by_status: (raw.by_status ?? {}) as Record<string, number>,
    by_provider: byProvider,
    by_category: byCategory,
    top_products: topProducts,
    daily_series: dailySeries,
  }
}