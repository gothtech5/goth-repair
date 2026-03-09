"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BUSINESS } from "@/config/business"

interface AppointmentDetails {
  summary: string
  start: string
  end: string
}

type Status = "loading" | "details" | "cancelling" | "cancelled" | "already-cancelled" | "error"

export function CancelForm({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("loading")
  const [details, setDetails] = useState<AppointmentDetails | null>(null)

  useEffect(() => {
    fetch(`/api/cancel?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data: AppointmentDetails & { cancelled?: boolean; error?: string }) => {
        if (data.cancelled) {
          setStatus("already-cancelled")
        } else if (data.error) {
          setStatus("error")
        } else {
          setDetails(data)
          setStatus("details")
        }
      })
      .catch(() => setStatus("error"))
  }, [token])

  async function handleCancel() {
    setStatus("cancelling")
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json() as { success?: boolean; cancelled?: boolean }
      if (data.success || data.cancelled) {
        setStatus("cancelled")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  function formatDateTime(iso: string): string {
    const date = new Date(iso)
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: BUSINESS.location.timezone,
    })
  }

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-text-secondary">Loading appointment details…</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-destructive">Error</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
          Something went wrong
        </h1>
        <p className="mt-3 text-text-secondary">
          We couldn&apos;t load your appointment. The link may be invalid or expired.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Go Home
        </Link>
      </div>
    )
  }

  if (status === "already-cancelled" || status === "cancelled") {
    return (
      <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Appointment cancelled
        </h1>
        <p className="mt-2 text-text-secondary">
          {status === "already-cancelled"
            ? "This appointment was already cancelled."
            : "Your appointment has been cancelled successfully."}
        </p>
        <Link
          href="/book"
          className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Book a New Appointment
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-destructive">Cancel Appointment</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        Are you sure?
      </h1>
      <p className="mt-3 text-text-secondary">
        This will cancel your repair appointment. This action cannot be undone.
      </p>

      {details && (
        <div className="mt-8 w-full rounded-xl border border-border-light p-6 text-left">
          <p className="text-sm font-medium">Appointment Details</p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Appointment" value={details.summary} />
            <Row label="Date & Time" value={formatDateTime(details.start)} />
          </dl>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={status === "cancelling"}
          className="rounded-lg bg-destructive px-6 py-3 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
        >
          {status === "cancelling" ? "Cancelling…" : "Cancel My Appointment"}
        </button>
        <Link href="/" className="text-sm text-accent hover:underline">
          Never mind, keep it
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border-light pb-2 last:border-0 last:pb-0">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
