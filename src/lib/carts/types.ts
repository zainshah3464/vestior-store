export interface CartSnapshot {
  userId: string
  userEmail: string
  userName: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string | null
    size?: string | null
  }>
  subtotal: number
  itemCount: number
  recoveryToken: string
  recoveryEmailSentAt: string | null
  recoveryEmailCount: number
  lastReminderAt: string | null
  recoveredAt: string | null
  recoveredOrderId: string | null
  // Coupon we offered in the reminder (only set when email sent)
  offeredCouponCode: string | null
  createdAt: string
  updatedAt: string
}