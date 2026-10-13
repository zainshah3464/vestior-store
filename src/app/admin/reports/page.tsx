import { getSalesReport } from '@/lib/analytics/sales-queries'
import {
  computeRange,
  RANGE_PRESETS,
  type DateRangePreset,
  type SalesReport,
} from '@/lib/analytics/types'
import ReportsDashboard from '@/components/admin/ReportsDashboard'

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
  let previousRange: { from: Date | null; to: Date | null; preset?: DateRangePreset }
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

  // Fetch current + previous in parallel.
  // For "all" preset, reuse the current promise as previous (no comparison).
  const currentPromise: Promise<SalesReport> = getSalesReport(currentRange)
  const previousPromise: Promise<SalesReport> =
    preset === 'all' ? currentPromise : getSalesReport(previousRange)

  const [current, previous] = await Promise.all([
    currentPromise,
    previousPromise,
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Sales Reports
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Revenue analytics, category breakdown, and top-selling products.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE_PRESETS.map((p) => (
            <a
              key={p.value}
              href={`/admin/reports?range=${p.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                preset === p.value
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>

      <ReportsDashboard current={current} previous={previous} preset={preset} />
    </div>
  )
}