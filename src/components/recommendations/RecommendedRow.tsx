'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setShowLeft(el.scrollLeft > 20)
    setShowRight(el.scrollLeft < max - 20)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [products])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (!products || products.length === 0) return null

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="relative group">
          {showLeft && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scroll('left')}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm border border-indigo-500/30 p-2 md:p-3 rounded-full hover:bg-indigo-500 transition-all shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} className="text-white" />
            </motion.button>
          )}

          {showRight && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scroll('right')}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm border border-indigo-500/30 p-2 md:p-3 rounded-full hover:bg-indigo-500 transition-all shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} className="text-white" />
            </motion.button>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div
              className="flex gap-4"
              style={{ width: 'max-content', minWidth: '100%' }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[170px] sm:w-[200px] md:w-[240px] flex-shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}