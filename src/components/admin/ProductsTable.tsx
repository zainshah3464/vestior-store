'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Package,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Pencil,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  is_active: boolean
  images: string[]
  category_main: string
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  // ─────────────────────────────────────────────
  // Categories derived from products — preserved
  // ─────────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category_main))
    return ['all', ...Array.from(set).filter(Boolean).sort()]
  }, [products])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat =
      categoryFilter === 'all' || p.category_main === categoryFilter
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  // ─────────────────────────────────────────────
  // Stats — preserved
  // ─────────────────────────────────────────────
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.is_active).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Boxes,
      accent: 'border-l-indigo-500',
      glow: 'bg-indigo-500/[0.06]',
      iconBg: 'bg-indigo-500/[0.1]',
      iconText: 'text-indigo-400',
    },
    {
      label: 'Active',
      value: activeProducts,
      icon: CheckCircle2,
      accent: 'border-l-emerald-500',
      glow: 'bg-emerald-500/[0.06]',
      iconBg: 'bg-emerald-500/[0.1]',
      iconText: 'text-emerald-400',
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: AlertTriangle,
      accent: 'border-l-amber-500',
      glow: 'bg-amber-500/[0.06]',
      iconBg: 'bg-amber-500/[0.1]',
      iconText: 'text-amber-400',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: Package,
      accent: 'border-l-red-500',
      glow: 'bg-red-500/[0.06]',
      iconBg: 'bg-red-500/[0.1]',
      iconText: 'text-red-400',
    },
  ]

  const hasActiveFilters = search !== '' || categoryFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Package
            size={11}
            className="text-indigo-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Catalog
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Products
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Manage your catalog, stock levels, and product visibility.
            </p>
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              href="/admin/products/new"
              className="group/btn relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 flex-shrink-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
              />
              <Plus
                size={14}
                className="relative z-10"
                aria-hidden="true"
              />
              <span className="relative z-10">Add Product</span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          Stats cards
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] p-4 sm:p-5 rounded-2xl transition-colors duration-300"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full ${stat.accent}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-16 -right-16 w-[140px] h-[140px] ${stat.glow} blur-[70px]`}
              />
              <div className="relative pl-3">
                <div
                  className={`w-8 h-8 rounded-xl ${stat.iconBg} border border-white/[0.06] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={14}
                    className={stat.iconText}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums tracking-tight">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────
          Filter bar
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-9 pr-9 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCurrentPage(1)
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Clear search"
            >
              <X size={11} aria-hidden="true" />
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by category"
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white min-w-[160px]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* ─────────────────────────────────────────────
          Table / Empty state
         ───────────────────────────────────────────── */}
      {paginated.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Package
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No products found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Add your first product to get started.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <X size={11} aria-hidden="true" />
                Clear all filters
              </button>
            ) : (
              <Link
                href="/admin/products/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-gray-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-400/40 transition-all duration-300"
              >
                <Plus size={11} aria-hidden="true" />
                Add Product
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Product
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Price
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Stock
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product, i) => {
                  const stockState =
                    product.stock === 0
                      ? 'out'
                      : product.stock < 10
                      ? 'low'
                      : 'ok'

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(i * 0.02, 0.25),
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Product */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/[0.06] flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package
                                  size={14}
                                  className="text-gray-600"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[12px] text-white font-medium truncate max-w-[220px]">
                              {product.name}
                            </span>
                            <Link
                              href={`/products/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 p-1 -m-1 rounded text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                              aria-label={`View ${product.name} on site`}
                            >
                              <ExternalLink
                                size={10}
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 sm:px-5 py-3 hidden sm:table-cell">
                        <span className="text-[11px] text-gray-400 truncate max-w-[160px] inline-block">
                          {product.category_main || '—'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 sm:px-5 py-3 text-right">
                        <span className="text-[12px] font-semibold text-white tabular-nums">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-white font-medium tabular-nums">
                            {product.stock}
                          </span>
                          {stockState === 'low' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/[0.12] border border-amber-500/25 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                              Low
                            </span>
                          )}
                          {stockState === 'out' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/[0.12] border border-red-500/25 text-[9px] font-semibold uppercase tracking-wider text-red-300">
                              Out
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            product.is_active
                              ? 'bg-emerald-500/[0.1] text-emerald-300 border-emerald-500/25'
                              : 'bg-red-500/[0.1] text-red-300 border-red-500/25'
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              product.is_active
                                ? 'bg-emerald-400'
                                : 'bg-red-400'
                            }`}
                            aria-hidden="true"
                          />
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3 text-right">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="group/edit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/[0.08] transition-all duration-200"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil
                            size={11}
                            className="transition-transform duration-300 group-hover/edit:rotate-12"
                            aria-hidden="true"
                          />
                          Edit
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/[0.06]">
              <span className="text-[11px] text-gray-500 tabular-nums">
                Page{' '}
                <span className="text-gray-300 font-medium">
                  {currentPage}
                </span>{' '}
                of{' '}
                <span className="text-gray-300 font-medium">
                  {totalPages}
                </span>{' '}
                ·{' '}
                <span className="text-gray-300 font-medium">
                  {filtered.length.toLocaleString()}
                </span>{' '}
                filtered
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  <ChevronLeft
                    size={12}
                    className="transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
                >
                  Next
                  <ChevronRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}