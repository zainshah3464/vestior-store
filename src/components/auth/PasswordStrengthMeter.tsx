'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { checkPasswordStrength } from '@/lib/password'

export default function PasswordStrengthMeter({
  password,
}: {
  password: string
}) {
  const { score, label, color, checks, isValid } =
    checkPasswordStrength(password)

  if (password.length === 0) return null

  const requirements: Array<{ label: string; met: boolean }> = [
    { label: 'At least 8 characters', met: checks.length },
    { label: 'Lowercase letter', met: checks.lowercase },
    { label: 'Uppercase letter', met: checks.uppercase },
    { label: 'Number', met: checks.number },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 overflow-hidden"
    >
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color}`}
            initial={{ width: '0%' }}
            animate={{ width: `${((score + 1) / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span
          className={`text-[10px] font-medium ${
            score <= 1
              ? 'text-red-400'
              : score === 2
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1 text-[10px]">
        {requirements.map((req) => (
          <div
            key={req.label}
            className={`flex items-center gap-1 ${
              req.met ? 'text-emerald-400' : 'text-gray-500'
            }`}
          >
            {req.met ? (
              <Check size={10} className="flex-shrink-0" aria-hidden="true" />
            ) : (
              <X size={10} className="flex-shrink-0" aria-hidden="true" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>

      {isValid && (
        <p className="text-[10px] text-emerald-400">✓ Password meets requirements</p>
      )}
    </motion.div>
  )
}