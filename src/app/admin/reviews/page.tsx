import { getAdminReviews, getReviewAdminStats } from '@/lib/reviews/queries'
import ReviewAdminStats from '@/components/admin/ReviewAdminStats'
import ReviewsAdminTable from '@/components/admin/ReviewsAdminTable'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          Moderate customer reviews before they go live.
        </p>
      </div>

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