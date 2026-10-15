export default function VisitorsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading visitors"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
        <div className="h-9 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-white/[0.03] rounded-md animate-pulse" />
      </div>

      {/* 6 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 w-24 bg-white/[0.04] rounded-xl animate-pulse"
          />
        ))}
      </div>

      {/* Search skeleton */}
      <div className="h-11 bg-white/[0.04] rounded-xl animate-pulse" />

      {/* Table */}
      <div className="h-96 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading visitors…</span>
    </div>
  )
}