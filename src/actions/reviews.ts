'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────
const submitReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional().or(z.literal('')),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(2000),
})

// ─────────────────────────────────────────────────────────────
// Submit review (customer)
// ─────────────────────────────────────────────────────────────
export async function submitReview(input: {
  productId: string
  rating: number
  title?: string
  comment: string
}) {
  const parsed = submitReviewSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid review')
  }

  // 1. Authenticate
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be logged in to review')

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const userName =
    profile?.full_name || user.email?.split('@')[0] || 'Anonymous'
  const userEmail = profile?.email || user.email || ''

  // 3. Check if user has ordered this product (verified purchase)
  const { data: orderItems } = await supabaseAdmin
    .from('order_items')
    .select('order_id, orders!inner(user_id, status)')
    .eq('product_id', parsed.data.productId)
    .eq('orders.user_id', user.id)
    .in('orders.status', ['delivered', 'shipped', 'processing'])
    .limit(1)

  const isVerifiedPurchase = (orderItems?.length ?? 0) > 0

  // 4. Check for existing review
  const { data: existing } = await supabaseAdmin
    .from('product_reviews')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('product_id', parsed.data.productId)
    .maybeSingle()

  // 5. Upsert
  const payload = {
    product_id: parsed.data.productId,
    user_id: user.id,
    user_name: userName,
    user_email: userEmail,
    rating: parsed.data.rating,
    title: parsed.data.title?.trim() || null,
    comment: parsed.data.comment.trim(),
    status: 'pending' as const, // reset to pending on every submit/edit
    is_verified_purchase: isVerifiedPurchase,
  }

  let error
  if (existing) {
    const res = await supabaseAdmin
      .from('product_reviews')
      .update(payload)
      .eq('id', existing.id)
    error = res.error
  } else {
    const res = await supabaseAdmin.from('product_reviews').insert(payload)
    error = res.error
  }

  if (error) throw new Error(error.message)

  revalidatePath(`/products/${parsed.data.productId}`)
  revalidatePath('/admin/reviews')

  return { success: true, isVerifiedPurchase }
}

// ─────────────────────────────────────────────────────────────
// Admin: approve / reject / delete
// ─────────────────────────────────────────────────────────────
export async function updateReviewStatus(
  reviewId: string,
  status: 'approved' | 'rejected'
) {
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status')
  }

  // Auth
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  // Fetch review for revalidation
  const { data: review } = await supabaseAdmin
    .from('product_reviews')
    .select('product_id, status')
    .eq('id', reviewId)
    .single()

  if (!review) throw new Error('Review not found')

  // Update
  const { error } = await supabaseAdmin
    .from('product_reviews')
    .update({ status })
    .eq('id', reviewId)

  if (error) throw new Error(error.message)

  // Audit
  await logAudit({
    actorId: user.id,
    actorEmail: profile.email || user.email || '',
    action: `review.${status}`,
    targetType: 'review',
    targetId: reviewId,
    before: { status: review.status },
    after: { status },
  })

  revalidatePath('/admin/reviews')
  revalidatePath(`/products/${review.product_id}`)

  return { success: true }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const { data: review } = await supabaseAdmin
    .from('product_reviews')
    .select('product_id')
    .eq('id', reviewId)
    .single()

  const { error } = await supabaseAdmin
    .from('product_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw new Error(error.message)

  await logAudit({
    actorId: user.id,
    actorEmail: profile.email || user.email || '',
    action: 'review.delete',
    targetType: 'review',
    targetId: reviewId,
  })

  revalidatePath('/admin/reviews')
  if (review) revalidatePath(`/products/${review.product_id}`)

  return { success: true }
}