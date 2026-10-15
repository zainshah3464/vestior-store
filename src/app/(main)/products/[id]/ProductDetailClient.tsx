'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Copy,
  MessageCircle,
  Check,
  Minus,
  Plus,
  Sparkles,
  Package,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { track } from '@/lib/tracking/client'
import { useWishlist } from '@/components/WishlistProvider'
import { trackViewed } from '@/components/recommendations/RecentlyViewed'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  images: string[]
  stock: number
  is_new_arrival: boolean
  category_main: string
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom']

export default function ProductDetailClient({
  product,
}: {
  product: Product
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Wishlist context
  const { isInWishlist, toggle } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  // ─────────────────────────────────────────────
  // Track product_view + recently viewed
  // ─────────────────────────────────────────────
  useEffect(() => {
    track('product_view', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category_main,
    })

    trackViewed(product.id)
  }, [product.id, product.name, product.price, product.category_main])

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10
  const savings = product.compare_at_price
    ? product.compare_at_price - product.price
    : 0

  // ─────────────────────────────────────────────
  // Add to cart
  // ─────────────────────────────────────────────
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock')
      return
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: { id: string; size?: string | null }) =>
        item.id === product.id && item.size === selectedSize
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        images: product.images,
        stock: product.stock,
        quantity,
        size: selectedSize,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!', { icon: '🛒' })
    window.dispatchEvent(new Event('cartUpdated'))

    // Micro-interaction: flash "Added" on the button
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)

    track('add_to_cart', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
    })
  }

  const handleWishlistToggle = async () => {
    await toggle(product.id)
    track('wishlist_add', {
      productId: product.id,
      productName: product.name,
    })
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/products/${product.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy link')
    }
  }

  const shareWhatsApp = () => {
    const text = `Check out ${product.name} - ₹${product.price}`
    const url = `${window.location.origin}/products/${product.id}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      '_blank'
    )
  }

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  const prevImage = () =>
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    )

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => {
      const next = q + delta
      if (next < 1) return 1
      if (next > product.stock) return product.stock
      return next
    })
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  // Filter out empty image entries
  const validImages = product.images.filter(Boolean)
  const currentImage = validImages[selectedImage] || validImages[0]

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 md:pb-20 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background glow
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/4 w-[500px] h-[400px] bg-blue-500/[0.05] blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[380px] h-[380px] bg-indigo-500/[0.04] blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Breadcrumb
           ───────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 md:mb-8 flex items-center gap-1.5 text-[12px] text-gray-500 flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight
            size={12}
            className="text-gray-700 flex-shrink-0"
            aria-hidden="true"
          />
          <Link
            href="/products"
            className="hover:text-white transition-colors"
          >
            Products
          </Link>
          {product.category_main && (
            <>
              <ChevronRight
                size={12}
                className="text-gray-700 flex-shrink-0"
                aria-hidden="true"
              />
              <Link
                href={`/category/${encodeURIComponent(product.category_main)}`}
                className="hover:text-white transition-colors"
              >
                {product.category_main}
              </Link>
            </>
          )}
          <ChevronRight
            size={12}
            className="text-gray-700 flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-gray-400 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* ═════════════════════════════════════════════
              LEFT — Image gallery
             ═════════════════════════════════════════════ */}
          <div className="space-y-3 md:space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-gradient-to-b from-[#131313] to-[#0d0d0d] rounded-2xl overflow-hidden group border border-white/[0.06]">
              {/* Image — LCP element: NO scale/fade animation */}
              {currentImage ? (
                <Image
                  key={selectedImage}
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package
                    size={48}
                    className="text-gray-700"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Top-left badges */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2 items-start z-10">
                {discount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/95 text-white text-[10px] font-bold tracking-wider backdrop-blur-md border border-blue-400/40 shadow-lg shadow-blue-500/25">
                    {discount}% OFF
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold tracking-[0.15em] backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
                    <Sparkles size={9} aria-hidden="true" />
                    NEW
                  </span>
                )}
              </div>

              {/* Nav arrows — visible on all devices */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronLeft
                      size={18}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronRight
                      size={18}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </button>
                </>
              )}

              {/* Image counter — bottom-right */}
              {validImages.length > 1 && (
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.12] text-[11px] font-medium text-white/90">
                  {selectedImage + 1} / {validImages.length}
                </div>
              )}

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold tracking-[0.15em] uppercase backdrop-blur-md">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
              <div
                className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
                role="tablist"
                aria-label="Product images"
              >
                {validImages.map((img, idx) => {
                  const active = selectedImage === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      role="tab"
                      aria-selected={active}
                      aria-label={`View image ${idx + 1}`}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        active
                          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black'
                          : 'ring-1 ring-white/[0.08] hover:ring-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ═════════════════════════════════════════════
              RIGHT — Product info
             ═════════════════════════════════════════════ */}
          <div className="flex flex-col lg:pt-2">
            {/* Category eyebrow */}
            {product.category_main && (
              <Link
                href={`/category/${encodeURIComponent(product.category_main)}`}
                className="inline-flex items-center gap-1.5 self-start mb-3 group"
              >
                <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                  {product.category_main}
                </span>
                <span
                  aria-hidden="true"
                  className="w-4 h-px bg-blue-500/40 group-hover:w-6 transition-all duration-300"
                />
              </Link>
            )}

            {/* Product name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compare_at_price &&
                product.compare_at_price > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-gray-500 line-through">
                      ₹{product.compare_at_price.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Save ₹{savings.toLocaleString()}
                    </span>
                  </>
                )}
            </div>

            {/* Stock indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 text-[12px] font-medium text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3 py-1.5 rounded-full">
                  <AlertCircle size={12} aria-hidden="true" />
                  Out of stock
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-2 text-[12px] font-medium text-amber-300 bg-amber-500/[0.08] border border-amber-500/20 px-3 py-1.5 rounded-full">
                  <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                  </span>
                  Only {product.stock} left in stock
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[12px] font-medium text-emerald-300 bg-emerald-500/[0.08] border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <Check size={12} aria-hidden="true" />
                  In stock — ready to ship
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────
                Size selector
               ───────────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-400">
                  Select Size
                </h2>
                {selectedSize && (
                  <span className="text-[11px] text-blue-400 font-medium">
                    {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const active = selectedSize === size
                  return (
                    <motion.button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      whileTap={{ scale: 0.94 }}
                      className={`relative min-w-[48px] px-3.5 py-2 rounded-xl border text-[12px] font-medium transition-all duration-200 ${
                        active
                          ? 'border-blue-500 bg-blue-500/[0.12] text-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
                          : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white'
                      }`}
                      aria-pressed={active}
                    >
                      {size}
                      {active && (
                        <motion.span
                          layoutId="size-check"
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <Check
                            size={8}
                            strokeWidth={3}
                            className="text-white"
                          />
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* ─────────────────────────────────────────────
                Quantity selector
               ───────────────────────────────────────────── */}
            <div className="mb-6">
              <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-3">
                Quantity
              </h2>
              <div className="inline-flex items-center bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-12 text-center text-white text-[15px] font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* ─────────────────────────────────────────────
                Add to Cart (primary CTA)
               ───────────────────────────────────────────── */}
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={isOutOfStock ? {} : { scale: 0.98 }}
              className={`group relative w-full py-4 rounded-xl font-semibold text-[14px] overflow-hidden transition-all duration-300 flex items-center justify-center gap-2.5 mb-3 ${
                isOutOfStock
                  ? 'bg-white/[0.03] text-gray-500 border border-white/[0.06] cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
              }`}
            >
              {/* Shine sweep on hover */}
              {!isOutOfStock && !justAdded && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
                />
              )}

              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2.5 relative z-10"
                  >
                    <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                    Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2.5 relative z-10"
                  >
                    <ShoppingCart size={18} aria-hidden="true" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* ─────────────────────────────────────────────
                Wishlist / Copy / WhatsApp row
               ───────────────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-8">
              <motion.button
                type="button"
                onClick={handleWishlistToggle}
                whileTap={{ scale: 0.96 }}
                aria-pressed={wishlisted}
                aria-label={
                  wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium border transition-all duration-200 ${
                  wishlisted
                    ? 'bg-red-500/[0.1] border-red-500/30 text-red-400'
                    : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04] hover:border-white/15'
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
                    size={15}
                    fill={wishlisted ? 'currentColor' : 'none'}
                    strokeWidth={wishlisted ? 0 : 2}
                    aria-hidden="true"
                  />
                </motion.span>
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </motion.button>

              <motion.button
                type="button"
                onClick={copyLink}
                whileTap={{ scale: 0.96 }}
                aria-label="Copy product link"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium border transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-400'
                    : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04] hover:border-white/15'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                      Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Copy size={15} aria-hidden="true" />
                      Copy Link
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                type="button"
                onClick={shareWhatsApp}
                whileTap={{ scale: 0.96 }}
                aria-label="Share on WhatsApp"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium border bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/[0.06] hover:border-emerald-500/25 transition-all duration-200"
              >
                <MessageCircle size={15} aria-hidden="true" />
                WhatsApp
              </motion.button>
            </div>

            {/* ─────────────────────────────────────────────
                Description
               ───────────────────────────────────────────── */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-3">
                  Description
                </h2>
                <p className="text-[13px] sm:text-[14px] text-gray-400 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* ─────────────────────────────────────────────
                Trust badges
               ───────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.06]">
              {[
                {
                  icon: Truck,
                  label: 'Free Shipping',
                  sub: 'On orders ₹5,000+',
                },
                {
                  icon: Shield,
                  label: 'Secure Payment',
                  sub: 'Encrypted checkout',
                },
                {
                  icon: RotateCcw,
                  label: 'Easy Returns',
                  sub: '14-day window',
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center py-3 px-2 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <Icon
                    size={16}
                    className="text-blue-400 mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] font-medium text-white leading-tight">
                    {label}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}