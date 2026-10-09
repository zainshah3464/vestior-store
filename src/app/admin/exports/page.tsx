import ExportCenter from "@/components/admin/ExportCenter"

export const dynamic = 'force-dynamic'

export default function AdminExportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Export Center</h1>
        <p className="text-gray-400 text-sm mt-1">
          Download your business data as CSV files. Excel-ready with UTF-8
          encoding.
        </p>
      </div>

      <ExportCenter />
    </div>
  )
}