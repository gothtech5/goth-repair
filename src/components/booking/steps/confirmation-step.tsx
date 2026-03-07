"use client"

import Link from "next/link"
import { DEVICE_MODELS, REPAIR_ISSUES, STORE_INFO } from "@/data/devices"
import type { BookingState } from "@/types/booking"

interface ConfirmationStepProps {
  state: BookingState
  onReset: () => void
}

export function ConfirmationStep({ state, onReset }: ConfirmationStepProps) {
  const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
  const issue = REPAIR_ISSUES.find((i) => i.id === state.issueId)

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
        You&apos;re all set!
      </h2>
      <p className="mt-2 text-text-secondary">
        Your repair appointment has been booked. We&apos;ll see you soon.
      </p>

      <div className="mt-8 rounded-xl border border-border-light p-6 text-left">
        <p className="text-sm font-medium">Appointment Details</p>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={state.contact ? `${state.contact.firstName} ${state.contact.lastName}` : ""} />
          <Row label="Device" value={model?.name ?? ""} />
          <Row label="Issue" value={issue?.name ?? ""} />
          <Row label="Date" value={state.date ?? ""} />
          <Row label="Time" value={state.timeSlot ?? ""} />
          {state.contact?.phone && <Row label="Phone" value={state.contact.phone} />}
          {state.contact?.email && <Row label="Email" value={state.contact.email} />}
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-border-light p-5 text-left text-sm">
        <p className="font-medium">Bring your device to</p>
        <p className="mt-1 text-text-secondary">
          {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} {STORE_INFO.zip}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Book Another Repair
        </button>
        <Link href="/" className="text-sm text-accent hover:underline">
          Back to Home
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
