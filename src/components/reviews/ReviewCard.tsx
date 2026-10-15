'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, ThumbsUp, Quote } from 'lucide-react'
import StarRating from './StarRating'
import type { ProductReview } from '@/lib/reviews/types'

export default function ReviewCard({ review }: { review: ProductReview }) {
  const initials = review.userName.charAt(0).toUpperCase()

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 md:p-6 transition-colors duration-300"
    >
      {/* Subtle top-left quote mark */}
      <Quote
        size={28}
        className="absolute top-4 right-4 text-white/[0.04] group-hover:text-white/[0.06] transition-colors duration-300"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────
          Header — avatar + name + rating
         ───────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0 ring-1 ring-white/10"
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Name + date + verified badge */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13px] md:text-[14px] font-semibold text-white truncate leading-tight">
                {review.userName}
              </p>

              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wider uppercase bg-emerald-500/[0.12] text-emerald-300 px-1.5 py-[3px] rounded-md border border-emerald-500/25 flex-shrink-0">
                  <BadgeCheck size={10} aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mt-1 tabular-nums">
              {new Date(review.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Rating — right aligned */}
        <div className="flex-shrink-0">
          <StarRating rating={review.rating} size={13} />
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          Review title
         ───────────────────────────────────────────── */}
      {review.title && (
        <h4 className="text-[14px] font-semibold text-white mb-2 leading-snug tracking-[-0.01em]">
          {review.title}
        </h4>
      )}

      {/* ─────────────────────────────────────────────
          Review body
         ───────────────────────────────────────────── */}
      <p className="text-[13px] md:text-[14px] text-gray-300 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {/* ─────────────────────────────────────────────
          Helpful footer (only when count > 0)
         ───────────────────────────────────────────── */}
      {review.helpfulCount > 0 && (
        <footer className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-gray-500">
          <ThumbsUp size={11} aria-hidden="true" />
          <span>
            <span className="text-gray-400 font-medium tabular-nums">
              {review.helpfulCount}
            </span>{' '}
            {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
          </span>
        </footer>
      )}
    </motion.article>
  )
}