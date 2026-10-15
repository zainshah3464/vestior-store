// src/app/(main)/category/[slug]/page.tsx
import { supabasePublic } from '@/lib/supabase/public'
import type { Metadata } from 'next'
import ProductGrid from '@/components/ProductGrid'
import ProductSort from '@/components/ProductSort'
import ProductFiltersSidebar from '@/components/ProductFilters'
import ActiveFilters from '@/components/ActiveFilters'
import { parseProductImages } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/StructuredData'
import { parseFilters, type SortOption } from '@/lib/products/filters'
import { Filter, PackageOpen } from 'lucide-react'
import Link from 'next/link'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'

// Cache for 5 minutes — category pages are public
export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const decoded = decodeURIComponent(slug)

  return {
    title: `${decoded} Collection`,
    description: `Shop our premium ${decoded} collection at VESTIOR. Hand-tailored menswear for the modern gentleman.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${decoded} Collection | VESTIOR`,
      description: `Premium tailored ${decoded} — crafted with precision and elegance.`,
      url: `${SITE_URL}/category/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const sp = await searchParams
  const decodedSlug = decodeURIComponent(slug)

  const filters = parseFilters(sp)
  // Force category from URL slug (overrides any stray query param)
  filters.category = decodedSlug

  const sort: SortOption = filters.sort ?? 'newest'

  let query = supabasePublic
    .from('products')
    .select(
      'id, name, price, compare_at_price, images, stock, is_new_arrival, category_main'
    )
    .eq('category_main', decodedSlug)
    .eq('is_active', true)

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters.inStockOnly) {
    query = query.gt('stock', 0)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  const parsed = (products || []).map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))

  const productCount = parsed.length
  const hasProducts = productCount > 0

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Products', url: `${SITE_URL}/products` },
          { name: decodedSlug, url: `${SITE_URL}/category/${slug}` },
        ]}
      />
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
                Category
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white tracking-[-0.02em] leading-tight">
                {decodedSlug}
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
              basePath={`/category/${slug}`}
              categories={[]} // hidden in category pages
              filters={filters}
            />

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: active filters + sort */}
              <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                <div className="flex-1 min-w-0">
                  <ActiveFilters
                    basePath={`/category/${slug}`}
                    filters={{ ...filters, category: undefined }} // hide category chip
                  />
                </div>
                <div className="flex-shrink-0 ml-auto">
                  <ProductSort
                    basePath={`/category/${slug}`}
                    currentSort={sort}
                  />
                </div>
              </div>

              {/* Results */}
              {hasProducts ? (
                <ProductGrid products={parsed} />
              ) : (
                <EmptyState categoryName={decodedSlug} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// Empty state — refined, editorial
// ─────────────────────────────────────────────
function EmptyState({ categoryName }: { categoryName: string }) {
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
          No {categoryName} match your filters
        </h3>
        <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
          Try adjusting your price range or availability to see more results.
        </p>

        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <Link
            href={`/category/${encodeURIComponent(categoryName)}`}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300"
          >
            Clear all filters
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
          >
            Browse all products
          </Link>
        </div>
      </div>
    </div>
  )
}