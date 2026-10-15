'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Shield,
  Crown,
  Hash,
  ExternalLink,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  role: string
  is_super_admin?: boolean
  created_at: string
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  updated_at?: string | null
}

export default function UserDetailsModal({
  user,
  onClose,
}: {
  user: Profile | null
  onClose: () => void
}) {
  // ESC to close
  useEffect(() => {
    if (!user) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [user, onClose])

  // Body scroll lock
  useEffect(() => {
    if (!user) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [user])

  if (!user) return null

  const initial =
    user.full_name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    '?'

  // Role badge styling
  const roleConfig = user.is_super_admin
    ? {
        label: 'Super Admin',
        Icon: Crown,
        bg: 'bg-amber-500/[0.1]',
        text: 'text-amber-300',
        border: 'border-amber-500/25',
      }
    : user.role === 'admin'
    ? {
        label: 'Admin',
        Icon: Shield,
        bg: 'bg-indigo-500/[0.1]',
        text: 'text-indigo-300',
        border: 'border-indigo-500/25',
      }
    : {
        label: 'Customer',
        Icon: User,
        bg: 'bg-emerald-500/[0.1]',
        text: 'text-emerald-300',
        border: 'border-emerald-500/25',
      }

  const RoleIcon = roleConfig.Icon

  const fullAddress =
    [
      user.address_line1,
      user.address_line2,
      [user.city, user.state, user.pincode].filter(Boolean).join(', '),
    ]
      .filter(Boolean)
      .join(' · ') || 'No address provided'

  const hasAddress = !!(
    user.address_line1 ||
    user.address_line2 ||
    user.city ||
    user.state ||
    user.pincode
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="User details"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-md bg-[#0f0f0f] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.08] blur-[100px]"
          />

          {/* Top gradient accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-60"
          />

          {/* ═════════════════════════════════════════════
              Header
             ═════════════════════════════════════════════ */}
          <div className="relative flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                <User
                  size={14}
                  className="text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-white leading-tight">
                  User Details
                </h2>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Full profile information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 flex-shrink-0"
              aria-label="Close"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* ═════════════════════════════════════════════
              Scrollable body
             ═════════════════════════════════════════════ */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            {/* ─────────────────────────────────────────────
                Hero — avatar + identity
               ───────────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.05,
                  type: 'spring',
                  stiffness: 400,
                  damping: 22,
                }}
                className="relative mb-3"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ring-1 ring-white/[0.08] shadow-2xl shadow-indigo-500/25"
                  style={{ width: '4.5rem', height: '4.5rem' }}
                >
                  {initial}
                </div>
                {/* Online dot */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f0f0f]"
                />
              </motion.div>

              <h3 className="text-[16px] sm:text-[17px] font-bold text-white tracking-[-0.01em] leading-tight">
                {user.full_name || 'No Name'}
              </h3>
              <p className="text-[12px] text-gray-500 mt-1 break-all max-w-full px-2">
                {user.email}
              </p>

              {/* Role badge */}
              <span
                className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
              >
                <RoleIcon size={10} aria-hidden="true" />
                {roleConfig.label}
              </span>
            </div>

            {/* ─────────────────────────────────────────────
                Quick info — contact + dates
               ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-3 mb-5">
              <InfoBlock
                icon={Phone}
                label="Phone"
                value={user.phone || 'Not provided'}
              />
              <InfoBlock
                icon={Calendar}
                label="Joined"
                value={new Date(user.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              />
              {user.updated_at && (
                <InfoBlock
                  icon={Clock}
                  label="Last Updated"
                  value={new Date(user.updated_at).toLocaleDateString(
                    'en-GB',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                />
              )}
            </div>

            {/* ─────────────────────────────────────────────
                Address section
               ───────────────────────────────────────────── */}
            <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/[0.1] border border-blue-500/25 flex items-center justify-center">
                  <MapPin
                    size={12}
                    className="text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-400">
                  Address
                </h4>
              </div>

              {hasAddress ? (
                <div className="text-[12px] text-gray-300 space-y-1 leading-relaxed">
                  {user.address_line1 && <p>{user.address_line1}</p>}
                  {user.address_line2 && <p>{user.address_line2}</p>}
                  {(user.city || user.state || user.pincode) && (
                    <p className="text-gray-400">
                      {[user.city, user.state].filter(Boolean).join(', ')}
                      {user.pincode && (
                        <>
                          {' '}
                          <span className="tabular-nums">
                            {user.pincode}
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[12px] text-gray-500 italic">
                  No address provided
                </p>
              )}
            </div>

            {/* ─────────────────────────────────────────────
                Activity link
               ───────────────────────────────────────────── */}
            <div className="mt-5">
              <Link
                href={`/admin/users/${user.id}/activity`}
                onClick={onClose}
                className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/[0.1] border border-rose-500/25 flex items-center justify-center flex-shrink-0">
                    <MessageSquare
                      size={12}
                      className="text-rose-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white leading-tight">
                      View Activity
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Sessions, orders, and behavior history
                    </p>
                  </div>
                </div>
                <ExternalLink
                  size={13}
                  className="flex-shrink-0 text-gray-600 group-hover:text-rose-400 transition-colors"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* ═════════════════════════════════════════════
              Footer
             ═════════════════════════════════════════════ */}
          <div className="flex-shrink-0 px-5 py-3 border-t border-white/[0.06] bg-black/20">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// InfoBlock — small info tile with icon
// ─────────────────────────────────────────────
function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-gray-400" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-gray-500">
          {label}
        </p>
        <p className="text-[12px] text-white mt-0.5 truncate tabular-nums">
          {value}
        </p>
      </div>
    </div>
  )
}