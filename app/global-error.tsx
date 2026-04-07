'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-red-600">Lỗi hệ thống</h1>
          <p className="mt-2 text-gray-600">An application error occurred. Please try again.</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-800"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  )
}
