'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Award, ChevronDown } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Simulate loading for entry animation
    const timer = setTimeout(() => setLoading(false), 500)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timer)
    }
  }, [])
  
  // Stats data
  const stats = [
    { value: '50+', label: 'Premium Suits', icon: Shield },
    { value: '100%', label: 'Wool & Silk', icon: Award },
    { value: 'Free', label: 'Tailoring', icon: Sparkles },
  ]
  
  // Images from public folder
  const mobileBgPath = "/suits/mobile-bg.jpg"
  const desktopBgPath = "/suits/10.png"
  const backgroundImage = (isMobile && mounted) ? mobileBgPath : desktopBgPath
  
  // Loading animation
  if (loading || !mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-sm tracking-wider"
          >
            LOADING EXPERIENCE
          </motion.p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="relative min-h-screen w-full flex items-center justify-start bg-black pt-16 overflow-hidden">
      {/* Background Image - No glow effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/25 z-0" />
        
        <img 
          src={backgroundImage}
          alt="Premium Suit Background"
          className={`absolute inset-0 w-full h-full object-cover object-center z-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: isMobile ? 'center' : 'center' }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay on left side for text readability - No blue glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-0" />
      </div>
      
      {/* Content - FULLY LEFT ALIGNED with entry animations */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-blue-500/30 mb-6"
            whileHover={{ scale: 1.05, borderColor: 'rgba(59,130,246,0.6)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={14} className="text-blue-500" />
            </motion.div>
            <span className="text-xs text-gray-200 tracking-wide uppercase">Bespoke Tailoring Since 1968</span>
          </motion.div>
          
          {/* Main Heading with stagger animation */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="text-white block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              ART OF
            </motion.span>
            <motion.span 
              className="text-blue-500 block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
            >
              ELEGANCE
            </motion.span>
          </motion.h1>
          
          {/* Description with fade in */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Experience the pinnacle of craftsmanship with our premium collection of hand-tailored suits. 
            Each piece is a masterpiece of precision, using only the finest Italian wools and British linens.
          </motion.p>
          
          {/* Buttons with hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredButton('primary')}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <Link
                href="/new-arrivals"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30"
              >
                New Collection
                <motion.div
                  animate={{ x: hoveredButton === 'primary' ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredButton('secondary')}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <Link 
                href="/featured" 
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Featured Product
                <motion.div
                  animate={{ 
                    rotate: hoveredButton === 'secondary' ? 360 : 0,
                    scale: hoveredButton === 'secondary' ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles size={16} />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats with hover animations */}
          <motion.div 
            className="flex flex-wrap justify-start gap-6 sm:gap-10 md:gap-14 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="relative text-center cursor-pointer"
                onHoverStart={() => setHoveredStat(index)}
                onHoverEnd={() => setHoveredStat(null)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-1 group-hover:text-gray-100 transition-colors duration-300">
                  {stat.label}
                </p>
                <AnimatePresence>
                  {hoveredStat === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: -8 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                    >
                      <stat.icon size={12} className="text-blue-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Increased opacity */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span 
            className="text-[10px] sm:text-xs text-gray-300 uppercase tracking-wider font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <ChevronDown size={16} className="text-gray-300" />
        </motion.div>
      </motion.div>
    </div>
  )
}