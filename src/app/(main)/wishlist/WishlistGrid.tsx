'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWishlist } from '@/components/WishlistProvider'
import type { WishlistProduct } from '@/lib/wishlist/queries'

export default function WishlistGrid({
  products,
}: {
  products: WishlistProduct[]
}) {
  const router = useRouter()
  const { toggle } = useWishlist()
  const [removing, setRemoving] = useState<string | null>(null)

  const handleRemove = async (id: string) => {
    setRemoving(id)
    try {
      await toggle(id)
      toast.success('Removed from wishlist')
      router.refresh()
    } catch {
      toast.error('Failed to remove')
    } finally {
      setRemoving(null)
    }
  }

  const handleAddToCart = (product: WishlistProduct) => {
    if (product.stock === 0) {
      toast.error('Out of stock')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((item: { id: string }) => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        compare_at_price: product.compare_at_price,
        images: product.images,
        stock: product.stock,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Added to cart!')
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="group bg-[#111111] rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500/40 transition-all"
          >
            <Link
              href={`/products/${product.id}`}
              className="relative block aspect-square overflow-hidden bg-gray-900"
            >
              <Image
                src={
                  product.images?.[0] ||
                  'https://placehold.co/400x400/1a1a1a/3B82F6?text=No+Image'
                }
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover group-hover:scale-110 transition duration-500"
              />

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}

              {product.is_new_arrival && (
                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  NEW
                </span>
              )}
            </Link>

            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-white text-sm hover:text-indigo-400 transition line-clamp-1">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-semibold text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.compare_at_price.toLocaleString()}
                    </span>
                  )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <ShoppingCart size={12} />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  disabled={removing === product.id}
                  className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50"
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}