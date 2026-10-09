'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package, CreditCard, Mail, Users, ShieldCheck, Download,
  Loader2, Calendar, Filter,
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

export default function ExportCenter() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [status, setStatus] = useState('all')
  const [provider, setProvider] = useState('all')
  const [downloading, setDownloading] = useState<ExportType | null>(null)

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

  const clearFilters = () => {
    setFromDate('')
    setToDate('')
    setStatus('all')
    setProvider('all')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">
            Filters (apply to all exports)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              <Calendar size={12} className="inline mr-1" />
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              <Calendar size={12} className="inline mr-1" />
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-[#1a1a1a]"
            >
              <option value="all">All</option>
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
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-[#1a1a1a]"
            >
              <option value="all">All</option>
              <option value="cod">COD</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-300 transition"
          >
            Clear filters
          </button>
        </div>
      </motion.div>

      {/* Export cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_CONFIGS.map((config, idx) => {
          const Icon = ICON_MAP[config.icon] ?? Package
          const isLoading = downloading === config.type

          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="relative bg-[#0f0f0f]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 overflow-hidden shadow-xl"
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 rounded-r-full ${config.color}`}
              />

              <div className="pl-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white">
                      {config.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(config.type)}
                  disabled={!!downloading}
                  className="w-full py-2.5 bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download CSV
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300"
      >
        <p>
          <strong>Note:</strong> Exports are limited to 10,000 rows per file.
          Files are UTF-8 encoded with BOM — Excel will open them correctly
          with proper currency symbols.
        </p>
      </motion.div>
    </div>
  )
}