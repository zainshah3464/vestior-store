import {
  getLiveUsers,
  getTodayStats,
  getConversionFunnel,
  getTopProducts,
  getDeviceBreakdown,
  getTrafficSources,
  getNewVsReturning,
} from '@/lib/tracking/queries'
import {
  getProductSalesStats,
  getProductPerformance,
} from '@/lib/analytics/product-queries'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import ProductAnalytics from '@/components/admin/ProductAnalytics'
import NewVsReturningChart from '@/components/admin/NewVsReturningChart'
import LiveUsersWidget from '@/components/admin/LiveUsersWidget'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const daysParam = typeof sp.days === 'string' ? parseInt(sp.days, 10) : 7
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 7

  const [
    live,
    today,
    funnel,
    topProducts,
    devices,
    referrers,
    newVsReturning,
  ] = await Promise.all([
    getLiveUsers(),
    getTodayStats(),
    getConversionFunnel(7),
    getTopProducts(7, 10),
    getDeviceBreakdown(7),
    getTrafficSources(7),
    getNewVsReturning(30),
  ])

  const [salesReport, performance] = await Promise.all([
    getProductSalesStats(50),
    getProductPerformance(days),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <BarChart3
              size={11}
              className="text-indigo-400"
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Insights
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
            Analytics
          </h1>
          <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-xl leading-relaxed">
            First-party event tracking + product performance analytics.
          </p>
        </div>

        {/* Days filter — pills */}
        <div
          role="tablist"
          aria-label="Date range filter"
          className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex-shrink-0"
        >
          {[7, 30, 90].map((d) => {
            const active = days === d
            return (
              <Link
                key={d}
                href={`/admin/analytics?days=${d}`}
                role="tab"
                aria-selected={active}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-indigo-500/[0.15] text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.25)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {d}d
              </Link>
            )
          })}
        </div>
      </header>

      {/* Event-based dashboard */}
      <AnalyticsDashboard
        live={live}
        today={today}
        funnel={funnel}
        topProducts={topProducts}
        devices={devices}
        referrers={referrers}
      />

      {/* Live Users + New vs Returning */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <LiveUsersWidget />

        <section aria-label="New vs returning visitors" className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-[15px] sm:text-base font-semibold text-white tracking-[-0.01em]">
                New vs Returning
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Visitor breakdown · last 30 days
              </p>
            </div>
          </div>
          <NewVsReturningChart data={newVsReturning} />
        </section>
      </div>

      {/* Product Analytics section */}
      <ProductAnalytics
        salesReport={salesReport}
        performance={performance}
        days={days}
      />
    </div>
  )
}