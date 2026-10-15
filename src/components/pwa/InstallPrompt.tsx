'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Zap, WifiOff } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'vestior-pwa-install-dismissed'
const DISMISS_COOLDOWN_DAYS = 30
const AUTO_SHOW_DELAY_MS = 20_000

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const dismissedAt = parseInt(raw, 10)
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
    return daysSince < DISMISS_COOLDOWN_DAYS
  } catch {
    return false
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (isDismissedRecently()) return

    const handler = (e: Event) => {
      e.preventDefault()

      if (isDismissedRecently()) return

      setDeferredPrompt(e as BeforeInstallPromptEvent)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        if (!isDismissedRecently()) setShow(true)
      }, AUTO_SHOW_DELAY_MS)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

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
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 sm:max-w-sm z-40"
        >
          <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl">
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 w-[180px] h-[180px] bg-indigo-500/[0.15] blur-[70px]"
            />

            <div className="relative p-4 flex items-start gap-3">
              {/* App icon */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  type: 'spring',
                  stiffness: 400,
                  damping: 22,
                }}
                className="relative flex-shrink-0"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Smartphone
                    size={18}
                    className="text-white"
                    aria-hidden="true"
                  />
                </div>
                {/* Online dot */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0e0e0e]"
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-semibold text-white leading-tight">
                    Install VESTIOR
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-indigo-500/[0.12] text-indigo-300 px-1.5 py-[2px] rounded border border-indigo-500/25">
                    Free
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">
                  Faster access · Works offline · One-tap launch
                </p>

                {/* Micro-benefits */}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap
                      size={9}
                      className="text-amber-400"
                      aria-hidden="true"
                    />
                    Fast
                  </span>
                  <span
                    className="w-1 h-1 rounded-full bg-gray-700"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-1">
                    <WifiOff
                      size={9}
                      className="text-blue-400"
                      aria-hidden="true"
                    />
                    Offline
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <motion.button
                    type="button"
                    onClick={handleInstall}
                    whileTap={{ scale: 0.97 }}
                    className="group/btn relative flex-1 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[12px] font-semibold rounded-lg overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 flex items-center justify-center gap-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                    />
                    <Download
                      size={12}
                      className="relative z-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Install</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="px-3.5 py-2 text-[12px] font-medium text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/15 rounded-lg transition-all duration-200"
                  >
                    Not now
                  </button>
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                aria-label="Dismiss install prompt"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}