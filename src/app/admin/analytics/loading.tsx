export default function AnalyticsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading analytics"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
          <div className="h-9 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-white/[0.03] rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-white/[0.04] rounded-full animate-pulse flex-shrink-0" />
      </div>

      {/* 4 top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Conversion funnel */}
      <div className="h-80 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      {/* Top products + Devices/Sources */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-96 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div className="space-y-4 sm:space-y-6">
          <div className="h-56 bg-white/[0.03] rounded-2xl animate-pulse" />
          <div className="h-56 bg-white/[0.03] rounded-2xl animate-pulse" />
        </div>
      </div>

      {/* Product analytics section header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.04] animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="h-3 w-56 bg-white/[0.03] rounded-md animate-pulse" />
        </div>
      </div>

      {/* Product analytics stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Product performance table */}
      <div className="h-96 bg-white/[0.03] rounded-2xl animate-pulse" />

      {/* Top products by revenue */}
      <div className="h-80 bg-white/[0.03] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading analytics…</span>
    </div>
  )
}