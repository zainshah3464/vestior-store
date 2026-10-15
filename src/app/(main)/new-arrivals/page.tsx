import { supabasePublic } from '@/lib/supabase/public'
import ProductGrid from '@/components/ProductGrid'
import { Clock, Sparkles } from 'lucide-react'
import { parseProductImages } from '@/lib/utils'

// Cache for 5 minutes
export const revalidate = 300

export default async function NewArrivalsPage() {
  const supabase = supabasePublic

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, price, compare_at_price, images, stock, is_new_arrival'
    )
    .eq('is_active', true)
    .eq('is_new_arrival', true)
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
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/[0.05] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-blue-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Editorial header
           ───────────────────────────────────────────── */}
        <header className="text-center mb-12 md:mb-16">
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
            New{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                Arrivals
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
              />
            </span>
          </h1>

          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 max-w-lg mx-auto leading-relaxed">
            Fresh styles for the season — be the first to experience our
            latest craftsmanship.
          </p>

          {/* Live count */}
          {hasProducts && (
            <p className="text-[11px] text-gray-500 mt-5 tabular-nums">
              {productCount} new{' '}
              {productCount === 1 ? 'piece' : 'pieces'} available
            </p>
          )}
        </header>

        {hasProducts ? (
          <ProductGrid products={parsedProducts} />
        ) : (
          <EmptyState
            accent="emerald"
            title="No new arrivals yet"
            description="Fresh pieces are being added soon. Check back shortly, or browse our full collection."
          />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty state — consistent with site-wide style
// ─────────────────────────────────────────────
function EmptyState({
  accent,
  title,
  description,
}: {
  accent: 'emerald' | 'blue'
  title: string
  description: string
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 md:py-24 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/[0.07] blur-[110px]"
      />

      <div className="relative px-6 max-w-md">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            aria-hidden="true"
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/25 to-blue-500/25 blur-2xl"
          />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60">
            <Clock
              size={30}
              className="text-emerald-400/70"
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 text-amber-400"
            >
              <Sparkles size={12} />
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] mb-2">
          {title}
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}