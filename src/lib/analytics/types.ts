// ─────────────────────────────────────────────────────────────
// Sales Report Types
// ─────────────────────────────────────────────────────────────

export interface SalesTotals {
  total_orders: number
  total_revenue: number
  avg_order_value: number | string
}

export interface ProviderStat {
  provider: string
  order_count: number
  revenue: number
}

export interface CategoryStat {
  category: string
  revenue: number
  units_sold: number
  order_count: number
}

export interface TopProduct {
  id: string
  name: string
  units_sold: number
  revenue: number
  order_count: number
}

export interface DailySeriesPoint {
  day: string
  revenue: number
  order_count: number
}

export interface SalesReport {
  totals: SalesTotals
  by_status: Record<string, number>
  by_provider: ProviderStat[]
  by_category: CategoryStat[]
  top_products: TopProduct[]
  daily_series: DailySeriesPoint[]
}

// ─────────────────────────────────────────────────────────────
// Date range presets
// ─────────────────────────────────────────────────────────────

export type DateRangePreset = '7d' | '30d' | '90d' | 'all' | 'custom'

export interface DateRange {
  from: Date | null
  to: Date | null
  /**
   * Optional — server queries only need `from` / `to`.
   * Callers can omit it (e.g., when constructing a
   * synthetic "previous period" range for trend comparison).
   */
  preset?: DateRangePreset
}

export const RANGE_PRESETS: Array<{ value: DateRangePreset; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

// ─────────────────────────────────────────────────────────────
// Compute from/to dates for a preset
// ─────────────────────────────────────────────────────────────
export function computeRange(preset: DateRangePreset): {
  from: Date | null
  to: Date | null
  preset: DateRangePreset
} {
  const now = new Date()

  switch (preset) {
    case '7d':
      return { from: new Date(now.getTime() - 7 * 86400000), to: now, preset }
    case '30d':
      return { from: new Date(now.getTime() - 30 * 86400000), to: now, preset }
    case '90d':
      return { from: new Date(now.getTime() - 90 * 86400000), to: now, preset }
    case 'all':
    default:
      return { from: null, to: null, preset: 'all' }
  }
}