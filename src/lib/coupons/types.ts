export type DiscountType = 'percent' | 'fixed'

export interface Coupon {
  id: string
  code: string
  description: string | null
  discountType: DiscountType
  discountValue: number
  minOrderAmount: number
  maxDiscountAmount: number | null
  usageLimit: number | null
  perUserLimit: number
  timesUsed: number
  validFrom: string
  validUntil: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CouponValidation {
  valid: boolean
  couponId?: string
  code?: string
  description?: string | null
  discountType?: DiscountType
  discountValue?: number
  discountAmount?: number
  message?: string
  error?: string
}

export interface AppliedCoupon {
  code: string
  discountAmount: number
  description: string | null
}