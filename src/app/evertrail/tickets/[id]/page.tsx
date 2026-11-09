import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError, type Row } from "@/lib/evertrail/db"
import { dollars, one, text, toCents, toInt, type Search } from "@/lib/evertrail/format"
import {
  balanceCents,
  loadTicket,
  niceDate,
  readTicketForm,
  recordPayment,
  setStatus,
  updateTicket,
} from "@/lib/evertrail/tickets"
import {
  TICKET_STATUSES,
  dropOffText,
  readyText,
  smsHref,
  type TicketStatus,
} from "@/lib/evertrail/ticket-info"
import { SQUARE_POS_RETURN_URL, squarePosHref, squarePosReady } from "@/lib/evertrail/square-pos"
import { Shell, Field, buttonClass, inputClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"
import { TicketFields } from "@/components/evertrail/ticket-fields"
import { StatusBadge } from "@/components/evertrail/status-badge"

export const dynamic = "force-dynamic"

async function saveTicket(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const { ticket, error } = readTicketForm(formData)
  let target = `/evertrail/tickets/${id}`
  if (error) {
    target += "?err=" + encodeURIComponent(error + " Nothing was saved.")
  } else {
    try {
      const number = await updateTicket(id, ticket)
      target = number
        ? `/evertrail/tickets/${id}?ok=` + encodeURIComponent(`Ticket ${number} saved.`)
        : "/evertrail/tickets?err=" + encodeURIComponent("That ticket no longer exists.")
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function changeStatus(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const status = text(formData.get("status"))
  let target = `/evertrail/tickets/${id}`
  if (!(TICKET_STATUSES as readonly string[]).includes(status) || status === "Collected") {
    // "Collected" goes through the pickup check below, not this quick button.
    target += "?err=" + encodeURIComponent("Choose a status.")
  } else {
    try {
      const number = await setStatus(id, status as TicketStatus)
      target += "?ok=" + encodeURIComponent(`${number}: status changed to ${status}.`)
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function recordOtherPayment(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const cents = toCents(formData.get("amount"))
  const method = text(formData.get("method")) || "Other"
  let target = `/evertrail/tickets/${id}`
  if (cents <= 0) {
    target += "?err=" + encodeURIComponent("Enter the amount that was paid.")
  } else {
    try {
      const when = new Date().toLocaleDateString("en-US", { timeZone: "America/Chicago" })
      const number = await recordPayment(id, cents, `${method} $${dollars(cents)} on ${when} (entered by staff)`)
      target += "?ok=" + encodeURIComponent(`Payment of $${dollars(cents)} recorded on ${number}.`)
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function markCollected(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  let target = `/evertrail/tickets/${id}`
  if (formData.get("device_checked") !== "on") {
    target += "?err=" + encodeURIComponent("Tick the box to confirm you checked the device before marking it Collected.")
  } else {
    try {
      const t = await loadTicket(String(id))
      const owed = t ? balanceCents(t) : 0
      if (t && owed > 0 && formData.get("unpaid_ok") !== "on") {
        target +=
          "?err=" +
          encodeURIComponent(`$${dollars(owed)} is still unpaid. Take the payment first, or tick "leaving without paying".`)
      } else {
        const number = await setStatus(id, "Collected")
        target += "?ok=" + encodeURIComponent(`${number} marked Collected.`)
      }
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Search
}) {
  await requireAuth()
  const { id } = await params
  const query = await searchParams

  let error = one(query.err)
  let t: Row | undefined
  try {
    t = await loadTicket(id)
    if (!t && !error) error = "That ticket was not found."
  } catch (e) {
    error = "Could not load the ticket: " + friendlyError(e)
  }

  if (!t) {
    return (
      <Shell title="Repair ticket" error={error}>
        <Link href="/evertrail/tickets" className={linkClass}>
          Back to all tickets
        </Link>
      </Shell>
    )
  }

  const price = Number(t.price_cents ?? 0)
  const deposit = Number(t.deposit_cents ?? 0)
  const paid = Number(t.paid_cents ?? 0)
  const owed = balanceCents(t)
  const collected = t.status === "Collected"
  const device = `${t.device_brand ?? ""} ${t.device_model ?? ""}`.trim()

  // Texting: only with the customer's permission, to the number they chose.
  const textOk = t.text_ok === "true" || t.text_ok === "t"
  const textNumber = t.text_to === "alt" && t.alt_phone ? t.alt_phone : (t.customer_phone ?? "")
  const forText = {
    ...t,
    date_received_text: niceDate(t.date_received),
    balance_text: owed > 0 ? `$${dollars(owed)}` : "",
  }
  const posReady = squarePosReady()

  return (
    <Shell title={`Ticket ${t.ticket_number}`} error={error} notice={one(query.ok)}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={t.status} />
        <span className="text-sm text-neutral-700">
          {t.customer_name} · {device} · received {niceDate(t.date_received)}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href={`/evertrail/tickets/${t.id}/print?auto=1`} className={buttonClass + " inline-block"}>
          Print ticket
        </Link>
        {textOk && textNumber ? (
          <a href={smsHref(textNumber, dropOffText(forText))} className={smallButtonClass + " py-2"}>
            Text ticket to {textNumber}
          </a>
        ) : (
          <span className="text-xs text-neutral-600">Texting is off: the customer hasn&apos;t agreed to texts.</span>
        )}
        <Link href="/evertrail/tickets/new" className={smallButtonClass + " py-2"}>
          + New ticket
        </Link>
        <Link href="/evertrail/tickets" className={linkClass}>
          Back to all tickets
        </Link>
      </div>

      {/* ---------- Status ---------- */}
      <section className="mb-6 rounded-lg border border-neutral-300 p-4">
        <h2 className="mb-3 text-lg font-semibold">Repair status</h2>
        {collected ? (
          <p className="text-sm">Collected {t.collected_text ? "on " + t.collected_text : ""}.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {TICKET_STATUSES.filter((s) => s !== "Collected").map((s) => (
              <form key={s} action={changeStatus}>
                <input type="hidden" name="id" value={t.id ?? ""} />
                <input type="hidden" name="status" value={s} />
                <button
                  type="submit"
                  className={s === t.status ? buttonClass : smallButtonClass + " py-2"}
                  aria-pressed={s === t.status}
                >
                  {s}
                </button>
              </form>
            ))}
          </div>
        )}
        {t.status === "Ready for Pickup" && textOk && textNumber ? (
          <div className="mt-4 rounded-md border border-green-300 bg-green-50 p-3">
            <p className="mb-2 text-sm">Message to send:</p>
            <p className="mb-3 text-sm italic">&ldquo;{readyText(t)}&rdquo;</p>
            <a href={smsHref(textNumber, readyText(t))} className={buttonClass + " inline-block"}>
              Text &ldquo;ready for pickup&rdquo; to {textNumber}
            </a>
            <p className="mt-2 text-xs text-neutral-600">
              Opens Messages on this iPhone or iPad with the text filled in. Check it, then tap Send.
            </p>
          </div>
        ) : null}
      </section>

      {/* ---------- Pickup and payment ---------- */}
      <section className="mb-6 rounded-lg border-2 border-neutral-800 p-4">
        <h2 className="mb-3 text-lg font-semibold">Pickup and payment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-sm">
            <p className="mb-1 font-semibold">Check it&apos;s the right device</p>
            <p>
              <span className="font-medium">{device}</span> · {t.customer_name} · {t.customer_phone}
              {t.alt_phone ? ` · alt ${t.alt_phone}` : ""}
            </p>
            <p className="mt-1 text-neutral-700">Repair: {t.issue}</p>
            {t.device_condition ? <p className="text-neutral-700">Condition at drop-off: {t.device_condition}</p> : null}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-0.5 text-neutral-700">Estimated price</td>
                <td className="py-0.5 text-right">${dollars(price)}</td>
              </tr>
              <tr>
                <td className="py-0.5 text-neutral-700">Deposit</td>
                <td className="py-0.5 text-right">−${dollars(deposit)}</td>
              </tr>
              {paid > 0 ? (
                <tr>
                  <td className="py-0.5 text-neutral-700">Paid at pickup</td>
                  <td className="py-0.5 text-right">−${dollars(paid)}</td>
                </tr>
              ) : null}
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold">Balance due</td>
                <td className="py-1 text-right text-lg font-bold">${dollars(owed)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {!collected && owed > 0 ? (
          <div className="mt-4 space-y-4">
            {posReady ? (
              <div>
                <a href={squarePosHref(t.id ?? "", t.ticket_number ?? "", owed)} className={buttonClass + " inline-block"}>
                  Charge ${dollars(owed)} in Square
                </a>
                <p className="mt-1 text-xs text-neutral-600">
                  Opens the Square Point of Sale app on this iPhone or iPad with the amount and ticket number filled in.
                  After payment, Square comes back here and the payment is recorded.
                </p>
              </div>
            ) : (
              <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                The &ldquo;Charge in Square&rdquo; button needs a one-time setup: add SQUARE_APPLICATION_ID in Vercel and set
                the Web callback URL in the Square Developer Console to {SQUARE_POS_RETURN_URL}. Until then, charge in
                the Square app as usual and record it below.
              </p>
            )}
            <form action={recordOtherPayment} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={t.id ?? ""} />
              <div className="w-32">
                <Field label="Amount paid ($)">
                  <input name="amount" inputMode="decimal" defaultValue={dollars(owed)} className={inputClass} />
                </Field>
              </div>
              <div className="w-48">
                <Field label="How">
                  <select name="method" className={inputClass}>
                    <option>Square app</option>
                    <option>Cash</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
              <button type="submit" className={smallButtonClass + " py-2"}>
                Record payment taken another way
              </button>
            </form>
          </div>
        ) : null}

        {t.payment_notes ? (
          <div className="mt-4 text-xs text-neutral-700">
            <p className="font-semibold">Payments</p>
            <p className="whitespace-pre-line">{t.payment_notes}</p>
          </div>
        ) : null}

        {!collected ? (
          <form action={markCollected} className="mt-4 space-y-2 border-t border-neutral-300 pt-4 text-sm">
            <input type="hidden" name="id" value={t.id ?? ""} />
            <label className="flex items-start gap-2">
              <input name="device_checked" type="checkbox" required className="mt-1 size-4" />
              <span>I checked the device is the {device} on this ticket and gave it to the customer.</span>
            </label>
            {owed > 0 ? (
              <label className="flex items-start gap-2 text-red-800">
                <input name="unpaid_ok" type="checkbox" className="mt-1 size-4" />
                <span>Customer is leaving without paying the ${dollars(owed)} balance.</span>
              </label>
            ) : null}
            <button type="submit" className={buttonClass}>
              Mark Collected
            </button>
          </form>
        ) : null}
      </section>

      {/* ---------- Edit everything ---------- */}
      <details className="rounded-lg border border-neutral-300 p-4">
        <summary className="cursor-pointer text-lg font-semibold">Edit ticket details</summary>
        <form action={saveTicket} className="mt-4">
          <input type="hidden" name="id" value={t.id ?? ""} />
          <TicketFields
            ticket={{
              customer_name: t.customer_name ?? "",
              customer_phone: t.customer_phone ?? "",
              alt_phone: t.alt_phone ?? "",
              text_ok: textOk,
              text_to: t.text_to ?? "main",
              device_brand: t.device_brand ?? "",
              device_model: t.device_model ?? "",
              issue: t.issue ?? "",
              device_condition: t.device_condition ?? "",
              price: dollars(t.price_cents),
              deposit: dollars(t.deposit_cents),
              date_received: (t.date_received ?? "").slice(0, 10),
              estimated_completion: (t.estimated_completion ?? "").slice(0, 10),
              status: t.status ?? "Received",
              technician_notes: t.technician_notes ?? "",
            }}
          />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className={buttonClass}>
              Save changes
            </button>
          </div>
        </form>
      </details>
      <p className="mt-3 text-xs text-neutral-600">
        Created {t.created_text} · last saved {t.updated_text}
      </p>
    </Shell>
  )
}
