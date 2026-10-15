'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { track } from '@/lib/tracking/client'
import { useWishlist } from '@/components/WishlistProvider'

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  is_new_arrival: boolean
  stock: number
  ratingSummary?: { averageRating: number; totalCount: number } | null
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { isInWishlist, toggle } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  // Secondary image for hover swap (UI only — no logic change)
  const primaryImage = product.images?.[0]
  const secondaryImage = product.images?.[1]

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: { id: string }) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!', { icon: '🛒' })
    window.dispatchEvent(new Event('cartUpdated'))

    track('add_to_cart', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  const handleWishlistClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    await toggle(product.id)
    track('wishlist_add', {
      productId: product.id,
      productName: product.name,
    })
  }

  const rating = product.ratingSummary?.averageRating ?? 0
  const ratingCount = product.ratingSummary?.totalCount ?? 0
  const roundedRating = Math.round(rating)
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10

  return (
    <motion.div
      className="group relative bg-gradient-to-b from-[#131313] to-[#0f0f0f] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-blue-500/30 transition-[border-color,box-shadow] duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft accent glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(600px circle at 50% 0%, rgba(59,130,246,0.08), transparent 40%)',
        }}
      />

      {/* ─────────────────────────────────────────────
          Image area
         ───────────────────────────────────────────── */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-[#0a0a0a]"
        aria-label={product.name}
      >
        {/* Primary image */}
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            quality={80}
            className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              isHovered && secondaryImage
                ? 'opacity-0'
                : 'opacity-100 scale-100'
            } group-hover:scale-[1.06]`}
            onLoad={() => setImgLoaded(true)}
          />
        )}

        {/* Secondary image — cross-fade on hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            quality={80}
            className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              isHovered ? 'opacity-100 scale-[1.04]' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Bottom gradient fade for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80"
        />

        {/* ─────────────────────────────────────────────
            Top-left badges
           ───────────────────────────────────────────── */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 items-start z-10">
          <AnimatePresence>
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-blue-500/95 text-white text-[9px] sm:text-[10px] font-bold tracking-wide backdrop-blur-md border border-blue-400/40 shadow-lg shadow-blue-500/25"
              >
                <span className="w-1 h-1 rounded-full bg-white/90" />
                {discount}% OFF
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {product.is_new_arrival && (
              <motion.span
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-flex items-center gap-1 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-500/10"
              >
                NEW
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLowStock && (
              <motion.span
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-flex items-center gap-1.5 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-amber-500/15 text-amber-300 text-[9px] sm:text-[10px] font-semibold tracking-wide backdrop-blur-md border border-amber-400/30"
              >
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
                Only {product.stock} left
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* ─────────────────────────────────────────────
            Top-right wishlist button
           ───────────────────────────────────────────── */}
        <motion.button
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.88 }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            wishlisted
              ? 'bg-red-500/20 border-red-400/40 text-red-400 shadow-lg shadow-red-500/20'
              : 'bg-black/40 border-white/15 text-white hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400'
          }`}
        >
          <motion.span
            animate={
              wishlisted
                ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex"
          >
            <Heart
              size={14}
              fill={wishlisted ? 'currentColor' : 'none'}
              aria-hidden="true"
              strokeWidth={wishlisted ? 0 : 2}
            />
          </motion.span>
        </motion.button>

        {/* ─────────────────────────────────────────────
            Quick View — slides up on hover
           ───────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 flex justify-center z-10">
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 12,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-black text-[11px] font-semibold backdrop-blur-xl shadow-xl shadow-black/40 border border-white/20">
              <Eye size={12} aria-hidden="true" />
              Quick View
            </span>
          </motion.div>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold tracking-[0.15em] uppercase backdrop-blur-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* ─────────────────────────────────────────────
          Content section
         ───────────────────────────────────────────── */}
      <div className="relative p-3 sm:p-4">
        {/* Category eyebrow */}
        {product.ratingSummary && ratingCount > 0 ? null : (
          <div className="h-3" aria-hidden="true" />
        )}

        {/* Name */}
        <Link href={`/products/${product.id}`} className="block group/name">
          <h3 className="text-[13px] sm:text-[14px] font-medium text-white leading-snug line-clamp-1 group-hover/name:text-blue-400 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Price + rating row */}
        <div className="flex items-end justify-between gap-2 mt-1.5">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-[15px] sm:text-base font-semibold text-white tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <span className="text-[11px] text-gray-500 line-through">
                  ₹{product.compare_at_price.toLocaleString()}
                </span>
              )}
          </div>

          {/* Rating */}
          {ratingCount > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star
                size={11}
                className="text-amber-400 fill-amber-400"
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-gray-300">
                {rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-500">
                ({ratingCount})
              </span>
            </div>
          )}
        </div>

        {/* Interactive star row — subtle detail for premium feel */}
        {ratingCount > 0 && (
          <div
            className="flex items-center gap-0.5 mt-1"
            aria-hidden="true"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={9}
                className={
                  star <= roundedRating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-700'
                }
              />
            ))}
          </div>
        )}

        {/* Add to Cart button */}
        <motion.button
          onClick={addToCart}
          disabled={isOutOfStock}
          whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
          className={`group/btn relative mt-3 w-full py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-medium overflow-hidden transition-all duration-300 flex items-center justify-center gap-1.5 ${
            isOutOfStock
              ? 'bg-white/[0.03] text-gray-500 border border-white/[0.06] cursor-not-allowed'
              : 'bg-white/[0.05] text-white border border-white/[0.08] hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          {/* Shine sweep on hover */}
          {!isOutOfStock && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -inset-x-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"
            />
          )}

          <ShoppingCart
            size={13}
            aria-hidden="true"
            className="relative z-10 transition-transform duration-300 group-hover/btn:scale-110"
          />
          <span className="relative z-10">
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}