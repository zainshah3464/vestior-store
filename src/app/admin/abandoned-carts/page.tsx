import { getCartStats, listAbandonedCarts } from '@/lib/carts/queries'
import CartStats from '@/components/admin/CartStats'
import AbandonedCartsTable from '@/components/admin/AbandonedCartsTable'
import { ShoppingBag } from 'lucide-react'

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
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <ShoppingBag
            size={11}
            className="text-rose-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Recovery
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Abandoned Carts
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Auto-reminder emails sent 2h after abandonment (max 3 per cart).
            </p>
          </div>
        </div>
      </header>

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