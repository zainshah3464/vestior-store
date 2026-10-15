export default function ExportsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading export center"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="h-6 w-20 bg-white/[0.04] rounded-full animate-pulse" />
        <div className="h-9 w-48 bg-white/[0.04] rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-white/[0.03] rounded-md animate-pulse" />
      </div>

      {/* Filters card */}
      <div className="h-40 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      {/* Export cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-44 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      <span className="sr-only">Loading export center…</span>
    </div>
  )
}