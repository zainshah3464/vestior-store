export default function UserActivityLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading user activity"
      className="space-y-6 sm:space-y-8"
    >
      {/* Back link */}
      <div className="h-4 w-32 bg-white/[0.03] rounded animate-pulse" />

      {/* Profile header hero */}
      <div className="h-32 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      {/* 6 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Session timeline */}
      <div className="h-96 bg-gradient-to-b from-[#131313] to-[#0e0e0e] border border-white/[0.06] rounded-2xl animate-pulse" />

      <span className="sr-only">Loading user activity…</span>
    </div>
  )
}