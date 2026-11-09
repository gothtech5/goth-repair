import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError } from "@/lib/evertrail/db"
import { one, type Search } from "@/lib/evertrail/format"
import { createTicket, readTicketForm, todayInMinneapolis } from "@/lib/evertrail/tickets"
import { Shell, buttonClass, linkClass } from "@/components/evertrail/shell"
import { TicketFields } from "@/components/evertrail/ticket-fields"

export const dynamic = "force-dynamic"

async function saveNewTicket(formData: FormData) {
  "use server"
  await requireAuth()

  const { ticket, error } = readTicketForm(formData)
  let target = ""
  if (error) {
    target = "/evertrail/tickets/new?err=" + encodeURIComponent(error + " The ticket was not saved.")
  } else {
    try {
      const saved = await createTicket(ticket)
      target =
        `/evertrail/tickets/${saved.id}?ok=` +
        encodeURIComponent(`Ticket ${saved.ticket_number} saved for ${ticket.customer_name}.`)
    } catch (e) {
      target = "/evertrail/tickets/new?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function NewTicketPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams

  return (
    <Shell title="New repair ticket" error={one(params.err)}>
      <p className="mb-6 text-sm text-neutral-700">
        A ticket number is created automatically when you save.{" "}
        <Link href="/evertrail/tickets" className={linkClass}>
          Back to all tickets
        </Link>
      </p>
      <form action={saveNewTicket} className="rounded-lg border border-neutral-300 p-4">
        <TicketFields ticket={{ date_received: todayInMinneapolis(), status: "Received" }} />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" className={buttonClass}>
            Save ticket
          </button>
          <Link href="/evertrail/tickets" className={linkClass}>
            Cancel
          </Link>
        </div>
      </form>
    </Shell>
  )
}
