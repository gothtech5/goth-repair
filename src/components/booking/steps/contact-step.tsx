"use client"

import { type FormEvent, useState, useRef } from "react"
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
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const firstName = (form.get("firstName") as string).trim()
    const lastName = (form.get("lastName") as string).trim()
    const phone = (form.get("phone") as string).trim()
    const email = (form.get("email") as string).trim()
    const notes = (form.get("notes") as string).trim()
    const agreedToTerms = form.get("agreedToTerms") === "on"
    const marketingOptIn = form.get("marketingOptIn") === "on"

    const newErrors: Record<string, string> = {}
    if (!firstName) newErrors.firstName = "First name is required"
    if (!lastName) newErrors.lastName = "Last name is required"
    if (!phone) newErrors.phone = "Phone number is required"
    else if (!/^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone))
      newErrors.phone = "Enter a valid phone number"
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"
    if (!agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ firstName, lastName, phone, email, notes, agreedToTerms, marketingOptIn })
  }

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Last step — enter your contact info
      </h2>
      <p className="mt-2 text-text-secondary">
        We&apos;ll use this to confirm your appointment. No payment until after the repair.
      </p>

      <form id="contact-form" ref={formRef} onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-5">
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

        <div className="space-y-3 border-t border-border-light pt-4">
          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              name="agreedToTerms"
              className="mt-0.5 size-4 rounded border-border-light accent-accent"
            />
            <span>
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Privacy Policy
              </a>
              {" "}<span className="text-destructive">*</span>
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="ml-6 text-sm text-destructive" role="alert">{errors.agreedToTerms}</p>
          )}

          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              name="marketingOptIn"
              className="mt-0.5 size-4 rounded border-border-light accent-accent"
            />
            <span className="text-text-secondary">
              Send me repair tips and exclusive offers (you can unsubscribe anytime)
            </span>
          </label>
        </div>

        {submitError && (
          <p className="text-sm text-destructive" role="alert">{submitError}</p>
        )}
      </form>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border-light bg-surface/95 px-6 py-4 backdrop-blur-sm safe-area-inset-bottom">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-accent hover:underline"
          >
            &larr; Back
          </button>
          <button
            type="submit"
            form="contact-form"
            disabled={submitting}
            className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
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
