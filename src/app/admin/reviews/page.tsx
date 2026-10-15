import { getAdminReviews, getReviewAdminStats } from '@/lib/reviews/queries'
import ReviewAdminStats from '@/components/admin/ReviewAdminStats'
import ReviewsAdminTable from '@/components/admin/ReviewsAdminTable'
import { Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const filters = {
    status: ((sp.status as string) || 'pending') as
      | 'pending'
      | 'approved'
      | 'rejected'
      | 'all',
    search: (sp.q as string) || '',
    page: parseInt((sp.page as string) || '1', 10),
    perPage: 20,
  }

  const [stats, reviews] = await Promise.all([
    getReviewAdminStats(),
    getAdminReviews(filters),
  ])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Star
            size={11}
            className="text-amber-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Moderation
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Reviews
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Moderate customer reviews before they go live on the storefront.
            </p>
          </div>
        </div>
      </header>

      <ReviewAdminStats stats={stats} />

      <ReviewsAdminTable
        rows={reviews.rows}
        total={reviews.total}
        page={reviews.page}
        totalPages={reviews.totalPages}
        initialFilters={{
          status: filters.status,
          search: filters.search,
        }}
      />
    </div>
  )
}