import { fetchAuditLogs, fetchAuditStats } from '@/lib/audit'
import AuditStats from '@/components/admin/AuditStats'
import AuditTable from '@/components/admin/AuditTable'

export const dynamic = 'force-dynamic'

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const filters = {
    action: (sp.action as string) || 'all',
    targetType: (sp.targetType as string) || 'all',
    search: (sp.q as string) || '',
    page: parseInt((sp.page as string) || '1', 10),
    perPage: 25,
  }

  const [stats, logs] = await Promise.all([
    fetchAuditStats(),
    fetchAuditLogs(filters),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-1">
          Every admin action, tracked and timestamped.
        </p>
      </div>

      <AuditStats stats={stats} />

      <AuditTable
        rows={logs.rows}
        total={logs.total}
        page={logs.page}
        totalPages={logs.totalPages}
        initialFilters={{
          action: filters.action,
          targetType: filters.targetType,
          search: filters.search,
        }}
      />
    </div>
  )
}