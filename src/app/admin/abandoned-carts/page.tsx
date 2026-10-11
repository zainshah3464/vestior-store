import { getCartStats, listAbandonedCarts } from '@/lib/carts/queries'
import CartStats from '@/components/admin/CartStats'
import AbandonedCartsTable from '@/components/admin/AbandonedCartsTable'

export const dynamic = 'force-dynamic'

export default async function AbandonedCartsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const page = parseInt((sp.page as string) || '1', 10)
  const perPage = 20

  const [stats, list] = await Promise.all([
    getCartStats(),
    listAbandonedCarts({
      onlyPending: sp.show === 'pending',
      limit: perPage,
      skip: (page - 1) * perPage,
    }),
  ])

  const totalPages = Math.ceil(list.total / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Abandoned Carts
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Auto-reminder emails sent 2h after abandonment (max 3 per cart).
        </p>
      </div>

      <CartStats stats={stats} />

      <AbandonedCartsTable
        items={list.items}
        total={list.total}
        page={page}
        totalPages={totalPages}
      />
    </div>
  )
}