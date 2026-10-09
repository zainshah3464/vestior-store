import { fetchEmailLogs, fetchEmailStats } from '@/lib/email/queries'
import EmailStats from '@/components/admin/EmailStats'
import EmailsTable from '@/components/admin/EmailsTable'

export const dynamic = 'force-dynamic'

export default async function AdminEmailsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const filters = {
    template: (sp.template as string) || 'all',
    status: (sp.status as string) || 'all',
    search: (sp.q as string) || '',
    page: parseInt((sp.page as string) || '1', 10),
    perPage: 20,
  }

  const [stats, logs] = await Promise.all([
    fetchEmailStats(),
    fetchEmailLogs(filters),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Emails</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track all transactional emails sent to customers.
        </p>
      </div>

      <EmailStats stats={stats} />

      <EmailsTable
        rows={logs.rows}
        total={logs.total}
        page={logs.page}
        totalPages={logs.totalPages}
        initialFilters={{
          template: filters.template,
          status: filters.status,
          search: filters.search,
        }}
      />
    </div>
  )
}