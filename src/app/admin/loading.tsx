export default function AdminLoading() {
  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 bg-white/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-80 bg-white/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Table */}
      <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
    </div>
  )
}