import { fetchSessions, getVisitorOverview } from '@/lib/tracking/session-queries'
import VisitorsStats from '@/components/admin/VisitorsStats'
import VisitorsTable from '@/components/admin/VisitorsTable'
import { Users2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const filters = {
    visitorType: (sp.type as string) || 'all',
    search: (sp.q as string) || '',
    page: parseInt((sp.page as string) || '1', 10),
    perPage: 25,
  }

  const [overview, sessions] = await Promise.all([
    getVisitorOverview(),
    fetchSessions({
      visitorType: filters.visitorType as never,
      search: filters.search,
      page: filters.page,
      perPage: filters.perPage,
    }),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Users2
            size={11}
            className="text-emerald-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Audience
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Visitors
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Every session — guests, new visitors, returning customers, admins.
            </p>
          </div>
        </div>
      </header>

      <VisitorsStats overview={overview} />

      <VisitorsTable
        rows={sessions.rows}
        total={sessions.total}
        page={sessions.page}
        totalPages={sessions.totalPages}
        initialFilters={{
          visitorType: filters.visitorType,
          search: filters.search,
        }}
      />
    </div>
  )
}