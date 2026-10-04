// src/app/admin/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin'
import DashboardClient from '@/components/admin/DashboardClient'

export default async function AdminDashboard() {
  // ────────────────────────────────────────────
  // Parallel execution — everything fires at once
  // ────────────────────────────────────────────

  const today = new Date()
  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 6)

  const previous7Start = new Date(last7Days)
  previous7Start.setDate(previous7Start.getDate() - 7)

  const [
    statsResult,
    recentRevenueOrdersResult,
    prevOrdersResult,
    recentOrdersResult,
  ] = await Promise.all([
    // 1. Aggregated stats — single RPC call
    supabaseAdmin.rpc('get_dashboard_stats'),

    // 2. Last 7 days revenue (for area chart)
    supabaseAdmin
      .from('orders')
      .select('created_at, total')
      .gte('created_at', last7Days.toISOString())
      .order('created_at', { ascending: true }),

    // 3. Previous 7 days (for trend calculation)
    supabaseAdmin
      .from('orders')
      .select('total')
      .gte('created_at', previous7Start.toISOString())
      .lt('created_at', last7Days.toISOString()),

    // 4. Recent 5 orders
    supabaseAdmin
      .from('orders')
      .select('id, user_email, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // ────────────────────────────────────────────
  // Extract stats from RPC result
  // ────────────────────────────────────────────
  const stats = (statsResult.data as {
    product_count: number
    order_count: number
    user_count: number
    total_revenue: number
    status_counts: Record<string, number>
  } | null) ?? {
    product_count: 0,
    order_count: 0,
    user_count: 0,
    total_revenue: 0,
    status_counts: {},
  }

  const productCount = stats.product_count
  const orderCount = stats.order_count
  const userCount = stats.user_count
  const totalRevenue = Number(stats.total_revenue)
  const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0

  // ────────────────────────────────────────────
  // Sales chart — group by day
  // ────────────────────────────────────────────
  const salesByDay: Record<string, number> = {}
  recentRevenueOrdersResult.data?.forEach((order) => {
    const day = new Date(order.created_at).toLocaleDateString('en-GB')
    salesByDay[day] = (salesByDay[day] || 0) + (order.total || 0)
  })
  const chartData = Object.entries(salesByDay).map(([date, total]) => ({
    date,
    total,
  }))

  // ────────────────────────────────────────────
  // Trend calculation
  // ────────────────────────────────────────────
  const prevOrders = prevOrdersResult.data ?? []
  const prevRevenue = prevOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const prevOrderCount = prevOrders.length

  let revenueTrend = 0
  if (prevRevenue > 0) {
    revenueTrend = ((totalRevenue - prevRevenue) / prevRevenue) * 100
  }

  let orderTrend = 0
  if (prevOrderCount > 0) {
    orderTrend = ((orderCount - prevOrderCount) / prevOrderCount) * 100
  }

  // ────────────────────────────────────────────
  // Status distribution — already computed by RPC
  // ────────────────────────────────────────────
  const ALL_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ] as const

  const statusChartData = ALL_STATUSES.map((name) => ({
    name,
    value: stats.status_counts[name] || 0,
  }))

  // ────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────
  return (
    <DashboardClient
      productCount={productCount}
      orderCount={orderCount}
      userCount={userCount}
      totalRevenue={totalRevenue}
      avgOrderValue={avgOrderValue}
      chartData={chartData}
      statusChartData={statusChartData}
      recentOrders={recentOrdersResult.data || []}
      revenueTrend={revenueTrend}
      orderTrend={orderTrend}
    />
  )
}