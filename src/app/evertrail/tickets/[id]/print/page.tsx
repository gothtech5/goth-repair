import Link from "next/link"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError, type Row } from "@/lib/evertrail/db"
import { dollars, one, type Search } from "@/lib/evertrail/format"
import { balanceCents, loadTicket, niceDate } from "@/lib/evertrail/tickets"
import { SHOP } from "@/lib/evertrail/ticket-info"
import { linkClass } from "@/components/evertrail/shell"
import { PrintButton } from "@/components/evertrail/print-button"

export const dynamic = "force-dynamic"

/**
 * The customer receipt for one repair ticket.
 * Technician notes are staff-only and are never printed here.
 */
export default async function PrintTicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Search
}) {
  await requireAuth()
  const { id } = await params
  const query = await searchParams

  let error = ""
  let t: Row | undefined
  try {
    t = await loadTicket(id)
    if (!t) error = "That ticket was not found."
  } catch (e) {
    error = "Could not load the ticket: " + friendlyError(e)
  }

  if (!t) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-black">
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        <Link href="/evertrail/tickets" className={linkClass}>
          Back to all tickets
        </Link>
      </div>
    )
  }

  const price = Number(t.price_cents ?? 0)
  const deposit = Number(t.deposit_cents ?? 0)
  const paid = Number(t.paid_cents ?? 0)

  return (
    <div className="min-h-screen bg-neutral-100 py-6 text-black print:min-h-0 print:bg-white print:py-0">
      <style>{`@page { size: letter; margin: 0.5in; }`}</style>

      <div className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center gap-4 px-4 print:hidden">
        <PrintButton autoPrint={one(query.auto) === "1"} label="Print ticket" />
        <Link href={`/evertrail/tickets/${t.id}`} className={linkClass}>
          Back to ticket
        </Link>
        <span className="text-xs text-neutral-600">Technician notes are not printed.</span>
      </div>

      <article className="mx-auto max-w-2xl bg-white px-8 py-8 shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <p className="text-3xl font-bold tracking-tight">{SHOP.name}</p>
            <p className="text-sm text-neutral-700">Phone, iPad &amp; Device Repair</p>
          </div>
          <div className="text-right text-sm leading-relaxed">
            <p className="font-semibold">{SHOP.website}</p>
            <p>{SHOP.phone}</p>
            <p>{SHOP.addressLine1}</p>
            <p>{SHOP.addressLine2}</p>
            <p>{SHOP.hours}</p>
          </div>
        </header>

        <section className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Repair ticket</p>
            <p className="font-mono text-3xl font-bold">{t.ticket_number}</p>
          </div>
          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm">
            <dt className="text-neutral-600">Date received</dt>
            <dd className="text-right font-medium">{niceDate(t.date_received)}</dd>
            <dt className="text-neutral-600">Est. completion</dt>
            <dd className="text-right font-medium">{niceDate(t.estimated_completion) || "To be confirmed"}</dd>
            <dt className="text-neutral-600">Status</dt>
            <dd className="text-right font-medium">{t.status}</dd>
          </dl>
        </section>

        <section className="mt-6 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Customer
            </h2>
            <p className="font-medium">{t.customer_name}</p>
            <p className="text-sm">{t.customer_phone}</p>
            {t.alt_phone ? <p className="text-sm">Alternate: {t.alt_phone}</p> : null}
          </div>
          <div>
            <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Device
            </h2>
            <p className="font-medium">
              {t.device_brand} {t.device_model}
            </p>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          <div>
            <h2 className="mb-1 border-b border-neutral-300 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Repair issue
            </h2>
            <p className="text-sm whitespace-pre-line">{t.issue}</p>
          </div>
          {t.device_condition ? (
            <div>
              <h2 className="mb-1 border-b border-neutral-300 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Device condition when received
              </h2>
              <p className="text-sm whitespace-pre-line">{t.device_condition}</p>
            </div>
          ) : null}
        </section>

        <section className="mt-6 ml-auto w-full max-w-xs">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-neutral-700">Estimated repair price</td>
                <td className="py-1 text-right">${dollars(price)}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-700">Deposit paid</td>
                <td className="py-1 text-right">−${dollars(deposit)}</td>
              </tr>
              {paid > 0 ? (
                <tr>
                  <td className="py-1 text-neutral-700">Paid at pickup</td>
                  <td className="py-1 text-right">−${dollars(paid)}</td>
                </tr>
              ) : null}
              <tr className="border-t-2 border-black">
                <td className="py-2 font-bold">Remaining balance</td>
                <td className="py-2 text-right text-lg font-bold">${dollars(balanceCents(t))}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-10 grid gap-8 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <div className="h-10 border-b border-black" />
            <p className="mt-1 text-xs text-neutral-600">Customer signature</p>
          </div>
          <div>
            <div className="h-10 border-b border-black" />
            <p className="mt-1 text-xs text-neutral-600">Date</p>
          </div>
        </section>

        <footer className="mt-10 border-t border-neutral-300 pt-4 text-center text-xs leading-relaxed text-neutral-700">
          <p>Please bring this ticket when you pick up your device.</p>
          <p>
            Questions about your repair? Call {SHOP.phone} and mention ticket{" "}
            <span className="font-mono font-semibold">{t.ticket_number}</span>.
          </p>
          <p className="mt-2 font-semibold text-black">
            Thank you for choosing {SHOP.name} · {SHOP.website}
          </p>
        </footer>
      </article>
    </div>
  )
}
