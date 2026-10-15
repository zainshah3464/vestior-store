'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  CreditCard,
  Mail,
  Users,
  ShieldCheck,
  Download,
  Loader2,
  Calendar,
  Filter,
  Printer,
  FileSpreadsheet,
  Info,
  X,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { EXPORT_CONFIGS, type ExportType } from '@/lib/exports/types'

const ICON_MAP: Record<string, React.ElementType> = {
  Package,
  CreditCard,
  Mail,
  Users,
  ShieldCheck,
}

// Same export types — display labels and subtexts
const EXPORT_DESCRIPTIONS: Record<ExportType, string> = {
  orders: 'All orders with customer, items, totals, and shipping info',
  payments: 'Payment transactions with provider, amount, and status',
  emails: 'Email delivery logs with template and status',
  users: 'Customer and admin profiles with contact info',
  audit: 'Every admin action with timestamp and target',
}

export default function ExportCenter() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [status, setStatus] = useState('all')
  const [provider, setProvider] = useState('all')
  const [downloading, setDownloading] = useState<ExportType | null>(null)

  const hasActiveFilters =
    fromDate !== '' ||
    toDate !== '' ||
    status !== 'all' ||
    provider !== 'all'

  const handleDownload = async (type: ExportType) => {
    setDownloading(type)
    try {
      const params = new URLSearchParams({ type })

      if (fromDate) params.set('fromDate', new Date(fromDate).toISOString())
      if (toDate) {
        // Include entire end day
        const end = new Date(toDate)
        end.setHours(23, 59, 59, 999)
        params.set('toDate', end.toISOString())
      }
      if (status && status !== 'all') params.set('status', status)
      if (provider && provider !== 'all') params.set('provider', provider)

      const res = await fetch(`/api/admin/export?${params.toString()}`)

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Export failed' }))
        throw new Error(err.error || 'Export failed')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download =
        res.headers
          .get('Content-Disposition')
          ?.match(/filename="([^"]+)"/)?.[1] || `${type}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`${type} exported`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setDownloading(null)
    }
  }

  const handlePrint = (type: ExportType) => {
    const params = new URLSearchParams()

    if (fromDate) params.set('fromDate', new Date(fromDate).toISOString())
    if (toDate) {
      const end = new Date(toDate)
      end.setHours(23, 59, 59, 999)
      params.set('toDate', end.toISOString())
    }
    if (status && status !== 'all') params.set('status', status)
    if (provider && provider !== 'all') params.set('provider', provider)

    const qs = params.toString()
    const url = `/admin/exports/print/${type}${qs ? `?${qs}` : ''}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const clearFilters = () => {
    setFromDate('')
    setToDate('')
    setStatus('all')
    setProvider('all')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ─────────────────────────────────────────────
          Filters panel
         ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Export filters"
        className="relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl"
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[240px] h-[240px] bg-indigo-500/[0.05] blur-[100px]"
        />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/[0.1] border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
              <Filter
                size={13}
                className="text-indigo-400"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-white leading-tight">
                Filters
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Applied to all exports below
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X
                size={11}
                className="transition-transform duration-300 group-hover:rotate-90"
                aria-hidden="true"
              />
              Clear
            </button>
          )}
        </div>

        {/* Filter grid */}
        <div className="relative p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* From Date */}
            <div>
              <label
                htmlFor="export-from-date"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                <Calendar size={10} aria-hidden="true" />
                From
              </label>
              <input
                id="export-from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [color-scheme:dark] transition-all duration-200"
              />
            </div>

            {/* To Date */}
            <div>
              <label
                htmlFor="export-to-date"
                className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                <Calendar size={10} aria-hidden="true" />
                To
              </label>
              <input
                id="export-to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white tabular-nums focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [color-scheme:dark] transition-all duration-200"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="export-status"
                className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                Status
              </label>
              <select
                id="export-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [&>option]:bg-[#1a1a1a] [&>option]:text-white cursor-pointer transition-all duration-200"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Provider */}
            <div>
              <label
                htmlFor="export-provider"
                className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-400 mb-2"
              >
                Provider
              </label>
              <select
                id="export-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] [&>option]:bg-[#1a1a1a] [&>option]:text-white cursor-pointer transition-all duration-200"
              >
                <option value="all">All providers</option>
                <option value="cod">Cash on Delivery</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-white/[0.04]">
              <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-gray-500 mr-1">
                Active:
              </span>

              {fromDate && (
                <FilterChip
                  label={`From ${new Date(fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                  onRemove={() => setFromDate('')}
                />
              )}
              {toDate && (
                <FilterChip
                  label={`To ${new Date(toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                  onRemove={() => setToDate('')}
                />
              )}
              {status !== 'all' && (
                <FilterChip
                  label={status}
                  onRemove={() => setStatus('all')}
                />
              )}
              {provider !== 'all' && (
                <FilterChip
                  label={provider.toUpperCase()}
                  onRemove={() => setProvider('all')}
                />
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────
          Export cards grid
         ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {EXPORT_CONFIGS.map((config, idx) => {
          const Icon = ICON_MAP[config.icon] ?? Package
          const isLoading = downloading === config.type
          const description = EXPORT_DESCRIPTIONS[config.type]

          return (
            <motion.article
              key={config.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + idx * 0.06,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-colors duration-300"
            >
              {/* Left accent bar */}
              <div
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-16 rounded-r-full ${config.color}`}
              />

              <div className="relative p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4 pl-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Icon
                      size={18}
                      className="text-indigo-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-white leading-tight">
                      {config.label}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pl-3">
                  {/* CSV — primary */}
                  <motion.button
                    type="button"
                    onClick={() => handleDownload(config.type)}
                    disabled={!!downloading}
                    whileTap={downloading ? {} : { scale: 0.98 }}
                    className="group/btn relative flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {!isLoading && !downloading && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      {isLoading ? (
                        <>
                          <Loader2
                            size={13}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                          Exporting…
                        </>
                      ) : (
                        <>
                          <Download size={13} aria-hidden="true" />
                          Download CSV
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Print — secondary */}
                  <motion.button
                    type="button"
                    onClick={() => handlePrint(config.type)}
                    disabled={!!downloading}
                    whileTap={downloading ? {} : { scale: 0.98 }}
                    className="group/print relative flex-shrink-0 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 rounded-xl text-[12px] font-medium disabled:opacity-40 transition-all duration-200 flex items-center justify-center gap-1.5"
                    aria-label={`Print ${config.label} export`}
                  >
                    <Printer
                      size={13}
                      className="transition-transform duration-300 group-hover/print:scale-110"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Print</span>
                  </motion.button>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────
          Info note
         ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        role="note"
        className="relative overflow-hidden flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/[0.15]"
      >
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-500/[0.15] border border-indigo-500/25 flex items-center justify-center">
          <Info
            size={12}
            className="text-indigo-300"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-indigo-200/90 leading-relaxed">
            <strong className="text-indigo-100 font-semibold">
              Note:
            </strong>{' '}
            Exports are limited to 10,000 rows per file. Files are UTF-8
            encoded with BOM — Excel will open them correctly with proper
            currency symbols.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Filter chip helper
// ─────────────────────────────────────────────
function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onRemove}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full bg-indigo-500/[0.12] border border-indigo-500/30 text-indigo-300 text-[10px] font-medium hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-all duration-200"
      aria-label={`Remove filter: ${label}`}
    >
      <span className="capitalize">{label}</span>
      <X
        size={10}
        strokeWidth={2.5}
        className="text-indigo-400/70 group-hover:text-white transition-colors flex-shrink-0"
        aria-hidden="true"
      />
    </motion.button>
  )
}