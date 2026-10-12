'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'vestior-pwa-install-dismissed'
const DISMISS_COOLDOWN_DAYS = 7

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Already installed as standalone? Skip.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // User dismissed recently? Skip.
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10)
        const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
        if (daysSince < DISMISS_COOLDOWN_DAYS) return
      }
    } catch {
      // ignore
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Wait 15s before showing, so it's not aggressive
      setTimeout(() => setShow(true), 15_000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('[pwa] user accepted install')
      }

      setShow(false)
      setDeferredPrompt(null)
    } catch (err) {
      console.error('[pwa] install prompt failed:', err)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    } catch {
      // ignore
    }
  }

  return (
    <AnimatePresence>
      {show && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 sm:max-w-sm z-40"
        >
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 flex items-start gap-3 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Smartphone size={18} className="text-white" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Install VESTIOR
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Get faster access with our app. Works offline.
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                >
                  <Download size={12} aria-hidden="true" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-white transition p-1 -mr-1 -mt-1"
              aria-label="Dismiss install prompt"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}