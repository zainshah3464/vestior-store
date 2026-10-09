import { describe, it, expect, vi } from 'vitest'

vi.mock('@upstash/ratelimit', () => {
  const MockRatelimit = {
    slidingWindow: vi.fn().mockReturnValue({}),
  }
  return {
    Ratelimit: class {
      static slidingWindow = MockRatelimit.slidingWindow
      limit = vi.fn().mockResolvedValue({ success: true })
    },
  }
})

vi.mock('@/lib/redis', () => ({
  redis: {},
}))

import { getLimiterForPath, getClientKey } from '@/lib/ratelimit'

describe('getLimiterForPath', () => {
  it('returns auth limiter for /auth paths', () => {
    const { name } = getLimiterForPath('/auth/login')
    expect(name).toBe('auth')
  })

  it('returns admin limiter for /admin paths', () => {
    const { name } = getLimiterForPath('/admin/orders')
    expect(name).toBe('admin')
  })

  it('returns orders limiter for /checkout', () => {
    const { name } = getLimiterForPath('/checkout')
    expect(name).toBe('orders')
  })

  it('returns track limiter for /api/track', () => {
    const { name } = getLimiterForPath('/api/track')
    expect(name).toBe('track')
  })

  it('returns general limiter for other paths', () => {
    const { name } = getLimiterForPath('/products')
    expect(name).toBe('general')
  })
})

describe('getClientKey', () => {
  // Note: getClientKey prefixes the returned key with "ip:" to avoid
  // Redis collisions with other rate limiter keys. The exact prefix is
  // an implementation detail, so we assert on the shape.
  it('contains the IP when provided', () => {
    expect(getClientKey('1.2.3.4')).toContain('1.2.3.4')
  })

  it('contains "unknown" when IP is null', () => {
    expect(getClientKey(null)).toContain('unknown')
  })

  it('contains "unknown" when IP is empty string', () => {
    expect(getClientKey('')).toContain('unknown')
  })

  it('returns different keys for different IPs', () => {
    expect(getClientKey('1.2.3.4')).not.toBe(getClientKey('5.6.7.8'))
  })

  it('is deterministic for the same IP', () => {
    expect(getClientKey('9.9.9.9')).toBe(getClientKey('9.9.9.9'))
  })
})