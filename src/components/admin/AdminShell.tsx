'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminNotificationsProvider from './AdminNotificationsProvider'

export default function AdminShell({
  user,
  children,
}: {
  user: { email?: string }
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ─────────────────────────────────────────────
  // 🔒 Lock body scroll while admin shell is mounted
  //    Admin has its own internal scroll container.
  // ─────────────────────────────────────────────
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [children])

  // ESC closes mobile sidebar
  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [sidebarOpen])

  return (
    <AdminNotificationsProvider>
      <div className="flex h-dvh bg-[#0A0A0A] text-white overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                aria-hidden="true"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] lg:hidden shadow-2xl shadow-black/60"
                role="dialog"
                aria-modal="true"
                aria-label="Admin navigation"
              >
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader
            user={user}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <main
            id="admin-main-content"
            className="relative z-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 md:p-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="max-w-[1600px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminNotificationsProvider>
  )
}