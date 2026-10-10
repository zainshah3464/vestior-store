'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number          // 0-5, can be decimal
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
  return (
    <div className={`flex items-center gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const halfFilled = !filled && rating >= star - 0.5

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="hover:scale-110 transition-transform"
              aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
            >
              <Star
                size={size}
                className={filled || halfFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
              />
            </button>
          )
        }

        return (
          <Star
            key={star}
            size={size}
            className={
              filled
                ? 'text-amber-400 fill-amber-400'
                : halfFilled
                ? 'text-amber-400 fill-amber-400 opacity-60'
                : 'text-gray-600'
            }
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}