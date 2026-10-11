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

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Products', url: `${SITE_URL}/products` },
          { name: decodedSlug, url: `${SITE_URL}/category/${slug}` },
        ]}
      />
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {decodedSlug}
            </h1>
            <p className="text-gray-400 mt-1">
              {parsed.length} product{parsed.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex gap-6">
            <ProductFiltersSidebar
              basePath={`/category/${slug}`}
              categories={[]} // hidden in category pages
              filters={filters}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <ActiveFilters
                  basePath={`/category/${slug}`}
                  filters={{ ...filters, category: undefined }} // hide category chip
                />
                <div className="ml-auto">
                  <ProductSort
                    basePath={`/category/${slug}`}
                    currentSort={sort}
                  />
                </div>
              </div>

              {parsed.length > 0 ? (
                <ProductGrid products={parsed} />
              ) : (
                <p className="text-gray-400 text-center py-16">
                  No products match your filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}