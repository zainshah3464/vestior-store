'use client'

import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'

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

  return (
    <>
      {/* Screen-only controls */}
      <div className="print:hidden bg-black pt-20 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/exports"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft size={14} />
            Back to Export Center
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-500/20"
          >
            <Printer size={16} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Print area */}
      <div className="bg-neutral-900 print:bg-white py-8 print:py-0 min-h-screen print:min-h-0">
        <div
          id="export-print-area"
          className="max-w-6xl mx-auto bg-white text-neutral-900 p-8 print:p-4 shadow-2xl print:shadow-none print:max-w-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-neutral-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                VESTIOR
              </h1>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
                {title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Generated</p>
              <p className="text-sm font-medium text-neutral-900">
                {issuedDate}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {rows.length} record{rows.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Filters */}
          {filterChips.length > 0 && (
            <div className="mt-4 text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">Filters:</span>{' '}
              {filterChips
                .map(([k, v]) => `${k}=${String(v)}`)
                .join('  ·  ')}
            </div>
          )}

          {/* Table */}
          {rows.length === 0 ? (
            <p className="text-center py-12 text-neutral-500 text-sm">
              No records found for these filters.
            </p>
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

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-500">
            VESTIOR — Data Export · {issuedDate} · {rows.length} records
          </div>
        </div>
      </div>

      {/* Print-specific CSS */}
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