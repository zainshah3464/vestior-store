import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrdersRealtime from '@/components/OrdersRealtime'
import { Package, ArrowRight, Sparkles } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, payment_status, total, created_at, items')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const hasOrders = !!orders && orders.length > 0

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.05] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Header — editorial
           ───────────────────────────────────────────── */}
        <header className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <Package
              size={11}
              className="text-blue-400"
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Order History
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] leading-tight">
              Your Orders
            </h1>
            {hasOrders && (
              <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                {orders.length} order{orders.length === 1 ? '' : 's'}
              </p>
            )}
          </div>
        </header>

        {hasOrders ? (
          <OrdersRealtime initialOrders={orders} />
        ) : (
          <EmptyOrders />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Empty state — playful, matching cart's empty state
// ─────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/[0.07] blur-[110px]"
      />

      <div className="relative px-6 max-w-md">
        {/* Animated package icon with halo */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            aria-hidden="true"
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 blur-2xl"
          />

          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60">
            <Package
              size={32}
              className="text-blue-400/70"
              aria-hidden="true"
              strokeWidth={1.5}
            />

            {/* Floating sparkle accent */}
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
          No orders yet
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-7 max-w-xs mx-auto">
          Your future favorites are waiting. Start exploring our collection to
          place your first order.
        </p>

        {/* Primary CTA */}
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-[13px] font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          />
          <span className="relative z-10">Start Shopping</span>
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
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-blue-400 transition-colors"
          >
            <Sparkles size={11} aria-hidden="true" />
            <span>Or browse new arrivals</span>
          </Link>
        </div>
      </div>
    </div>
  )
}