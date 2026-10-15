'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Shield, Sparkles } from 'lucide-react'
import PasswordInput from '@/components/auth/PasswordInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const msg = error.message.toLowerCase()

      if (msg.includes('email not confirmed')) {
        toast.error(
          'Please verify your email first. Check your inbox for the verification link.',
          { duration: 6000 }
        )
      } else if (
        msg.includes('invalid login credentials') ||
        msg.includes('invalid credentials')
      ) {
        toast.error('Wrong email or password. Please try again.')
      } else if (msg.includes('too many requests')) {
        toast.error('Too many attempts. Please wait a moment.')
      } else {
        toast.error(error.message)
      }

      setLoading(false)
      return
    }

    toast.success('Welcome back!')

    fetch('/api/auth/login-success', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {})

    router.push('/')
    router.refresh()
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
      {/* ─────────────────────────────────────────────
          Ambient background
         ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-indigo-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6"
      >
        {/* ─────────────────────────────────────────────
            Header
           ───────────────────────────────────────────── */}
        <header className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              aria-hidden="true"
              className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-2xl"
            />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/30 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Sparkles
                size={22}
                className="text-white"
                aria-hidden="true"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-2">
            Welcome back
          </h1>
          <p className="text-[13px] text-gray-500">
            Sign in to your VESTIOR account
          </p>
        </header>

        {/* ─────────────────────────────────────────────
            Form card
           ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/40">
          {/* Ambient glow inside card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-blue-500/[0.06] blur-[90px]"
          />

          <form onSubmit={handleLogin} className="relative space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                <Mail
                  size={10}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                Email
              </label>
              <input
                id="login-email"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400"
                >
                  <Lock
                    size={10}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                value={password}
                onChange={setPassword}
                name="login-password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={loading ? {} : { scale: 0.99 }}
              className="group/btn relative w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {!loading && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-white/[0.08]" />
            <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-gray-600">
              or
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-white/[0.08]" />
          </div>

          {/* Google */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            whileTap={{ scale: 0.99 }}
            className="relative w-full py-3 bg-white/[0.06] border border-white/[0.08] text-white rounded-xl text-[13px] font-medium hover:bg-white/[0.1] hover:border-white/15 transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573505 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443639,10.4668129 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
            Continue with Google
          </motion.button>
        </div>

        {/* Footer link */}
        <p className="text-center text-[12px] text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            Create one
          </Link>
        </p>

        {/* Trust footer */}
        <p className="text-[10px] text-gray-600 text-center mt-4 flex items-center justify-center gap-1.5">
          <Shield size={9} aria-hidden="true" />
          Secured with end-to-end encryption
        </p>
      </motion.div>
    </div>
  )
}