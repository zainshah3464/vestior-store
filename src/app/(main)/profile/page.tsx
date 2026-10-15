'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  User,
  Save,
  Loader2,
  MapPin,
  Phone,
  Heart,
  Package,
  Mail,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

// ─────────────────────────────────────────────
// Ambient background — refined
// ─────────────────────────────────────────────
function BackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      <motion.div
        animate={{ x: [0, 40, -30, 0], y: [0, -50, 20, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/[0.07] rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -60, 40, 0], y: [0, 70, -40, 0] }}
        transition={{ repeat: Infinity, duration: 26, ease: 'easeInOut' }}
        className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-violet-600/[0.06] rounded-full blur-[120px]"
      />
    </div>
  )
}

const FIELDS = [
  { label: 'Full Name', name: 'full_name', col: 'full' as const, icon: User },
  { label: 'Phone', name: 'phone', col: 'full' as const, icon: Phone },
  { label: 'Address Line 1', name: 'address_line1', col: 'full' as const },
  { label: 'Address Line 2', name: 'address_line2', col: 'full' as const },
  { label: 'City', name: 'city', col: 'half' as const },
  { label: 'State', name: 'state', col: 'half' as const },
  { label: 'Pincode', name: 'pincode', col: 'half' as const },
] as const

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserEmail(user.email ?? null)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address_line1: profile.address_line1 || '',
          address_line2: profile.address_line2 || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
        })
      }
      setLoading(false)
    }
    getUserProfile()
  }, [supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
    }
    setSaving(false)
  }

  // ─────────────────────────────────────────────
  // Loading skeleton
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen bg-black pt-20 pb-16">
        <BackgroundAnimation />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton header */}
          <div className="h-40 rounded-3xl bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Skeleton title */}
          <div className="h-8 w-48 bg-white/[0.04] rounded-xl mb-3" />
          <div className="h-4 w-72 bg-white/[0.03] rounded-lg mb-8" />

          {/* Skeleton form */}
          <div className="space-y-5 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`h-12 bg-white/[0.04] rounded-xl ${
                    i <= 4 ? 'md:col-span-2' : ''
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <div className="h-12 w-40 bg-white/[0.04] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-black pt-20 pb-20">
      <BackgroundAnimation />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────
            Header card — avatar + banner
           ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          {/* Banner */}
          <div className="relative h-32 md:h-36 rounded-3xl bg-gradient-to-br from-indigo-600/30 via-violet-600/25 to-blue-600/20 border border-white/[0.06] overflow-hidden">
            {/* Subtle grid pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-violet-500/20 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px]"
            />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.15,
                type: 'spring',
                stiffness: 300,
                damping: 22,
              }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border-4 border-black flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                <User
                  size={32}
                  className="text-white"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>
              {/* Online dot */}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────
            Title + email
           ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
            My Profile
          </h1>
          {userEmail && (
            <p className="text-[13px] text-gray-500 mt-1.5 flex items-center gap-1.5">
              <Mail size={12} aria-hidden="true" />
              <span>{userEmail}</span>
            </p>
          )}
          <p className="text-[13px] text-gray-400 mt-3 max-w-md leading-relaxed">
            Manage your personal details, contact info, and shipping address
            for faster checkout.
          </p>
        </motion.div>

        {/* ─────────────────────────────────────────────
            Quick links
           ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { href: '/orders', label: 'Orders', Icon: Package },
            { href: '/wishlist', label: 'Wishlist', Icon: Heart },
            { href: '/products', label: 'Shop', Icon: MapPin },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Icon
                size={16}
                className="text-indigo-400 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* ─────────────────────────────────────────────
            Form
           ───────────────────────────────────────────── */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          onSubmit={handleSubmit}
          className="relative overflow-hidden space-y-6 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/30"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-indigo-500/[0.05] blur-[100px]"
          />

          {/* Form header */}
          <div className="relative flex items-start gap-3 pb-4 border-b border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
              <User
                size={16}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-white leading-tight">
                Personal Details
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Auto-filled at checkout for faster orders
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {FIELDS.map((field, idx) => {
              const Icon = 'icon' in field ? field.icon : null

              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + idx * 0.04,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={
                    field.col === 'full' ? 'md:col-span-2' : ''
                  }
                >
                  <label
                    htmlFor={`profile-${field.name}`}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
                  >
                    {Icon && (
                      <Icon
                        size={11}
                        className="text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                    {field.label}
                  </label>

                  <input
                    id={`profile-${field.name}`}
                    type="text"
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="relative flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 text-center text-[12px] font-medium text-gray-400 hover:text-white transition-colors order-2 sm:order-1"
            >
              Cancel
            </Link>

            <motion.button
              type="submit"
              disabled={saving}
              whileTap={saving ? {} : { scale: 0.98 }}
              className="group/btn relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {!saving && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                {saving ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Save size={15} aria-hidden="true" />
                )}
                {saving ? 'Saving…' : 'Save Changes'}
              </span>
            </motion.button>
          </div>
        </motion.form>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-[11px] text-gray-600 text-center mt-6 flex items-center justify-center gap-1.5"
        >
          <ArrowRight size={10} aria-hidden="true" />
          Your details are encrypted and never shared
        </motion.p>
      </div>
    </div>
  )
}