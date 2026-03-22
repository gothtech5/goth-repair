"use client"

import { type FormEvent, useState } from "react"
import type { ShippingAddress } from "@/types/booking"

interface ShippingStepProps {
  onSubmit: (address: ShippingAddress) => void
  onBack: () => void
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const

export function ShippingStep({ onSubmit, onBack }: ShippingStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const street = (form.get("street") as string).trim()
    const apartment = (form.get("apartment") as string).trim()
    const city = (form.get("city") as string).trim()
    const state = (form.get("state") as string).trim()
    const zip = (form.get("zip") as string).trim()

    const newErrors: Record<string, string> = {}
    if (!street) newErrors.street = "Street address is required"
    if (!city) newErrors.city = "City is required"
    if (!state) newErrors.state = "State is required"
    if (!zip) newErrors.zip = "ZIP code is required"
    else if (!/^\d{5}(-\d{4})?$/.test(zip)) newErrors.zip = "Enter a valid ZIP code"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ street, apartment, city, state, zip })
  }

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Mail-in repair
      </h2>
      <p className="mt-2 text-text-secondary">
        Enter your return address below, then ship your device to our shop. Once we complete the repair, we&apos;ll ship it right back.
      </p>

      <div className="mt-6 rounded-xl border border-border-light bg-surface-secondary p-5">
        <p className="text-sm font-semibold">Ship your device to:</p>
        <address className="mt-2 space-y-0.5 text-sm not-italic text-text-secondary">
          <p>GothTech</p>
          <p>200 W Lake St #203</p>
          <p>Minneapolis, MN 55408</p>
        </address>
        <p className="mt-3 text-xs text-text-tertiary">
          Pack your device securely. We recommend using the original box or a padded shipping box.
        </p>
      </div>

      <p className="mt-8 text-sm font-medium">Your return address</p>
      <form id="shipping-form" onSubmit={handleSubmit} className="mt-3 max-w-lg space-y-5">
        <Field name="street" label="Street address" required error={errors.street} />
        <Field name="apartment" label="Apt, suite, unit (optional)" />
        <Field name="city" label="City" required error={errors.city} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="state" className="block text-sm font-medium">
              State <span className="text-destructive">*</span>
            </label>
            <select
              id="state"
              name="state"
              required
              aria-invalid={errors.state ? true : undefined}
              className="mt-1.5 w-full rounded-lg border border-border-light px-3 py-2.5 text-sm outline-none focus:border-accent bg-surface"
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-destructive" role="alert">{errors.state}</p>}
          </div>
          <Field name="zip" label="ZIP code" required error={errors.zip} />
        </div>
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
            form="shipping-form"
            className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  name,
  label,
  required = false,
  error,
}: {
  name: string
  label: string
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
        type="text"
        required={required}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-1.5 w-full rounded-lg border border-border-light px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
      {error && <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  )
}
