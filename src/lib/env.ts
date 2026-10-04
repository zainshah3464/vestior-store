/**
 * Environment variable validation.
 *
 * Import this module from `next.config.ts` or any server entry to force
 * validation on startup. Throws a clear error if anything is missing.
 */

const required = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
} as const

const missing: string[] = []

for (const [key, value] of Object.entries(required)) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    missing.push(key)
  }
}

if (missing.length > 0) {
  throw new Error(
    `❌ Missing required environment variables:\n` +
      missing.map((k) => `   • ${k}`).join('\n') +
      `\n\nCheck your .env.local file (see .env.example for reference).`
  )
}

// Basic URL sanity checks
try {
  new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
} catch {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_URL is not a valid URL')
}

try {
  new URL(process.env.UPSTASH_REDIS_REST_URL!)
} catch {
  throw new Error('❌ UPSTASH_REDIS_REST_URL is not a valid URL')
}

export const env = required