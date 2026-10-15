'use client'

import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { Home, Compass } from 'lucide-react'

export default function NotFound() {
  // ─────────────────────────────────────────────
  // Shared mouse → spring motion values
  // (single listener, smooth follow, no re-renders)
  // ─────────────────────────────────────────────
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const springCfg = { stiffness: 45, damping: 16, mass: 0.8 }
  const sx = useSpring(mx, springCfg)
  const sy = useSpring(my, springCfg)

  // ─────────────────────────────────────────────
  // Per-layer parallax transforms
  // (different depth = different multiplier)
  // ─────────────────────────────────────────────
  const orb1X = useTransform(sx, [0, 1], [35, -35])
  const orb1Y = useTransform(sy, [0, 1], [35, -35])
  const orb2X = useTransform(sx, [0, 1], [-45, 45])
  const orb2Y = useTransform(sy, [0, 1], [-45, 45])

  const reticleX = useTransform(sx, [0, 1], [-12, 12])
  const reticleY = useTransform(sy, [0, 1], [-12, 12])

  const digitLeftX = useTransform(sx, [0, 1], [-30, 30])
  const digitLeftY = useTransform(sy, [0, 1], [-30, 30])
  const digitMidX = useTransform(sx, [0, 1], [22, -22])
  const digitMidY = useTransform(sy, [0, 1], [22, -22])
  const digitRightX = useTransform(sx, [0, 1], [-30, 30])
  const digitRightY = useTransform(sy, [0, 1], [-30, 30])

  const contentX = useTransform(sx, [0, 1], [-18, 18])
  const contentY = useTransform(sy, [0, 1], [-18, 18])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth)
      my.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [mx, my])

  // ─────────────────────────────────────────────
  // Particle field (random on mount)
  // ─────────────────────────────────────────────
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; dur: number; delay: number }[]
  >([])
  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.6,
        dur: 3 + Math.random() * 4,
        delay: Math.random() * 4,
      }))
    )
  }, [])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-5 sm:px-8">
      {/* ═════════════════════════════════════════════
          Ambient orbs (opposite parallax for depth)
         ═════════════════════════════════════════════ */}
      <motion.div
        aria-hidden="true"
        style={{ x: orb1X, y: orb1Y }}
        className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[400px] bg-indigo-500/[0.08] blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: orb2X, y: orb2Y }}
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[400px] bg-blue-500/[0.06] blur-[120px]"
      />

      {/* ═════════════════════════════════════════════
          Tech reticle (concentric rings + crosshair)
         ═════════════════════════════════════════════ */}
      <motion.svg
        aria-hidden="true"
        style={{ x: reticleX, y: reticleY }}
        className="pointer-events-none absolute inset-0 w-full h-full opacity-70"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle
          cx="400"
          cy="400"
          r="360"
          fill="none"
          stroke="rgba(99,102,241,0.06)"
          strokeWidth="1"
        />
        <circle
          cx="400"
          cy="400"
          r="280"
          fill="none"
          stroke="rgba(99,102,241,0.1)"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
        <circle
          cx="400"
          cy="400"
          r="200"
          fill="none"
          stroke="rgba(99,102,241,0.14)"
          strokeWidth="1"
        />
        {/* Crosshair ticks */}
        <line x1="400" y1="20" x2="400" y2="80" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        <line x1="400" y1="720" x2="400" y2="780" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        <line x1="20" y1="400" x2="80" y2="400" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        <line x1="720" y1="400" x2="780" y2="400" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      </motion.svg>

      {/* ═════════════════════════════════════════════
          Particle field
         ═════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-indigo-400/50"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.7, 0.1] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ═════════════════════════════════════════════
          Main content
         ═════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        {/* Status badge */}
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-8"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-gray-400">
            Signal Lost · 404
          </span>
        </motion.div>

        {/* Big 404 with per-digit parallax */}
        <div className="flex items-center justify-center gap-1 sm:gap-3 md:gap-5 mb-6 select-none">
          <motion.span
            style={{ x: digitLeftX, y: digitLeftY }}
            className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-bold text-white leading-none tracking-[-0.05em]"
          >
            4
          </motion.span>

          <motion.span
            style={{ x: digitMidX, y: digitMidY }}
            className="relative text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-bold leading-none tracking-[-0.05em]"
          >
            {/* Pulsing portal rings behind the 0 */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.span
                className="absolute w-[70%] aspect-square rounded-full border border-indigo-500/40"
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.span
                className="absolute w-[70%] aspect-square rounded-full border border-indigo-500/25"
                animate={{ scale: [1, 2.1], opacity: [0.6, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: 0.7,
                  ease: 'easeOut',
                }}
              />
            </span>
            <span className="relative bg-gradient-to-br from-indigo-300 via-white to-indigo-400 bg-clip-text text-transparent">
              0
            </span>
          </motion.span>

          <motion.span
            style={{ x: digitRightX, y: digitRightY }}
            className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-bold text-white leading-none tracking-[-0.05em]"
          >
            4
          </motion.span>
        </div>

        {/* Text content */}
        <motion.div style={{ x: contentX, y: contentY }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] mb-3">
            Page Not Found
          </h1>
          <p className="text-[13px] sm:text-[14px] text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been
            moved to a different dimension.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 w-full sm:w-auto"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: 'easeInOut',
                }}
              />
              <Home size={14} aria-hidden="true" className="relative" />
              <span className="relative">Back to Home</span>
            </Link>

            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/[0.1] text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/[0.04] text-[13px] font-semibold transition-all duration-300 w-full sm:w-auto"
            >
              <Compass
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:rotate-45"
              />
              <span>Browse Products</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}