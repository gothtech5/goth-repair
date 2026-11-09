import Link from "next/link"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError, type Row } from "@/lib/evertrail/db"
import { dollars, one, type Search } from "@/lib/evertrail/format"
import { niceDate, searchTickets } from "@/lib/evertrail/tickets"
import { TICKET_STATUSES } from "@/lib/evertrail/ticket-info"
import { StatusBadge } from "@/components/evertrail/status-badge"
import { Shell, buttonClass, inputClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

export default async function TicketsPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const q = one(params.q).trim()
  const status = one(params.status)

  let error = one(params.err)
  let tickets: Row[] = []
  try {
    tickets = await searchTickets(q, status)
  } catch (e) {
    error = "Could not load repair tickets: " + friendlyError(e)
  }

  return (
    <Shell title="Repair tickets" error={error} notice={one(params.ok)}>
      <div className="mb-6">
        <Link href="/evertrail/tickets/new" className={buttonClass + " inline-block"}>
          + New repair ticket
        </Link>
      </div>

      <form method="get" className="mb-2 flex flex-wrap gap-2 sm:flex-nowrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search customer name, phone number or ticket number"
          className={inputClass}
        />
        <select name="status" defaultValue={status} className={inputClass + " sm:w-56"} aria-label="Status">
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>
      <p className="mb-4 text-sm text-neutral-700">
        Tap a ticket number to open, edit or print it.
        {q || status ? (
          <>
            {" "}
            <Link href="/evertrail/tickets" className={linkClass}>
              Show all tickets
            </Link>
          </>
        ) : null}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-400 text-left">
              <th className="py-2 pr-3">Ticket</th>
              <th className="py-2 pr-3">Customer</th>
              <th className="py-2 pr-3">Phone</th>
              <th className="py-2 pr-3">Device</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Received</th>
              <th className="py-2 pr-3">Est. done</th>
              <th className="py-2 pr-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b border-neutral-200 align-top">
                <td className="pr-3">
                  <Link
                    href={`/evertrail/tickets/${t.id}`}
                    className="block py-3 font-mono font-semibold whitespace-nowrap text-blue-700 underline"
                  >
                    {t.ticket_number}
                  </Link>
                </td>
                <td className="py-3 pr-3 font-medium">{t.customer_name}</td>
                <td className="py-3 pr-3 whitespace-nowrap">{t.customer_phone}</td>
                <td className="py-3 pr-3">
                  {t.device_brand} {t.device_model}
                </td>
                <td className="py-3 pr-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="py-3 pr-3 whitespace-nowrap">{niceDate(t.date_received)}</td>
                <td className="py-3 pr-3 whitespace-nowrap">{niceDate(t.estimated_completion) || "-"}</td>
                <td className="py-3 pr-3 text-right whitespace-nowrap">
                  ${dollars(Number(t.price_cents ?? 0) - Number(t.deposit_cents ?? 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && !error ? (
          <p className="py-6 text-sm text-neutral-600">
            {q || status ? "No tickets match that search." : "No repair tickets yet. Create your first one above."}
          </p>
        ) : null}
      </div>
    </Shell>
  )
}
