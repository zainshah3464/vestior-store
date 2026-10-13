import {
  getLiveUsers,
  getTodayStats,
  getConversionFunnel,
  getTopProducts,
  getDeviceBreakdown,
  getTrafficSources,
} from '@/lib/tracking/queries'
import {
  getProductSalesStats,
  getProductPerformance,
} from '@/lib/analytics/product-queries'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import ProductAnalytics from '@/components/admin/ProductAnalytics'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const daysParam = typeof sp.days === 'string' ? parseInt(sp.days, 10) : 7
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 7

  const [live, today, funnel, topProducts, devices, referrers] =
    await Promise.all([
      getLiveUsers(),
      getTodayStats(),
      getConversionFunnel(7),
      getTopProducts(7, 10),
      getDeviceBreakdown(7),
      getTrafficSources(7),
    ])

  // Product-level analytics
  const [salesReport, performance] = await Promise.all([
    getProductSalesStats(50),
    getProductPerformance(days),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            First-party event tracking + product performance analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((d) => (
            <a
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                days === d
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Last {d}d
            </a>
          ))}
        </div>
      </div>

      {/* Existing event-based dashboard */}
      <AnalyticsDashboard
        live={live}
        today={today}
        funnel={funnel}
        topProducts={topProducts}
        devices={devices}
        referrers={referrers}
      />

      {/* New product analytics section */}
      <ProductAnalytics
        salesReport={salesReport}
        performance={performance}
        days={days}
      />
    </div>
  )
}