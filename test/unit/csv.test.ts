import { describe, it, expect } from 'vitest'
import { toCSV, withBOM, csvFilename } from '@/lib/exports/csv'

describe('toCSV', () => {
  it('returns empty string for empty rows', () => {
    expect(toCSV([])).toBe('')
  })

  it('produces a header and one data line for a single row', () => {
    const rows = [{ id: '1', name: 'Zain' }]
    const csv = toCSV(rows)
    const lines = csv.split('\r\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe('id,name')
    expect(lines[1]).toBe('1,Zain')
  })

  it('escapes values containing commas', () => {
    const rows = [{ name: 'Shah, Zain' }]
    const csv = toCSV(rows)
    expect(csv).toContain('"Shah, Zain"')
  })

  it('escapes values containing quotes', () => {
    const rows = [{ note: 'He said "hi"' }]
    const csv = toCSV(rows)
    expect(csv).toContain('"He said ""hi"""')
  })

  it('escapes values containing newlines', () => {
    const rows = [{ note: 'line1\nline2' }]
    const csv = toCSV(rows)
    expect(csv).toContain('"line1\nline2"')
  })

  it('handles null and undefined as empty strings', () => {
    const rows = [{ a: null, b: undefined }]
    const csv = toCSV(rows)
    expect(csv.split('\r\n')[1]).toBe(',')
  })

  it('serializes objects as JSON', () => {
    const rows = [{ meta: { a: 1 } }]
    const csv = toCSV(rows)
    expect(csv).toContain('"{""a"":1}"')
  })

  it('respects explicit columns list and order', () => {
    const rows = [{ a: 1, b: 2, c: 3 }]
    const csv = toCSV(rows, [
      { key: 'c', header: 'C' },
      { key: 'a', header: 'A' },
    ])
    const lines = csv.split('\r\n')
    expect(lines[0]).toBe('C,A')
    expect(lines[1]).toBe('3,1')
  })
})

describe('withBOM', () => {
  it('prepends a BOM character', () => {
    const result = withBOM('hello')
    expect(result.charCodeAt(0)).toBe(0xfeff)
    expect(result.slice(1)).toBe('hello')
  })
})

describe('csvFilename', () => {
  it('contains the prefix', () => {
    expect(csvFilename('orders')).toMatch(/^orders_/)
  })

  it('ends with the given extension', () => {
    expect(csvFilename('test', 'csv')).toMatch(/\.csv$/)
    expect(csvFilename('test', 'xlsx')).toMatch(/\.xlsx$/)
  })

  it('contains a date', () => {
    const name = csvFilename('x')
    expect(name).toMatch(/\d{4}-\d{2}-\d{2}/)
  })
})