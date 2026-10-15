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

  const clearPriceRange = () => {
    const url = buildFilterUrl(basePath, current, {
      minPrice: undefined,
      maxPrice: undefined,
      page: undefined,
    })
    router.push(url)
  }

  const clearAll = () => {
    router.push(basePath)
  }

  // Build chips
  const chips: Array<{
    key: string
    label: string
    onRemove: () => void
  }> = []

  if (filters.category) {
    chips.push({
      key: 'category',
      label: filters.category,
      onRemove: () => remove('category'),
    })
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice?.toLocaleString() ?? '0'
    const max = filters.maxPrice?.toLocaleString() ?? '∞'
    chips.push({
      key: 'price',
      label: `₹${min} – ₹${max}`,
      onRemove: clearPriceRange,
    })
  }

  if (filters.inStockOnly) {
    chips.push({
      key: 'inStock',
      label: 'In Stock',
      onRemove: () => remove('inStock'),
    })
  }

  if (filters.sort && filters.sort !== 'newest') {
    const sortLabel = SORT_OPTIONS.find((s) => s.value === filters.sort)?.label
    if (sortLabel) {
      chips.push({
        key: 'sort',
        label: sortLabel,
        onRemove: () => remove('sort'),
      })
    }
  }

  if (chips.length === 0) return null

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        role="list"
        aria-label="Active filters"
      >
        {chips.map((chip, idx) => (
          <motion.button
            key={chip.key}
            type="button"
            role="listitem"
            layout
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{
              duration: 0.2,
              delay: Math.min(idx * 0.03, 0.15),
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={chip.onRemove}
            className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-blue-500/[0.12] border border-blue-500/30 text-blue-300 rounded-full text-[11px] font-medium hover:bg-blue-500/25 hover:border-blue-400/50 hover:text-white transition-all duration-200"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <span className="truncate max-w-[140px]">{chip.label}</span>
            <X
              size={11}
              strokeWidth={2.5}
              className="text-blue-400/70 group-hover:text-white transition-colors duration-200 flex-shrink-0"
              aria-hidden="true"
            />
          </motion.button>
        ))}

        {/* Clear all — only shown if 2+ chips */}
        {chips.length >= 2 && (
          <motion.button
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            onClick={clearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:text-red-400 rounded-full transition-colors duration-200"
            aria-label="Clear all filters"
          >
            Clear all
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}