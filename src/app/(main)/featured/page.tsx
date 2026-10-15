import { supabasePublic } from '@/lib/supabase/public'
import ProductGrid from '@/components/ProductGrid'
import Link from 'next/link'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import { parseProductImages } from '@/lib/utils'

// Cache for 5 minutes
export const revalidate = 300

export default async function FeaturedPage() {
  const supabase = supabasePublic

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, price, compare_at_price, images, stock, is_new_arrival'
    )
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  const parsedProducts = (products || []).map((product) => ({
    ...product,
    images: parseProductImages(product.images),
  }))

  const productCount = parsedProducts.length
  const hasProducts = productCount > 0

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/[0.04] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Editorial header
           ───────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/25 mb-5 backdrop-blur-sm">
            <Sparkles
              size={13}
              className="text-amber-400"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium text-amber-300">
              Premium Selection
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
            Featured{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                Collection
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
              />
            </span>
          </h1>

          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 max-w-lg mx-auto leading-relaxed">
            Curated pieces for the discerning gentleman — hand-selected for
            exceptional quality and timeless style.
          </p>

          {/* Live count */}
          {hasProducts && (
            <p className="text-[11px] text-gray-500 mt-5 tabular-nums flex items-center justify-center gap-1.5">
              <Star
                size={10}
                className="text-amber-400 fill-amber-400"
                aria-hidden="true"
              />
              {productCount} handpicked{' '}
              {productCount === 1 ? 'piece' : 'pieces'}
            </p>
          )}
        </header>

        {hasProducts ? (
          <ProductGrid products={parsedProducts} />
        ) : (
          <EmptyState />
        )}

        {/* ─────────────────────────────────────────────
            CTA — explore full catalog
           ───────────────────────────────────────────── */}
        {hasProducts && (
          <div className="text-center mt-14 md:mt-16">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300 backdrop-blur-sm"
            >
              <span>Explore Full Collection</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty state — matches site-wide style
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 md:py-24 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/[0.07] blur-[110px]"
      />

      <div className="relative px-6 max-w-md">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            aria-hidden="true"
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/25 to-indigo-500/25 blur-2xl"
          />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60">
            <Sparkles
              size={30}
              className="text-amber-400/70"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] mb-2">
          No featured pieces yet
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
          Our curators are handpicking the next featured collection. In the
          meantime, explore our full catalog.
        </p>

        <Link
          href="/products"
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black rounded-full text-[12px] font-semibold overflow-hidden shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-shadow duration-300"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          />
          <span className="relative z-10">Browse All Products</span>
          <ArrowRight
            size={14}
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}