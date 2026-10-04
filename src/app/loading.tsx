export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <p className="text-gray-500 text-sm tracking-wider">Loading…</p>
        <span className="sr-only">Please wait while we load your content.</span>
      </div>
    </div>
  )
}