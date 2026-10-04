// src/app/(main)/category/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import ProductGrid from '@/components/ProductGrid'
import { parseProductImages } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/StructuredData'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  return {
    title: `${decodedSlug} Collection`,
    description: `Shop our premium ${decodedSlug} collection at VESTIOR. Hand-tailored menswear for the modern gentleman.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${decodedSlug} Collection | VESTIOR`,
      description: `Premium tailored ${decodedSlug} — crafted with precision and elegance.`,
      url: `${SITE_URL}/category/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const decodedSlug = decodeURIComponent(slug)

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, price, compare_at_price, images, stock, is_new_arrival'
    )
    .eq('category_main', decodedSlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const parsedProducts = (products || []).map((p) => ({
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
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            {decodedSlug}
          </h1>
          {parsedProducts.length > 0 ? (
            <ProductGrid products={parsedProducts} />
          ) : (
            <p className="text-gray-500">No products in this category.</p>
          )}
        </div>
      </div>
    </>
  )
}