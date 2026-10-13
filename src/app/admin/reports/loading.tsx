export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="h-9 w-56 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-white/5 rounded-md mt-3 animate-pulse" />
        </div>
        <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />

      <div className="grid lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
    </div>
  )
}