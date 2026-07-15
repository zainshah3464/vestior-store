// src/app/admin/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin'
import DashboardClient from '@/components/admin/DashboardClient'

export default async function AdminDashboard() {
  // ----- Current counts -----
  const { count: productCount } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
  const { count: orderCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Safe counts (null → 0)
  const safeOrderCount = orderCount ?? 0

  // ----- Current revenue & avg -----
  const { data: allOrders } = await supabaseAdmin.from('orders').select('total')
  const totalRevenue = allOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const avgOrderValue = safeOrderCount ? totalRevenue / safeOrderCount : 0

  // ----- Sales last 7 days (for chart) -----
  const today = new Date()
  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 6)

  const { data: recentRevenueOrders } = await supabaseAdmin
    .from('orders')
    .select('created_at, total')
    .gte('created_at', last7Days.toISOString())
    .order('created_at', { ascending: true })

  const salesByDay: Record<string, number> = {}
  recentRevenueOrders?.forEach(order => {
    const day = new Date(order.created_at).toLocaleDateString('en-GB')
    salesByDay[day] = (salesByDay[day] || 0) + (order.total || 0)
  })
  const chartData = Object.entries(salesByDay).map(([date, total]) => ({ date, total }))

  // ----- Previous period for trends (7 days) -----
  const previous7Start = new Date(last7Days)
  previous7Start.setDate(previous7Start.getDate() - 7)
  const previous7End = new Date(last7Days)

  const { data: prevOrders } = await supabaseAdmin
    .from('orders')
    .select('total')
    .gte('created_at', previous7Start.toISOString())
    .lt('created_at', previous7End.toISOString())

  const prevRevenue = prevOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const prevOrderCount = prevOrders?.length || 0

  // Revenue trend (percentage change)
  let revenueTrend = 0
  if (prevRevenue > 0) {
    revenueTrend = ((totalRevenue - prevRevenue) / prevRevenue) * 100
  }
  // Order count trend
  let orderTrend = 0
  if (prevOrderCount > 0) {
    orderTrend = ((safeOrderCount - prevOrderCount) / prevOrderCount) * 100
  }

  // ----- Order status distribution -----
  const { data: statusData } = await supabaseAdmin.from('orders').select('status')
  const statusCounts: Record<string, number> = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  statusData?.forEach(order => {
    if (statusCounts.hasOwnProperty(order.status)) {
      statusCounts[order.status as keyof typeof statusCounts]++
    }
  })
  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // ----- Recent 5 orders -----
  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select('id, user_email, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardClient
      productCount={productCount || 0}
      orderCount={safeOrderCount}
      userCount={userCount || 0}
      totalRevenue={totalRevenue}
      avgOrderValue={avgOrderValue}
      chartData={chartData}
      statusChartData={statusChartData}
      recentOrders={recentOrders || []}
      revenueTrend={revenueTrend}
      orderTrend={orderTrend}
    />
  )
}