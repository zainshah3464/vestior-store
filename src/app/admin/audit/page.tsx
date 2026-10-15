import { fetchAuditLogs, fetchAuditStats } from '@/lib/audit'
import AuditStats from '@/components/admin/AuditStats'
import AuditTable from '@/components/admin/AuditTable'
import { ShieldCheck } from 'lucide-react'

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
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <ShieldCheck
            size={11}
            className="text-indigo-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Compliance
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Audit Logs
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Every privileged admin action, tracked and timestamped for
              compliance and accountability.
            </p>
          </div>
        </div>
      </header>

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