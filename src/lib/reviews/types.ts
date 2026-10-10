export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string | null
  comment: string
  status: ReviewStatus
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  averageRating: number
  totalCount: number
  breakdown: Record<string, number> // '1'..'5' → count
}

export interface ReviewCardData {
  id: string
  userName: string
  rating: number
  title: string | null
  comment: string
  isVerifiedPurchase: boolean
  createdAt: string
}