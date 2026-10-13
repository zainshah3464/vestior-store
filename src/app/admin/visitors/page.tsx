import { fetchSessions, getVisitorOverview } from '@/lib/tracking/session-queries'
import VisitorsStats from '@/components/admin/VisitorsStats'
import VisitorsTable from '@/components/admin/VisitorsTable'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Visitors</h1>
        <p className="text-gray-400 text-sm mt-1">
          Every session — guests, new visitors, returning customers, admins.
        </p>
      </div>

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