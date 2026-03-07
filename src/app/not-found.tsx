import Link from "next/link"
import { BOOKING_URL } from "@/data/devices"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        Page not found
      </h1>
      <p className="mt-3 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Go Home
        </Link>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface-secondary"
        >
          Book a Repair
        </a>
      </div>
    </div>
  )
}
