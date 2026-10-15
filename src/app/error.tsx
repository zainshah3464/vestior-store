'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useState } from 'react'
import { Home, RotateCcw, AlertOctagon } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // ─────────────────────────────────────────────
  // Structured log — preserved exactly
  // ─────────────────────────────────────────────
  useEffect(() => {
    console.error('[Global error]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  // ─────────────────────────────────────────────
  // Shared mouse → spring motion values
  // ─────────────────────────────────────────────
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const springCfg = { stiffness: 45, damping: 16, mass: 0.8 }
  const sx = useSpring(mx, springCfg)
  const sy = useSpring(my, springCfg)

  // ─────────────────────────────────────────────
  // Per-layer parallax transforms
  // ─────────────────────────────────────────────
  const orb1X = useTransform(sx, [0, 1], [35, -35])
  const orb1Y = useTransform(sy, [0, 1], [35, -35])
  const orb2X = useTransform(sx, [0, 1], [-45, 45])
  const orb2Y = useTransform(sy, [0, 1], [-45, 45])

  const reticleX = useTransform(sx, [0, 1], [-12, 12])
  const reticleY = useTransform(sy, [0, 1], [-12, 12])

  const iconX = useTransform(sx, [0, 1], [22, -22])
  const iconY = useTransform(sy, [0, 1], [22, -22])

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
  // Particle field
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
    <html lang="en">
      <body className="bg-black">
        <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-5 sm:px-8">
          {/* ═════════════════════════════════════════════
              Ambient orbs — red/critical accent
             ═════════════════════════════════════════════ */}
          <motion.div
            aria-hidden="true"
            style={{ x: orb1X, y: orb1Y }}
            className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[400px] bg-red-500/[0.07] blur-[120px]"
          />
          <motion.div
            aria-hidden="true"
            style={{ x: orb2X, y: orb2Y }}
            className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[400px] bg-rose-500/[0.05] blur-[120px]"
          />

          {/* ═════════════════════════════════════════════
              Tech reticle
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
              stroke="rgba(239,68,68,0.06)"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="280"
              fill="none"
              stroke="rgba(239,68,68,0.1)"
              strokeWidth="1"
              strokeDasharray="3 9"
            />
            <circle
              cx="400"
              cy="400"
              r="200"
              fill="none"
              stroke="rgba(239,68,68,0.14)"
              strokeWidth="1"
            />
            <line x1="400" y1="20" x2="400" y2="80" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
            <line x1="400" y1="720" x2="400" y2="780" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
            <line x1="20" y1="400" x2="80" y2="400" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
            <line x1="720" y1="400" x2="780" y2="400" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
          </motion.svg>

          {/* ═════════════════════════════════════════════
              Particle field
             ═════════════════════════════════════════════ */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-red-400/50"
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
                Critical Failure
              </span>
            </motion.div>

            {/* Center icon — parallax + pulsing rings */}
            <motion.div
              style={{ x: iconX, y: iconY }}
              className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 flex items-center justify-center"
            >
              {/* Outer pulsing rings */}
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.span
                  className="absolute w-full aspect-square rounded-full border border-red-500/40"
                  animate={{ scale: [1, 1.7], opacity: [0.9, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                <motion.span
                  className="absolute w-full aspect-square rounded-full border border-red-500/25"
                  animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: 0.7,
                    ease: 'easeOut',
                  }}
                />
              </span>

              {/* Inner icon tile */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-red-500/[0.15] via-rose-500/[0.1] to-red-600/[0.15] border border-red-500/30 flex items-center justify-center shadow-[0_0_60px_-12px_rgba(239,68,68,0.5)]">
                <motion.div
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <AlertOctagon
                    size={44}
                    className="text-red-400"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Inner glow ring */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-3xl bg-red-500/[0.08] blur-2xl -z-10"
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div style={{ x: contentX, y: contentY }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-3">
                Critical Error
              </h1>
              <p className="text-[13px] sm:text-[14px] text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                The application encountered a fatal error and couldn&rsquo;t
                recover. Please try again. If the issue persists, contact
                support.
              </p>

              {/* Error digest pill */}
              {error.digest && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                  <AlertOctagon
                    size={10}
                    className="text-red-400"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-mono text-gray-500">
                    Ref: {error.digest}
                  </span>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-[13px] font-semibold overflow-hidden shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto"
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
                  <RotateCcw
                    size={14}
                    aria-hidden="true"
                    className="relative transition-transform duration-300 group-hover:-rotate-180"
                  />
                  <span className="relative">Try Again</span>
                </button>

                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/[0.1] text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/[0.04] text-[13px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto"
                >
                  <Home size={14} aria-hidden="true" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  )
}