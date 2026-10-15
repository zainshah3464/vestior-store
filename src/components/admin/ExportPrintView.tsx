'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Info,
} from 'lucide-react'

export interface PrintColumn {
  key: string
  label: string
  format?: 'date' | 'currency' | 'text'
}

interface Props {
  type: string
  title: string
  columns: PrintColumn[]
  rows: Record<string, unknown>[]
  filters: Record<string, string | undefined>
}

function fmt(value: unknown, format?: PrintColumn['format']): string {
  if (value === null || value === undefined || value === '') return '—'
  if (format === 'currency') {
    const n = Number(value)
    return isNaN(n) ? '—' : `₹${n.toLocaleString()}`
  }
  if (format === 'date') {
    try {
      return new Date(String(value)).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export default function ExportPrintView({
  type,
  title,
  columns,
  rows,
  filters,
}: Props) {
  const issuedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const filterChips = Object.entries(filters).filter(([, v]) => v)
  const recordCount = rows.length

  return (
    <>
      {/* ═════════════════════════════════════════════
          Screen-only controls
         ═════════════════════════════════════════════ */}
      <div className="print:hidden relative bg-black pt-20 pb-4 overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/[0.05] blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/exports"
            className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Export Center
          </Link>

          <motion.button
            type="button"
            onClick={() => window.print()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group/btn relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[12px] font-semibold overflow-hidden shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -inset-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out"
            />
            <Printer
              size={14}
              className="relative z-10"
              aria-hidden="true"
            />
            <span className="relative z-10">Print / Save as PDF</span>
          </motion.button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════
          Print area (VISIBILITY PRESERVED)
         ═════════════════════════════════════════════ */}
      <div className="bg-neutral-900 print:bg-white py-8 print:py-0 min-h-screen print:min-h-0">
        <div
          id="export-print-area"
          className="max-w-6xl mx-auto bg-white text-neutral-900 p-8 print:p-4 shadow-2xl print:shadow-none print:max-w-none"
        >
          {/* ─────────────────────────────────────────────
              Header
             ───────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-neutral-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                VESTIOR
              </h1>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                <FileSpreadsheet
                  size={10}
                  aria-hidden="true"
                />
                {title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Generated</p>
              <p className="text-sm font-medium text-neutral-900">
                {issuedDate}
              </p>
              <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                {recordCount} record{recordCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Active filters
             ───────────────────────────────────────────── */}
          {filterChips.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600 flex-wrap">
              <span className="font-semibold text-neutral-800">
                Filters:
              </span>
              {filterChips.map(([k, v], i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200"
                >
                  <span className="text-neutral-500">{k}</span>
                  <span className="text-neutral-800 font-medium">
                    {String(v)}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* ─────────────────────────────────────────────
              Table / Empty
             ───────────────────────────────────────────── */}
          {recordCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-3">
                <Info
                  size={22}
                  className="text-neutral-400"
                  aria-hidden="true"
                />
              </div>
              <p className="text-neutral-500 text-sm font-medium mb-1">
                No records found
              </p>
              <p className="text-neutral-400 text-xs">
                Try adjusting your filters and export again
              </p>
            </div>
          ) : (
            <table className="w-full text-xs mt-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-300 bg-neutral-50">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="text-left py-2 px-2 font-semibold text-neutral-700 whitespace-nowrap"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className="py-1.5 px-2 align-top text-neutral-700 break-words"
                      >
                        {fmt(row[c.key], c.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ─────────────────────────────────────────────
              Footer
             ───────────────────────────────────────────── */}
          <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1.5">
            <CheckCircle2
              size={10}
              className="text-neutral-400"
              aria-hidden="true"
            />
            VESTIOR — Data Export · {issuedDate} · {recordCount}{' '}
            {recordCount === 1 ? 'record' : 'records'}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════
          Print-specific CSS — PRESERVED EXACTLY
         ═════════════════════════════════════════════ */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          html,
          body {
            background: white !important;
          }
          body > * {
            visibility: hidden;
          }
          #export-print-area,
          #export-print-area * {
            visibility: visible;
          }
          #export-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          tr {
            page-break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </>
  )
}