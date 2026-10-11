import 'server-only'
import { supabasePublic } from '@/lib/supabase/public'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { parseProductImages } from '@/lib/utils'

export interface RecommendedProduct {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  stock: number
  is_new_arrival: boolean
  category_main: string
}

const COLS =
  'id, name, price, compare_at_price, images, stock, is_new_arrival, category_main'

// ─────────────────────────────────────────────────────────────
// Related products — same category, similar price
// ─────────────────────────────────────────────────────────────
export async function getRelatedProducts(
  productId: string,
  category: string,
  price: number,
  limit = 8
): Promise<RecommendedProduct[]> {
  const minPrice = Math.round(price * 0.5)
  const maxPrice = Math.round(price * 1.5)

  // Fetch same category, price range
  const { data } = await supabasePublic
    .from('products')
    .select(COLS)
    .eq('is_active', true)
    .eq('category_main', category)
    .neq('id', productId)
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .order('created_at', { ascending: false })
    .limit(limit)

  let results = data ?? []

  // If not enough, fill with same-category products (any price)
  if (results.length < limit) {
    const { data: more } = await supabasePublic
      .from('products')
      .select(COLS)
      .eq('is_active', true)
      .eq('category_main', category)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit * 2)

    const existingIds = new Set(results.map((r) => r.id))
    for (const p of more ?? []) {
      if (results.length >= limit) break
      if (!existingIds.has(p.id)) {
        results.push(p)
        existingIds.add(p.id)
      }
    }
  }

  return results.slice(0, limit).map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))
}

// ─────────────────────────────────────────────────────────────
// "You may also like" — cross-category, similar price
// ─────────────────────────────────────────────────────────────
export async function getYouMayAlsoLike(
  productId: string,
  price: number,
  excludeCategory: string | null,
  limit = 8
): Promise<RecommendedProduct[]> {
  const minPrice = Math.round(price * 0.7)
  const maxPrice = Math.round(price * 1.3)

  let query = supabasePublic
    .from('products')
    .select(COLS)
    .eq('is_active', true)
    .neq('id', productId)
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .order('created_at', { ascending: false })
    .limit(limit * 2)

  if (excludeCategory) {
    query = query.neq('category_main', excludeCategory)
  }

  const { data } = await query

  const results = (data ?? []).slice(0, limit)

  return results.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))
}

// ─────────────────────────────────────────────────────────────
// Trending products (from tracking events)
// ─────────────────────────────────────────────────────────────
export async function getTrendingProducts(
  limit = 8,
  days = 7
): Promise<RecommendedProduct[]> {
  try {
    const db = await getDb()
    const since = new Date(Date.now() - days * 86400000)

    // Aggregate top-viewed products
    const pipeline = [
      {
        $match: {
          timestamp: { $gte: since },
          event_type: { $in: ['product_view', 'add_to_cart'] },
          'properties.productId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$properties.productId',
          score: {
            $sum: {
              $cond: [{ $eq: ['$event_type', 'add_to_cart'] }, 3, 1],
            },
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: limit },
    ]

    const rows = await db
      .collection(COLLECTIONS.EVENTS)
      .aggregate(pipeline)
      .toArray()

    if (rows.length === 0) {
      // Fallback: newest active products
      const { data } = await supabasePublic
        .from('products')
        .select(COLS)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      return (data ?? []).map((p) => ({
        ...p,
        images: parseProductImages(p.images),
      }))
    }

    const ids = rows.map((r) => String(r._id))

    const { data } = await supabasePublic
      .from('products')
      .select(COLS)
      .in('id', ids)
      .eq('is_active', true)

    // Preserve score order
    const map = new Map((data ?? []).map((p) => [p.id, p]))
    const ordered = ids
      .map((id) => map.get(id))
      .filter((p): p is NonNullable<typeof p> => !!p)

    return ordered.map((p) => ({
      ...p,
      images: parseProductImages(p.images),
    }))
  } catch (err) {
    console.error('[getTrendingProducts] failed:', err)
    return []
  }
}

// ─────────────────────────────────────────────────────────────
// Fetch products by IDs (for recently viewed)
// ─────────────────────────────────────────────────────────────
export async function getProductsByIds(
  ids: string[]
): Promise<RecommendedProduct[]> {
  if (ids.length === 0) return []

  const { data } = await supabasePublic
    .from('products')
    .select(COLS)
    .in('id', ids)
    .eq('is_active', true)

  const map = new Map((data ?? []).map((p) => [p.id, p]))
  const ordered = ids
    .map((id) => map.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  return ordered.map((p) => ({
    ...p,
    images: parseProductImages(p.images),
  }))
}