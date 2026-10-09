import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'

// Auto cleanup
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// ─────────────────────────────────────────────────────────────
// Module mocks
// ─────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, ...rest } = props as Record<string, unknown>
    void fill
    void priority
    void sizes
    return React.createElement('img', rest)
  },
}))

// ─────────────────────────────────────────────────────────────
// Env variable stubs
// ─────────────────────────────────────────────────────────────
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key'
process.env.NEXT_PUBLIC_SITE_URL ||= 'http://localhost:3000'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||= 'pk_test_xxx'
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'test-service-role'
process.env.UPSTASH_REDIS_REST_URL ||= 'https://test.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN ||= 'test-token'
process.env.MONGODB_URI ||= 'mongodb://localhost:27017/test'
process.env.MONGODB_DB_NAME ||= 'vestior-test'
process.env.IP_HASH_SALT ||= 'a'.repeat(32)
process.env.CRON_SECRET ||= 'b'.repeat(32)
process.env.ADMIN_EMAIL ||= 'admin@test.com'
process.env.GMAIL_USER ||= 'test@gmail.com'
process.env.GMAIL_APP_PASSWORD ||= 'xxxx xxxx xxxx xxxx'
process.env.EMAIL_FROM ||= 'VESTIOR <test@gmail.com>'
process.env.QSTASH_URL ||= 'https://qstash.upstash.io'
process.env.QSTASH_TOKEN ||= 'test-qstash-token'
process.env.QSTASH_CURRENT_SIGNING_KEY ||= 'test-signing-current'
process.env.QSTASH_NEXT_SIGNING_KEY ||= 'test-signing-next'
process.env.STRIPE_SECRET_KEY ||= 'sk_test_xxx'