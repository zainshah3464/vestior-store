import { getSalesReport } from '@/lib/analytics/sales-queries'
import {
  computeRange,
  RANGE_PRESETS,
  type DateRangePreset,
  type SalesReport,
} from '@/lib/analytics/types'
import ReportsDashboard from '@/components/admin/ReportsDashboard'
import { FileBarChart } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const VALID_PRESETS: DateRangePreset[] = ['7d', '30d', '90d', 'all']

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const presetParam = typeof sp.range === 'string' ? sp.range : '30d'
  const preset: DateRangePreset = VALID_PRESETS.includes(
    presetParam as DateRangePreset
  )
    ? (presetParam as DateRangePreset)
    : '30d'

  const currentRange = computeRange(preset)

  // Compute previous period of equal length (for trend comparison)
  let previousRange: {
    from: Date | null
    to: Date | null
    preset?: DateRangePreset
  }
  if (currentRange.from && currentRange.to) {
    const durationMs = currentRange.to.getTime() - currentRange.from.getTime()
    previousRange = {
      from: new Date(currentRange.from.getTime() - durationMs),
      to: new Date(currentRange.from.getTime()),
      preset: 'custom',
    }
  } else {
    previousRange = { from: null, to: null, preset: 'all' }
  }

  const currentPromise: Promise<SalesReport> = getSalesReport(currentRange)
  const previousPromise: Promise<SalesReport> =
    preset === 'all' ? currentPromise : getSalesReport(previousRange)

  const [current, previous] = await Promise.all([
    currentPromise,
    previousPromise,
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <FileBarChart
              size={11}
              className="text-emerald-400"
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Analytics
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
            Sales Reports
          </h1>
          <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-xl leading-relaxed">
            Revenue analytics, category breakdown, and top-selling products.
          </p>
        </div>

        {/* Range filter — segmented pill group */}
        <div
          role="tablist"
          aria-label="Date range filter"
          className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm flex-shrink-0 flex-wrap"
        >
          {RANGE_PRESETS.map((p) => {
            const active = preset === p.value
            return (
              <Link
                key={p.value}
                href={`/admin/reports?range=${p.value}`}
                role="tab"
                aria-selected={active}
                className={`relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-indigo-500/[0.15] text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.25)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {p.label}
              </Link>
            )
          })}
        </div>
      </header>

      <ReportsDashboard
        current={current}
        previous={previous}
        preset={preset}
      />
    </div>
  )
}