'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, MapPin, Calendar, Clock, User, Shield } from 'lucide-react'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: string
  created_at: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  updated_at?: string | null
}

export default function UserDetailsModal({ user, onClose }: { user: Profile | null; onClose: () => void }) {
  if (!user) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-[#0f0f0f]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Decorative gradient line top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">User Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
              <X size={20} />
            </button>
          </div>

          {/* Avatar and basic info */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
              {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h3 className="text-lg font-medium text-white">{user.full_name || 'No Name'}</h3>
            <span className="text-sm text-gray-400">{user.email}</span>
            <span className={`mt-2 px-3 py-0.5 text-xs rounded-full ${
              user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {user.role}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={16} className="text-indigo-400" />
              <span>{user.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={16} className="text-indigo-400" />
              <span>Joined: {new Date(user.created_at).toLocaleDateString('en-GB')}</span>
            </div>
            {user.updated_at && (
              <div className="flex items-center gap-2 text-gray-400 md:col-span-2">
                <Clock size={16} className="text-indigo-400" />
                <span>Last updated: {new Date(user.updated_at).toLocaleDateString('en-GB')}</span>
              </div>
            )}
            <div className="md:col-span-2 mt-2 border-t border-white/10 pt-4">
              <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-indigo-400" /> Address
              </h4>
              <div className="text-gray-400 space-y-1">
                {user.address_line1 && <p>{user.address_line1}</p>}
                {user.address_line2 && <p>{user.address_line2}</p>}
                <p>
                  {[user.city, user.state, user.pincode].filter(Boolean).join(', ') || 'No address provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}