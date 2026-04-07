'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-semibold text-red-600">Có lỗi xảy ra</h2>
      <p className="mt-2 text-gray-600">Something went wrong. Please try again.</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
      >
        Thử lại
      </button>
    </div>
  )
}
