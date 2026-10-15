import ExportCenter from '@/components/admin/ExportCenter'
import { Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminExportsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─────────────────────────────────────────────
          Header — Editorial
         ───────────────────────────────────────────── */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3 backdrop-blur-sm">
          <Download
            size={11}
            className="text-indigo-400"
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-gray-400">
            Data
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Export Center
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Download your business data as CSV files. Excel-ready with
              UTF-8 encoding and proper currency symbols.
            </p>
          </div>
        </div>
      </header>

      <ExportCenter />
    </div>
  )
}