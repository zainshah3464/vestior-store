'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowDownWideNarrow } from 'lucide-react'
import { SORT_OPTIONS, buildFilterUrl, type SortOption } from '@/lib/products/filters'

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

    // Build searchParams object
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

  return (
    <div className="flex items-center gap-2">
      <ArrowDownWideNarrow
        size={16}
        className="text-gray-500 hidden sm:block"
        aria-hidden="true"
      />
      <select
        value={currentSort}
        onChange={handleChange}
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-[#1a1a1a] cursor-pointer"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}