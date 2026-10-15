'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useInView, type Variants } from 'framer-motion'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  is_new_arrival: boolean
  stock: number
}

export default function HomeProductSection({
  products,
}: {
  products: Product[]
}) {
  const midPoint = Math.ceil(products.length / 2)
  const firstRowProducts = products.slice(0, midPoint)
  const secondRowProducts = products.slice(midPoint)

  const firstRowRef = useRef<HTMLDivElement>(null)
  const secondRowRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [showFirstLeftArrow, setShowFirstLeftArrow] = useState(false)
  const [showFirstRightArrow, setShowFirstRightArrow] = useState(false)
  const [showSecondLeftArrow, setShowSecondLeftArrow] = useState(false)
  const [showSecondRightArrow, setShowSecondRightArrow] = useState(false)

  const [firstProgress, setFirstProgress] = useState(0)
  const [secondProgress, setSecondProgress] = useState(0)

  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const checkScroll = useCallback(
    (
      container: HTMLDivElement | null,
      setLeft: (val: boolean) => void,
      setRight: (val: boolean) => void,
      setProgress: (val: number) => void
    ) => {
      if (!container) return
      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth

      setLeft(scrollLeft > 4)
      setRight(scrollLeft < maxScroll - 4)
      setProgress(maxScroll > 0 ? Math.min(scrollLeft / maxScroll, 1) : 0)
    },
    []
  )

  const scrollRow = (
    container: HTMLDivElement | null,
    direction: 'left' | 'right'
  ) => {
    if (!container) return
    const scrollAmount = container.clientWidth * 0.85
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const firstContainer = firstRowRef.current
    const secondContainer = secondRowRef.current

    const handleFirstScroll = () =>
      checkScroll(
        firstContainer,
        setShowFirstLeftArrow,
        setShowFirstRightArrow,
        setFirstProgress
      )
    const handleSecondScroll = () =>
      checkScroll(
        secondContainer,
        setShowSecondLeftArrow,
        setShowSecondRightArrow,
        setSecondProgress
      )

    if (firstContainer) {
      checkScroll(
        firstContainer,
        setShowFirstLeftArrow,
        setShowFirstRightArrow,
        setFirstProgress
      )
      firstContainer.addEventListener('scroll', handleFirstScroll, {
        passive: true,
      })
    }
    if (secondContainer) {
      checkScroll(
        secondContainer,
        setShowSecondLeftArrow,
        setShowSecondRightArrow,
        setSecondProgress
      )
      secondContainer.addEventListener('scroll', handleSecondScroll, {
        passive: true,
      })
    }

    const handleResize = () => {
      handleFirstScroll()
      handleSecondScroll()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    const ro = new ResizeObserver(handleResize)
    if (firstContainer) ro.observe(firstContainer)
    if (secondContainer) ro.observe(secondContainer)

    return () => {
      if (firstContainer)
        firstContainer.removeEventListener('scroll', handleFirstScroll)
      if (secondContainer)
        secondContainer.removeEventListener('scroll', handleSecondScroll)
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
    }
  }, [products, checkScroll])

  if (!products || products.length === 0) return null

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // ─────────────────────────────────────────────
  // Scrollable row renderer
  // ─────────────────────────────────────────────
  const renderScrollableRow = (
    rowProducts: Product[],
    rowRef: React.RefObject<HTMLDivElement | null>,
    showLeftArrow: boolean,
    showRightArrow: boolean,
    progress: number,
    onScrollLeft: () => void,
    onScrollRight: () => void,
    rowIndex: number
  ) => (
    <motion.div variants={rowVariants} className="relative group/row">
      {/* Left arrow */}
      <motion.button
        type="button"
        onClick={onScrollLeft}
        initial={false}
        animate={{
          opacity: showLeftArrow ? 1 : 0,
          x: showLeftArrow ? 0 : -12,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showLeftArrow ? 'auto' : 'none' }}
        aria-label="Scroll products left"
        className="absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-blue-600 hover:border-blue-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
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
        onClick={onScrollRight}
        initial={false}
        animate={{
          opacity: showRightArrow ? 1 : 0,
          x: showRightArrow ? 0 : 12,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showRightArrow ? 'auto' : 'none' }}
        aria-label="Scroll products right"
        className="absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60 hover:bg-blue-600 hover:border-blue-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
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
        animate={{ opacity: showLeftArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-14 z-10 bg-gradient-to-r from-black via-black/70 to-transparent"
      />

      {/* Right edge fade */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: showRightArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-14 z-10 bg-gradient-to-l from-black via-black/70 to-transparent"
      />

      {/* Scrollable container */}
      <div
        ref={rowRef}
        className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory sm:snap-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          style={{ width: 'max-content', minWidth: '100%' }}
        >
          {rowProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.05, 0.35),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[170px] sm:w-[200px] md:w-[240px] lg:w-[280px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress indicator — appears when scrollable */}
      {(showLeftArrow || showRightArrow) && (
        <div
          aria-hidden="true"
          className="mt-2 flex justify-center"
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
      )}
    </motion.div>
  )

  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="space-y-8 md:space-y-10"
    >
      {renderScrollableRow(
        firstRowProducts,
        firstRowRef,
        showFirstLeftArrow,
        showFirstRightArrow,
        firstProgress,
        () => scrollRow(firstRowRef.current, 'left'),
        () => scrollRow(firstRowRef.current, 'right'),
        0
      )}

      {secondRowProducts.length > 0 &&
        renderScrollableRow(
          secondRowProducts,
          secondRowRef,
          showSecondLeftArrow,
          showSecondRightArrow,
          secondProgress,
          () => scrollRow(secondRowRef.current, 'left'),
          () => scrollRow(secondRowRef.current, 'right'),
          1
        )}
    </motion.div>
  )
}