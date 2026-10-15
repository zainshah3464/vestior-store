export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading admin dashboard"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-3 w-80 bg-white/[0.03] rounded-md animate-pulse" />
        </div>
        <div className="hidden sm:block h-9 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
      </div>

      {/* Top stats — 6 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Action Center */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-24 bg-white/[0.04] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-80 bg-white/[0.04] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 h-96 bg-white/[0.04] rounded-2xl animate-pulse" />
        <div className="h-96 bg-white/[0.04] rounded-2xl animate-pulse" />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  )
}