import 'server-only'

/**
 * Minimal CSV builder — no external dependencies.
 * Handles quotes, newlines, commas.
 *
 * Uses `T extends object` (not `Record<string, unknown>`) so plain
 * interfaces without index signatures are accepted. Values are looked
 * up via `keyof T` at runtime.
 */
export function toCSV<T extends object>(
  rows: T[],
  columns?: Array<{ key: keyof T; header: string }>
): string {
  if (rows.length === 0) return ''

  const firstRow = rows[0] as Record<string, unknown>
  const cols =
    columns ??
    (Object.keys(firstRow) as Array<keyof T>).map((k) => ({
      key: k,
      header: String(k),
    }))

  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    const str =
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    if (
      str.includes(',') ||
      str.includes('"') ||
      str.includes('\n') ||
      str.includes('\r')
    ) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const headerLine = cols.map((c) => escape(c.header)).join(',')
  const dataLines = rows.map((row) => {
    const obj = row as Record<string, unknown>
    return cols.map((c) => escape(obj[c.key as string])).join(',')
  })

  return [headerLine, ...dataLines].join('\r\n')
}

/**
 * BOM prefix makes Excel open CSV as UTF-8 (fixes ₹ symbols).
 */
export function withBOM(csv: string): string {
  return '\uFEFF' + csv
}

/**
 * Build a filename for a CSV download.
 */
export function csvFilename(prefix: string, ext = 'csv'): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toISOString().slice(11, 19).replace(/:/g, '-')
  return `${prefix}_${date}_${time}.${ext}`
}