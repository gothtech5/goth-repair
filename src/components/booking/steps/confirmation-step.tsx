"use client"

import Link from "next/link"
import { CalendarPlus, Phone, MapPin } from "lucide-react"
import { DEVICE_MODELS, BRANDS, REPAIR_ISSUES } from "@/data/devices"
import { BUSINESS } from "@/config/business"
import type { BookingState } from "@/types/booking"

interface ConfirmationStepProps {
  state: BookingState
  onReset: () => void
}

function buildCalendarUrl(state: BookingState, model: { name: string } | undefined): string {
  const title = encodeURIComponent(`${BUSINESS.name} Repair — ${model?.name ?? "Device"}`)
  const location = encodeURIComponent(
    `${BUSINESS.location.address}, ${BUSINESS.location.city}, ${BUSINESS.location.state} ${BUSINESS.location.zip}`,
  )
  const details = encodeURIComponent(`Bring your device to ${BUSINESS.name} for your scheduled repair.`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}`
}

export function ConfirmationStep({ state, onReset }: ConfirmationStepProps) {
  const brand = BRANDS.find((b) => b.id === state.brand)
  const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
  const selectedIssues = REPAIR_ISSUES.filter((i) => state.issues.includes(i.id))
  const firstName = state.contact?.firstName ?? ""
  const calendarUrl = buildCalendarUrl(state, model)
  const directionsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${BUSINESS.location.address}, ${BUSINESS.location.city}, ${BUSINESS.location.state} ${BUSINESS.location.zip}`,
  )}`

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
      <h2 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl text-balance">
        You&apos;re all set{firstName ? `, ${firstName}` : ""}. See you soon!
      </h2>
      <p className="mt-2 text-text-secondary">
        Your repair appointment has been booked. We&apos;ll see you at {BUSINESS.name}.
      </p>

      <div className="mt-8 rounded-xl border border-border-light p-6 text-left">
        <p className="text-sm font-medium">Appointment Details</p>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Name" value={state.contact ? `${state.contact.firstName} ${state.contact.lastName}` : ""} />
          <Row label="Device" value={`${brand?.name ?? ""} ${model?.name ?? ""}`} />
          <Row
            label={selectedIssues.length === 1 ? "Issue" : "Issues"}
            value={selectedIssues.length > 0 ? selectedIssues.map((i) => i.name).join(", ") : "Other"}
          />
          <Row label="Date" value={state.date ?? ""} />
          <Row label="Time" value={state.timeSlot ?? ""} />
          {state.contact?.phone && <Row label="Phone" value={state.contact.phone} />}
          {state.contact?.email && <Row label="Email" value={state.contact.email} />}
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-border-light p-5 text-left text-sm">
        <p className="font-medium">Bring your device to</p>
        <p className="mt-1 text-text-secondary">
          {BUSINESS.location.address}, {BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.zip}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-light px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary"
        >
          <CalendarPlus className="size-4" />
          Add to Calendar
        </a>
        <a
          href={BUSINESS.contact.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-light px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary"
        >
          <Phone className="size-4" />
          Call Store
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-light px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary"
        >
          <MapPin className="size-4" />
          Get Directions
        </a>
      </div>

      <div className="mt-8 rounded-xl border border-border-light p-6 text-left">
        <p className="text-sm font-semibold">What happens next?</p>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">1</span>
            <span><span className="font-medium text-text-primary">Free diagnostics</span> — We&apos;ll inspect your device and confirm the issue.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">2</span>
            <span><span className="font-medium text-text-primary">Fast repair</span> — Most repairs completed same-day.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">3</span>
            <span><span className="font-medium text-text-primary">1-year warranty</span> — Every repair backed by our guarantee.</span>
          </li>
        </ol>
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
