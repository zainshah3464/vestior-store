export default function ExportsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-white/5 rounded-md mt-3 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}