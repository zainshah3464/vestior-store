/**
 * Password strength validation.
 *
 * Rules:
 *   • Min 8 characters
 *   • At least 1 lowercase
 *   • At least 1 uppercase
 *   • At least 1 number
 *   • (Bonus) 1 special character increases score
 */

export interface PasswordChecks {
  length: boolean
  lowercase: boolean
  uppercase: boolean
  number: boolean
  special: boolean
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: string
  checks: PasswordChecks
  isValid: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const checks: PasswordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password),
  }

  const passedCount = Object.values(checks).filter(Boolean).length

  let score: PasswordStrength['score'] = 0
  if (password.length === 0) score = 0
  else if (passedCount >= 5) score = 4
  else if (passedCount >= 4) score = 3
  else if (passedCount >= 3) score = 2
  else if (passedCount >= 2) score = 1

  const meta: Record<
    PasswordStrength['score'],
    { label: PasswordStrength['label']; color: string }
  > = {
    0: { label: 'Very Weak', color: 'bg-gray-600' },
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Fair', color: 'bg-amber-500' },
    3: { label: 'Strong', color: 'bg-emerald-500' },
    4: { label: 'Very Strong', color: 'bg-emerald-400' },
  }

  // Must pass: length + lowercase + uppercase + number
  const isValid =
    checks.length && checks.lowercase && checks.uppercase && checks.number

  return {
    score,
    label: meta[score].label,
    color: meta[score].color,
    checks,
    isValid,
  }
}

/**
 * Human-readable list of what's missing (for error messages).
 */
export function getPasswordErrors(password: string): string[] {
  const { checks } = checkPasswordStrength(password)
  const errors: string[] = []

  if (!checks.length) errors.push('At least 8 characters')
  if (!checks.lowercase) errors.push('At least one lowercase letter')
  if (!checks.uppercase) errors.push('At least one uppercase letter')
  if (!checks.number) errors.push('At least one number')

  return errors
}