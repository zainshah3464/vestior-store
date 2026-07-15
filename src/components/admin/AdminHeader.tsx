'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ChevronDown, LogOut, Clock } from 'lucide-react'

interface AdminHeaderProps {
  user: { email?: string }
  onToggleSidebar: () => void
}

export default function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
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
    ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '--:-- --'
  const dateString = currentTime
    ? currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-- --- ----'

  return (
    <header className="relative bg-[#0A0A0A]/70 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
      {/* Decorative animated line – contained in its own wrapper */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-px">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Live Clock with subtle glow */}
        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
          >
            <Clock size={15} className="text-indigo-400" />
            <span className="text-sm font-medium text-white">{timeString}</span>
            <span className="text-xs text-gray-500 ml-1">{dateString}</span>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="hidden md:inline">{user?.email}</span>
            <ChevronDown size={16} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-[#121212]/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-white/10 mb-1">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition"
                  >
                    <LogOut size={16} className="text-red-400" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}