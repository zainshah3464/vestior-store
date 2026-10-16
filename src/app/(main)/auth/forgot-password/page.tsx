'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Send,
  Sparkles,
  Inbox,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
 const siteUrl = window.location.origin  // hamesha current origin use karo

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${siteUrl}/auth/callback`,  // ✅ callback route pe bhejo
})

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
      toast.success('Reset link sent! Check your inbox.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSent(false)
    setEmail('')
  }

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/auth/login"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to sign in
        </Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <header className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center mb-5">
                  <div
                    aria-hidden="true"
                    className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-2xl"
                  />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/30 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                    <Mail
                      size={22}
                      className="text-white"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-2">
                  Forgot your password?
                </h1>
                <p className="text-[13px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                  No worries — enter your email and we&apos;ll send you a
                  secure reset link.
                </p>
              </header>

              {/* Form card */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/40">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-blue-500/[0.06] blur-[90px]"
                />

                <form onSubmit={handleSubmit} className="relative space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
                    >
                      <Mail
                        size={10}
                        className="text-gray-500"
                        aria-hidden="true"
                      />
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={loading}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !email}
                    whileTap={loading || !email ? {} : { scale: 0.99 }}
                    className="group/btn relative w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                  >
                    {!loading && email && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {loading ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <Send
                            size={13}
                            className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>

              {/* Footer */}
              <p className="text-center text-[12px] text-gray-500 mt-6">
                Remembered it?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Success icon */}
              <div className="relative inline-flex items-center justify-center mb-5 w-full">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 22,
                  }}
                  className="relative"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-full bg-emerald-500/15 blur-2xl"
                  />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400/30 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2
                      size={26}
                      className="text-white"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Text */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-3">
                  Check your email
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="text-[14px] text-white font-semibold mt-1.5 break-all">
                  {email}
                </p>
              </div>

              {/* Tips card */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-5 shadow-2xl shadow-black/40">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-amber-500/[0.04] blur-[90px]"
                />

                <div className="relative flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/[0.1] border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                    <Inbox
                      size={13}
                      className="text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-tight">
                      Didn&apos;t receive the email?
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Try these quick checks
                    </p>
                  </div>
                </div>

                <ul className="relative space-y-2 text-[12px] text-gray-400">
                  <li className="flex items-start gap-2">
                    <span
                      className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>Check your spam or junk folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>Make sure you entered the correct email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="w-1 h-1 rounded-full bg-blue-400 mt-[7px] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      Wait a few minutes — delivery can take up to 5 minutes
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="group/btn relative w-full py-3 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl text-[12px] font-medium hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw
                    size={13}
                    className="transition-transform duration-300 group-hover/btn:rotate-90"
                    aria-hidden="true"
                  />
                  Try a different email
                </button>

                <Link
                  href="/auth/login"
                  className="w-full py-3 text-[12px] font-medium text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={12} aria-hidden="true" />
                  Back to sign in
                </Link>
              </div>

              {/* Footer trust */}
              <p className="text-[10px] text-gray-600 text-center mt-4 flex items-center justify-center gap-1.5">
                <Sparkles size={9} aria-hidden="true" />
                The link expires in 1 hour for your security
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}