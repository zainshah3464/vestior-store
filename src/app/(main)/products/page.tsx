// src/app/(main)/products/page.tsx
import { supabasePublic } from '@/lib/supabase/public'
import ProductGrid from '@/components/ProductGrid'
import ProductFiltersSidebar from '@/components/ProductFilters'
import ProductSort from '@/components/ProductSort'
import ActiveFilters from '@/components/ActiveFilters'
import { Filter, PackageOpen } from 'lucide-react'
import Link from 'next/link'
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
      query = query
        .order('is_new_arrival', { ascending: false })
        .order('created_at', { ascending: false })
      break
    case 'rating':
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
  // Batch rating summaries
  // ─────────────────────────────────────────────
  const productIds = parsed.map((p) => p.id)
  const ratingMap = await getBatchRatingSummaries(productIds)

  // Attach ratings
  let enriched = parsed.map((p) => ({
    ...p,
    ratingSummary: ratingMap[p.id] ?? null,
  }))

  // Post-sort by rating
  if (sort === 'rating') {
    enriched = enriched.sort((a, b) => {
      const aRating = a.ratingSummary?.averageRating ?? 0
      const bRating = b.ratingSummary?.averageRating ?? 0
      if (bRating !== aRating) return bRating - aRating
      const aCount = a.ratingSummary?.totalCount ?? 0
      const bCount = b.ratingSummary?.totalCount ?? 0
      return bCount - aCount
    })
  }

  const productCount = enriched.length
  const hasProducts = productCount > 0
  const pageTitle = filters.category || 'All Products'

  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-24 xl:pt-28 pb-20 md:pb-24 xl:pb-28 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient backdrop
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.03] blur-[110px]" />
      </div>

      <div className="relative z-10 w-full px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-28">
        {/* ─────────────────────────────────────────────
            Page header — editorial
           ───────────────────────────────────────────── */}
        <header className="mb-8 md:mb-12 xl:mb-14 2xl:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <PackageOpen
              size={11}
              className="text-blue-400"
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Collection
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white tracking-[-0.02em] leading-tight">
              {pageTitle}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
              {productCount.toLocaleString()}{' '}
              {productCount === 1 ? 'product' : 'products'}
            </p>
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            Layout
           ───────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {/* Sidebar (desktop + mobile trigger) */}
          <ProductFiltersSidebar
            basePath="/products"
            categories={CATEGORIES}
            filters={filters}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: active filters + sort */}
            <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
              <div className="flex-1 min-w-0">
                <ActiveFilters
                  basePath="/products"
                  filters={filters}
                />
              </div>
              <div className="flex-shrink-0 ml-auto">
                <ProductSort
                  basePath="/products"
                  currentSort={sort}
                />
              </div>
            </div>

            {/* Results */}
            {hasProducts ? (
              <ProductGrid products={enriched} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty state — refined, editorial
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 md:py-28 xl:py-32 2xl:py-36 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/[0.06] blur-[100px]"
      />

      <div className="relative px-6">
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/[0.05] border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-blue-500/5">
          <Filter
            size={28}
            className="text-blue-400/70"
            aria-hidden="true"
          />
        </div>

        <h3 className="text-[17px] sm:text-lg font-semibold text-white mb-2">
          No products match your filters
        </h3>
        <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
          Try adjusting your price range, category, or availability to see
          more results.
        </p>

        <Link
          href="/products"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300"
        >
          Clear all filters
        </Link>
      </div>
    </div>
  )
}