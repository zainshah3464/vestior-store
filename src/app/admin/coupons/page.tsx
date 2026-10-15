import { getAllCoupons, getCouponStats } from '@/lib/coupons/queries'
import CouponStats from '@/components/admin/CouponStats'
import CouponsTable from '@/components/admin/CouponsTable'
import { Ticket } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const [coupons, stats] = await Promise.all([
    getAllCoupons(),
    getCouponStats(),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Ticket
            size={11}
            className="text-violet-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Promotions
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Coupons
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Create and manage discount codes. Usage is tracked atomically to
              prevent over-redemption.
            </p>
          </div>
        </div>
      </header>

      <CouponStats stats={stats} />

      <CouponsTable coupons={coupons} />
    </div>
  )
}