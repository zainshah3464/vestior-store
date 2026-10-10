import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { supabasePublic } from '@/lib/supabase/public'
import type { ProductReview, ReviewStats } from './types'

// ─────────────────────────────────────────────────────────────
// Approved reviews for a product (public)
// ─────────────────────────────────────────────────────────────
export async function getApprovedReviews(productId: string): Promise<ProductReview[]> {
  const { data, error } = await supabasePublic
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('is_verified_purchase', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(mapRow)
}

// ─────────────────────────────────────────────────────────────
// Review stats for a single product
// ─────────────────────────────────────────────────────────────
export async function getReviewStats(productId: string): Promise<ReviewStats> {
  const { data } = await supabasePublic.rpc('get_product_review_stats', {
    p_product_id: productId,
  })

  if (!data) {
    return { averageRating: 0, totalCount: 0, breakdown: {} }
  }

  return {
    averageRating: Number(data.average_rating ?? 0),
    totalCount: Number(data.total_count ?? 0),
    breakdown: data.breakdown ?? {},
  }
}

// ─────────────────────────────────────────────────────────────
// Batch stats for many products (product listing pages)
// ─────────────────────────────────────────────────────────────
export interface ProductRatingSummary {
  averageRating: number
  totalCount: number
}

export async function getBatchRatingSummaries(
  productIds: string[]
): Promise<Record<string, ProductRatingSummary>> {
  if (productIds.length === 0) return {}

  const { data } = await supabasePublic.rpc('get_products_review_stats', {
    p_product_ids: productIds,
  })

  const map: Record<string, ProductRatingSummary> = {}
  if (data) {
    for (const [id, stats] of Object.entries(data as Record<string, { average_rating: number; total_count: number }>)) {
      map[id] = {
        averageRating: Number(stats.average_rating ?? 0),
        totalCount: Number(stats.total_count ?? 0),
      }
    }
  }
  return map
}

// ─────────────────────────────────────────────────────────────
// User's own review for a product
// ─────────────────────────────────────────────────────────────
export async function getUserReview(
  userId: string,
  productId: string
): Promise<ProductReview | null> {
  const { data, error } = await supabaseAdmin
    .from('product_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (error || !data) return null
  return mapRow(data)
}

// ─────────────────────────────────────────────────────────────
// Admin: list all reviews with filters
// ─────────────────────────────────────────────────────────────
export interface AdminReviewsFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all'
  search?: string
  page?: number
  perPage?: number
}

export async function getAdminReviews(filters: AdminReviewsFilters = {}) {
  const page = Math.max(1, filters.page ?? 1)
  const perPage = Math.min(100, Math.max(10, filters.perPage ?? 20))
  const offset = (page - 1) * perPage

  let query = supabaseAdmin
    .from('product_reviews')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    const term = `%${filters.search}%`
    query = query.or(
      `user_name.ilike.${term},user_email.ilike.${term},comment.ilike.${term}`
    )
  }

  const { data, count, error } = await query

  if (error || !data) {
    return { rows: [], total: 0, page, perPage, totalPages: 0 }
  }

  return {
    rows: data.map(mapRow),
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  }
}

// ─────────────────────────────────────────────────────────────
// Admin stats
// ─────────────────────────────────────────────────────────────
export interface ReviewAdminStats {
  total: number
  pending: number
  approved: number
  rejected: number
  averageRating: number
}

export async function getReviewAdminStats(): Promise<ReviewAdminStats> {
  const [total, pending, approved, rejected] = await Promise.all([
    supabaseAdmin
      .from('product_reviews')
      .select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('product_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabaseAdmin
      .from('product_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabaseAdmin
      .from('product_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'rejected'),
  ])

  // Average rating (all approved)
  const { data: avgData } = await supabaseAdmin
    .from('product_reviews')
    .select('rating')
    .eq('status', 'approved')

  const avg =
    avgData && avgData.length > 0
      ? avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
      : 0

  return {
    total: total.count ?? 0,
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
    averageRating: avg,
  }
}

// ─────────────────────────────────────────────────────────────
// Row mapper
// ─────────────────────────────────────────────────────────────
function mapRow(row: Record<string, unknown>): ProductReview {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    userEmail: row.user_email as string,
    rating: row.rating as number,
    title: (row.title as string | null) ?? null,
    comment: row.comment as string,
    status: row.status as ProductReview['status'],
    isVerifiedPurchase: Boolean(row.is_verified_purchase),
    helpfulCount: (row.helpful_count as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}