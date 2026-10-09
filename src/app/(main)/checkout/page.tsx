'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { placeOrder } from '@/actions/placeOrder'
import { confirmPayment } from '@/actions/confirmPayment'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Truck, ChevronLeft, MapPin, ShieldCheck, Loader2, Sparkles,
  ArrowRight, Check, Banknote,
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
  { label: 'Full Name', name: 'full_name', type: 'text', col: 'full' },
  { label: 'Phone', name: 'phone', type: 'text', col: 'full' },
  { label: 'Address Line 1', name: 'address_line1', type: 'text', col: 'full' },
  { label: 'Address Line 2 (Optional)', name: 'address_line2', type: 'text', col: 'full' },
  { label: 'City', name: 'city', type: 'text', col: 'half' },
  { label: 'State', name: 'state', type: 'text', col: 'half' },
  { label: 'Pincode', name: 'pincode', type: 'text', col: 'half' },
]

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

  useEffect(() => {
    const cartData: CartItem[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    )
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(cartData)

    // ─────────────────────────────────────────────
    // Track checkout_started
    // ─────────────────────────────────────────────
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
      const { data: { user: authUser } } = await supabase.auth.getUser()
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 100
  const total = subtotal + shipping

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
        paymentMethod
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
      const message = err instanceof Error ? err.message : 'Failed to place order'
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

  if (cart.length === 0) {
    return (
      <div className="relative min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <Link href="/cart" className="text-blue-400 hover:underline">
            Go back to cart
          </Link>
        </div>
      </div>
    )
  }

  const stripePromiseLocal = getStripePromise()

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-8 transition"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">Back to Cart</span>
        </Link>

        <div className="flex items-center gap-0 mb-10 max-w-lg mx-auto">
          {['Shipping', 'Review & Pay'].map((label, idx) => (
            <div key={label} className="flex-1 flex items-center">
              <button
                onClick={() => !clientSecret && setActiveStep(idx)}
                className={`relative flex items-center justify-center w-full text-sm font-medium transition-colors ${
                  activeStep >= idx ? 'text-indigo-400' : 'text-gray-600'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 transition-all ${
                    activeStep === idx
                      ? 'border-indigo-400 bg-indigo-400/10'
                      : activeStep > idx
                      ? 'border-indigo-400 bg-indigo-400'
                      : 'border-gray-700 bg-transparent'
                  }`}
                >
                  {activeStep > idx ? <Check size={16} className="text-white" /> : idx + 1}
                </span>
                {label}
              </button>
              {idx < 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    activeStep > idx ? 'bg-indigo-400' : 'bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeStep === 0 ? (
                <motion.form
                  key="address"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleContinueToReview}
                  className="space-y-6"
                >
                  <div className="bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl shadow-indigo-500/5">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <MapPin className="text-indigo-400 w-5 h-5" />
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {formFields.map((field, i) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={field.col === 'full' ? 'md:col-span-2' : ''}
                        >
                          <label className="block text-sm text-gray-400 mb-1.5">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={address[field.name as keyof typeof address]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-black/70 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            required={field.name !== 'address_line2'}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="mt-8 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      Continue to Review <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-400 w-5 h-5" />
                      Review Your Order
                    </h2>

                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-3">Payment Method</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <PaymentOption
                          active={paymentMethod === 'cod'}
                          onClick={() => !clientSecret && setPaymentMethod('cod')}
                          icon={<Banknote size={18} />}
                          title="Cash on Delivery"
                          subtitle="Pay when you receive"
                          disabled={!!clientSecret}
                        />
                        <PaymentOption
                          active={paymentMethod === 'stripe'}
                          onClick={() => !clientSecret && setPaymentMethod('stripe')}
                          icon={<CreditCard size={18} />}
                          title="Card Payment"
                          subtitle="Visa, Mastercard, Amex"
                          disabled={!!clientSecret}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Items</span>
                        <span>{cart.length}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-3 border-t border-white/10">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    {!clientSecret && (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="mt-6 w-full py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          <CreditCard size={20} />
                        )}
                        {loading
                          ? 'Processing...'
                          : paymentMethod === 'cod'
                          ? 'Place Order (Cash on Delivery)'
                          : 'Continue to Card Payment'}
                      </button>
                    )}

                    {clientSecret && stripePromiseLocal && orderId && (
                      <div className="mt-6">
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
                              },
                            },
                          }}
                        >
                          <StripePaymentForm
                            orderId={orderId}
                            onSuccess={handlePaymentSuccess}
                          />
                        </Elements>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-amber-400 w-4 h-4" />
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || 'https://placehold.co/40x40'}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        alt=""
                      />
                      <span className="text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <hr className="border-white/10" />
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-around text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-indigo-400" />
                  <span className="text-xs">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CreditCard size={18} className="text-indigo-400" />
                  <span className="text-xs">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
        active
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-white/10 bg-black/30 hover:border-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div
        className={`p-2 rounded-lg ${
          active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-400'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {active && (
        <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
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
        // Server-side confirmation (works without Stripe CLI/webhook)
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
      <div className="bg-black/40 rounded-xl p-4 border border-white/10">
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <CreditCard size={20} />
        )}
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Payments are secured by Stripe. You will be redirected on success.
      </p>
    </form>
  )
}