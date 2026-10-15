import { fetchEmailLogs, fetchEmailStats } from '@/lib/email/queries'
import EmailStats from '@/components/admin/EmailStats'
import EmailsTable from '@/components/admin/EmailsTable'
import { Mail } from 'lucide-react'

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
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Mail size={11} className="text-blue-400" aria-hidden="true" />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Delivery
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Emails
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Track all transactional emails sent to customers — delivery,
              status, and message IDs.
            </p>
          </div>
        </div>
      </header>

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