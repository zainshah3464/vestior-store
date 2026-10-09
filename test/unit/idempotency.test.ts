import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted solves the "Cannot access X before initialization" issue
const { mockRedis } = vi.hoisted(() => ({
  mockRedis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}))

vi.mock('@/lib/redis', () => ({
  redis: mockRedis,
  redisKeys: {
    idempotency: (scope: string, key: string) => `idem:${scope}:${key}`,
    idempotencyResult: (scope: string, key: string) =>
      `idem:result:${scope}:${key}`,
  },
}))

import { withIdempotency, wasProcessed } from '@/lib/idempotency'

describe('withIdempotency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('executes fn and returns result when lock is acquired', async () => {
    mockRedis.set.mockResolvedValueOnce('OK')
    mockRedis.set.mockResolvedValueOnce('OK')
    mockRedis.get.mockResolvedValueOnce('some-uuid')

    const fn = vi.fn().mockResolvedValue({ data: 'result' })
    const result = await withIdempotency({ scope: 'test', key: 'abc' }, fn)

    expect(fn).toHaveBeenCalledOnce()
    expect(result).toEqual({ data: 'result' })
  })

  it('returns cached result if lock was already taken and result exists', async () => {
    mockRedis.set.mockResolvedValueOnce(null)
    mockRedis.get.mockResolvedValueOnce({ cached: true })

    const fn = vi.fn()
    const result = await withIdempotency({ scope: 'test', key: 'abc' }, fn)

    expect(fn).not.toHaveBeenCalled()
    expect(result).toEqual({ cached: true })
  })

  it('throws if lock is taken and no cached result exists', async () => {
    mockRedis.set.mockResolvedValueOnce(null)
    mockRedis.get.mockResolvedValueOnce(null)

    const fn = vi.fn()

    await expect(
      withIdempotency({ scope: 'test', key: 'abc' }, fn)
    ).rejects.toThrow(/already in progress or processed/)
  })
})

describe('wasProcessed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when result exists', async () => {
    mockRedis.get.mockResolvedValueOnce({ done: true })
    const result = await wasProcessed('test', 'key1')
    expect(result).toBe(true)
  })

  it('returns false when no result exists', async () => {
    mockRedis.get.mockResolvedValueOnce(null)
    const result = await wasProcessed('test', 'key1')
    expect(result).toBe(false)
  })
})