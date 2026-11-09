"use client"

import { useEffect, useRef, useState } from "react"
import { dollars, toCents } from "@/lib/evertrail/format"
import { TICKET_STATUSES } from "@/lib/evertrail/ticket-info"
import { Field, inputClass } from "@/components/evertrail/shell"

export type TicketDefaults = {
  customer_name?: string
  customer_phone?: string
  device_brand?: string
  device_model?: string
  issue?: string
  device_condition?: string
  price?: string
  deposit?: string
  date_received?: string
  estimated_completion?: string
  status?: string
  technician_notes?: string
  alt_phone?: string
  text_ok?: boolean
  text_to?: string
}

const BRANDS = ["Apple", "Samsung", "Google", "Motorola", "OnePlus", "LG", "Microsoft", "Lenovo", "Other"]

/** Every box on the new-ticket and edit-ticket forms, with the remaining balance worked out as you type. */
export function TicketFields({ ticket = {} }: { ticket?: TicketDefaults }) {
  const priceRef = useRef<HTMLInputElement>(null)
  const depositRef = useRef<HTMLInputElement>(null)
  const [money, setMoney] = useState({ price: ticket.price ?? "", deposit: ticket.deposit ?? "" })

  const priceCents = toCents(money.price)
  const depositCents = toCents(money.deposit)
  const tooMuch = depositCents > priceCents
  const balanceError = tooMuch ? `Deposit can't be more than the price ($${dollars(priceCents)}).` : ""

  function read() {
    setMoney({ price: priceRef.current?.value ?? "", deposit: depositRef.current?.value ?? "" })
  }

  // A deposit bigger than the price stops the form from saving (the server checks it again too).
  useEffect(() => {
    depositRef.current?.setCustomValidity(balanceError)
  }, [balanceError])

  return (
    <div className="space-y-6">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 text-base font-semibold">Customer</legend>
        <Field label="Customer name (required)">
          <input name="customer_name" required defaultValue={ticket.customer_name} autoComplete="off" className={inputClass} />
        </Field>
        <Field label="Phone number (required)">
          <input
            name="customer_phone"
            type="tel"
            inputMode="tel"
            required
            defaultValue={ticket.customer_phone}
            placeholder="(612) 555-0123"
            autoComplete="off"
            className={inputClass}
          />
        </Field>
        <Field label="Alternate contact number (optional)">
          <input
            name="alt_phone"
            type="tel"
            inputMode="tel"
            defaultValue={ticket.alt_phone}
            placeholder="Family, work or friend's number"
            autoComplete="off"
            className={inputClass}
          />
          <span className="mt-1 block text-xs font-normal text-neutral-600">
            Useful when the phone being repaired is their only phone.
          </span>
        </Field>
        <div className="space-y-2 rounded-md border border-neutral-300 bg-neutral-50 p-3 text-sm">
          <label className="flex items-start gap-2 font-medium">
            <input name="text_ok" type="checkbox" defaultChecked={ticket.text_ok} className="mt-1 size-4" />
            <span>Customer agrees to receive texts about this repair</span>
          </label>
          <label className="block">
            <span className="mb-1 block font-medium">Text this number</span>
            <select name="text_to" defaultValue={ticket.text_to === "alt" ? "alt" : "main"} className={inputClass}>
              <option value="main">Main phone number</option>
              <option value="alt">Alternate contact number</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 text-base font-semibold">Device</legend>
        <Field label="Brand (required)">
          <input
            name="device_brand"
            list="ticket-brands"
            required
            defaultValue={ticket.device_brand}
            placeholder="Apple"
            className={inputClass}
          />
          <datalist id="ticket-brands">
            {BRANDS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </Field>
        <Field label="Model (required)">
          <input name="device_model" required defaultValue={ticket.device_model} placeholder="iPhone 15 Pro" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Repair issue (required)">
            <textarea
              name="issue"
              required
              rows={2}
              defaultValue={ticket.issue}
              placeholder="Cracked screen, touch not working"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Device condition when received">
            <textarea
              name="device_condition"
              rows={2}
              defaultValue={ticket.device_condition}
              placeholder="Scratches on back, small dent on bottom-left corner, powers on"
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-3 sm:grid-cols-3">
        <legend className="mb-2 text-base font-semibold">Price</legend>
        <Field label="Estimated repair price ($)">
          <input
            ref={priceRef}
            name="price"
            inputMode="decimal"
            defaultValue={ticket.price}
            placeholder="0.00"
            onChange={read}
            className={inputClass}
          />
        </Field>
        <Field label="Deposit paid ($)">
          <input
            ref={depositRef}
            name="deposit"
            inputMode="decimal"
            defaultValue={ticket.deposit}
            placeholder="0.00"
            onChange={read}
            aria-invalid={tooMuch ? true : undefined}
            className={inputClass + (tooMuch ? " border-2 border-red-600" : "")}
          />
        </Field>
        <div className="block text-sm font-medium">
          <span className="mb-1 block">Remaining balance</span>
          <p
            aria-live="polite"
            className={
              "rounded-md border px-3 py-2 text-base font-semibold " +
              (tooMuch ? "border-red-300 bg-red-50 text-red-700" : "border-neutral-300 bg-neutral-50")
            }
          >
            {tooMuch ? balanceError : `$${dollars(priceCents - depositCents)}`}
          </p>
        </div>
      </fieldset>

      <fieldset className="grid gap-3 sm:grid-cols-3">
        <legend className="mb-2 text-base font-semibold">Dates and status</legend>
        <Field label="Date received">
          <input name="date_received" type="date" required defaultValue={ticket.date_received} className={inputClass} />
        </Field>
        <Field label="Estimated completion">
          <input name="estimated_completion" type="date" defaultValue={ticket.estimated_completion} className={inputClass} />
        </Field>
        <Field label="Repair status">
          <select name="status" defaultValue={ticket.status || "Received"} className={inputClass}>
            {TICKET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-base font-semibold">Technician notes</legend>
        <textarea
          name="technician_notes"
          rows={4}
          defaultValue={ticket.technician_notes}
          placeholder="Staff only. Not printed on the customer receipt."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-neutral-600">
          Staff only — never printed on the receipt. Do not write the customer&apos;s phone passcode here or anywhere
          on the ticket.
        </p>
      </fieldset>
    </div>
  )
}
