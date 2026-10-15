'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  is_new_arrival: boolean
  stock: number
  created_at?: string
}

export default function ProductRow({ products }: { products: Product[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth

    setShowLeftArrow(scrollLeft > 4)
    setShowRightArrow(scrollLeft < maxScroll - 4)

    // Progress: 0 → 1
    setProgress(maxScroll > 0 ? Math.min(scrollLeft / maxScroll, 1) : 0)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.85
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (!container) return

    const onResize = () => checkScroll()
    window.addEventListener('resize', onResize, { passive: true })
    // Also observe container resize (e.g. sidebar toggles)
    const ro = new ResizeObserver(() => checkScroll())
    ro.observe(container)

    return () => {
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [products, checkScroll])

  // ─────────────────────────────────────────────
  // Empty state
  // ─────────────────────────────────────────────
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#121212] to-[#0d0d0d] py-14 px-6 text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/[0.06] blur-[80px]"
        />
        <div className="relative">
          <p className="text-[14px] text-gray-400 font-medium">
            No products available
          </p>
          <p className="text-[12px] text-gray-600 mt-1">
            Check back soon for new arrivals
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div
      className="relative group/row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─────────────────────────────────────────────
          Left arrow
         ───────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => scroll('left')}
        initial={false}
        animate={{
          opacity: showLeftArrow && isHovered ? 1 : 0,
          x: showLeftArrow && isHovered ? 0 : -12,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Scroll left"
        className="absolute left-0 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-blue-600 hover:border-blue-400/50 hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto"
        style={{ pointerEvents: showLeftArrow ? 'auto' : 'none' }}
      >
        <ChevronLeft size={18} className="text-white" aria-hidden="true" />
      </motion.button>

      {/* ─────────────────────────────────────────────
          Right arrow
         ───────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => scroll('right')}
        initial={false}
        animate={{
          opacity: showRightArrow && isHovered ? 1 : 0,
          x: showRightArrow && isHovered ? 0 : 12,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Scroll right"
        className="absolute right-0 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-blue-600 hover:border-blue-400/50 hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto"
        style={{ pointerEvents: showRightArrow ? 'auto' : 'none' }}
      >
        <ChevronRight size={18} className="text-white" aria-hidden="true" />
      </motion.button>

      {/* ─────────────────────────────────────────────
          Left edge fade — only when scrollable
         ───────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: showLeftArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"
      />

      {/* ─────────────────────────────────────────────
          Right edge fade — only when scrollable
         ───────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: showRightArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-10 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"
      />

      {/* ─────────────────────────────────────────────
          Scrollable container
         ───────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory sm:snap-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex gap-3 sm:gap-4 md:gap-5"
          style={{ minWidth: 'min-content' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] xl:w-[calc(20%-16px)] flex-shrink-0 snap-start"
              style={{ minWidth: '160px' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Progress indicator — thin bar under row
         ───────────────────────────────────────────── */}
      {showLeftArrow || showRightArrow ? (
        <div
          aria-hidden="true"
          className="mt-1 flex justify-center"
        >
          <div className="relative w-24 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ x: `${progress * 100}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 rounded-full"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}