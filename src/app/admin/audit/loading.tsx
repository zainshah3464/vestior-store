export default function AuditLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-40 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-white/5 rounded-md mt-3 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
    </div>
  )
}