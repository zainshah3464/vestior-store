// src/app/(main)/page.tsx
import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import HomeProductSection from '@/components/HomeProductSection'
import { createClient } from '@/lib/supabase/server'
import { parseProductImages } from '@/lib/utils'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Columns actually used by <ProductCard />
const PRODUCT_COLUMNS = 'id, name, price, compare_at_price, images, stock, is_new_arrival'

export default async function HomePage() {
  const supabase = await createClient()

  // ────────────────────────────────────────────
  // Parallel fetch — both queries fire simultaneously
  // ────────────────────────────────────────────
  const [featuredResult, newArrivalsResult] = await Promise.all([
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

      {/* Featured Products */}
      <div className="bg-black py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-xs text-blue-400 tracking-wide">
                PREMIUM SELECTION
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Featured{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Collection
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Curated pieces for the discerning gentleman, crafted with precision
              and elegance
            </p>
          </div>

          {parsedFeatured.length > 0 ? (
            <HomeProductSection products={parsedFeatured} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="bg-[#0A0A0A] py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Clock size={14} className="text-blue-500" />
              <span className="text-xs text-blue-400 tracking-wide">
                JUST ARRIVED
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              New{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Arrivals
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Fresh styles for the season, be the first to experience our latest
              collection
            </p>
          </div>

          {parsedNewArrivals.length > 0 ? (
            <HomeProductSection products={parsedNewArrivals} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No new arrivals available</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors group"
            >
              <span>View All New Arrivals</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}