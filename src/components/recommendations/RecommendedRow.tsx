'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import type { RecommendedProduct } from '@/lib/recommendations/queries'

interface Props {
  title: string
  subtitle?: string
  products: RecommendedProduct[]
}

export default function RecommendedRow({
  title,
  subtitle,
  products,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [progress, setProgress] = useState(0)

  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setShowLeft(el.scrollLeft > 4)
    setShowRight(el.scrollLeft < max - 4)
    setProgress(max > 0 ? Math.min(el.scrollLeft / max, 1) : 0)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll, { passive: true })

    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      ro.disconnect()
    }
  }, [products, checkScroll])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (!products || products.length === 0) return null

  return (
    <section ref={sectionRef} className="relative py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 md:mb-8 flex items-end justify-between gap-4 flex-wrap"
        >
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>

        {/* Row container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.55,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative group/row"
        >
          {/* Left arrow */}
          <motion.button
            type="button"
            onClick={() => scroll('left')}
            initial={false}
            animate={{
              opacity: showLeft ? 1 : 0,
              x: showLeft ? 0 : -12,
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: showLeft ? 'auto' : 'none' }}
            aria-label="Scroll left"
            className="absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-indigo-600 hover:border-indigo-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft
              size={18}
              className="text-white"
              aria-hidden="true"
            />
          </motion.button>

          {/* Right arrow */}
          <motion.button
            type="button"
            onClick={() => scroll('right')}
            initial={false}
            animate={{
              opacity: showRight ? 1 : 0,
              x: showRight ? 0 : 12,
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: showRight ? 'auto' : 'none' }}
            aria-label="Scroll right"
            className="absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-indigo-600 hover:border-indigo-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronRight
              size={18}
              className="text-white"
              aria-hidden="true"
            />
          </motion.button>

          {/* Left edge fade */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: showLeft ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-14 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"
          />

          {/* Right edge fade */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: showRight ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-14 z-10 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent"
          />

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory sm:snap-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              className="flex gap-3 sm:gap-4 md:gap-5"
              style={{ width: 'max-content', minWidth: '100%' }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 14 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.04, 0.32),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-[170px] sm:w-[200px] md:w-[240px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          {(showLeft || showRight) && (
            <div
              aria-hidden="true"
              className="mt-2 flex justify-center"
            >
              <div className="relative w-20 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ x: `${progress * 100}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}