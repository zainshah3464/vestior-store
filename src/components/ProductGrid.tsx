'use client'

import ProductCard from './ProductCard'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ArrowRight, Sparkles } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  is_new_arrival: boolean
  stock: number
}

export default function ProductGrid({ products }: { products: Product[] }) {
  // ─────────────────────────────────────────────
  // Empty state — refined with CTA
  // ─────────────────────────────────────────────
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center min-h-[420px] text-center overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a]"
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/[0.07] blur-[100px]"
        />

        <div className="relative px-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/[0.05] border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-blue-500/5"
          >
            <Package
              size={30}
              className="text-blue-400/70"
              aria-hidden="true"
            />
            <motion.span
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 w-3 h-3"
            >
              <Sparkles size={12} className="text-blue-400/60" />
            </motion.span>
          </motion.div>

          {/* Title */}
          <h3 className="text-[17px] sm:text-lg font-semibold text-white mb-2">
            No products found
          </h3>
          <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find anything in this collection. Try adjusting
            your filters or explore other categories.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-6"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300"
            >
              Browse All Products
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // ─────────────────────────────────────────────
  // Grid
  // ─────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            // Cap the stagger so a huge grid doesn't take forever
            delay: Math.min(index * 0.04, 0.5),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}