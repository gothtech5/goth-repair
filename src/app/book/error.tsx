"use client"

import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BookError({ reset }: ErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-destructive">Booking Error</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        Something went wrong
      </h1>
      <p className="mt-3 text-text-secondary">
        We couldn&apos;t load the booking page. Your progress may have been lost.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface-secondary"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
