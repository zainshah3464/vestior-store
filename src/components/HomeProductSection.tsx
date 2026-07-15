'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion'
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

export default function HomeProductSection({ products }: { products: Product[] }) {
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

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const checkScroll = (container: HTMLDivElement | null, setLeft: (val: boolean) => void, setRight: (val: boolean) => void) => {
    if (container) {
      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      setLeft(scrollLeft > 20)
      setRight(scrollLeft < maxScroll - 20)
    }
  }

  const debouncedCheckScroll = (container: HTMLDivElement | null, setLeft: (val: boolean) => void, setRight: (val: boolean) => void) => {
    setTimeout(() => {
      checkScroll(container, setLeft, setRight)
    }, 100)
  }

  const scrollRow = (container: HTMLDivElement | null, direction: 'left' | 'right') => {
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const firstContainer = firstRowRef.current
    const secondContainer = secondRowRef.current

    const handleFirstScroll = () => checkScroll(firstContainer, setShowFirstLeftArrow, setShowFirstRightArrow)
    const handleSecondScroll = () => checkScroll(secondContainer, setShowSecondLeftArrow, setShowSecondRightArrow)

    const handleResize = () => {
      debouncedCheckScroll(firstContainer, setShowFirstLeftArrow, setShowFirstRightArrow)
      if (secondContainer) debouncedCheckScroll(secondContainer, setShowSecondLeftArrow, setShowSecondRightArrow)
    }

    if (firstContainer) {
      checkScroll(firstContainer, setShowFirstLeftArrow, setShowFirstRightArrow)
      firstContainer.addEventListener('scroll', handleFirstScroll)
    }
    if (secondContainer) {
      checkScroll(secondContainer, setShowSecondLeftArrow, setShowSecondRightArrow)
      secondContainer.addEventListener('scroll', handleSecondScroll)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (firstContainer) firstContainer.removeEventListener('scroll', handleFirstScroll)
      if (secondContainer) secondContainer.removeEventListener('scroll', handleSecondScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [products])

  if (!products || products.length === 0) return null

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  // 👇 Fixed: rowRef type now accepts RefObject<HTMLDivElement | null>
  const renderScrollableRow = (
    products: Product[],
    rowRef: React.RefObject<HTMLDivElement | null>,
    showLeftArrow: boolean,
    showRightArrow: boolean,
    onScrollLeft: () => void,
    onScrollRight: () => void,
    rowIndex: number
  ) => (
    <motion.div variants={rowVariants} className="relative group">
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onScrollLeft}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm border border-blue-500/30 p-2 md:p-3 rounded-full hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/25"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} className="text-white md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={onScrollRight}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm border border-blue-500/30 p-2 md:p-3 rounded-full hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/25"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={18} className="text-white md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={rowRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 md:gap-5 lg:gap-6 pb-4" style={{ width: 'max-content', minWidth: '100%' }}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="w-[170px] sm:w-[200px] md:w-[240px] lg:w-[280px] flex-shrink-0"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {rowIndex === 0 && products.length > 4 && (
        <div className="hidden md:flex justify-center gap-1 mt-4">
          {[...Array(Math.min(products.length, 6))].map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300 bg-white/20"
              style={{ width: '20px' }}
            />
          ))}
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
          () => scrollRow(secondRowRef.current, 'left'),
          () => scrollRow(secondRowRef.current, 'right'),
          1
        )}

      <div className="text-center mt-2">
        <p className="text-xs text-gray-600">← Drag to scroll or use arrows →</p>
      </div>
    </motion.div>
  )
}