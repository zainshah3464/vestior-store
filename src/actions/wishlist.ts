'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// ─────────────────────────────────────────────────────────────
// Toggle wishlist for a product (add if missing, remove if present)
// ─────────────────────────────────────────────────────────────
export async function toggleWishlist(
  productId: string
): Promise<{ inWishlist: boolean }> {
  if (!productId) throw new Error('Missing productId')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be logged in')

  // Check if already in wishlist
  const { data: existing } = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    // Remove
    const { error } = await supabaseAdmin
      .from('wishlists')
      .delete()
      .eq('id', existing.id)
    if (error) throw new Error(error.message)

    revalidatePath('/wishlist')
    return { inWishlist: false }
  }

  // Add
  const { error } = await supabaseAdmin
    .from('wishlists')
    .insert({ user_id: user.id, product_id: productId })
  if (error) throw new Error(error.message)

  revalidatePath('/wishlist')
  return { inWishlist: true }
}

// ─────────────────────────────────────────────────────────────
// Merge guest wishlist (localStorage) into DB after login
// ─────────────────────────────────────────────────────────────
export async function mergeWishlist(
  productIds: string[]
): Promise<{ count: number }> {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return { count: 0 }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { count: 0 }

  // Cap to 200 to prevent abuse
  const ids = productIds.slice(0, 200)

  const rows = ids.map((productId) => ({
    user_id: user.id,
    product_id: productId,
  }))

  // upsert with ON CONFLICT DO NOTHING via .upsert + ignoreDuplicates
  const { error } = await supabaseAdmin
    .from('wishlists')
    .upsert(rows, {
      onConflict: 'user_id,product_id',
      ignoreDuplicates: true,
    })

  if (error) throw new Error(error.message)

  revalidatePath('/wishlist')
  return { count: ids.length }
}