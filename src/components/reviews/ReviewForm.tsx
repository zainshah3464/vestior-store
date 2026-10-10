'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import StarRating from './StarRating'
import { submitReview } from '@/actions/reviews'
import type { ProductReview } from '@/lib/reviews/types'

interface ReviewFormProps {
  productId: string
  existingReview: ProductReview | null
  onSubmitted?: () => void
}

export default function ReviewForm({
  productId,
  existingReview,
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [title, setTitle] = useState(existingReview?.title ?? '')
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating < 1) {
      toast.error('Please select a rating')
      return
    }
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      await submitReview({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      })
      toast.success(
        existingReview
          ? 'Review updated — pending moderation'
          : 'Review submitted — pending moderation'
      )
      onSubmitted?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-5 space-y-4"
    >
      <h3 className="text-base font-semibold text-white">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {existingReview?.status === 'pending' && (
        <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          Your review is pending moderation. You can update it below.
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Your Rating <span className="text-red-400">*</span>
        </label>
        <StarRating
          rating={rating}
          size={28}
          interactive
          onChange={setRating}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          Title <span className="text-gray-600">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summarize your experience"
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">
          Review <span className="text-red-400">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          minLength={10}
          maxLength={2000}
          placeholder="What did you like or dislike? How was the quality, fit, and delivery?"
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 resize-none"
        />
        <p className="text-[10px] text-gray-600 mt-1">
          {comment.length} / 2000
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send size={14} />
        )}
        {submitting
          ? 'Submitting...'
          : existingReview
          ? 'Update Review'
          : 'Submit Review'}
      </button>

      <p className="text-[10px] text-gray-500 text-center">
        Reviews are moderated. Verified purchase badge shown for confirmed buyers.
      </p>
    </motion.form>
  )
}