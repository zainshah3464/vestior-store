export default function AbandonedCartsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading abandoned carts"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-24 bg-white/[0.04] rounded-full animate-pulse" />
        <div className="h-9 w-64 bg-white/[0.04] rounded-xl animate-pulse" />
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

      {/* Cart cards list */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative h-52 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading abandoned carts…</span>
    </div>
  )
}