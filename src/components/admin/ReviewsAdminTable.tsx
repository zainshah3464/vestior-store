'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Check, X, Trash2, Loader2, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import StarRating from '@/components/reviews/StarRating'
import { updateReviewStatus, deleteReview } from '@/actions/reviews'
import type { ProductReview } from '@/lib/reviews/types'

interface Props {
  rows: ProductReview[]
  total: number
  page: number
  totalPages: number
  initialFilters: { status: string; search: string }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
}

const TABS = ['pending', 'approved', 'rejected', 'all']

export default function ReviewsAdminTable({
  rows,
  total,
  page,
  totalPages,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialFilters.search)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('q', search)
      else params.delete('q')
      params.set('page', '1')
      router.replace(`/admin/reviews?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || !value) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    router.replace(`/admin/reviews?${params.toString()}`)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`/admin/reviews?${params.toString()}`)
  }

  const handleApprove = async (id: string) => {
    setBusy(id)
    try {
      await updateReviewStatus(id, 'approved')
      toast.success('Review approved')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleReject = async (id: string) => {
    setBusy(id)
    try {
      await updateReviewStatus(id, 'rejected')
      toast.success('Review rejected')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return
    setBusy(id)
    try {
      await deleteReview(id)
      toast.success('Review deleted')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => updateFilter('status', tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              initialFilters.status === tab
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-16 text-center">
          <p className="text-gray-400">No reviews match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((review) => (
            <div
              key={review.id}
              className="bg-[#0f0f0f]/60 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">
                        {review.userName}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                          <BadgeCheck size={10} />
                          Verified
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[review.status]}`}
                      >
                        {review.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {review.userEmail} ·{' '}
                      {new Date(review.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>

              {review.title && (
                <p className="text-sm font-medium text-white mb-1">
                  {review.title}
                </p>
              )}
              <p className="text-sm text-gray-300 whitespace-pre-line mb-3">
                {review.comment}
              </p>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={busy === review.id}
                    className="px-3 py-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {busy === review.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Approve
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(review.id)}
                    disabled={busy === review.id}
                    className="px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <X size={12} />
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={busy === review.id}
                  className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}