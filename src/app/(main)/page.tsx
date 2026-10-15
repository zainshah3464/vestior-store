// src/app/(main)/page.tsx
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import HomeProductSection from '@/components/HomeProductSection'
import RecommendedRow from '@/components/recommendations/RecommendedRow'
import { supabasePublic } from '@/lib/supabase/public'
import { getTrendingProducts } from '@/lib/recommendations/queries'
import { parseProductImages } from '@/lib/utils'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Cache homepage for 5 minutes — great for LCP
export const revalidate = 300

// Columns actually used by <ProductCard />
const PRODUCT_COLUMNS =
  'id, name, price, compare_at_price, images, stock, is_new_arrival'

export default async function HomePage() {
  const supabase = supabasePublic

  // ────────────────────────────────────────────
  // Parallel fetch — all three queries fire simultaneously
  // ────────────────────────────────────────────
  const [featuredResult, newArrivalsResult, trending] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false }),

    supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('is_active', true)
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false }),

    getTrendingProducts(8, 7),
  ])

  // Parse images for both arrays
  const parsedFeatured = (featuredResult.data || []).map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))
  const parsedNewArrivals = (newArrivalsResult.data || []).map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))

  return (
    <>
      <Hero />
      <CategorySection />

      {/* ─────────────────────────────────────────────
          Featured Collection
         ───────────────────────────────────────────── */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden">
        {/* Ambient gradient orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-blue-500/[0.06] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-500/[0.04] blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-20">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/25 mb-5 backdrop-blur-sm">
              <Sparkles
                size={13}
                className="text-blue-400"
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium text-blue-300">
                Premium Selection
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
              Featured{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Collection
                </span>
                {/* Underline accent */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
                />
              </span>
            </h2>

            <p className="text-gray-400 text-[13px] sm:text-[14px] md:text-[15px] max-w-xl mx-auto leading-relaxed">
              Curated pieces for the discerning gentleman — crafted with
              precision, finished with elegance.
            </p>
          </div>

          {parsedFeatured.length > 0 ? (
            <HomeProductSection products={parsedFeatured} />
          ) : (
            <EmptyState message="No featured products available" />
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          New Arrivals
         ───────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] py-20 md:py-28 overflow-hidden">
        {/* Subtle divider */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-20">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/25 mb-5 backdrop-blur-sm">
              <Clock
                size={13}
                className="text-emerald-400"
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium text-emerald-300">
                Just Arrived
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
              New{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Arrivals
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
                />
              </span>
            </h2>

            <p className="text-gray-400 text-[13px] sm:text-[14px] md:text-[15px] max-w-xl mx-auto leading-relaxed">
              Fresh styles for the season — be the first to experience our
              latest craftsmanship.
            </p>
          </div>

          {parsedNewArrivals.length > 0 ? (
            <HomeProductSection products={parsedNewArrivals} />
          ) : (
            <EmptyState message="No new arrivals available" />
          )}

          {/* View All CTA */}
          <div className="text-center mt-14 md:mt-16">
            <Link
              href="/new-arrivals"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300 backdrop-blur-sm"
            >
              <span>View All New Arrivals</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          Trending Now
         ───────────────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="relative bg-[#0A0A0A] overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          />
          <RecommendedRow
            title="Trending Now"
            subtitle="What everyone's viewing this week"
            products={trending}
          />
        </section>
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// Empty state (shared for both sections)
// ─────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <p className="text-[13px] text-gray-500">{message}</p>
    </div>
  )
}