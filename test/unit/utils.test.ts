import { describe, it, expect } from 'vitest'
import { parseProductImages } from '@/lib/utils'

describe('parseProductImages', () => {
  it('returns an empty array for null/undefined', () => {
    expect(parseProductImages(null)).toEqual([])
    expect(parseProductImages(undefined)).toEqual([])
  })

  it('returns the same array if already an array', () => {
    const arr = ['a.jpg', 'b.jpg']
    expect(parseProductImages(arr)).toEqual(arr)
  })

  it('parses JSON array string', () => {
    expect(parseProductImages('["a.jpg","b.jpg"]')).toEqual(['a.jpg', 'b.jpg'])
  })

  it('parses PostgreSQL array literal {url1,url2}', () => {
    expect(parseProductImages('{a.jpg,b.jpg}')).toEqual(['a.jpg', 'b.jpg'])
  })

  it('parses PostgreSQL array with quotes', () => {
    expect(parseProductImages('{"a.jpg","b.jpg"}')).toEqual(['a.jpg', 'b.jpg'])
  })

  it('handles single URL as string', () => {
    expect(parseProductImages('single.jpg')).toEqual(['single.jpg'])
  })

  it('handles empty string', () => {
    expect(parseProductImages('')).toEqual([])
  })

  it('handles "null" string', () => {
    expect(parseProductImages('null')).toEqual([])
  })

  it('handles whitespace', () => {
    expect(parseProductImages('  single.jpg  ')).toEqual(['single.jpg'])
  })

  it('returns empty array for unsupported types', () => {
    expect(parseProductImages(123)).toEqual([])
    expect(parseProductImages({})).toEqual([])
  })

  it('wraps non-array JSON in array', () => {
    expect(parseProductImages('"single.jpg"')).toEqual(['single.jpg'])
  })
})