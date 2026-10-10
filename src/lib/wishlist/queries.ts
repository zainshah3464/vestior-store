import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { parseProductImages } from '@/lib/utils'

export interface WishlistProduct {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: string[]
  stock: number
  is_new_arrival: boolean
  addedAt: string
}

/**
 * Shape of the joined `products` object returned by Supabase.
 * Supabase types this as an array by default (no generated types),
 * but at runtime a FK join to a single row returns a single object.
 */
interface JoinedProduct {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  images: unknown
  stock: number
  is_new_arrival: boolean
  is_active?: boolean
}

/**
 * Fetch all wishlist products for the current user.
 */
export async function getWishlistProducts(): Promise<WishlistProduct[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('wishlists')
    .select(
      'created_at, products:product_id (id, name, price, compare_at_price, images, stock, is_new_arrival, is_active)'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data
    .filter((row) => {
      // Cast through unknown because Supabase's inferred type is an array
      const p = row.products as unknown as JoinedProduct | null
      return p?.is_active !== false
    })
    .map((row) => {
      const p = row.products as unknown as JoinedProduct
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        compare_at_price: p.compare_at_price,
        images: parseProductImages(p.images),
        stock: p.stock,
        is_new_arrival: p.is_new_arrival,
        addedAt: row.created_at as string,
      }
    })
}

/**
 * Fetch wishlist product IDs (for client-side "in wishlist" checks).
 */
export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)

  return (data ?? []).map((r) => r.product_id as string)
}