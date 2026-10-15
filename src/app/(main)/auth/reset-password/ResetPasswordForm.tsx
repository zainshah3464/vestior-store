'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { checkPasswordStrength } from '@/lib/password'
import PasswordInput from '@/components/auth/PasswordInput'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

export default function ResetPasswordForm({
  userEmail,
}: {
  userEmail: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = checkPasswordStrength(password)
  const passwordsMatch = password.length > 0 && password === confirm
  const canSubmit = strength.isValid && passwordsMatch && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!strength.isValid) {
      toast.error('Password does not meet the requirements')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error(error.message)
        return
      }

      setSuccess(true)
      toast.success('Password updated successfully!')

      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────
  // Success state
  // ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/[0.06] blur-[130px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 text-center"
        >
          <div className="relative inline-flex items-center justify-center mb-5">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-3">
            Password updated
          </h1>
          <p className="text-[13px] text-gray-500 mb-8">
            Your password has been changed. Redirecting you now…
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-gray-400">
            <Loader2
              size={12}
              className="animate-spin text-emerald-400"
              aria-hidden="true"
            />
            Redirecting…
          </div>
        </motion.div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Form state
  // ─────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 flex items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[380px] h-[380px] bg-violet-500/[0.04] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6"
      >
        {/* Header */}
        <header className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              aria-hidden="true"
              className="absolute w-20 h-20 rounded-full bg-indigo-500/20 blur-2xl"
            />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border border-indigo-400/30 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <ShieldCheck
                size={22}
                className="text-white"
                aria-hidden="true"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] mb-2">
            Set new password
          </h1>
          <p className="text-[13px] text-gray-500">
            For{' '}
            <span className="text-gray-300 font-medium break-all">
              {userEmail}
            </span>
          </p>
        </header>

        {/* Form card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.05] blur-[90px]"
          />

          <form onSubmit={handleSubmit} className="relative space-y-4">
            {/* New password */}
            <div>
              <label
                htmlFor="new-password"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                <KeyRound
                  size={10}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                New Password
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                name="new-password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                <Lock
                  size={10}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                Confirm Password
              </label>
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                name="confirm-password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                disabled={loading}
              />

              {/* Match indicator */}
              {confirm.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-[10px] mt-1.5 flex items-center gap-1.5 ${
                    passwordsMatch
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2
                        size={10}
                        aria-hidden="true"
                      />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <span
                        className="w-1 h-1 rounded-full bg-red-400"
                        aria-hidden="true"
                      />
                      Passwords do not match
                    </>
                  )}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileTap={!canSubmit ? {} : { scale: 0.99 }}
              className="group/btn relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[13px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {!loading && canSubmit && (
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
                    Updating…
                  </>
                ) : (
                  <>
                    Update Password
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
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-gray-500 mt-6">
          <Link
            href="/"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Cancel and go home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}