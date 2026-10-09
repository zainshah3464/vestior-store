/**
 * Environment variable validation with Zod.
 *
 * Import this module from any server entry to force validation on
 * startup. Throws a clear, aggregated error if anything is missing
 * or malformed — instead of failing silently at runtime.
 *
 * ─── Usage ────────────────────────────────────────────────────
 *   import { env } from '@/lib/env'
 *   const db = await MongoClient.connect(env.MONGODB_URI)
 * ─────────────────────────────────────────────────────────────
 */

import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// Server-only variables (never exposed to browser)
// ─────────────────────────────────────────────────────────────
const serverSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // MongoDB
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required')
    .refine((v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'), {
      message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://',
    }),
  MONGODB_DB_NAME: z.string().min(1).default('vestior'),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),

  // Security
  IP_HASH_SALT: z
    .string()
    .min(16, 'IP_HASH_SALT must be at least 16 characters (recommend 64)'),
  CRON_SECRET: z
    .string()
    .min(16, 'CRON_SECRET must be at least 16 characters (recommend 64)'),

  // Admin
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),

  // ── Email (Gmail SMTP) ─────────────────────────────────────
  GMAIL_USER: z.string().email('GMAIL_USER must be a valid email'),
  GMAIL_APP_PASSWORD: z
    .string()
    .min(16, 'GMAIL_APP_PASSWORD must be 16 characters'),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),

  // ── QStash (production queue) ──────────────────────────────
  QSTASH_URL: z.string().url('QSTASH_URL must be a valid URL'),
  QSTASH_TOKEN: z.string().min(1, 'QSTASH_TOKEN is required'),
  QSTASH_CURRENT_SIGNING_KEY: z
    .string()
    .min(1, 'QSTASH_CURRENT_SIGNING_KEY is required'),
  QSTASH_NEXT_SIGNING_KEY: z
    .string()
    .min(1, 'QSTASH_NEXT_SIGNING_KEY is required'),

  // ── Resend (optional — disabled for now) ───────────────────
  RESEND_API_KEY: z.string().optional(),

  // ── Payments (Phase 4+) ────────────────────────────────────
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_SANDBOX: z.string().optional(),

  // ── Media (Phase 5+) ───────────────────────────────────────
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // ── Monitoring (Phase 6+) ──────────────────────────────────
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
})

// ─────────────────────────────────────────────────────────────
// Client-exposed variables (NEXT_PUBLIC_ prefix)
// ─────────────────────────────────────────────────────────────
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD: z.string().optional(),
})

// ─────────────────────────────────────────────────────────────
// Validate (fails fast on module import)
// ─────────────────────────────────────────────────────────────
function validateEnv() {
  const serverResult = serverSchema.safeParse(process.env)
  const clientResult = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_CLOUDINARY_CLOUD: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  })

  if (!serverResult.success || !clientResult.success) {
    const errors: string[] = []

    if (!serverResult.success) {
      for (const issue of serverResult.error.issues) {
        errors.push(`  • ${issue.path.join('.')}: ${issue.message}`)
      }
    }
    if (!clientResult.success) {
      for (const issue of clientResult.error.issues) {
        errors.push(`  • ${issue.path.join('.')}: ${issue.message}`)
      }
    }

    throw new Error(
      `❌ Environment variable validation failed:\n${errors.join('\n')}\n\n` +
        `Check your .env.local file (see .env.example for reference).`
    )
  }

  return {
    ...serverResult.data,
    ...clientResult.data,
  }
}

export const env = validateEnv()

// Type-safe env object — hover over any key for autocomplete
export type Env = typeof env