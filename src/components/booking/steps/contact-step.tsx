"use client"

import { type FormEvent, useState, useRef } from "react"
import { DEVICE_MODELS, REPAIR_ISSUES } from "@/data/devices"
import type { BookingState, ContactInfo } from "@/types/booking"

interface ContactStepProps {
  state: BookingState
  onSubmit: (contact: ContactInfo) => void
  onBack: () => void
  submitting?: boolean
  submitError?: string | null
}

export function ContactStep({ state, onSubmit, onBack, submitting, submitError }: ContactStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [live, setLive] = useState({ firstName: "", lastName: "", phone: "", email: "" })
  const formRef = useRef<HTMLFormElement>(null)

  const model = DEVICE_MODELS.find((m) => m.id === state.modelId)
  const issue = REPAIR_ISSUES.find((i) => i.id === state.issueId)

  function handleInput() {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    setLive({
      firstName: (fd.get("firstName") as string) ?? "",
      lastName: (fd.get("lastName") as string) ?? "",
      phone: (fd.get("phone") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const firstName = (form.get("firstName") as string).trim()
    const lastName = (form.get("lastName") as string).trim()
    const phone = (form.get("phone") as string).trim()
    const email = (form.get("email") as string).trim()
    const notes = (form.get("notes") as string).trim()

    const newErrors: Record<string, string> = {}
    if (!firstName) newErrors.firstName = "First name is required"
    if (!lastName) newErrors.lastName = "Last name is required"
    if (!phone) newErrors.phone = "Phone number is required"
    else if (!/^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone))
      newErrors.phone = "Enter a valid phone number"
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ firstName, lastName, phone, email, notes })
  }

  const fullName = [live.firstName.trim(), live.lastName.trim()].filter(Boolean).join(" ")

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-accent hover:underline"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Your information
      </h2>
      <p className="mt-2 text-text-secondary">
        We&apos;ll use this to confirm your appointment.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">
        <form ref={formRef} onSubmit={handleSubmit} onInput={handleInput} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="firstName" label="First name" required error={errors.firstName} />
            <Field name="lastName" label="Last name" required error={errors.lastName} />
          </div>
          <Field name="phone" label="Phone number" type="tel" required error={errors.phone} />
          <Field name="email" label="Email" type="email" required error={errors.email} />
          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Additional notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-border-light px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {submitError && (
            <p className="text-sm text-destructive" role="alert">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>

        <div className="rounded-xl border border-border-light p-5">
          <p className="text-sm font-medium">Appointment Summary</p>
          <dl className="mt-3 space-y-2 text-sm">
            <SummaryRow label="Device" value={model?.name} />
            <SummaryRow label="Issue" value={issue?.name} />
            {issue?.estimatedTime && (
              <SummaryRow label="Est. Time" value={issue.estimatedTime} />
            )}
            <SummaryRow label="Date" value={state.date ?? undefined} />
            <SummaryRow label="Time" value={state.timeSlot ?? undefined} />
            <SummaryRow label="Name" value={fullName || undefined} />
            <SummaryRow label="Phone" value={live.phone.trim() || undefined} />
            <SummaryRow label="Email" value={live.email.trim() || undefined} />
          </dl>
        </div>
      </div>
    </div>
  )
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  error,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  error?: string
}) {
  const errorId = `${name}-error`
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}{required && <span className="text-destructive"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-1.5 w-full rounded-lg border border-border-light px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
      {error && <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex justify-between">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
