import {
  fetchPayments,
  fetchPaymentStats,
  type PaymentFilters,
} from '@/lib/payments/queries'
import PaymentsStats from '@/components/admin/PaymentsStats'
import PaymentsTable from '@/components/admin/PaymentsTable'
import { Wallet } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const filters: PaymentFilters = {
    provider: (sp.provider as PaymentFilters['provider']) || 'all',
    status: (sp.status as string) || 'all',
    search: (sp.q as string) || '',
    page: parseInt((sp.page as string) || '1', 10),
    perPage: 20,
  }

  const [stats, payments] = await Promise.all([
    fetchPaymentStats(),
    fetchPayments(filters),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Wallet
            size={11}
            className="text-emerald-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Transactions
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Payments
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Track transactions, refunds, and provider performance in one
              place.
            </p>
          </div>
        </div>
      </header>

      <PaymentsStats stats={stats} />

      <PaymentsTable
        rows={payments.rows}
        total={payments.total}
        page={payments.page}
        totalPages={payments.totalPages}
        initialFilters={{
          provider: filters.provider || 'all',
          status: filters.status || 'all',
          search: filters.search || '',
        }}
      />
    </div>
  )
}