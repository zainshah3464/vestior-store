export default function PaymentsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading payments"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-28 bg-white/[0.04] rounded-full animate-pulse" />
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

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2.5">
        <div className="h-11 bg-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-11 w-36 bg-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-11 w-36 bg-white/[0.04] rounded-xl animate-pulse" />
      </div>

      {/* Table */}
      <div className="h-96 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading payments…</span>
    </div>
  )
}