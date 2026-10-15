'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWishlist } from '@/components/WishlistProvider'
import type { WishlistProduct } from '@/lib/wishlist/queries'

export default function WishlistGrid({
  products,
}: {
  products: WishlistProduct[]
}) {
  const router = useRouter()
  const { toggle } = useWishlist()
  const [removing, setRemoving] = useState<string | null>(null)

  const handleRemove = async (id: string) => {
    setRemoving(id)
    try {
      await toggle(id)
      toast.success('Removed from wishlist')
      router.refresh()
    } catch {
      toast.error('Failed to remove')
    } finally {
      setRemoving(null)
    }
  }

  const handleAddToCart = (product: WishlistProduct) => {
    if (product.stock === 0) {
      toast.error('Out of stock')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((item: { id: string }) => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        images: product.images,
        stock: product.stock,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Added to cart!')
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      <AnimatePresence initial={false}>
        {products.map((product, index) => {
          const hasDiscount =
            product.compare_at_price &&
            product.compare_at_price > product.price
          const discount = hasDiscount
            ? Math.round(
                ((product.compare_at_price! - product.price) /
                  product.compare_at_price!) *
                  100
              )
            : 0
          const isOutOfStock = product.stock === 0
          const isRemoving = removing === product.id

          return (
            <motion.article
              key={product.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.25),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-colors duration-300"
            >
              {/* ─────────────────────────────────────────────
                  Image
                 ───────────────────────────────────────────── */}
              <Link
                href={`/products/${product.id}`}
                className="relative block aspect-square overflow-hidden bg-[#0a0a0a]"
                aria-label={product.name}
              >
                <Image
                  src={
                    product.images?.[0] ||
                    'https://placehold.co/400x400/1a1a1a/3B82F6?text=No+Image'
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  quality={80}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] will-change-transform"
                />

                {/* Bottom gradient for depth */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                />

                {/* Discount badge */}
                {discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-1 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-blue-500/95 text-white text-[9px] sm:text-[10px] font-bold tracking-wide backdrop-blur-md border border-blue-400/40 shadow-lg shadow-blue-500/25">
                    {discount}% OFF
                  </span>
                )}

                {/* NEW badge */}
                {product.is_new_arrival && (
                  <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 inline-flex items-center gap-1 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
                    NEW
                  </span>
                )}

                {/* Out of stock overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold tracking-[0.15em] uppercase backdrop-blur-md">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Wishlist heart (remove) — top-right when not NEW */}
                {!product.is_new_arrival && (
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(product.id)
                    }}
                    disabled={isRemoving}
                    whileTap={{ scale: 0.88 }}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-red-500/20 backdrop-blur-md border border-red-400/40 text-red-400 shadow-lg shadow-red-500/20 hover:bg-red-500/30 transition-all duration-300 disabled:opacity-60"
                  >
                    <Heart
                      size={14}
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  </motion.button>
                )}
              </Link>

              {/* ─────────────────────────────────────────────
                  Content
                 ───────────────────────────────────────────── */}
              <div className="relative p-3 sm:p-4">
                <Link href={`/products/${product.id}`} className="block group/name">
                  <h3 className="text-[13px] sm:text-[14px] font-medium text-white leading-snug line-clamp-1 group-hover/name:text-blue-400 transition-colors duration-200">
                    {product.name}
                  </h3>
                </Link>

                {/* Price row */}
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-[15px] sm:text-base font-semibold text-white tracking-tight tabular-nums">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-gray-500 line-through tabular-nums">
                      ₹{product.compare_at_price!.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <motion.button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    whileTap={isOutOfStock ? {} : { scale: 0.97 }}
                    className={`group/btn relative flex-1 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[12px] font-medium overflow-hidden transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      isOutOfStock
                        ? 'bg-white/[0.03] text-gray-500 border border-white/[0.06] cursor-not-allowed'
                        : 'bg-white/[0.05] text-white border border-white/[0.08] hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/25'
                    }`}
                  >
                    {!isOutOfStock && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -inset-x-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"
                      />
                    )}
                    <ShoppingCart
                      size={12}
                      className="relative z-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                    whileTap={{ scale: 0.94 }}
                    className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 hover:bg-red-500/[0.15] hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          )
        })}
      </AnimatePresence>
    </div>
  )
}