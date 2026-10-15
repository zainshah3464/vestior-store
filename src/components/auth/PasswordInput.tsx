'use client'

import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
  autoComplete?: string
  required?: boolean
  disabled?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput(
    {
      value,
      onChange,
      placeholder = '••••••••',
      name = 'password',
      autoComplete = 'current-password',
      required,
      disabled,
    },
    ref
  ) {
    const [show, setShow] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className="w-full px-3.5 py-3 pr-11 bg-black/50 border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] disabled:opacity-50 transition-all duration-200"
        />

        <motion.button
          type="button"
          onClick={() => setShow((v) => !v)}
          whileTap={{ scale: 0.9 }}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.05] transition-all duration-200"
        >
          <motion.span
            key={show ? 'off' : 'on'}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="inline-flex"
          >
            {show ? (
              <EyeOff size={14} aria-hidden="true" />
            ) : (
              <Eye size={14} aria-hidden="true" />
            )}
          </motion.span>
        </motion.button>
      </div>
    )
  }
)

export default PasswordInput