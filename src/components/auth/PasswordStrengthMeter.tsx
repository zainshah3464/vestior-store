'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ShieldCheck, AlertCircle } from 'lucide-react'
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

  const metCount = requirements.filter((r) => r.met).length

  // Per-score accent palette
  const scoreStyles =
    score <= 1
      ? {
          text: 'text-red-400',
          track: 'bg-red-500/[0.08]',
          fill: 'from-red-500 to-red-400',
          ring: 'rgba(239,68,68,0.10)',
        }
      : score === 2
      ? {
          text: 'text-amber-400',
          track: 'bg-amber-500/[0.08]',
          fill: 'from-amber-500 to-amber-400',
          ring: 'rgba(245,158,11,0.10)',
        }
      : score === 3
      ? {
          text: 'text-emerald-400',
          track: 'bg-emerald-500/[0.08]',
          fill: 'from-emerald-500 to-emerald-400',
          ring: 'rgba(16,185,129,0.10)',
        }
      : {
          text: 'text-emerald-300',
          track: 'bg-emerald-500/[0.10]',
          fill: 'from-emerald-400 to-teal-400',
          ring: 'rgba(16,185,129,0.14)',
        }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-3 space-y-3 overflow-hidden"
    >
      {/* ─────────────────────────────────────────────
          Strength bar
         ───────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500">
            Strength
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className={`text-[10px] font-bold tracking-wide ${scoreStyles.text}`}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Segmented bar — 4 segments for progressive feel */}
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => {
            const filled = i <= score
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  opacity: filled ? 1 : 0.4,
                }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={`flex-1 h-1 rounded-full overflow-hidden ${
                  filled ? scoreStyles.track : 'bg-white/[0.06]'
                }`}
              >
                {filled && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ originX: 0 }}
                    className={`h-full bg-gradient-to-r ${scoreStyles.fill} rounded-full`}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Requirements checklist
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {requirements.map((req, i) => (
          <motion.div
            key={req.label}
            initial={false}
            animate={{
              color: req.met ? 'rgb(52,211,153)' : 'rgb(107,114,128)',
            }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className="flex items-center gap-1.5 text-[10px] font-medium"
          >
            <motion.span
              initial={false}
              animate={{
                scale: req.met ? [1, 1.25, 1] : 1,
                rotate: req.met ? [0, 12, 0] : 0,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center transition-colors ${
                req.met
                  ? 'bg-emerald-500/15 border border-emerald-500/40'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}
            >
              {req.met ? (
                <Check
                  size={8}
                  className="text-emerald-400"
                  strokeWidth={3.5}
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={8}
                  className="text-gray-500"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              )}
            </motion.span>
            <span className="leading-tight">{req.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────
          Status footer
         ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isValid ? (
          <motion.div
            key="valid"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20"
          >
            <ShieldCheck
              size={11}
              className="text-emerald-400 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-[10px] font-medium text-emerald-300">
              Password meets all requirements
            </span>
          </motion.div>
        ) : metCount >= 3 ? (
          <motion.div
            key="almost"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/20"
          >
            <AlertCircle
              size={11}
              className="text-amber-400 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-[10px] font-medium text-amber-300">
              Almost there — just needs a bit more
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}