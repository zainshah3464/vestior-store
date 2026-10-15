'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Check,
  X,
  Trash2,
  Loader2,
  BadgeCheck,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react'
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

// ─────────────────────────────────────────────
// Status styling
// ─────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  {
    bg: string
    text: string
    border: string
    dot: string
    icon: React.ElementType
  }
> = {
  pending: {
    bg: 'bg-amber-500/[0.1]',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
    icon: Clock,
  },
  approved: {
    bg: 'bg-emerald-500/[0.1]',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  rejected: {
    bg: 'bg-red-500/[0.1]',
    text: 'text-red-300',
    border: 'border-red-500/25',
    dot: 'bg-red-400',
    icon: XCircle,
  },
}

const DEFAULT_STATUS = {
  bg: 'bg-gray-500/[0.1]',
  text: 'text-gray-300',
  border: 'border-gray-500/25',
  dot: 'bg-gray-400',
  icon: MessageSquare,
}

// ─────────────────────────────────────────────
// Tab styling
// ─────────────────────────────────────────────
const TAB_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; activeStyles: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    activeStyles:
      'bg-amber-500/[0.15] text-amber-300 border-amber-500/40 shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    activeStyles:
      'bg-emerald-500/[0.15] text-emerald-300 border-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    activeStyles:
      'bg-red-500/[0.15] text-red-300 border-red-500/40 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  },
  all: {
    label: 'All',
    icon: Layers,
    activeStyles:
      'bg-indigo-500/[0.15] text-indigo-300 border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]',
  },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* ─────────────────────────────────────────────
          Tabs — segmented with icons
         ───────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Review status filter"
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const config = TAB_CONFIG[tab]
          const Icon = config.icon
          const active = initialFilters.status === tab

          return (
            <motion.button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => updateFilter('status', tab)}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium capitalize transition-all duration-200 border ${
                active
                  ? config.activeStyles
                  : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-white/15'
              }`}
            >
              <Icon
                size={12}
                className={active ? '' : 'text-gray-500'}
                aria-hidden="true"
              />
              {config.label}
            </motion.button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────
          Search
         ───────────────────────────────────────────── */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by name, email, or comment…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-9 pr-9 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all duration-200"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Clear search"
          >
            <X size={11} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          Empty state
         ───────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[240px] bg-amber-500/[0.05] blur-[100px]"
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <MessageSquare
                size={22}
                className="text-gray-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              No reviews found
            </h3>
            <p className="text-[12px] text-gray-500 max-w-xs">
              {search
                ? 'Try adjusting your search query.'
                : initialFilters.status === 'pending'
                ? "You're all caught up — no pending reviews."
                : 'No reviews match this filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {rows.map((review, idx) => {
              const statusStyle =
                STATUS_STYLES[review.status] ?? DEFAULT_STATUS
              const StatusIcon = statusStyle.icon
              const isBusy = busy === review.id

              return (
                <motion.article
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(idx * 0.03, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-colors duration-300"
                >
                  {/* Subtle status glow */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-24 -right-24 w-[200px] h-[200px] ${statusStyle.bg} blur-[100px] opacity-50`}
                  />

                  <div className="relative p-4 sm:p-5">
                    {/* ─────────────────────────────────────────────
                        Header — avatar + name + status + rating
                       ───────────────────────────────────────────── */}
                    <header className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[13px] font-semibold ring-1 ring-white/[0.08] flex-shrink-0"
                          aria-hidden="true"
                        >
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-white truncate leading-tight">
                              {review.userName}
                            </p>

                            {review.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/[0.12] text-emerald-300 px-1.5 py-[3px] rounded-md border border-emerald-500/25 flex-shrink-0">
                                <BadgeCheck size={9} aria-hidden="true" />
                                Verified
                              </span>
                            )}

                            <span
                              className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-[3px] rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex-shrink-0`}
                            >
                              <StatusIcon size={9} aria-hidden="true" />
                              {review.status}
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1.5 truncate">
                            <span className="truncate">
                              {review.userEmail}
                            </span>
                            <span
                              className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="tabular-nums flex-shrink-0">
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex-shrink-0">
                        <StarRating rating={review.rating} size={14} />
                      </div>
                    </header>

                    {/* ─────────────────────────────────────────────
                        Content
                       ───────────────────────────────────────────── */}
                    {review.title && (
                      <h4 className="text-[13px] font-semibold text-white mb-1.5 leading-snug">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-[12.5px] text-gray-300 whitespace-pre-line leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {/* ─────────────────────────────────────────────
                        Actions
                       ───────────────────────────────────────────── */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                      {review.status !== 'approved' && (
                        <motion.button
                          type="button"
                          onClick={() => handleApprove(review.id)}
                          disabled={isBusy}
                          whileTap={isBusy ? {} : { scale: 0.97 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-300 rounded-xl hover:bg-emerald-500/[0.15] hover:border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {isBusy ? (
                            <Loader2
                              size={11}
                              className="animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Check size={11} aria-hidden="true" />
                          )}
                          Approve
                        </motion.button>
                      )}

                      {review.status !== 'rejected' && (
                        <motion.button
                          type="button"
                          onClick={() => handleReject(review.id)}
                          disabled={isBusy}
                          whileTap={isBusy ? {} : { scale: 0.97 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-red-500/[0.08] border border-red-500/25 text-red-300 rounded-xl hover:bg-red-500/[0.15] hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <X size={11} aria-hidden="true" />
                          Reject
                        </motion.button>
                      )}

                      <motion.button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        disabled={isBusy}
                        whileTap={isBusy ? {} : { scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-white/[0.03] border border-white/[0.08] text-gray-400 rounded-xl hover:bg-white/[0.06] hover:text-white hover:border-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Trash2 size={11} aria-hidden="true" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          Pagination
         ───────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl">
          <span className="text-[11px] text-gray-500 tabular-nums">
            Page <span className="text-gray-300 font-medium">{page}</span> of{' '}
            <span className="text-gray-300 font-medium">{totalPages}</span> ·{' '}
            <span className="text-gray-300 font-medium">
              {total.toLocaleString()}
            </span>{' '}
            total
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
            >
              <ChevronLeft
                size={12}
                className="transition-transform duration-300 group-hover:-translate-x-0.5 group-disabled:translate-x-0"
                aria-hidden="true"
              />
              Previous
            </button>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:text-gray-400 transition-all duration-200"
            >
              Next
              <ChevronRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}