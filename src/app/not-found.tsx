'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function BackgroundParticles() {
  const [particles, setParticles] = useState<{x: number; y: number; delay: number}[]>([])
  useEffect(() => {
    setParticles(Array.from({length: 30}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    })))
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-500/30 rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 + p.delay, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      <BackgroundParticles />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="text-center max-w-md relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl font-bold text-white mb-4"
        >
          4
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block"
          >
            0
          </motion.span>
          4
        </motion.h1>
        <p className="text-xl text-gray-400 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-500/30"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}