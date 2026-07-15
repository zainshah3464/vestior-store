'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, Package, Boxes, AlertTriangle, CheckCircle2 } from 'lucide-react'

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

  // ---- Animated background shapes (client only) ----
  const [shapes, setShapes] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([])
  useEffect(() => {
    setShapes(
      Array.from({ length: 4 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 30 + Math.random() * 50,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category_main))
    return ['all', ...Array.from(set).filter(Boolean).sort()]
  }, [products])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category_main === categoryFilter
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  // Stats
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
  const outOfStock = products.filter(p => p.stock === 0).length

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Boxes, color: 'border-l-indigo-500' },
    { label: 'Active', value: activeProducts, icon: CheckCircle2, color: 'border-l-emerald-500' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'border-l-amber-500' },
    { label: 'Out of Stock', value: outOfStock, icon: Package, color: 'border-l-red-500' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-white/5"
            style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: shape.size, height: shape.size }}
            animate={{ x: [0, 20, -15, 0], y: [0, -30, 15, 0], scale: [1, 1.08, 0.95, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: shape.duration, delay: shape.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Header & Add Button */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative bg-[#0f0f0f]/60 backdrop-blur-md p-4 rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full ${stat.color}`} />
            <div className="relative z-10 pl-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-[#1a1a1a]">
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="relative z-10">
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No products found.</div>
        ) : (
          <div className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left text-sm text-gray-400">Product</th>
                    <th className="p-4 text-left text-sm text-gray-400 hidden sm:table-cell">Category</th>
                    <th className="p-4 text-left text-sm text-gray-400">Price</th>
                    <th className="p-4 text-left text-sm text-gray-400">Stock</th>
                    <th className="p-4 text-left text-sm text-gray-400">Status</th>
                    <th className="p-4 text-left text-sm text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-t border-white/5 hover:bg-white/5 transition-colors ${
                        product.stock < 10 ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={product.images[0] || 'https://placehold.co/40x40'}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          alt=""
                        />
                        <span className="text-white text-sm font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">
                        {product.category_main || '—'}
                      </td>
                      <td className="p-4 text-sm text-white font-medium">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-white">
                        {product.stock}
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="ml-2 text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">Low</span>
                        )}
                        {product.stock === 0 && (
                          <span className="ml-2 text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">Out</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full ${
                            product.is_active
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}