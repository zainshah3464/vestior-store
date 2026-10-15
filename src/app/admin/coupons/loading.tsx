export default function CouponsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading coupons"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
        <div className="h-9 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-white/[0.03] rounded-md animate-pulse" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Table header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-white/[0.04] rounded animate-pulse" />
            <div className="h-3 w-32 bg-white/[0.03] rounded animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-32 bg-white/[0.04] rounded-xl animate-pulse" />
      </div>

      {/* Table */}
      <div className="h-96 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading coupons…</span>
    </div>
  )
}