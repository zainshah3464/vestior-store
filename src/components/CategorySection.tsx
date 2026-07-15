'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, TrendingUp, Clock } from 'lucide-react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

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
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.section 
      id="category-section"
      ref={sectionRef}
      initial="hidden"
      animate={controls}
      className="py-16 md:py-24 bg-black relative overflow-hidden"
    >
      {/* Background Elements - Subtle blue glow only */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Shop by{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Explore our premium collections crafted with precision and elegance
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              custom={index}
              onHoverStart={() => setHoveredCard(cat.name)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group block"
              >
                <div className="relative bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                  {/* Image Container with Overlay */}
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <motion.img
                      src={getImageUrl(cat.slug)}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      onError={() => {
                        setImgErrors(prev => ({ ...prev, [cat.slug]: true }))
                      }}
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{ opacity: hoveredCard === cat.name ? 1 : 0 }}
                    />
                    
                    {/* Popular Badge */}
                    {cat.popular && (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full">
                          <TrendingUp size={10} className="text-white" />
                          <span className="text-[10px] font-medium text-white">Popular</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Quick View Button on Hover */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{ opacity: hoveredCard === cat.name ? 1 : 0 }}
                    >
                      <motion.div 
                        className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Now
                        <ChevronRight size={12} />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5 relative">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {cat.name}
                      </h3>
                      <motion.div 
                        className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{ x: hoveredCard === cat.name ? 0 : -10 }}
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {cat.items}
                      </p>
                      {cat.items !== '0 styles' && (
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="text-gray-600" />
                          <span className="text-[10px] text-gray-600">In Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Animated Border Bottom */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-400"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-12 md:mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:border-blue-500/50 transition-all duration-300 group"
            >
              <span>View All Collections</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </motion.section>
  )
}