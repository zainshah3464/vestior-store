'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
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
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '')

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-md w-full">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-6 transition text-sm"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Mail size={26} className="text-blue-400" aria-hidden="true" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Forgot your password?
              </h1>
              <p className="text-gray-400 text-sm">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <CheckCircle2
                size={26}
                className="text-emerald-400"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We&apos;ve sent a password reset link to
              <br />
              <span className="text-white font-medium">{email}</span>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left text-xs text-gray-400 space-y-1.5 mb-6">
              <p className="text-gray-300 font-medium mb-2">
                Didn&apos;t receive the email?
              </p>
              <p>• Check your spam or junk folder</p>
              <p>• Make sure you entered the correct email</p>
              <p>• Wait a few minutes and try again</p>
            </div>

            <button
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
              className="text-blue-400 hover:text-blue-300 transition text-sm"
            >
              Try a different email
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}