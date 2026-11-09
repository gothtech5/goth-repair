import { NextResponse } from "next/server"
import { isLoggedIn } from "@/lib/evertrail/auth"
import { dollars } from "@/lib/evertrail/format"
import { paymentAlreadyRecorded, recordPayment } from "@/lib/evertrail/tickets"
import { confirmedAmount, posErrorMessage, readPosResult } from "@/lib/evertrail/square-pos"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Square Point of Sale sends the iPhone/iPad back here after a "Charge in Square" payment.
 * Records the payment on the ticket, then shows the ticket again.
 * Only works for someone logged in to Evertrail (the login cookie comes with this address).
 */
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url)
  const back = (path: string) => NextResponse.redirect(new URL(path, url.origin), 303)

  if (!(await isLoggedIn())) return back("/evertrail")

  const result = readPosResult(url.searchParams)
  const match = /^ticket:(\d+):(\d+)$/.exec(result.state ?? "")
  if (!match) {
    return back("/evertrail/tickets?err=" + encodeURIComponent("Square returned, but without a ticket. Check Square for the payment."))
  }
  const id = Number(match[1])
  const requested = Number(match[2])
  const ticketPage = `/evertrail/tickets/${id}`

  if (result.status !== "ok") {
    return back(ticketPage + "?err=" + encodeURIComponent(posErrorMessage(result.error_code)))
  }

  // Use Square's own record of the payment when it can be looked up; otherwise the amount that was sent.
  const squareId = result.transaction_id || result.client_transaction_id || ""
  if (squareId && (await paymentAlreadyRecorded(id, squareId))) {
    return back(ticketPage + "?ok=" + encodeURIComponent("That Square payment is already recorded on this ticket."))
  }
  const confirmed = result.transaction_id ? await confirmedAmount(result.transaction_id) : null
  const cents = confirmed ?? requested
  const reference =
    `Square $${dollars(cents)} on ` +
    new Date().toLocaleDateString("en-US", { timeZone: "America/Chicago" }) +
    (squareId ? ` (Square ID ${squareId}` + (confirmed === null ? ", not yet confirmed with Square)" : ")") : "")

  const number = await recordPayment(id, cents, reference)
  if (!number) {
    return back("/evertrail/tickets?err=" + encodeURIComponent("Square took the payment, but that ticket no longer exists. Note it in Square."))
  }
  return back(
    ticketPage +
      "?ok=" +
      encodeURIComponent(`Square payment of $${dollars(cents)} recorded on ${number}. Check the device, then mark it Collected.`)
  )
}
