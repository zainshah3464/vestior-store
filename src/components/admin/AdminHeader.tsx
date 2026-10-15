'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  ChevronDown,
  LogOut,
  Clock,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

interface AdminHeaderProps {
  user: { email?: string }
  onToggleSidebar: () => void
}

export default function AdminHeader({
  user,
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const timeString = currentTime
    ? currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '--:-- --'

  const dateString = currentTime
    ? currentTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-- --- ----'

  const dayName = currentTime
    ? currentTime.toLocaleDateString('en-US', { weekday: 'short' })
    : '---'

  const userInitial = user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <header className="relative z-30 flex-shrink-0 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06] px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
      {/* ─────────────────────────────────────────────
          Animated top accent line
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px overflow-hidden"
      >
        <motion.div
          className="h-px w-1/3 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        />
      </div>

      {/* ─────────────────────────────────────────────
          Left — Menu toggle + Live clock capsule
         ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Open navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* ─────────────────────────────────────────────
            Desktop / tablet — premium live clock capsule
           ───────────────────────────────────────────── */}
        <motion.div
          initial={false}
          className="hidden sm:flex items-center gap-3 pl-2 pr-3.5 py-1.5 rounded-full bg-gradient-to-r from-white/[0.05] via-white/[0.03] to-white/[0.02] border border-white/[0.08] shadow-[0_0_24px_-8px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md"
        >
          {/* Live icon badge */}
          <div className="relative flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/25 to-indigo-600/25 border border-blue-400/30 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Clock size={12} className="text-blue-300" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"
            />
          </div>

          {/* Time — big, bold, tabular */}
          <span className="text-[13px] font-bold text-white tabular-nums tracking-tight">
            {timeString}
          </span>

          {/* Gradient divider */}
          <span
            aria-hidden="true"
            className="w-px h-4 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />

          {/* Date block — day name + date */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300/90">
              {dayName}
            </span>
            <span className="text-[11px] text-gray-400 tabular-nums font-medium">
              {dateString}
            </span>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────
            Mobile — compact live pill
           ───────────────────────────────────────────── */}
        <div className="sm:hidden flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span
            aria-hidden="true"
            className="relative flex w-1.5 h-1.5 flex-shrink-0"
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
          </span>
          <span className="text-[12px] font-semibold text-white tabular-nums">
            {timeString}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Right — Notifications + User menu
         ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <NotificationBell />

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pr-1.5 rounded-full hover:bg-white/[0.04] transition-colors duration-200"
            aria-label="Open user menu"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[12px] font-semibold ring-1 ring-white/10 flex-shrink-0">
              {userInitial}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0A0A]"
              />
            </div>
            <span className="hidden md:inline text-[12px] text-gray-300 max-w-[160px] truncate">
              {user?.email}
            </span>
            <ChevronDown
              size={14}
              className={`hidden md:block text-gray-500 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop click-away */}
                <div
                  className="fixed inset-0 z-[60]"
                  onClick={() => setDropdownOpen(false)}
                  aria-hidden="true"
                />

                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  role="menu"
                  className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-1.5rem)] z-[70] bg-[#121212]/98 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 mb-1">
                      Signed in as
                    </p>
                    <p className="text-[12px] text-white font-medium truncate">
                      {user?.email || 'Admin'}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/"
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                      role="menuitem"
                    >
                      <ExternalLink
                        size={14}
                        className="text-gray-500 group-hover:text-blue-400 transition-colors"
                        aria-hidden="true"
                      />
                      <span className="flex-1">Back to Site</span>
                    </Link>

                    <div className="my-1 h-px bg-white/[0.06]" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] rounded-xl transition-colors"
                      role="menuitem"
                    >
                      <LogOut size={14} aria-hidden="true" />
                      <span className="flex-1 text-left">Sign out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}