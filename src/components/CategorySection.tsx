'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronRight, TrendingUp, Layers } from 'lucide-react'
import {
  motion,
  useInView,
  type Variants,
} from 'framer-motion'

// Use EXACT category names as in database
const categories = [
  { name: 'Pants', slug: 'Pants', image: '/images/categories/pants.jpg', items: '6 styles', popular: true },
  { name: 'Shirts', slug: 'Shirts', image: '/images/categories/shirts.jpg', items: '1 style', popular: false },
  { name: 'Coats', slug: 'Coats', image: '/images/categories/coats.jpg', items: '0 styles', popular: false },
  { name: 'Waistcoats', slug: 'Waistcoats', image: '/images/categories/waistcoats.jpg', items: '1 style', popular: false },
  { name: 'Suits', slug: 'Suits', image: '/images/categories/suits.jpg', items: '1 style', popular: true },
  { name: 'Gurkha', slug: 'Gurkha', image: '/images/categories/gurkha.jpg', items: '2 styles', popular: true },
  { name: '2 Piece', slug: '2 Piece', image: '/images/categories/2piece.jpg', items: '0 styles', popular: false },
  { name: '3 Piece', slug: '3 Piece', image: '/images/categories/3piece.jpg', items: '1 style', popular: false },
]

export default function CategorySection() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const getImageUrl = (slug: string) => {
    const fileName = slug.replace(' ', '').toLowerCase()
    if (imgErrors[slug]) {
      return `https://placehold.co/600x600/0A0A0A/3B82F6?text=${slug}`
    }
    return `/images/categories/${fileName}.jpg`
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.section
      id="category-section"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="relative py-20 md:py-28 bg-black overflow-hidden scroll-mt-24"
    >
      {/* Background ambience */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Top divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Section Header
           ───────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/25 mb-5 backdrop-blur-sm">
            <Layers
              size={13}
              className="text-blue-400"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium text-blue-300">
              Collections
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-[-0.02em] leading-[1.1]">
            Shop by{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                Category
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
              />
            </span>
          </h2>

          <p className="text-gray-400 text-[13px] sm:text-[14px] md:text-[15px] max-w-xl mx-auto leading-relaxed">
            Explore our premium collections crafted with precision and
            elegance.
          </p>
        </motion.div>

        {/* ─────────────────────────────────────────────
            Categories Grid
           ───────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
        >
          {categories.map((cat) => {
            const isPopular = cat.popular
            const isEmpty = cat.items === '0 styles'
            const isHovered = hoveredCard === cat.name

            return (
              <motion.div
                key={cat.name}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(cat.name)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
                  aria-label={`Shop ${cat.name} — ${cat.items}`}
                >
                  <div
                    className={`relative bg-gradient-to-b from-[#131313] to-[#0e0e0e] rounded-2xl overflow-hidden border transition-[border-color,box-shadow] duration-500 ${
                      isHovered
                        ? 'border-blue-500/40 shadow-2xl shadow-blue-500/10'
                        : 'border-white/[0.06]'
                    }`}
                  >
                    {/* ─────────────────────────────
                        Image area
                       ───────────────────────────── */}
                    <div className="relative aspect-square overflow-hidden bg-black">
                      {/* Image */}
                      <motion.img
                        src={getImageUrl(cat.slug)}
                        alt=""
                        loading="lazy"
                        initial={false}
                        animate={{
                          scale: isHovered ? 1.08 : 1,
                          opacity: isEmpty ? 0.35 : 1,
                        }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full h-full object-cover will-change-transform"
                        onError={() =>
                          setImgErrors((prev) => ({
                            ...prev,
                            [cat.slug]: true,
                          }))
                        }
                      />

                      {/* Base gradient — always present for legibility */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                      />

                      {/* Hover gradient overlay */}
                      <motion.div
                        aria-hidden="true"
                        initial={false}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                      />

                      {/* ─────────────────────────────
                          Popular badge — top-right
                         ───────────────────────────── */}
                      {isPopular && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10"
                        >
                          <div className="inline-flex items-center gap-1 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-blue-500/90 backdrop-blur-md border border-blue-400/40 shadow-lg shadow-blue-500/30">
                            <TrendingUp
                              size={9}
                              className="text-white"
                              aria-hidden="true"
                            />
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-wide text-white uppercase">
                              Popular
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* ─────────────────────────────
                          Empty state chip
                         ───────────────────────────── */}
                      {isEmpty && (
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                          <div className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08]">
                            <span className="text-[9px] font-medium tracking-wide text-gray-400 uppercase">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ─────────────────────────────
                          Center CTA — appears on hover
                         ───────────────────────────── */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 12,
                            scale: isHovered ? 1 : 0.95,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="pointer-events-auto"
                        >
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-black text-[11px] font-semibold shadow-xl shadow-black/40 backdrop-blur-xl border border-white/20">
                            Shop Now
                            <ChevronRight
                              size={12}
                              aria-hidden="true"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* ─────────────────────────────
                        Content section
                       ───────────────────────────── */}
                    <div className="relative p-3.5 sm:p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`text-[14px] sm:text-[15px] font-semibold transition-colors duration-300 leading-tight ${
                            isHovered
                              ? 'text-blue-400'
                              : 'text-white'
                          }`}
                        >
                          {cat.name}
                        </h3>

                        {/* Arrow */}
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : -6,
                          }}
                          transition={{ duration: 0.25 }}
                          className="text-blue-400 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          <ChevronRight size={15} />
                        </motion.div>
                      </div>

                      <p className="text-[11px] sm:text-[12px] text-gray-500 tracking-wide">
                        {cat.items}
                      </p>

                      {/* Animated bottom accent line */}
                      <motion.div
                        aria-hidden="true"
                        initial={false}
                        animate={{
                          scaleX: isHovered ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ originX: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ─────────────────────────────────────────────
            View All CTA
           ───────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-14 md:mt-16"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-gray-300 hover:text-white hover:bg-blue-600 hover:border-blue-400/40 transition-all duration-300 backdrop-blur-sm"
          >
            <span>View All Collections</span>
            <ChevronRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />
    </motion.section>
  )
}