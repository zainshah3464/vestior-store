'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Shield, Truck, AlertCircle, Gift, Sparkles, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface CartItem {
  id: string
  name: string
  price: number
  compare_at_price?: number | null
  images: string[]
  quantity: number
  stock: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')

  useEffect(() => {
    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [])

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    setLoading(false)
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const item = cart.find(i => i.id === id)
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available`)
      return
    }
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success('Cart updated')
  }

  const removeItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success('Item removed')
  }

  const clearCart = () => {
    if (confirm('Clear your shopping cart?')) {
      setCart([])
      localStorage.setItem('cart', '[]')
      toast.success('Cart cleared')
    }
  }

  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      setAppliedCoupon('WELCOME10')
      toast.success('🎉 10% discount applied!')
    } else if (couponCode === 'FREESHIP') {
      setDiscount(0)
      setAppliedCoupon('FREESHIP')
      toast.success('🚚 Free shipping applied!')
    } else if (couponCode === 'BRAND20') {
      const discountAmount = subtotal * 0.2
      setDiscount(discountAmount)
      setAppliedCoupon('BRAND20')
      toast.success('✨ 20% discount applied!')
    } else {
      toast.error('Invalid coupon code')
    }
    setCouponCode('')
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 5000 ? 0 : 100
  const total = subtotal + shipping - discount
  const savings = cart.reduce((sum, item) => {
    if (item.compare_at_price && item.compare_at_price > item.price) {
      return sum + ((item.compare_at_price - item.price) * item.quantity)
    }
    return sum
  }, 0)

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading your style...</p>
      </div>
    </div>
  )

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-700">
              <ShoppingBag size={36} className="text-gray-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't found your perfect piece yet</p>
          <Link 
            href="/products" 
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 text-sm"
          >
            Start Shopping
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-3">
                <ShoppingBag size={12} className="text-blue-400" />
                <span className="text-xs text-blue-400">Shopping Cart</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Your Cart <span className="text-gray-500 text-lg md:text-xl">({cart.length})</span>
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile: Order Summary First */}
        <div className="lg:hidden mb-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Total Amount</span>
              <span className="text-xl font-bold text-white">₹{total.toLocaleString()}</span>
            </div>
            <Link 
              href="/checkout" 
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium"
            >
              <CreditCard size={16} />
              Proceed to Checkout
            </Link>
            <button
              onClick={() => {
                const summary = document.getElementById('order-summary')
                summary?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full mt-2 text-center text-xs text-gray-500"
            >
              View Details ↓
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart Items - Mobile First Design */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      {/* Product Image - Smaller on mobile */}
                      <Link href={`/products/${item.id}`} className="w-20 h-20 flex-shrink-0">
                        <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800">
                          <img 
                            src={item.images?.[0] || 'https://placehold.co/100x100/1a1a1a/3B82F6?text=No+Image'} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          {item.compare_at_price && item.compare_at_price > item.price && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              Save ₹{(item.compare_at_price - item.price)}
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <Link href={`/products/${item.id}`} className="text-sm font-semibold text-white hover:text-blue-400 transition line-clamp-2 flex-1">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-white">₹{item.price.toLocaleString()}</span>
                          {item.compare_at_price && item.compare_at_price > item.price && (
                            <span className="text-xs text-gray-500 line-through">₹{item.compare_at_price.toLocaleString()}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-gray-800 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-700 rounded-l-lg transition-colors"
                            >
                              <Minus size={12} className="text-gray-400" />
                            </button>
                            <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-700 rounded-r-lg transition-colors"
                            >
                              <Plus size={12} className="text-gray-400" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white">₹{(item.price * item.quantity).toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500">{item.stock} left</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Continue Shopping */}
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors mt-4 group text-sm"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
          
          {/* Order Summary - Desktop and Mobile Details */}
          <div className="lg:col-span-5 order-1 lg:order-2" id="order-summary">
            <div className="sticky top-24">
              {/* Desktop Order Summary */}
              <div className="hidden lg:block bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-xl border border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-blue-400" />
                  <h2 className="text-base font-semibold text-white">Order Summary</h2>
                </div>
                
                {/* Savings Banner */}
                {savings > 0 && (
                  <div className="bg-green-500/10 rounded-lg p-2 mb-4 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <Gift size={12} />
                      <span>You're saving ₹{savings.toLocaleString()}!</span>
                    </div>
                  </div>
                )}
                
                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] text-gray-500 cursor-pointer hover:text-blue-400" onClick={() => setCouponCode('WELCOME10')}>WELCOME10</span>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span className="text-[10px] text-gray-500 cursor-pointer hover:text-blue-400" onClick={() => setCouponCode('BRAND20')}>BRAND20</span>
                  </div>
                </div>
                
                {/* Price Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  
                  {subtotal < 5000 && subtotal > 0 && (
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-blue-400 text-[11px]">
                        <Truck size={12} />
                        <span>Add ₹{(5000 - subtotal).toLocaleString()} for free shipping</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full transition-all"
                          style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <div className="flex justify-between text-white font-bold">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <Link 
                  href="/checkout" 
                  className="w-full mt-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium"
                >
                  <CreditCard size={16} />
                  Proceed to Checkout
                </Link>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
                  <div className="text-center">
                    <Shield size={14} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <Truck size={14} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <Clock size={14} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">14 Day Returns</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Detailed Summary - Hidden by default, shown when clicked */}
              <div className="lg:hidden bg-gray-900/50 rounded-xl border border-gray-800 p-4 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-green-400">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coupon</span>
                      <span className="text-green-400">{appliedCoupon}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-800 pt-3 flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-white text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Coupon for mobile */}
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}