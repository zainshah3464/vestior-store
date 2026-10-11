'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, X, Check, RotateCcw, ChevronDown,
} from 'lucide-react'
import {
  buildFilterUrl,
  countActiveFilters,
  type ProductFilters,
} from '@/lib/products/filters'

interface Props {
  basePath: string
  categories: string[]
  filters: ProductFilters
  /** Max price in catalog — used as slider max */
  priceCeiling?: number
}

const DEFAULT_PRICE_CEILING = 50000

export default function ProductFiltersSidebar({
  basePath,
  categories,
  filters,
  priceCeiling = DEFAULT_PRICE_CEILING,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '')
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '')

  const activeCount = countActiveFilters(filters)

  // Sync inputs with URL when filters change externally
  useEffect(() => {
    setMinPrice(filters.minPrice?.toString() ?? '')
    setMaxPrice(filters.maxPrice?.toString() ?? '')
  }, [filters.minPrice, filters.maxPrice])

  const getCurrentParams = (): Record<string, string> => {
    const obj: Record<string, string> = {}
    searchParams.forEach((v, k) => {
      obj[k] = v
    })
    return obj
  }

  const update = (
    updates: Partial<Record<string, string | number | boolean | undefined>>
  ) => {
    const url = buildFilterUrl(basePath, getCurrentParams(), {
      ...updates,
      page: undefined, // reset page on filter change
    })
    router.push(url)
  }

  const handleApplyPrice = () => {
    const min = minPrice ? parseInt(minPrice, 10) : undefined
    const max = maxPrice ? parseInt(maxPrice, 10) : undefined

    update({
      minPrice: min && min > 0 ? min : undefined,
      maxPrice: max && max > 0 ? max : undefined,
    })
  }

  const handleReset = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push(basePath)
  }

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-indigo-400" />
          Filters
          {activeCount > 0 && (
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <Section title="Category">
          <div className="space-y-1">
            <button
              onClick={() => update({ category: undefined })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                !filters.category
                  ? 'bg-indigo-500/15 text-indigo-400 font-medium'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const active = filters.category === cat
              return (
                <button
                  key={cat}
                  onClick={() =>
                    update({ category: active ? undefined : cat })
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-400 font-medium'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  {active && <Check size={14} />}
                </button>
              )
            })}
          </div>
        </Section>
      )}

      {/* Price Range */}
      <Section title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[10px] text-gray-500 mb-1">
                Min (₹)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <span className="text-gray-600 mt-5">–</span>
            <div className="flex-1">
              <label className="block text-[10px] text-gray-500 mb-1">
                Max (₹)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                min={0}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
          <button
            onClick={handleApplyPrice}
            className="w-full py-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 rounded-lg text-xs font-medium transition"
          >
            Apply Price
          </button>
        </div>
      </Section>

      {/* In stock */}
      <Section title="Availability">
        <button
          onClick={() => update({ inStock: !filters.inStockOnly })}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition ${
            filters.inStockOnly
              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
              : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'
          }`}
        >
          <span className="text-sm">In Stock Only</span>
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
              filters.inStockOnly
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-600'
            }`}
          >
            {filters.inStockOnly && <Check size={10} className="text-white" />}
          </div>
        </button>
      </Section>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5">
          {content}
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0A0A0A] z-10 pt-3 pb-2 px-5 border-b border-white/5">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Filters</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5">{content}</div>
              <div className="sticky bottom-0 bg-[#0A0A0A] p-4 border-t border-white/10">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-white/5 pt-5 first:border-t-0 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h4>
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}