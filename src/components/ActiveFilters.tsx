'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  buildFilterUrl,
  type ProductFilters,
  SORT_OPTIONS,
} from '@/lib/products/filters'

export default function ActiveFilters({
  basePath,
  filters,
}: {
  basePath: string
  filters: ProductFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const current: Record<string, string> = {}
  searchParams.forEach((v, k) => {
    current[k] = v
  })

  const remove = (key: string) => {
    const url = buildFilterUrl(basePath, current, {
      [key]: undefined,
      page: undefined,
    })
    router.push(url)
  }

  const chips: Array<{ key: string; label: string }> = []

  if (filters.category) {
    chips.push({ key: 'category', label: filters.category })
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice?.toLocaleString() ?? '0'
    const max = filters.maxPrice?.toLocaleString() ?? '∞'
    chips.push({
      key: 'minPrice',
      label: `₹${min} – ₹${max}`,
    })
  }

  if (filters.inStockOnly) {
    chips.push({ key: 'inStock', label: 'In Stock' })
  }

  if (filters.sort && filters.sort !== 'newest') {
    const sortLabel = SORT_OPTIONS.find((s) => s.value === filters.sort)?.label
    if (sortLabel) chips.push({ key: 'sort', label: sortLabel })
  }

  if (chips.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {chips.map((chip) => (
          <button
            key={chip.key + chip.label}
            onClick={() => {
              if (chip.key === 'minPrice') {
                // Clear both min and max
                const url = buildFilterUrl(basePath, current, {
                  minPrice: undefined,
                  maxPrice: undefined,
                  page: undefined,
                })
                router.push(url)
              } else {
                remove(chip.key)
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-full text-xs hover:bg-indigo-500/25 transition"
          >
            <span>{chip.label}</span>
            <X size={11} />
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}