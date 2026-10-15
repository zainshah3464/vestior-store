'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  ChevronDown,
  Package,
  Tag,
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

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [mobileOpen])

  // ESC closes mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileOpen])

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
      page: undefined,
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

  const handleKeyDownPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApplyPrice()
    }
  }

  // ─────────────────────────────────────────────
  // Filter content (shared between desktop + mobile)
  // ─────────────────────────────────────────────
  const content = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
        <h3 className="text-[13px] font-semibold text-white flex items-center gap-2 tracking-wide">
          <SlidersHorizontal
            size={13}
            className="text-blue-400"
            aria-hidden="true"
          />
          Filters
          {activeCount > 0 && (
            <motion.span
              key={activeCount}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="ml-1 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/30"
            >
              {activeCount}
            </motion.span>
          )}
        </h3>

        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 group"
          >
            <RotateCcw
              size={10}
              className="transition-transform duration-300 group-hover:-rotate-90"
              aria-hidden="true"
            />
            Reset
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          Category
         ───────────────────────────────────────────── */}
      {categories.length > 0 && (
        <Section
          title="Category"
          icon={Package}
        >
          <div className="space-y-0.5">
            <FilterOption
              label="All Categories"
              active={!filters.category}
              onClick={() => update({ category: undefined })}
            />
            {categories.map((cat) => {
              const active = filters.category === cat
              return (
                <FilterOption
                  key={cat}
                  label={cat}
                  active={active}
                  onClick={() => update({ category: active ? undefined : cat })}
                />
              )
            })}
          </div>
        </Section>
      )}

      {/* ─────────────────────────────────────────────
          Price Range
         ───────────────────────────────────────────── */}
      <Section title="Price Range" icon={Tag}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="price-min"
                className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-medium"
              >
                Min (₹)
              </label>
              <input
                id="price-min"
                type="number"
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onKeyDown={handleKeyDownPrice}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200"
              />
            </div>

            <span
              className="text-gray-600 mt-5 text-sm select-none"
              aria-hidden="true"
            >
              –
            </span>

            <div className="flex-1 min-w-0">
              <label
                htmlFor="price-max"
                className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-medium"
              >
                Max (₹)
              </label>
              <input
                id="price-max"
                type="number"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyDown={handleKeyDownPrice}
                placeholder="Any"
                min={0}
                className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleApplyPrice}
            className="w-full py-2 bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-blue-600 hover:border-blue-400/40 hover:text-white rounded-xl text-[12px] font-medium transition-all duration-300"
          >
            Apply Price
          </button>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────
          Availability
         ───────────────────────────────────────────── */}
      <Section title="Availability">
        <button
          onClick={() => update({ inStock: !filters.inStockOnly })}
          aria-pressed={!!filters.inStockOnly}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 ${
            filters.inStockOnly
              ? 'bg-blue-500/[0.12] border-blue-500/40 text-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.05)]'
              : 'bg-black/30 border-white/[0.08] text-gray-300 hover:border-white/15 hover:bg-white/[0.03]'
          }`}
        >
          <span className="text-[13px] font-medium">In Stock Only</span>
          <div
            aria-hidden="true"
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
              filters.inStockOnly
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-600'
            }`}
          >
            {filters.inStockOnly && (
              <Check size={10} className="text-white" strokeWidth={3} />
            )}
          </div>
        </button>
      </Section>
    </div>
  )

  return (
    <>
      {/* ─────────────────────────────────────────────
          Desktop sidebar
         ───────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-[#0f0f0f]/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl shadow-black/30">
          {content}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────
          Mobile filter trigger
         ───────────────────────────────────────────── */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="group w-full py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-200"
        >
          <SlidersHorizontal
            size={14}
            className="transition-transform duration-300 group-hover:rotate-90"
            aria-hidden="true"
          />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-blue-500/30">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────
          Mobile drawer
         ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-label="Product filters"
              className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden max-h-[88vh] bg-[#0A0A0A] border-t border-white/[0.08] rounded-t-3xl overflow-hidden flex flex-col shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* Drawer header */}
              <div className="relative flex-shrink-0 pt-3 pb-3 px-5 border-b border-white/[0.06] bg-[#0A0A0A]">
                <div
                  aria-hidden="true"
                  className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3"
                />
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-white tracking-wide">
                    Filters
                    {activeCount > 0 && (
                      <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/30 font-medium">
                        {activeCount}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 -mr-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-all duration-200"
                    aria-label="Close filters"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 overscroll-contain">
                {content}
              </div>

              {/* Drawer footer */}
              <div className="flex-shrink-0 p-4 border-t border-white/[0.06] bg-[#0A0A0A] safe-area-bottom">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-[14px] font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  Show {activeCount > 0 ? 'Filtered ' : ''}Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────
// Collapsible section
// ─────────────────────────────────────────────
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-white/[0.06] pt-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between mb-3 group py-1"
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={11}
              className="text-gray-500 group-hover:text-blue-400 transition-colors duration-200"
              aria-hidden="true"
            />
          )}
          <h4 className="text-[10px] font-semibold text-gray-400 group-hover:text-gray-300 uppercase tracking-[0.15em] transition-colors duration-200">
            {title}
          </h4>
        </div>
        <ChevronDown
          size={13}
          className={`text-gray-500 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────
// Filter option row
// ─────────────────────────────────────────────
function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 flex items-center justify-between ${
        active
          ? 'bg-blue-500/[0.12] text-blue-300 font-medium'
          : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      <span className="truncate">{label}</span>

      {/* Active check */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <Check size={13} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Left accent bar */}
      {active && (
        <motion.span
          layoutId="filter-active-bar"
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-blue-500 rounded-r-full"
        />
      )}
    </button>
  )
}