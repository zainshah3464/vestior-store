'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { checkPasswordStrength } from '@/lib/password'
import PasswordInput from '@/components/auth/PasswordInput'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

export default function ResetPasswordForm({ userEmail }: { userEmail: string }) {
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

      // Redirect to home after 1.5s (user is already signed in)
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

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <CheckCircle2
              size={28}
              className="text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Password Updated
          </h1>
          <p className="text-gray-400 text-sm">
            Redirecting you to the homepage...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <ShieldCheck
                size={26}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Set new password
            </h1>
            <p className="text-gray-400 text-sm">
              For <span className="text-white font-medium">{userEmail}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm text-gray-400 mb-1"
              >
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

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm text-gray-400 mb-1"
              >
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
              {confirm.length > 0 && (
                <p
                  className={`text-[10px] mt-1.5 ${
                    passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {passwordsMatch
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            <Link href="/" className="text-blue-500 hover:underline">
              Cancel and go home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}