'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  rating: number // 0-5, can be decimal
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export default function StarRating({
  rating,
  size = 16,
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  // What to display: hovered value takes precedence over actual rating
  const displayRating = interactive && hoverValue !== null ? hoverValue : rating

  return (
    <div
      className={`flex items-center ${interactive ? 'gap-1.5' : 'gap-0.5'} ${className}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Select a rating' : `${rating} out of 5 stars`}
      onMouseLeave={() => interactive && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayRating >= star
        const halfFilled = !filled && displayRating >= star - 0.5

        if (interactive) {
          const isActive = hoverValue === null ? filled : star <= hoverValue

          return (
            <motion.button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHoverValue(star)}
              onFocus={() => setHoverValue(star)}
              onBlur={() => setHoverValue(null)}
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="relative p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
            >
              <Star
                size={size}
                strokeWidth={1.75}
                className={
                  isActive
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]'
                    : 'text-gray-600 hover:text-gray-500 transition-colors'
                }
                aria-hidden="true"
              />
            </motion.button>
          )
        }

        return (
          <Star
            key={star}
            size={size}
            strokeWidth={1.75}
            className={
              filled
                ? 'text-amber-400 fill-amber-400'
                : halfFilled
                ? 'text-amber-400 fill-amber-400 opacity-50'
                : 'text-gray-700'
            }
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}