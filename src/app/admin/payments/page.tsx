import {
  fetchPayments,
  fetchPaymentStats,
  type PaymentFilters,
} from '@/lib/payments/queries'
import PaymentsStats from '@/components/admin/PaymentsStats'
import PaymentsTable from '@/components/admin/PaymentsTable'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Payments
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Track transactions, refunds, and provider performance.
        </p>
      </div>

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