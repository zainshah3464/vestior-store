import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Coupon, DiscountType } from './types'

// ─────────────────────────────────────────────────────────────
// Admin: list all coupons
// ─────────────────────────────────────────────────────────────
export async function getAllCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapCoupon)
}

// ─────────────────────────────────────────────────────────────
// Admin: single coupon by ID
// ─────────────────────────────────────────────────────────────
export async function getCouponById(id: string): Promise<Coupon | null> {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapCoupon(data)
}

// ─────────────────────────────────────────────────────────────
// Stats for admin dashboard
// ─────────────────────────────────────────────────────────────
export interface CouponStats {
  total: number
  active: number
  expired: number
  totalRedemptions: number
  totalDiscountGiven: number
}

export async function getCouponStats(): Promise<CouponStats> {
  const [coupons, redemptions] = await Promise.all([
    supabaseAdmin.from('coupons').select('id, is_active, valid_until'),
    supabaseAdmin
      .from('coupon_redemptions')
      .select('discount_amount'),
  ])

  const all = coupons.data ?? []
  const now = new Date()

  const active = all.filter(
    (c) =>
      c.is_active &&
      (!c.valid_until || new Date(c.valid_until) > now)
  ).length

  const expired = all.filter(
    (c) => c.valid_until && new Date(c.valid_until) <= now
  ).length

  const reds = redemptions.data ?? []
  const totalDiscountGiven = reds.reduce(
    (sum, r) => sum + Number(r.discount_amount || 0),
    0
  )

  return {
    total: all.length,
    active,
    expired,
    totalRedemptions: reds.length,
    totalDiscountGiven,
  }
}

// ─────────────────────────────────────────────────────────────
// Mapper
// ─────────────────────────────────────────────────────────────
function mapCoupon(row: Record<string, unknown>): Coupon {
  return {
    id: row.id as string,
    code: row.code as string,
    description: (row.description as string | null) ?? null,
    discountType: row.discount_type as DiscountType,
    discountValue: Number(row.discount_value),
    minOrderAmount: Number(row.min_order_amount ?? 0),
    maxDiscountAmount:
      row.max_discount_amount === null || row.max_discount_amount === undefined
        ? null
        : Number(row.max_discount_amount),
    usageLimit:
      row.usage_limit === null || row.usage_limit === undefined
        ? null
        : Number(row.usage_limit),
    perUserLimit: Number(row.per_user_limit ?? 1),
    timesUsed: Number(row.times_used ?? 0),
    validFrom: row.valid_from as string,
    validUntil: (row.valid_until as string | null) ?? null,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}