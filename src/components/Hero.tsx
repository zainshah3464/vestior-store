'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Shield, Award } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Stats data
  const stats = [
    { value: '50+', label: 'Premium Suits', icon: Shield },
    { value: '100%', label: 'Wool & Silk', icon: Award },
    { value: 'Free', label: 'Tailoring', icon: Sparkles },
  ]

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start bg-black pt-16 overflow-hidden">
      {/* ─────────────────────────────────────────────
          Background Images — optimized via next/image
         ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/25 z-0" aria-hidden="true" />

        {/* Mobile: smaller dedicated image (hidden on desktop) */}
        <Image
          src="/suits/mobile-bg.jpg"
          alt="Premium tailored suit — VESTIOR collection"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1px"
          quality={70}
          className={`md:hidden object-cover object-center z-0 transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Desktop: hero image (hidden on mobile) */}
        <Image
          src="/suits/hero-image.jpg"
          alt="Premium tailored suit — VESTIOR collection"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 1px"
          quality={80}
          className={`hidden md:block object-cover object-center z-0 transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlays for text readability + depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 z-0"
        />
      </div>

      {/* ─────────────────────────────────────────────
          Editorial corner crosshair marks (desktop only)
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute inset-0 z-10 pointer-events-none"
      >
        {/* Top-left */}
        <div className="absolute top-24 left-5 sm:left-8 md:left-10 lg:left-14 xl:left-20 2xl:left-28 w-4 h-4">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-8 right-5 sm:right-8 md:right-10 lg:right-14 xl:right-20 2xl:right-28 w-4 h-4">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Vertical brand mark (large screens only)
         ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        aria-hidden="true"
        className="hidden lg:flex absolute right-5 sm:right-8 md:right-10 lg:right-14 xl:right-20 2xl:right-28 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-4"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <span
          className="text-[10px] tracking-[0.4em] text-white/40 font-medium uppercase whitespace-nowrap"
          style={{ writingMode: 'vertical-rl' }}
        >
          VESTIOR · EST. 1968
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* ─────────────────────────────────────────────
          Content
         ───────────────────────────────────────────── */}
      <div className="relative w-full px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-28 z-20">
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-[52rem]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-blue-500/30 mb-6 sm:mb-8"
            whileHover={{ scale: 1.03, borderColor: 'rgba(59,130,246,0.7)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={13} className="text-blue-400" aria-hidden="true" />
            </motion.div>
            <span className="text-[10px] sm:text-xs text-gray-200 tracking-[0.15em] uppercase font-medium">
              Bespoke Tailoring Since 1968
            </span>
          </motion.div>

          {/* Main Heading — LCP element, NO opacity animation */}
          <h1 className="text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.03em] mb-5 sm:mb-6">
            <span className="text-white block">ART OF</span>
            <span className="relative text-blue-500 block">
              ELEGANCE
              {/* Accent underline */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-500 via-blue-400 to-transparent origin-left"
              />
            </span>
          </h1>

          {/* Description — LCP element, NO opacity animation */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl mb-8 sm:mb-10 leading-relaxed">
            Experience the pinnacle of craftsmanship with our premium collection of
            hand-tailored suits. Each piece is a masterpiece of precision, using only
            the finest Italian wools and British linens.
          </p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredButton('primary')}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative"
            >
              <Link
                href="/new-arrivals"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-sm font-semibold overflow-hidden shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300 w-full sm:w-auto"
              >
                {/* Shine sweep on hover */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                  animate={{ x: hoveredButton === 'primary' ? '200%' : '-100%' }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                />
                <span className="relative z-10">New Collection</span>
                <motion.span
                  animate={{ x: hoveredButton === 'primary' ? 4 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10 inline-flex"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredButton('secondary')}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative"
            >
              <Link
                href="/featured"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-blue-500/50 text-blue-400 rounded-full text-sm font-semibold overflow-hidden hover:border-blue-500 transition-colors duration-300 w-full sm:w-auto backdrop-blur-sm bg-blue-500/[0.06] hover:bg-blue-500/10"
              >
                <span className="relative z-10">Featured Product</span>
                <motion.span
                  animate={{
                    rotate: hoveredButton === 'secondary' ? 180 : 0,
                    scale: hoveredButton === 'secondary' ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="relative z-10 inline-flex"
                >
                  <Sparkles size={15} aria-hidden="true" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Divider — animated reveal */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            aria-hidden="true"
            className="mt-10 sm:mt-12 h-px bg-gradient-to-r from-white/25 via-white/10 to-transparent origin-left"
          />

          {/* Stats — refined editorial layout with dividers */}
          <motion.div
            className="flex flex-wrap items-stretch gap-6 sm:gap-8 md:gap-12 mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group cursor-default"
                onHoverStart={() => setHoveredStat(index)}
                onHoverEnd={() => setHoveredStat(null)}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col">
                  <motion.span
                    className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.85 + index * 0.1,
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 mt-2 uppercase tracking-[0.15em] font-medium">
                    {stat.label}
                  </span>

                  {/* Hover underline */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px bg-blue-500"
                    initial={false}
                    animate={{
                      width: hoveredStat === index ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>

                {/* Icon appears above on hover */}
                <AnimatePresence>
                  {hoveredStat === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.8 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.8 }}
                      transition={{ duration: 0.22 }}
                      aria-hidden="true"
                      className="absolute -top-6 left-0"
                    >
                      <stat.icon size={14} className="text-blue-400" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vertical divider between stats */}
                {index < stats.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute -right-3 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Scroll Indicator — refined mouse shape
         ───────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Mouse outline */}
          <div className="relative w-[22px] h-[36px] rounded-full border border-white/30 flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[3px] h-[6px] rounded-full bg-white/80"
            />
          </div>
          <span className="text-[9px] text-white/50 uppercase tracking-[0.3em] font-medium">
            Scroll
          </span>
        </div>
      </motion.div>
    </div>
  )
}