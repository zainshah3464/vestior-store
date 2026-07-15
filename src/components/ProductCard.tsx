'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  is_new_arrival: boolean
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!', { icon: '🛒' })
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <motion.div 
      className="group bg-[#111111] rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-900">
        <Image
          src={product.images?.[0] || 'https://placehold.co/400x400/1a1a1a/3B82F6?text=No+Image'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover group-hover:scale-110 transition duration-500"
          loading="eager"   // 👈 Eager load (above the fold images ko fast load karega)
        />
        
        {/* Quick View Overlay */}
        <motion.div 
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Eye size={12} />
            Quick View
          </button>
        </motion.div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {discount > 0 && (
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg">
              {discount}% OFF
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg">
              NEW
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
              Only {product.stock} left
            </span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <motion.button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-black/50 backdrop-blur-sm transition ${
            isWishlisted ? 'text-red-500' : 'text-white hover:text-red-500'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </motion.button>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-white text-sm hover:text-blue-400 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-semibold text-white">₹{product.price.toLocaleString()}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-gray-500 line-through">₹{product.compare_at_price.toLocaleString()}</span>
          )}
        </div>
        
        <motion.button
          onClick={addToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  )
}