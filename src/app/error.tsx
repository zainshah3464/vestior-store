'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Structured log — will be picked up by Vercel logs.
    // Phase 6 will add Sentry.captureException here.
    console.error('[Global error]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <span className="text-4xl" role="img" aria-label="Warning">
            ⚠️
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          An unexpected error occurred. Please try again. If the problem
          persists, contact support.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-600 mb-6 font-mono">
            Reference: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}