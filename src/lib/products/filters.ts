export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popular'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sort?: SortOption
}

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

// ─────────────────────────────────────────────────────────────
// Parse filters from URL search params
// ─────────────────────────────────────────────────────────────
export function parseFilters(
  sp: Record<string, string | string[] | undefined>
): ProductFilters {
  const pick = (key: string): string | undefined => {
    const v = sp[key]
    if (Array.isArray(v)) return v[0]
    return v
  }

  const filters: ProductFilters = {}

  const category = pick('category')
  if (category && category !== 'all') filters.category = category

  const minPrice = pick('minPrice')
  if (minPrice) {
    const n = parseInt(minPrice, 10)
    if (!isNaN(n) && n >= 0) filters.minPrice = n
  }

  const maxPrice = pick('maxPrice')
  if (maxPrice) {
    const n = parseInt(maxPrice, 10)
    if (!isNaN(n) && n > 0) filters.maxPrice = n
  }

  if (pick('inStock') === '1') filters.inStockOnly = true

  const sort = pick('sort') as SortOption | undefined
  if (sort && SORT_OPTIONS.some((s) => s.value === sort)) filters.sort = sort

  return filters
}

// ─────────────────────────────────────────────────────────────
// Build URL with new filters
// ─────────────────────────────────────────────────────────────
export function buildFilterUrl(
  basePath: string,
  current: Record<string, string | string[] | undefined>,
  updates: Partial<Record<string, string | number | boolean | undefined>>
): string {
  const params = new URLSearchParams()

  // Preserve existing valid params
  for (const [key, value] of Object.entries(current)) {
    if (typeof value === 'string') params.set(key, value)
  }

  // Apply updates
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === '' || value === false) {
      params.delete(key)
    } else if (value === true) {
      params.set(key, '1')
    } else {
      params.set(key, String(value))
    }
  }

  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

// ─────────────────────────────────────────────────────────────
// Count active filters (for badge on mobile button)
// ─────────────────────────────────────────────────────────────
export function countActiveFilters(filters: ProductFilters): number {
  let count = 0
  if (filters.category) count++
  if (filters.minPrice !== undefined) count++
  if (filters.maxPrice !== undefined) count++
  if (filters.inStockOnly) count++
  if (filters.sort && filters.sort !== 'newest') count++
  return count
}