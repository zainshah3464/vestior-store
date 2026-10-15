import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getWishlistProducts } from '@/lib/wishlist/queries'
import WishlistGrid from './WishlistGrid'
import { Heart, ArrowRight, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const products = await getWishlistProducts()

  const itemCount = products.length
  const hasProducts = itemCount > 0

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-500/[0.05] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-red-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Editorial header
           ───────────────────────────────────────────── */}
        <header className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <Heart
              size={11}
              className="text-rose-400"
              aria-hidden="true"
              fill="currentColor"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Saved Items
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] leading-tight">
              Your Wishlist
            </h1>
            {hasProducts && (
              <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                {itemCount} item{itemCount === 1 ? '' : 's'} saved
              </p>
            )}
          </div>
        </header>

        {hasProducts ? (
          <WishlistGrid products={products} />
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty state — playful, marketing-driven
// ─────────────────────────────────────────────
function EmptyWishlist() {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-rose-500/[0.07] blur-[110px]"
      />

      <div className="relative px-6 max-w-md">
        {/* Animated heart tile with halo */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            aria-hidden="true"
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-rose-500/25 to-pink-500/25 blur-2xl"
          />

          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60">
            <Heart
              size={30}
              className="text-rose-400/70"
              aria-hidden="true"
              strokeWidth={1.5}
              fill="currentColor"
            />
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 text-amber-400"
            >
              <Sparkles size={12} />
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-7 max-w-xs mx-auto">
          Save your favorite pieces here so you can come back to them anytime.
        </p>

        {/* Primary CTA */}
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-full text-[13px] font-semibold overflow-hidden shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 transition-shadow duration-300"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          />
          <span className="relative z-10">Browse Products</span>
          <ArrowRight
            size={15}
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        {/* Secondary link */}
        <div className="mt-4">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-rose-400 transition-colors"
          >
            <Sparkles size={11} aria-hidden="true" />
            <span>Or explore new arrivals</span>
          </Link>
        </div>
      </div>
    </div>
  )
}