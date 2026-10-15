import { createClient } from '@/lib/supabase/server'
import { supabasePublic } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'
import ReviewsSection from '@/components/reviews/ReviewsSection'
import RecommendedRow from '@/components/recommendations/RecommendedRow'
import RecentlyViewed from '@/components/recommendations/RecentlyViewed'
import { parseProductImages } from '@/lib/utils'
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData'
import {
  getApprovedReviews,
  getReviewStats,
  getUserReview,
} from '@/lib/reviews/queries'
import {
  getRelatedProducts,
  getYouMayAlsoLike,
} from '@/lib/recommendations/queries'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { data: product } = await supabasePublic
    .from('products')
    .select('name, description, price, images, category_main')
    .eq('id', id)
    .single()

  if (!product) return { title: 'Product Not Found' }

  const images = parseProductImages(product.images)
  const firstImage = images[0] || '/og-image.png'

  return {
    title: product.name,
    description:
      product.description ||
      `Shop ${product.name} at VESTIOR — premium tailored menswear.`,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description:
        product.description || `Shop ${product.name} at VESTIOR.`,
      images: [
        { url: firstImage, width: 1200, height: 630, alt: product.name },
      ],
      url: `${SITE_URL}/products/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description:
        product.description || `Shop ${product.name} at VESTIOR.`,
      images: [firstImage],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Public data (no cookies)
  const { data: product, error } = await supabasePublic
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) notFound()

  // Auth-aware data (cookies) — separate client
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch reviews + stats + user's own review + recommendations (parallel)
  const [reviews, stats, userReview, related, alsoLike] = await Promise.all([
    getApprovedReviews(id),
    getReviewStats(id),
    user ? getUserReview(user.id, id) : Promise.resolve(null),
    getRelatedProducts(id, product.category_main ?? '', product.price, 8),
    getYouMayAlsoLike(id, product.price, product.category_main, 8),
  ])

  const images = parseProductImages(product.images)
  const productWithParsedImages = { ...product, images }

  return (
    <>
      <ProductSchema
        product={productWithParsedImages}
        siteUrl={SITE_URL}
        reviewStats={stats}
        reviews={reviews.slice(0, 5)}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Products', url: `${SITE_URL}/products` },
          ...(product.category_main
            ? [
                {
                  name: product.category_main,
                  url: `${SITE_URL}/category/${encodeURIComponent(product.category_main)}`,
                },
              ]
            : []),
          { name: product.name, url: `${SITE_URL}/products/${id}` },
        ]}
      />

      {/* ─────────────────────────────────────────────
          Main product detail — client component
         ───────────────────────────────────────────── */}
      <ProductDetailClient product={productWithParsedImages} />

      {/* ─────────────────────────────────────────────
          Reviews section
         ───────────────────────────────────────────── */}
      <section className="relative bg-black">
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pt-20 md:pb-20">
          <ReviewsSection
            productId={id}
            initialReviews={reviews}
            stats={stats}
            currentUserId={user?.id ?? null}
            userReview={userReview}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Recommendations
         ───────────────────────────────────────────── */}
      <div className="relative bg-[#0A0A0A]">
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
        <div className="relative">
          <RecommendedRow
            title="You May Also Like"
            subtitle="Handpicked for you from our collection"
            products={alsoLike}
          />
          <RecentlyViewed excludeId={id} />
          <RecommendedRow
            title="Related Products"
            subtitle={`More from ${product.category_main ?? 'this category'}`}
            products={related}
          />
        </div>
      </div>
    </>
  )
}