export default function UserActivityLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
    </div>
  )
}