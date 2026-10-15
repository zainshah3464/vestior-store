'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Send, Shield, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import StarRating from './StarRating'
import { submitReview } from '@/actions/reviews'
import type { ProductReview } from '@/lib/reviews/types'

interface ReviewFormProps {
  productId: string
  existingReview: ProductReview | null
  onSubmitted?: () => void
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'] as const

export default function ReviewForm({
  productId,
  existingReview,
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [title, setTitle] = useState(existingReview?.title ?? '')
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [submitting, setSubmitting] = useState(false)

  const commentLen = comment.length
  const commentValid = comment.trim().length >= 10
  const titleLen = title.length

  // Live progress for character counter
  const commentProgress = useMemo(
    () => Math.min((commentLen / 2000) * 100, 100),
    [commentLen]
  )

  const ratingLabel = rating >= 1 && rating <= 5 ? RATING_LABELS[rating] : null

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
      toast.error(
        err instanceof Error ? err.message : 'Failed to submit review'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 md:p-6 space-y-5"
    >
      {/* Subtle accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-indigo-500/[0.06] blur-[100px]"
      />

      {/* ─────────────────────────────────────────────
          Header
         ───────────────────────────────────────────── */}
      <header className="relative flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
          <Sparkles
            size={15}
            className="text-indigo-400"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-white leading-tight">
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Share your experience to help other shoppers
          </p>
        </div>
      </header>

      {/* Pending moderation notice */}
      {existingReview?.status === 'pending' && (
        <div className="relative flex items-start gap-2.5 text-[11px] text-amber-300 bg-amber-500/[0.08] border border-amber-500/25 rounded-xl px-3.5 py-2.5 leading-relaxed">
          <Shield
            size={12}
            className="flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>
            Your review is pending moderation. You can update it below.
          </span>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          Rating
         ───────────────────────────────────────────── */}
      <div className="relative">
        <label className="flex items-center justify-between mb-3">
          <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400">
            Your Rating <span className="text-red-400">*</span>
          </span>
          {ratingLabel && (
            <motion.span
              key={ratingLabel}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-medium text-amber-400 tracking-wide"
            >
              {ratingLabel}
            </motion.span>
          )}
        </label>

        <StarRating
          rating={rating}
          size={30}
          interactive
          onChange={setRating}
        />
      </div>

      {/* ─────────────────────────────────────────────
          Title (optional)
         ───────────────────────────────────────────── */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="review-title"
            className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400"
          >
            Title <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
          </label>
          <span className="text-[10px] text-gray-600 tabular-nums">
            {titleLen} / 100
          </span>
        </div>

        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summarize your experience"
          className="w-full px-3.5 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
        />
      </div>

      {/* ─────────────────────────────────────────────
          Review body
         ───────────────────────────────────────────── */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="review-body"
            className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400"
          >
            Review <span className="text-red-400">*</span>
          </label>
          <span
            className={`text-[10px] tabular-nums ${
              commentValid ? 'text-gray-600' : 'text-red-400/70'
            }`}
          >
            {commentLen} / 2000
          </span>
        </div>

        <textarea
          id="review-body"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          minLength={10}
          maxLength={2000}
          placeholder="What did you like or dislike? How was the quality, fit, and delivery?"
          className="w-full px-3.5 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200 resize-none leading-relaxed"
        />

        {/* Progress bar */}
        <div
          aria-hidden="true"
          className="mt-2 h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden"
        >
          <motion.div
            initial={false}
            animate={{ width: `${commentProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              commentValid
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                : 'bg-gradient-to-r from-amber-500 to-amber-400'
            }`}
          />
        </div>

        {/* Inline hint */}
        {!commentValid && commentLen > 0 && (
          <p className="text-[10px] text-amber-400/70 mt-1.5">
            Need at least 10 characters ({10 - comment.trim().length} more)
          </p>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          Submit
         ───────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting}
        className="group/btn relative w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        {/* Shine sweep */}
        {!submitting && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
          />
        )}

        <span className="relative z-10 inline-flex items-center gap-2">
          {submitting ? (
            <Loader2
              className="w-4 h-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Send size={14} aria-hidden="true" />
          )}
          {submitting
            ? 'Submitting...'
            : existingReview
            ? 'Update Review'
            : 'Submit Review'}
        </span>
      </button>

      {/* Footer note */}
      <p className="relative text-[10px] text-gray-500 text-center leading-relaxed">
        Reviews are moderated. Verified purchase badge shown for confirmed buyers.
      </p>
    </motion.form>
  )
}