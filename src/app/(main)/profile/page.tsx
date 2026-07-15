'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Save, Loader2 } from 'lucide-react'

function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 40, -30, 0], y: [0, -50, 20, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -60, 40, 0], y: [0, 70, -40, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl"
      />
    </div>
  )
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black pt-20">
        <BackgroundAnimation />
        <div className="max-w-2xl mx-auto px-4 animate-pulse z-10 relative">
          <div className="h-48 bg-white/5 rounded-2xl mb-8" />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16">
      <BackgroundAnimation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="relative mb-10">
          <div className="h-32 bg-gradient-to-r from-indigo-600/30 to-violet-600/30 rounded-2xl" />
          <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-4 border-black flex items-center justify-center shadow-lg">
            <User size={30} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-gray-400 text-sm mb-8">Manage your personal details and address</p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Full Name', name: 'full_name' },
              { label: 'Phone', name: 'phone' },
              { label: 'Address Line 1', name: 'address_line1', col: 'full' },
              { label: 'Address Line 2', name: 'address_line2', col: 'full' },
              { label: 'City', name: 'city' },
              { label: 'State', name: 'state' },
              { label: 'Pincode', name: 'pincode' },
            ].map((field, idx) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={field.col === 'full' ? 'md:col-span-2' : ''}
              >
                <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/70 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}