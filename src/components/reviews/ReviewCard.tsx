'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, ThumbsUp } from 'lucide-react'
import StarRating from './StarRating'
import type { ProductReview } from '@/lib/reviews/types'

export default function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-white truncate">
                {review.userName}
              </p>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  <BadgeCheck size={10} />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(review.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>

      {review.title && (
        <h4 className="text-sm font-semibold text-white mb-1">{review.title}</h4>
      )}

      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {review.helpfulCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-500">
          <ThumbsUp size={12} />
          {review.helpfulCount} found this helpful
        </div>
      )}
    </motion.div>
  )
}