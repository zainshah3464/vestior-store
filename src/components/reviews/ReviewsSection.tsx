'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Star, ChevronDown } from 'lucide-react'
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

  // Hide form if not logged in
  const canReview = !!currentUserId

  return (
    <section className="mt-12 md:mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare size={24} className="text-indigo-400" />
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-6 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-white mb-1">
                {stats.averageRating.toFixed(1)}
              </p>
              <StarRating rating={stats.averageRating} size={18} className="justify-center mb-2" />
              <p className="text-xs text-gray-500">
                Based on {stats.totalCount} review{stats.totalCount === 1 ? '' : 's'}
              </p>
            </div>

            {/* Breakdown */}
            {stats.totalCount > 0 && (
              <div className="space-y-1.5 mt-4 pt-4 border-t border-white/10">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.breakdown[String(star)] ?? 0
                  const pct =
                    stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400 w-8 flex items-center gap-0.5">
                        {star}
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* CTA */}
            {canReview && (
              <button
                onClick={() => setShowForm((v) => !v)}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {showForm ? 'Cancel' : userReview ? 'Edit Your Review' : 'Write a Review'}
              </button>
            )}

            {!canReview && (
              <p className="mt-6 text-xs text-gray-500 text-center">
                <a href="/auth/login" className="text-indigo-400 hover:underline">
                  Sign in
                </a>{' '}
                to write a review
              </p>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Form */}
          <AnimatePresence>
            {showForm && canReview && (
              <ReviewForm
                productId={productId}
                existingReview={userReview}
                onSubmitted={handleSubmitted}
              />
            )}
          </AnimatePresence>

          {/* List */}
          {initialReviews.length === 0 && !showForm ? (
            <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-12 text-center">
              <MessageSquare size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No reviews yet</p>
              <p className="text-sm text-gray-500">
                Be the first to share your experience
              </p>
            </div>
          ) : (
            <>
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {hasMore && (
                <button
                  onClick={() => setVisibleCount((v) => v + 5)}
                  className="w-full py-2.5 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  Show More Reviews
                  <ChevronDown size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}