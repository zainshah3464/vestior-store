'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowDownWideNarrow, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  SORT_OPTIONS,
  buildFilterUrl,
  type SortOption,
} from '@/lib/products/filters'

export default function ProductSort({
  basePath,
  currentSort,
}: {
  basePath: string
  currentSort: SortOption
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption

    const current: Record<string, string> = {}
    searchParams.forEach((v, k) => {
      current[k] = v
    })

    const url = buildFilterUrl(basePath, current, {
      sort: value === 'newest' ? undefined : value,
      page: undefined,
    })
    router.push(url)
  }

  const currentLabel =
    SORT_OPTIONS.find((s) => s.value === currentSort)?.label ?? 'Newest'

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center gap-2"
    >
      {/* Icon — hidden on mobile to save space */}
      <ArrowDownWideNarrow
        size={15}
        className="hidden sm:block text-gray-500 flex-shrink-0"
        aria-hidden="true"
      />

      {/* Select wrapper — custom chevron */}
      <div className="relative">
        <select
          value={currentSort}
          onChange={handleChange}
          aria-label="Sort products"
          className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-3.5 pr-9 py-2 text-[12px] sm:text-[13px] font-medium text-white hover:bg-white/[0.06] hover:border-white/15 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200 cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>

      {/* Visually hidden current value for SR if needed */}
      <span className="sr-only">Currently sorted by {currentLabel}</span>
    </motion.div>
  )
}