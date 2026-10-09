import {
  getLiveUsers,
  getTodayStats,
  getConversionFunnel,
  getTopProducts,
  getDeviceBreakdown,
  getTrafficSources,
} from '@/lib/tracking/queries'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [live, today, funnel, topProducts, devices, referrers] =
    await Promise.all([
      getLiveUsers(),
      getTodayStats(),
      getConversionFunnel(7),
      getTopProducts(7, 10),
      getDeviceBreakdown(7),
      getTrafficSources(7),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          First-party event tracking — last 7 days unless noted.
        </p>
      </div>

      <AnalyticsDashboard
        live={live}
        today={today}
        funnel={funnel}
        topProducts={topProducts}
        devices={devices}
        referrers={referrers}
      />
    </div>
  )
}