export default function SessionLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading session detail"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header hero */}
      <div className="h-44 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      {/* 6 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* 2-col: timeline + device */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-64 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Paths / Products / Orders */}
      <div className="h-64 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />
      <div className="h-64 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading session…</span>
    </div>
  )
}