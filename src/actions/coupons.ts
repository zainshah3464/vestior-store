'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { z } from 'zod'
import type { CouponValidation } from '@/lib/coupons/types'

// ─────────────────────────────────────────────────────────────
// Validate a coupon code at checkout (customer-side, read-only)
// ─────────────────────────────────────────────────────────────
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Please enter a coupon code' }
  }
  if (subtotal <= 0) {
    return { valid: false, error: 'Invalid cart total' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { valid: false, error: 'Please sign in to use coupons' }
  }

  const { data, error } = await supabaseAdmin.rpc('validate_coupon', {
    p_code: code.trim().toUpperCase(),
    p_user_id: user.id,
    p_subtotal: subtotal,
  })

  if (error) {
    console.error('[validateCoupon] rpc error:', error)
    return { valid: false, error: 'Failed to validate coupon' }
  }

  const result = data as {
    valid: boolean
    coupon_id?: string
    code?: string
    description?: string | null
    discount_type?: 'percent' | 'fixed'
    discount_value?: number
    discount_amount?: number
    message?: string
    error?: string
  }

  if (!result.valid) {
    return { valid: false, error: result.error || 'Invalid coupon' }
  }

  return {
    valid: true,
    couponId: result.coupon_id,
    code: result.code,
    description: result.description ?? null,
    discountType: result.discount_type,
    discountValue: result.discount_value,
    discountAmount: result.discount_amount,
    message: result.message,
  }
}

// ─────────────────────────────────────────────────────────────
// Admin: create coupon
// ─────────────────────────────────────────────────────────────
const couponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, _ and - allowed'),
  description: z.string().max(200).optional().or(z.literal('')),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number().positive(),
  min_order_amount: z.number().min(0).default(0),
  max_discount_amount: z.number().positive().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  per_user_limit: z.number().int().positive().default(1),
  valid_until: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
})

export type CreateCouponInput = z.input<typeof couponSchema>

async function ensureAdmin() {
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
  return { userId: user.id, email: profile.email || user.email || '' }
}

export async function createCoupon(input: CreateCouponInput) {
  const parsed = couponSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid coupon')
  }

  const { userId, email } = await ensureAdmin()

  // Percent sanity
  if (parsed.data.discount_type === 'percent' && parsed.data.discount_value > 100) {
    throw new Error('Percent discount cannot exceed 100')
  }

  const { error, data } = await supabaseAdmin
    .from('coupons')
    .insert({
      code: parsed.data.code.toUpperCase().trim(),
      description: parsed.data.description?.trim() || null,
      discount_type: parsed.data.discount_type,
      discount_value: parsed.data.discount_value,
      min_order_amount: parsed.data.min_order_amount,
      max_discount_amount: parsed.data.max_discount_amount ?? null,
      usage_limit: parsed.data.usage_limit ?? null,
      per_user_limit: parsed.data.per_user_limit,
      valid_until: parsed.data.valid_until || null,
      is_active: parsed.data.is_active,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    actorId: userId,
    actorEmail: email,
    action: 'coupon.create',
    targetType: 'coupon',
    targetId: data.id,
    after: { code: parsed.data.code },
  })

  revalidatePath('/admin/coupons')
  return { success: true, id: data.id }
}

export async function updateCoupon(
  id: string,
  input: Partial<CreateCouponInput>
) {
  const { userId, email } = await ensureAdmin()

  const updates: Record<string, unknown> = {}

  if (input.code) updates.code = input.code.toUpperCase().trim()
  if (input.description !== undefined)
    updates.description = input.description?.trim() || null
  if (input.discount_type) updates.discount_type = input.discount_type
  if (input.discount_value !== undefined)
    updates.discount_value = input.discount_value
  if (input.min_order_amount !== undefined)
    updates.min_order_amount = input.min_order_amount
  if (input.max_discount_amount !== undefined)
    updates.max_discount_amount = input.max_discount_amount
  if (input.usage_limit !== undefined) updates.usage_limit = input.usage_limit
  if (input.per_user_limit !== undefined)
    updates.per_user_limit = input.per_user_limit
  if (input.valid_until !== undefined)
    updates.valid_until = input.valid_until || null
  if (input.is_active !== undefined) updates.is_active = input.is_active

  const { error } = await supabaseAdmin
    .from('coupons')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)

  await logAudit({
    actorId: userId,
    actorEmail: email,
    action: 'coupon.update',
    targetType: 'coupon',
    targetId: id,
    metadata: updates,
  })

  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const { userId, email } = await ensureAdmin()

  const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await logAudit({
    actorId: userId,
    actorEmail: email,
    action: 'coupon.delete',
    targetType: 'coupon',
    targetId: id,
  })

  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  return updateCoupon(id, { is_active: isActive })
}