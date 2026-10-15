'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Star,
  ChevronDown,
  LogIn,
  PenLine,
  Sparkles,
} from 'lucide-react'
import StarRating from './StarRating'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import type { ProductReview, ReviewStats } from '@/lib/reviews/types'

interface ReviewsSectionProps {
  productId: string
  initialReviews: ProductReview[]
  stats: ReviewStats
  currentUserId: string | null
  userReview: ProductReview | null
}

export default function ReviewsSection({
  productId,
  initialReviews,
  stats,
  currentUserId,
  userReview,
}: ReviewsSectionProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)

  const visibleReviews = initialReviews.slice(0, visibleCount)
  const hasMore = initialReviews.length > visibleCount

  const handleSubmitted = () => {
    setShowForm(false)
    router.refresh()
  }

  const canReview = !!currentUserId
  const hasReviews = initialReviews.length > 0

  return (
    <section aria-label="Customer reviews">
      {/* ─────────────────────────────────────────────
          Section header
         ───────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-8 md:mb-10"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-indigo-500/[0.1] border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare
            size={18}
            className="text-indigo-400"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
            Customer Reviews
          </h2>
          <p className="text-[11px] sm:text-[12px] text-gray-500 mt-0.5">
            {hasReviews
              ? `${stats.totalCount} verified ${
                  stats.totalCount === 1 ? 'review' : 'reviews'
                }`
              : 'Be the first to share your experience'}
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* ═════════════════════════════════════════════
            Stats sidebar
           ═════════════════════════════════════════════ */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="lg:col-span-1"
        >
          <div className="lg:sticky lg:top-24 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 md:p-6 overflow-hidden relative">
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[240px] h-[160px] bg-amber-500/[0.04] blur-[80px]"
            />

            {/* Big average */}
            <div className="relative text-center pb-5">
              <p className="text-5xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-none tabular-nums">
                {stats.averageRating.toFixed(1)}
              </p>

              <div className="flex justify-center mt-3 mb-2">
                <StarRating
                  rating={stats.averageRating}
                  size={16}
                />
              </div>

              <p className="text-[11px] text-gray-500">
                Based on{' '}
                <span className="text-gray-400 font-medium tabular-nums">
                  {stats.totalCount}
                </span>{' '}
                {stats.totalCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Histogram */}
            {stats.totalCount > 0 && (
              <div className="relative pt-5 border-t border-white/[0.06] space-y-2">
                {([5, 4, 3, 2, 1] as const).map((star, i) => {
                  const count = stats.breakdown[String(star)] ?? 0
                  const pct =
                    stats.totalCount > 0
                      ? (count / stats.totalCount) * 100
                      : 0

                  return (
                    <div key={star} className="flex items-center gap-2.5">
                      {/* Star label */}
                      <span className="flex items-center gap-0.5 w-8 text-[11px] text-gray-400 tabular-nums flex-shrink-0">
                        {star}
                        <Star
                          size={9}
                          className="fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>

                      {/* Bar */}
                      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.6,
                            delay: 0.15 + i * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                        />
                      </div>

                      {/* Count */}
                      <span className="w-6 text-right text-[11px] text-gray-500 tabular-nums flex-shrink-0">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* CTA */}
            {canReview ? (
              <motion.button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                whileTap={{ scale: 0.98 }}
                className={`relative mt-6 w-full py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  showForm
                    ? 'bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30'
                }`}
              >
                <PenLine size={13} aria-hidden="true" />
                {showForm
                  ? 'Cancel'
                  : userReview
                  ? 'Edit Your Review'
                  : 'Write a Review'}
              </motion.button>
            ) : (
              <Link
                href="/auth/login"
                className="group mt-6 w-full py-2.5 rounded-xl text-[12px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                Sign in to review
              </Link>
            )}
          </div>
        </motion.aside>

        {/* ═════════════════════════════════════════════
            Reviews list
           ═════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Form */}
          <AnimatePresence mode="wait">
            {showForm && canReview && (
              <ReviewForm
                key="review-form"
                productId={productId}
                existingReview={userReview}
                onSubmitted={handleSubmitted}
              />
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!hasReviews && !showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden bg-gradient-to-b from-[#111111]/60 to-[#0a0a0a] border border-white/[0.06] rounded-2xl p-10 md:p-14 text-center"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[180px] bg-indigo-500/[0.06] blur-[90px]"
              />

              <div className="relative">
                {/* Icon with sparkles */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare
                    size={26}
                    className="text-indigo-400/70"
                    aria-hidden="true"
                  />
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles size={12} className="text-indigo-400/60" />
                  </motion.span>
                </div>

                <h3 className="text-[16px] font-semibold text-white mb-1.5">
                  No reviews yet
                </h3>
                <p className="text-[12px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Be the first to share your experience with this product.
                </p>

                {canReview && (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-400/40 transition-all duration-300"
                  >
                    <PenLine size={12} aria-hidden="true" />
                    Write the first review
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Review cards */}
              <div className="space-y-3 md:space-y-4">
                {visibleReviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(idx * 0.05, 0.25),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </div>

              {/* Show more */}
              {hasMore && (
                <motion.button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + 5)}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.99 }}
                  className="group w-full py-3 bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:border-white/15 hover:text-white rounded-xl text-[12px] font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Show More Reviews
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors tabular-nums">
                    ({initialReviews.length - visibleCount} remaining)
                  </span>
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}