'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Truck, ChevronLeft, MapPin, ShieldCheck, Loader2, Sparkles, ArrowRight, Check
} from 'lucide-react'
import Link from 'next/link'

/* ---------------------------------- */
/*  Animated Background Component     */
/* ---------------------------------- */
function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Slow moving gradient blobs */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 50, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl"
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
    </div>
  )
}

/* ---------------------------------- */
/*  Main Checkout Component           */
/* ---------------------------------- */
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

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeStep, setActiveStep] = useState(0) // 0=Address, 1=Review
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
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(cartData)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        user_email: user.email,
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        address: {
          full_name: address.full_name,
          phone: address.phone,
          line1: address.address_line1,
          line2: address.address_line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        subtotal,
        shipping,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'cod',
      })
      .select('id')
      .single()

    if (orderError || !orderData) {
      toast.error('Order failed: ' + (orderError?.message || 'Unknown error'))
      setLoading(false)
      return
    }

    const orderId = orderData.id

    // 2. Insert order items
    const orderItems = cart.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      toast.success('Order placed!')
      toast.error('Order placed but failed to save items. Contact support.')
      console.error('Order items insert error:', itemsError)
    } else {
      toast.success('Order placed successfully!')
    }

    // 3. Clear cart and redirect
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/orders')
    setLoading(false)
  }

  if (cart.length === 0) {
    return (
      <div className="relative min-h-screen bg-black pt-20 flex items-center justify-center">
        <BackgroundAnimation />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <Link href="/cart" className="text-blue-400 hover:underline">Go back to cart</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 selection:bg-indigo-500/30">
      <BackgroundAnimation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/cart" className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-8 transition">
          <ChevronLeft size={16} />
          <span className="text-sm">Back to Cart</span>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-10 max-w-lg mx-auto">
          {['Shipping', 'Review & Pay'].map((label, idx) => (
            <div key={label} className="flex-1 flex items-center">
              <button
                onClick={() => setActiveStep(idx)}
                className={`relative flex items-center justify-center w-full text-sm font-medium transition-colors ${
                  activeStep >= idx ? 'text-indigo-400' : 'text-gray-600'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 transition-all ${
                  activeStep === idx ? 'border-indigo-400 bg-indigo-400/10' :
                  activeStep > idx ? 'border-indigo-400 bg-indigo-400' : 'border-gray-700 bg-transparent'
                }`}>
                  {activeStep > idx ? <Check size={16} className="text-white" /> : idx + 1}
                </span>
                {label}
              </button>
              {idx < 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${activeStep > idx ? 'bg-indigo-400' : 'bg-gray-800'}`} />
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
                  onSubmit={(e) => { e.preventDefault(); setActiveStep(1); }}
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
                          <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="mt-8 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      Continue to Review <ArrowRight size={18} />
                    </motion.button>
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
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between text-gray-300"><span>Items</span><span>{cart.length}</span></div>
                      <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-300"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                      <div className="flex justify-between font-bold text-white pt-3 border-t border-white/10"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="mt-6 w-full py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CreditCard size={20} />}
                      {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========== MOBILE ORDER SUMMARY (ADDED BACK) ========== */}
            <div className="lg:hidden mt-6">
              <div className="bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
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
                        <span className="text-gray-300">{item.name} × {item.quantity}</span>
                      </div>
                      <span className="text-gray-400">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <hr className="border-white/10" />
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                  <div className="flex justify-between font-bold text-white pt-3 border-t border-white/10"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-around text-gray-500">
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

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-amber-400 w-4 h-4" />
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 group">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || 'https://placehold.co/40x40'}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                        alt=""
                      />
                      <span className="text-gray-300">{item.name} × {item.quantity}</span>
                    </div>
                    <span className="text-gray-400">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <hr className="border-white/10" />
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-bold text-white pt-3 border-t border-white/10"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-around text-gray-500">
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