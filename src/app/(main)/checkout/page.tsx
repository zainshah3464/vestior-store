'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { placeOrder } from '@/actions/placeOrder'
import { confirmPayment } from '@/actions/confirmPayment'
import { validateCoupon } from '@/actions/coupons'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Truck,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  Loader2,
  Sparkles,
  ArrowRight,
  Check,
  Banknote,
  Tag,
  X,
  ShoppingBag,
  Lock,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { track } from '@/lib/tracking/client'

/* ---------------------------------- */
/*  Types                             */
/* ---------------------------------- */
type PaymentMethod = 'cod' | 'stripe'

interface CartItem {
  id: string
  name: string
  price: number
  compare_at_price?: number | null
  images: string[]
  quantity: number
  stock: number
  size?: string | null
}

const formFields = [
  { label: 'Full Name', name: 'full_name', type: 'text', col: 'full', placeholder: 'John Doe' },
  { label: 'Phone', name: 'phone', type: 'text', col: 'full', placeholder: '+92 300 1234567' },
  { label: 'Address Line 1', name: 'address_line1', type: 'text', col: 'full', placeholder: 'House / Street' },
  { label: 'Address Line 2 (Optional)', name: 'address_line2', type: 'text', col: 'full', placeholder: 'Apartment, suite, etc.' },
  { label: 'City', name: 'city', type: 'text', col: 'half', placeholder: 'Karachi' },
  { label: 'State', name: 'state', type: 'text', col: 'half', placeholder: 'Sindh' },
  { label: 'Pincode', name: 'pincode', type: 'text', col: 'half', placeholder: '75500' },
]

const STEPS = [
  { label: 'Shipping', icon: MapPin },
  { label: 'Review & Pay', icon: ShieldCheck },
] as const

// ─────────────────────────────────────────────
// Stripe Elements lazy loader (singleton)
// ─────────────────────────────────────────────
let stripePromise: Promise<StripeJs | null> | null = null
function getStripePromise() {
  if (stripePromise) return stripePromise
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return null
  stripePromise = loadStripe(key)
  return stripePromise
}

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [address, setAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  })

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountAmount: number
    description: string | null
  } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  useEffect(() => {
    const cartData: CartItem[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    )
    setCart(cartData)

    if (cartData.length > 0) {
      track('checkout_started', {
        itemCount: cartData.length,
        subtotal: cartData.reduce(
          (s: number, i: CartItem) => s + i.price * i.quantity,
          0
        ),
      })
    }

    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (profile) {
          setAddress({
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            address_line1: profile.address_line1 || '',
            address_line2: profile.address_line2 || '',
            city: profile.city || '',
            state: profile.state || '',
            pincode: profile.pincode || '',
          })
        }
      }
    }
    getUser()
  }, [supabase])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 5000 ? 0 : 100
  const discount = appliedCoupon?.discountAmount ?? 0
  const total = subtotal + shipping - discount
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    setActiveStep(1)
    // Scroll to top on mobile for clean step transition
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ─────────────────────────────────────────────
  // Coupon handlers
  // ─────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Enter a coupon code')
      return
    }

    setCouponLoading(true)
    setCouponError(null)

    try {
      const result = await validateCoupon(couponInput.trim(), subtotal)

      if (!result.valid) {
        setCouponError(result.error || 'Invalid coupon')
        setAppliedCoupon(null)
        return
      }

      setAppliedCoupon({
        code: result.code || couponInput.toUpperCase(),
        discountAmount: result.discountAmount || 0,
        description: result.description ?? null,
      })
      setCouponInput('')
      toast.success(
        `Coupon applied! You save ₹${(result.discountAmount || 0).toLocaleString()}`
      )
    } catch (err) {
      setCouponError(
        err instanceof Error ? err.message : 'Failed to validate'
      )
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
    setCouponInput('')
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || cart.length === 0) return

    setLoading(true)
    try {
      const result = await placeOrder(
        cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        {
          full_name: address.full_name,
          phone: address.phone,
          line1: address.address_line1,
          line2: address.address_line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod,
        appliedCoupon?.code ?? null
      )

      if (!result.success) return
      setOrderId(result.orderId)

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully!')
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cartUpdated'))
        router.push('/orders')
        return
      }

      if (result.clientSecret) {
        setClientSecret(result.clientSecret)
      } else {
        toast.error('Payment initialization failed')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to place order'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    toast.success('Payment successful!')
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/orders')
  }

  const stripePromiseLocal = getStripePromise()

  // ─────────────────────────────────────────────
  // Empty cart
  // ─────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-500/[0.05] blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md w-full mx-auto px-6 text-center"
        >
          <div className="relative inline-flex items-center justify-center mb-6">
            <div
              aria-hidden="true"
              className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-3xl"
            />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-black/60">
              <ShoppingBag
                size={32}
                className="text-blue-400/70"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-[-0.02em]">
            Your cart is empty
          </h2>
          <p className="text-[13px] text-gray-500 mb-6">
            Add some items before proceeding to checkout
          </p>

          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-[13px] font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-300"
          >
            <ChevronLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Cart
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-24 left-1/4 w-[500px] h-[400px] bg-indigo-500/[0.05] blur-[130px]" />
        <div className="absolute top-1/2 right-0 w-[380px] h-[380px] bg-violet-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Back link
           ───────────────────────────────────────────── */}
        <Link
          href="/cart"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white mb-6 md:mb-8 transition-colors"
        >
          <ChevronLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Cart
        </Link>

        {/* ─────────────────────────────────────────────
            Stepper — refined
           ───────────────────────────────────────────── */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = activeStep === idx
              const isComplete = activeStep > idx

              return (
                <div
                  key={step.label}
                  className="flex-1 flex items-center"
                >
                  <button
                    type="button"
                    onClick={() => !clientSecret && setActiveStep(idx)}
                    disabled={!!clientSecret}
                    className={`group flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${
                      clientSecret
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-500/[0.12] text-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                          : isComplete
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-white/[0.08] bg-white/[0.02] text-gray-500'
                      }`}
                    >
                      {isComplete ? (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 22,
                          }}
                        >
                          <Check
                            size={16}
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </motion.span>
                      ) : (
                        <Icon size={16} aria-hidden="true" />
                      )}

                      {/* Active pulse */}
                      {isActive && !isComplete && (
                        <motion.span
                          aria-hidden="true"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.4, 0, 0.4],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-0 rounded-full bg-indigo-500/30"
                        />
                      )}
                    </span>

                    <span
                      className={`text-[11px] sm:text-[12px] font-semibold tracking-wide transition-colors ${
                        isActive || isComplete
                          ? 'text-white'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div className="relative flex-shrink-0 w-12 sm:w-20 h-[2px] bg-white/[0.06] rounded-full overflow-hidden -mt-5 mx-2">
                      <motion.div
                        initial={false}
                        animate={{
                          width: activeStep > idx ? '100%' : '0%',
                        }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ═════════════════════════════════════════════
              LEFT — Steps content
             ═════════════════════════════════════════════ */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeStep === 0 ? (
                <motion.form
                  key="address"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={handleContinueToReview}
                  className="space-y-6"
                >
                  <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/30">
                    {/* Ambient glow */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-indigo-500/[0.06] blur-[100px]"
                    />

                    {/* Header */}
                    <div className="relative flex items-start gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                        <MapPin
                          size={17}
                          className="text-indigo-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-[16px] sm:text-[17px] font-semibold text-white leading-tight">
                          Shipping Address
                        </h2>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Where should we deliver your order?
                        </p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      {formFields.map((field, i) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.05 + i * 0.04,
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={
                            field.col === 'full' ? 'md:col-span-2' : ''
                          }
                        >
                          <label
                            htmlFor={`checkout-${field.name}`}
                            className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
                          >
                            {field.label}
                          </label>
                          <input
                            id={`checkout-${field.name}`}
                            type={field.type}
                            name={field.name}
                            value={
                              address[field.name as keyof typeof address]
                            }
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="w-full px-3.5 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                            required={field.name !== 'address_line2'}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.99 }}
                      className="group relative mt-8 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 flex items-center justify-center gap-2"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
                      />
                      <span className="relative z-10">Continue to Review</span>
                      <ArrowRight
                        size={16}
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/30">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-24 -left-24 w-[280px] h-[280px] bg-emerald-500/[0.05] blur-[100px]"
                    />

                    {/* Header */}
                    <div className="relative flex items-start gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck
                          size={17}
                          className="text-emerald-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-[16px] sm:text-[17px] font-semibold text-white leading-tight">
                          Review & Pay
                        </h2>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Choose your payment method and confirm
                        </p>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div className="relative mb-6">
                      <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <PaymentOption
                          active={paymentMethod === 'cod'}
                          onClick={() =>
                            !clientSecret && setPaymentMethod('cod')
                          }
                          icon={<Banknote size={18} />}
                          title="Cash on Delivery"
                          subtitle="Pay when you receive"
                          disabled={!!clientSecret}
                        />
                        <PaymentOption
                          active={paymentMethod === 'stripe'}
                          onClick={() =>
                            !clientSecret && setPaymentMethod('stripe')
                          }
                          icon={<CreditCard size={18} />}
                          title="Card Payment"
                          subtitle="Visa, Mastercard, Amex"
                          disabled={!!clientSecret}
                        />
                      </div>
                    </div>

                    {/* Coupon — mobile only */}
                    <div className="relative mb-6 lg:hidden">
                      <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2">
                        Promo Code
                      </label>
                      <CouponField
                        couponInput={couponInput}
                        setCouponInput={setCouponInput}
                        appliedCoupon={appliedCoupon}
                        couponLoading={couponLoading}
                        couponError={couponError}
                        setCouponError={setCouponError}
                        onApply={handleApplyCoupon}
                        onRemove={handleRemoveCoupon}
                        disabled={!!clientSecret}
                      />
                    </div>

                    {/* Summary lines */}
                    <div className="relative rounded-xl bg-black/30 border border-white/[0.06] p-4 space-y-2.5 text-[13px] mb-6">
                      <div className="flex justify-between text-gray-400">
                        <span>
                          Items{' '}
                          <span className="text-gray-600">
                            ({itemCount})
                          </span>
                        </span>
                        <span className="text-white tabular-nums">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <Tag size={11} aria-hidden="true" />
                            Discount{' '}
                            <span className="text-emerald-300">
                              ({appliedCoupon?.code})
                            </span>
                          </span>
                          <span className="tabular-nums font-medium">
                            -₹{discount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-400">
                        <span>Shipping</span>
                        <span
                          className={`tabular-nums ${
                            shipping === 0
                              ? 'text-emerald-400'
                              : 'text-white'
                          }`}
                        >
                          {shipping === 0 ? 'Free' : `₹${shipping}`}
                        </span>
                      </div>

                      <div className="border-t border-white/[0.08] pt-3 mt-2 flex justify-between items-baseline">
                        <span className="text-[13px] font-semibold text-white">
                          Total
                        </span>
                        <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Place order button */}
                    {!clientSecret && (
                      <motion.button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        whileTap={loading ? {} : { scale: 0.99 }}
                        className="group relative w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {!loading && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
                          />
                        )}
                        <span className="relative z-10 inline-flex items-center gap-2">
                          {loading ? (
                            <Loader2
                              className="w-4 h-4 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Lock size={15} aria-hidden="true" />
                          )}
                          {loading
                            ? 'Processing…'
                            : paymentMethod === 'cod'
                            ? 'Place Order — Cash on Delivery'
                            : 'Continue to Card Payment'}
                        </span>
                      </motion.button>
                    )}

                    {/* Stripe form */}
                    {clientSecret && stripePromiseLocal && orderId && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative mt-6"
                      >
                        <Elements
                          stripe={stripePromiseLocal}
                          options={{
                            clientSecret,
                            appearance: {
                              theme: 'night',
                              variables: {
                                colorPrimary: '#6366f1',
                                colorBackground: '#0f0f0f',
                                colorText: '#ffffff',
                                borderRadius: '12px',
                                fontFamily:
                                  'var(--font-geist-sans), system-ui, sans-serif',
                              },
                            },
                          }}
                        >
                          <StripePaymentForm
                            orderId={orderId}
                            onSuccess={handlePaymentSuccess}
                          />
                        </Elements>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═════════════════════════════════════════════
              RIGHT — Order summary (desktop)
             ═════════════════════════════════════════════ */}
          <aside className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24">
              <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/30">
                {/* Ambient glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-amber-500/[0.05] blur-[100px]"
                />

                {/* Header */}
                <div className="relative flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center">
                    <Sparkles
                      size={13}
                      className="text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">
                    Order Summary
                  </h2>
                </div>

                {/* Items */}
                <div className="relative space-y-3 max-h-[280px] overflow-y-auto pr-1 -mr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-1"
                    >
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black border border-white/[0.06] flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.images?.[0] ||
                            'https://placehold.co/44x44/1a1a1a/3B82F6?text=+'
                          }
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-black">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-gray-300 truncate leading-tight">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <span className="text-[12px] text-gray-300 tabular-nums font-medium flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-white/[0.06] my-4" />

                {/* Coupon — desktop */}
                <div className="relative mb-4">
                  <CouponField
                    couponInput={couponInput}
                    setCouponInput={setCouponInput}
                    appliedCoupon={appliedCoupon}
                    couponLoading={couponLoading}
                    couponError={couponError}
                    setCouponError={setCouponError}
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                    disabled={!!clientSecret}
                  />
                </div>

                {/* Totals */}
                <div className="relative space-y-2.5 text-[12px]">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white tabular-nums">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Tag size={10} aria-hidden="true" />
                        Discount
                      </span>
                      <span className="tabular-nums font-medium">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span
                      className={`tabular-nums ${
                        shipping === 0 ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="relative border-t border-white/[0.08] pt-4 mt-4 flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                {/* Trust strip */}
                <div className="relative grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                  {[
                    { Icon: Truck, label: 'Free Delivery' },
                    { Icon: Lock, label: 'Secure Payment' },
                    { Icon: ShieldCheck, label: '14-Day Returns' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="text-center">
                      <Icon
                        size={14}
                        className="text-indigo-400 mx-auto mb-1"
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
              Mobile — compact summary (below content)
             ═════════════════════════════════════════════ */}
          <div className="lg:hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles
                size={12}
                className="text-amber-400"
                aria-hidden="true"
              />
              Order Summary
            </h2>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-white tabular-nums">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    -₹{discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span
                  className={`tabular-nums ${
                    shipping === 0 ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3 mt-3 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-white">
                Total
              </span>
              <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────── */
/* Coupon field                                  */
/* ───────────────────────────────────────────── */
function CouponField({
  couponInput,
  setCouponInput,
  appliedCoupon,
  couponLoading,
  couponError,
  setCouponError,
  onApply,
  onRemove,
  disabled,
}: {
  couponInput: string
  setCouponInput: (v: string) => void
  appliedCoupon: {
    code: string
    discountAmount: number
    description: string | null
  } | null
  couponLoading: boolean
  couponError: string | null
  setCouponError: (v: string | null) => void
  onApply: () => void
  onRemove: () => void
  disabled?: boolean
}) {
  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between bg-emerald-500/[0.08] border border-emerald-500/25 rounded-xl px-3 py-2.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Tag size={12} className="text-emerald-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-emerald-300 font-mono tracking-wide truncate">
              {appliedCoupon.code}
            </p>
            {appliedCoupon.description && (
              <p className="text-[10px] text-emerald-400/70 truncate">
                {appliedCoupon.description}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="flex-shrink-0 p-1 -mr-1 text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-all duration-200 disabled:opacity-50"
          aria-label="Remove coupon"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase())
              setCouponError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onApply()
              }
            }}
            disabled={disabled}
            placeholder="Enter code"
            className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/[0.08] rounded-xl text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] disabled:opacity-50 font-mono tracking-wide transition-all duration-200"
          />
        </div>
        <button
          type="button"
          onClick={onApply}
          disabled={couponLoading || !couponInput.trim() || disabled}
          className="px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl text-[12px] font-semibold hover:bg-white/[0.08] hover:border-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
        >
          {couponLoading ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : (
            'Apply'
          )}
        </button>
      </div>
      {couponError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={10} aria-hidden="true" />
          {couponError}
        </motion.p>
      )}
    </div>
  )
}

/* ───────────────────────────────────────────── */
/* Payment option card                           */
/* ───────────────────────────────────────────── */
function PaymentOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
  disabled,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  disabled?: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`group relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
        active
          ? 'border-indigo-500/50 bg-indigo-500/[0.08] shadow-[0_0_0_3px_rgba(99,102,241,0.08)]'
          : 'border-white/[0.08] bg-black/30 hover:border-white/20 hover:bg-white/[0.02]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Icon tile */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
          active
            ? 'bg-indigo-500/[0.15] border border-indigo-500/30 text-indigo-400'
            : 'bg-white/[0.04] border border-white/[0.06] text-gray-400'
        }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-semibold leading-tight transition-colors duration-200 ${
            active ? 'text-white' : 'text-gray-200'
          }`}
        >
          {title}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Radio indicator */}
      <div
        aria-hidden="true"
        className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          active
            ? 'border-indigo-500 bg-indigo-500'
            : 'border-gray-600 bg-transparent'
        }`}
      >
        {active && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            <Check size={9} strokeWidth={3} className="text-white" />
          </motion.span>
        )}
      </div>
    </motion.button>
  )
}

/* ───────────────────────────────────────────── */
/* Stripe Elements inner form                    */
/* ───────────────────────────────────────────── */
function StripePaymentForm({
  orderId,
  onSuccess,
}: {
  orderId: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        try {
          await confirmPayment(orderId, paymentIntent.id)
          onSuccess()
        } catch (confirmErr) {
          const message =
            confirmErr instanceof Error
              ? confirmErr.message
              : 'Failed to confirm payment'
          toast.error(message)
        }
      } else {
        toast.error(`Payment status: ${paymentIntent?.status ?? 'unknown'}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-black/50 rounded-xl p-4 border border-white/[0.08]">
        <PaymentElement />
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || loading}
        whileTap={!stripe || loading ? {} : { scale: 0.99 }}
        className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        {!loading && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading ? (
            <Loader2
              className="w-4 h-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Lock size={15} aria-hidden="true" />
          )}
          {loading ? 'Processing Payment…' : `Pay ₹${' '}Securely`}
        </span>
      </motion.button>

      <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1.5">
        <Lock size={9} aria-hidden="true" />
        Payments are secured by Stripe
      </p>
    </form>
  )
}