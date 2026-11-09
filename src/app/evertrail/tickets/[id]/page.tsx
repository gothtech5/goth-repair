import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError, type Row } from "@/lib/evertrail/db"
import { dollars, one, toInt, type Search } from "@/lib/evertrail/format"
import { loadTicket, niceDate, readTicketForm, updateTicket } from "@/lib/evertrail/tickets"
import { Shell, buttonClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"
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

  return (
    <Shell title={`Ticket ${t.ticket_number}`} error={error} notice={one(query.ok)}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={t.status} />
        <span className="text-sm text-neutral-700">
          {t.customer_name} · {t.device_brand} {t.device_model} · received {niceDate(t.date_received)}
        </span>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href={`/evertrail/tickets/${t.id}/print?auto=1`} className={buttonClass + " inline-block"}>
          Print ticket
        </Link>
        <Link href="/evertrail/tickets/new" className={smallButtonClass + " py-2"}>
          + New ticket
        </Link>
        <Link href="/evertrail/tickets" className={linkClass}>
          Back to all tickets
        </Link>
      </div>

      <form action={saveTicket} className="rounded-lg border border-neutral-300 p-4">
        <input type="hidden" name="id" value={t.id ?? ""} />
        <TicketFields
          ticket={{
            customer_name: t.customer_name ?? "",
            customer_phone: t.customer_phone ?? "",
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
          <Link href="/evertrail/tickets" className={linkClass}>
            Cancel
          </Link>
        </div>
      </form>
      <p className="mt-3 text-xs text-neutral-600">
        Created {t.created_text} · last saved {t.updated_text}
      </p>
    </Shell>
  )
}
