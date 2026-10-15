'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  Sparkles,
  Clock,
  ChevronRight,
  Heart,
  Gift,
  Package,
  RotateCcw,
} from 'lucide-react'
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

/**
 * Merge duplicate cart items (same product id) into a single line.
 * Also clamps quantity to stock if stock dropped since item was added.
 */
function mergeCartItems(rawItems: CartItem[]): CartItem[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return []

  const map = new Map<string, CartItem>()

  for (const item of rawItems) {
    if (!item || typeof item.id !== 'string') continue

    const existing = map.get(item.id)
    if (existing) {
      const mergedQty = existing.quantity + (item.quantity || 0)
      existing.quantity = Math.min(
        mergedQty,
        typeof item.stock === 'number' && item.stock > 0 ? item.stock : mergedQty
      )
    } else {
      const safeStock =
        typeof item.stock === 'number' && item.stock > 0 ? item.stock : Infinity
      map.set(item.id, {
        ...item,
        quantity: Math.min(item.quantity || 1, safeStock),
      })
    }
  }

  return Array.from(map.values())
}

// ─────────────────────────────────────────────
// Rotating empty-state messages — cute, brand-marketing vibe
// ─────────────────────────────────────────────
const EMPTY_STATE_MESSAGES = [
  { emoji: '👋', text: 'Your cart is feeling a little lonely.' },
  { emoji: '✨', text: 'Every great outfit starts with one click.' },
  { emoji: '🤔', text: "Isn't it time you treated yourself?" },
  { emoji: '🎁', text: 'Somewhere in our catalog is your next favorite.' },
  { emoji: '🧵', text: 'Hand-tailored pieces are waiting to meet you.' },
] as const

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)

  const loadCart = useCallback(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const merged = mergeCartItems(savedCart)
    setCart(merged)
    // Sync merged version back to storage so future reads are clean
    localStorage.setItem('cart', JSON.stringify(merged))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [loadCart])

  // Rotate the empty-state messages every 3.5s
  useEffect(() => {
    if (cart.length > 0) return
    const id = setInterval(
      () => setMsgIndex((i) => (i + 1) % EMPTY_STATE_MESSAGES.length),
      3500
    )
    return () => clearInterval(id)
  }, [cart.length])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const item = cart.find((i) => i.id === id)
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available`)
      return
    }
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Cart updated')
  }

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    toast.success('Item removed')
  }

  const clearCart = () => {
    if (confirm('Clear your shopping cart?')) {
      setCart([])
      localStorage.setItem('cart', '[]')
      window.dispatchEvent(new Event('cartUpdated'))
      toast.success('Cart cleared')
    }
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 5000 ? 0 : 100
  const total = subtotal + shipping

  const savings = cart.reduce((sum, item) => {
    if (item.compare_at_price && item.compare_at_price > item.price) {
      return sum + (item.compare_at_price - item.price) * item.quantity
    }
    return sum
  }, 0)

  const freeShippingProgress = Math.min((subtotal / 5000) * 100, 100)
  const remainingForFreeShipping = Math.max(5000 - subtotal, 0)

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your style…</p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // EMPTY STATE — cute, animated, marketing-driven
  // ─────────────────────────────────────────────
  if (cart.length === 0) {
    const current = EMPTY_STATE_MESSAGES[msgIndex]

    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.06] blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-violet-500/[0.05] blur-[120px]" />
        </div>

        {/* Floating mini icons — playful confetti-like */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {[
            { Icon: Sparkles, x: '15%', y: '20%', delay: 0, dur: 7 },
            { Icon: Heart, x: '82%', y: '28%', delay: 0.6, dur: 8 },
            { Icon: Gift, x: '22%', y: '75%', delay: 1.2, dur: 9 },
            { Icon: Package, x: '78%', y: '72%', delay: 0.3, dur: 8.5 },
          ].map(({ Icon, x, y, delay, dur }, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 0.35, 0.35, 0],
                y: [20, 0, -10, -30],
                rotate: [0, 8, -6, 0],
              }}
              transition={{
                duration: dur,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute text-blue-400/40"
              style={{ left: x, top: y }}
            >
              <Icon size={18} />
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-lg mx-auto px-6 text-center z-10"
        >
          {/* Animated shopping bag with personality */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Pulsing halo */}
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 blur-2xl"
            />

            {/* Bag — gentle "breathing" motion */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60"
            >
              <ShoppingBag
                size={38}
                className="text-blue-400/70"
                aria-hidden="true"
                strokeWidth={1.5}
              />

              {/* Little "zzz" or sparkle accent */}
              <motion.span
                aria-hidden="true"
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -14, -22],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute -top-1 right-2 text-amber-400"
              >
                <Sparkles size={14} />
              </motion.span>
            </motion.div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-3">
            Your cart is empty
          </h2>

          {/* Rotating cute marketing messages */}
          <div className="h-8 mb-8 relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 text-[13px] sm:text-[14px] text-gray-400 flex items-center justify-center gap-2"
              >
                <span aria-hidden="true">{current.emoji}</span>
                <span>{current.text}</span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Primary CTA */}
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-[13px] sm:text-[14px] font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300"
          >
            {/* Shine sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
            />
            <span className="relative z-10">Start Shopping</span>
            <ChevronRight
              size={16}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
              aria-hidden="true"
            />
          </Link>

          {/* Secondary link */}
          <div className="mt-4">
            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-blue-400 transition-colors group"
            >
              <Sparkles size={12} aria-hidden="true" />
              <span>Or explore new arrivals</span>
            </Link>
          </div>

          {/* Marketing benefits strip */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-3">
            {[
              { Icon: Truck, label: 'Free Shipping', sub: 'Orders ₹5,000+' },
              { Icon: RotateCcw, label: '14-Day Returns', sub: 'No questions asked' },
              { Icon: Shield, label: 'Secure Payment', sub: 'Fully encrypted' },
            ].map(({ Icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center"
              >
                <Icon
                  size={16}
                  className="text-blue-400 mb-1.5"
                  aria-hidden="true"
                />
                <p className="text-[10px] font-medium text-white leading-tight">
                  {label}
                </p>
                <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                  {sub}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // CART — normal state
  // ─────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 overflow-hidden">
      {/* Ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/4 w-[500px] h-[400px] bg-blue-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Page header
           ───────────────────────────────────────────── */}
        <header className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
            <ShoppingBag
              size={11}
              className="text-blue-400"
              aria-hidden="true"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
              Your Bag
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.02em] leading-tight">
              Shopping Cart
              <span className="ml-2 text-base sm:text-lg font-medium text-gray-500 tabular-nums">
                ({cart.length})
              </span>
            </h1>

            <button
              onClick={clearCart}
              className="group text-[11px] font-medium text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5 py-1"
              aria-label="Clear entire cart"
            >
              <Trash2
                size={11}
                className="transition-transform duration-300 group-hover:rotate-12"
                aria-hidden="true"
              />
              Clear Cart
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────
            Mobile compact summary (before items)
           ───────────────────────────────────────────── */}
        <div className="lg:hidden mb-5">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] rounded-2xl border border-white/[0.08] p-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 right-0 w-[200px] h-[200px] bg-blue-500/[0.06] blur-[80px]"
            />
            <div className="relative flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 font-medium">
                  Total
                </p>
                <p className="text-2xl font-bold text-white tracking-tight tabular-nums">
                  ₹{total.toLocaleString()}
                </p>
              </div>
              {savings > 0 && (
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/[0.12] border border-emerald-500/25 px-2 py-1 rounded-full">
                  Save ₹{savings.toLocaleString()}
                </span>
              )}
            </div>

            <Link
              href="/checkout"
              className="relative w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              <CreditCard size={15} aria-hidden="true" />
              Checkout
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ═════════════════════════════════════════════
              Cart items
             ═════════════════════════════════════════════ */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {cart.map((item, index) => {
                  const hasDiscount =
                    item.compare_at_price &&
                    item.compare_at_price > item.price
                  const itemSavings = hasDiscount
                    ? (item.compare_at_price! - item.price) * item.quantity
                    : 0

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0, marginTop: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.04, 0.2),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative bg-gradient-to-b from-[#131313] to-[#0e0e0e] rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300 overflow-hidden"
                    >
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                        {/* Product image */}
                        <Link
                          href={`/products/${item.id}`}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-black border border-white/[0.06]"
                          aria-label={item.name}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              item.images?.[0] ||
                              'https://placehold.co/100x100/1a1a1a/3B82F6?text=+'
                            }
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {hasDiscount && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/95 text-white text-[9px] font-bold tracking-wide backdrop-blur-sm">
                              SAVE
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              href={`/products/${item.id}`}
                              className="text-[13px] sm:text-[14px] font-medium text-white hover:text-blue-400 transition line-clamp-2 flex-1 leading-snug"
                            >
                              {item.name}
                            </Link>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex-shrink-0 p-1 -mt-1 -mr-1 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-all duration-200"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 size={13} aria-hidden="true" />
                            </button>
                          </div>

                          {/* Price row */}
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight tabular-nums">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] text-gray-500 line-through tabular-nums">
                                ₹{item.compare_at_price!.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Bottom row: qty + line total */}
                          <div className="flex items-end justify-between gap-2 mt-auto pt-3">
                            <div className="inline-flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus size={12} aria-hidden="true" />
                              </button>
                              <span className="w-8 text-center text-white text-[13px] font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.stock}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus size={12} aria-hidden="true" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-[14px] sm:text-[15px] font-bold text-white tabular-nums leading-tight">
                                ₹
                                {(item.price * item.quantity).toLocaleString()}
                              </div>
                              {item.stock <= 10 && item.stock > 0 && (
                                <div className="text-[9px] text-amber-400 mt-0.5">
                                  Only {item.stock} left
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Item savings note */}
                          {itemSavings > 0 && (
                            <div className="mt-2 text-[10px] text-emerald-400/90 flex items-center gap-1">
                              <Gift size={9} aria-hidden="true" />
                              You save ₹{itemSavings.toLocaleString()} on this
                              item
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Continue shopping */}
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 mt-5 text-[12px] font-medium text-gray-500 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft
                size={13}
                className="transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden="true"
              />
              Continue Shopping
            </Link>
          </div>

          {/* ═════════════════════════════════════════════
              Order summary (desktop)
             ═════════════════════════════════════════════ */}
          <aside
            className="hidden lg:block lg:col-span-5 order-1 lg:order-2"
            id="order-summary"
          >
            <div className="sticky top-24">
              <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] rounded-2xl border border-white/[0.08] p-6 shadow-2xl shadow-black/30">
                {/* Ambient glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-blue-500/[0.06] blur-[100px]"
                />

                {/* Header */}
                <div className="relative flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/[0.1] border border-blue-500/20 flex items-center justify-center">
                    <Sparkles
                      size={13}
                      className="text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">
                    Order Summary
                  </h2>
                </div>

                {/* Savings callout */}
                {savings > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex items-center gap-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 px-3 py-2 mb-4"
                  >
                    <Gift
                      size={13}
                      className="text-emerald-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-[11px] text-emerald-300 font-medium">
                      You&apos;re saving ₹{savings.toLocaleString()} today
                    </p>
                  </motion.div>
                )}

                {/* Lines */}
                <div className="relative space-y-3 text-[13px]">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium tabular-nums">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span
                      className={`font-medium tabular-nums ${
                        shipping === 0
                          ? 'text-emerald-400'
                          : 'text-white'
                      }`}
                    >
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {remainingForFreeShipping > 0 && (
                    <div className="rounded-xl bg-blue-500/[0.08] border border-blue-500/20 p-3">
                      <div className="flex items-center gap-2 text-blue-300 text-[11px] font-medium mb-2">
                        <Truck size={12} aria-hidden="true" />
                        <span>
                          Add ₹
                          {remainingForFreeShipping.toLocaleString()} for free
                          shipping
                        </span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${freeShippingProgress}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 mt-1.5 tabular-nums">
                        ₹{subtotal.toLocaleString()} of ₹5,000
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="relative border-t border-white/[0.08] pt-4 mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-white tracking-tight tabular-nums">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="group relative w-full mt-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
                  />
                  <CreditCard
                    size={15}
                    className="relative z-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">Proceed to Checkout</span>
                </Link>

                {/* Trust strip */}
                <div className="relative grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-white/[0.06]">
                  {[
                    { Icon: Shield, label: 'Secure Payment' },
                    { Icon: Truck, label: 'Fast Delivery' },
                    { Icon: Clock, label: '14-Day Returns' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="text-center">
                      <Icon
                        size={14}
                        className="text-blue-400 mx-auto mb-1"
                        aria-hidden="true"
                      />
                      <p className="text-[10px] text-gray-500 leading-tight">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ═════════════════════════════════════════════
              Mobile order summary (after items)
             ═════════════════════════════════════════════ */}
          <div
            className="lg:hidden order-3 bg-gradient-to-b from-[#131313] to-[#0e0e0e] rounded-2xl border border-white/[0.08] p-5"
            id="order-summary-mobile"
          >
            <h2 className="text-[14px] font-semibold text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-[13px]">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium tabular-nums">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span
                  className={`font-medium tabular-nums ${
                    shipping === 0 ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>

              {remainingForFreeShipping > 0 && (
                <div className="rounded-xl bg-blue-500/[0.08] border border-blue-500/20 p-3 mt-1">
                  <div className="flex items-center gap-2 text-blue-300 text-[11px] font-medium mb-2">
                    <Truck size={11} aria-hidden="true" />
                    <span>
                      Add ₹{remainingForFreeShipping.toLocaleString()} for free
                      shipping
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.08] pt-4 mt-4 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-white">
                Total
              </span>
              <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                ₹{total.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold shadow-lg shadow-blue-500/25"
            >
              <CreditCard size={15} aria-hidden="true" />
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}