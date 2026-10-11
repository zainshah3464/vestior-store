import { getAllCoupons, getCouponStats } from '@/lib/coupons/queries'
import CouponStats from '@/components/admin/CouponStats'
import CouponsTable from '@/components/admin/CouponsTable'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const [coupons, stats] = await Promise.all([
    getAllCoupons(),
    getCouponStats(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Coupons</h1>
        <p className="text-gray-400 text-sm mt-1">
          Create and manage discount codes. Usage is tracked atomically.
        </p>
      </div>

      <CouponStats stats={stats} />

      <CouponsTable coupons={coupons} />
    </div>
  )
}