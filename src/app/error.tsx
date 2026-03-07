"use client"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-destructive">Error</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        Something went wrong
      </h1>
      <p className="mt-3 text-text-secondary">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Try Again
      </button>
    </div>
  )
}
