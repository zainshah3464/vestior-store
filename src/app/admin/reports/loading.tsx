export default function ReportsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading reports"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
          <div className="h-9 w-56 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-white/[0.03] rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-72 bg-white/[0.04] rounded-full animate-pulse flex-shrink-0" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="space-y-3">
        <div className="h-5 w-48 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-80 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
      </div>

      {/* Category + Provider */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <div className="h-5 w-48 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-80 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
        </div>
        <div className="h-[340px] bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
      </div>

      {/* Status grid */}
      <div className="h-40 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      {/* Top products table */}
      <div className="h-96 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading reports…</span>
    </div>
  )
}