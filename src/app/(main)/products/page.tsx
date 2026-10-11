// src/app/(main)/products/page.tsx
import { supabasePublic } from '@/lib/supabase/public'
import ProductGrid from '@/components/ProductGrid'
import ProductFiltersSidebar from '@/components/ProductFilters'
import ProductSort from '@/components/ProductSort'
import ActiveFilters from '@/components/ActiveFilters'
import { Filter } from 'lucide-react'
import { parseProductImages } from '@/lib/utils'
import { parseFilters, type SortOption } from '@/lib/products/filters'
import { getBatchRatingSummaries } from '@/lib/reviews/queries'

export const revalidate = 300

const CATEGORIES = [
  'Pants',
  'Shirts',
  'Coats',
  'Waistcoats',
  'Suits',
  'Gurkha',
  '2 Piece',
  '3 Piece',
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const filters = parseFilters(sp)

  // ─────────────────────────────────────────────
  // Build query
  // ─────────────────────────────────────────────
  let query = supabasePublic
    .from('products')
    .select(
      'id, name, price, compare_at_price, images, stock, is_new_arrival, category_main'
    )
    .eq('is_active', true)

  if (filters.category) {
    query = query.eq('category_main', filters.category)
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters.inStockOnly) {
    query = query.gt('stock', 0)
  }

  // Sort
  const sort: SortOption = filters.sort ?? 'newest'
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
      // New arrivals get priority, then most recent
      query = query
        .order('is_new_arrival', { ascending: false })
        .order('created_at', { ascending: false })
      break
    case 'rating':
      // Rating sort happens post-query (needs aggregate)
      query = query.order('created_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data: products } = await query

  const parsed = (products || []).map((product) => ({
    ...product,
    images: parseProductImages(product.images),
  }))

  // ─────────────────────────────────────────────
  // Fetch rating summaries for all products (batch)
  // ─────────────────────────────────────────────
  const productIds = parsed.map((p) => p.id)
  const ratingMap = await getBatchRatingSummaries(productIds)

  // Attach ratings
  let enriched = parsed.map((p) => ({
    ...p,
    ratingSummary: ratingMap[p.id] ?? null,
  }))

  // Post-sort by rating if requested
  if (sort === 'rating') {
    enriched = enriched.sort((a, b) => {
      const aRating = a.ratingSummary?.averageRating ?? 0
      const bRating = b.ratingSummary?.averageRating ?? 0
      if (bRating !== aRating) return bRating - aRating
      // tie-break: more reviews first
      const aCount = a.ratingSummary?.totalCount ?? 0
      const bCount = b.ratingSummary?.totalCount ?? 0
      return bCount - aCount
    })
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {filters.category || 'All Products'}
          </h1>
          <p className="text-gray-400 mt-1">
            {enriched.length} product{enriched.length === 1 ? '' : 's'} found
          </p>
        </div>

        {/* Layout */}
        <div className="flex gap-6">
          <ProductFiltersSidebar
            basePath="/products"
            categories={CATEGORIES}
            filters={filters}
          />

          <div className="flex-1 min-w-0">
            {/* Sort + active filters */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <ActiveFilters basePath="/products" filters={filters} />
              <div className="ml-auto">
                <ProductSort basePath="/products" currentSort={sort} />
              </div>
            </div>

            {enriched.length > 0 ? (
              <ProductGrid products={enriched} />
            ) : (
              <div className="text-center py-16">
                <Filter size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 mb-2">No products match your filters.</p>
                <a
                  href="/products"
                  className="text-sm text-indigo-400 hover:underline"
                >
                  Clear all filters
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}