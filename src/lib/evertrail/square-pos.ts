// Taking a repair payment in the Square app on the shop's iPhone or iPad.
// Server-side only: never import this file from a "use client" component.
//
// How it works (Square "Point of Sale API", mobile web):
//   1. Evertrail's "Charge in Square" button opens the Square Point of Sale app with the
//      amount and a note ("Repair ticket GT-01001") already filled in.
//   2. Staff take the payment in Square as usual (card, cash, ...).
//   3. Square sends Safari back to SQUARE_POS_RETURN_URL, and Evertrail records the payment on the ticket.
//
// Settings (Vercel environment variables):
//   SQUARE_APPLICATION_ID - the Application ID of the "Evertrail" app in the Square Developer Console.
//                           It is not a secret (it is part of the link), but it lives in Vercel like the others.
//   SQUARE_LOCATION_ID    - already set for Square sales; makes sure the GothTech location takes the payment.
// One-time Square setup: Developer Console > Evertrail app > Point of Sale API > Web callback URL
//   = SQUARE_POS_RETURN_URL below.
// No extra Square fees: the payment is a normal in-person Square payment at your usual rate.

import { square, type Money } from "@/lib/evertrail/square"

/** The exact address to paste into Square's "Web callback URL" box. */
export const SQUARE_POS_RETURN_URL = "https://www.gothtechnology.com/evertrail/tickets/square-return"

/** True when the Application ID is set, so the "Charge in Square" button can be shown. */
export function squarePosReady(): boolean {
  return Boolean(process.env.SQUARE_APPLICATION_ID?.trim())
}

/** The link that opens Square Point of Sale ready to charge `cents` for this ticket. */
export function squarePosHref(ticketId: string, ticketNumber: string, cents: number): string {
  const location = process.env.SQUARE_LOCATION_ID?.trim()
  const data = {
    amount_money: { amount: cents, currency_code: "USD" },
    callback_url: SQUARE_POS_RETURN_URL,
    client_id: process.env.SQUARE_APPLICATION_ID?.trim() ?? "",
    version: "1.3",
    notes: `Repair ticket ${ticketNumber}`,
    // Square sends this back unchanged, so Evertrail knows which ticket was paid.
    state: `ticket:${ticketId}:${cents}`,
    ...(location ? { location_id: location } : {}),
    options: {
      supported_tender_types: ["CREDIT_CARD", "CASH", "OTHER", "SQUARE_GIFT_CARD", "CARD_ON_FILE"],
      auto_return: true,
    },
  }
  return "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(data))
}

/** What Square sends back after a payment attempt (iOS sends one JSON "data" value). */
export type PosResult = {
  status?: string
  transaction_id?: string
  client_transaction_id?: string
  error_code?: string
  state?: string
}

/** Reads Square's reply from the return address. Works for iPhone/iPad (data=JSON) and Android (separate values). */
export function readPosResult(params: URLSearchParams): PosResult {
  const raw = params.get("data")
  if (raw) {
    try {
      return JSON.parse(raw) as PosResult
    } catch {
      return { status: "error", error_code: "data_invalid" }
    }
  }
  // Android style
  const error = params.get("com.squareup.pos.ERROR_CODE")
  return {
    status: error ? "error" : params.get("com.squareup.pos.SERVER_TRANSACTION_ID") ? "ok" : "error",
    transaction_id: params.get("com.squareup.pos.SERVER_TRANSACTION_ID") ?? undefined,
    client_transaction_id: params.get("com.squareup.pos.CLIENT_TRANSACTION_ID") ?? undefined,
    error_code: error ?? undefined,
    state: params.get("com.squareup.pos.REQUEST_METADATA") ?? undefined,
  }
}

/** Square's error codes, in plain words. */
export function posErrorMessage(code: string | undefined): string {
  switch (code) {
    case "payment_canceled":
      return "The payment was canceled in Square. Nothing was charged."
    case "not_logged_in":
      return "Square Point of Sale is not signed in on this device. Sign in and try again."
    case "user_id_mismatch":
      return "Square is signed in to a different location than GothTech's. Switch location in Square and try again."
    case "could_not_perform":
      return "Square has an unfinished sale open. Finish or clear it in Square, then try again."
    case "no_network_connection":
      return "This device has no internet connection. Square could not take the payment."
    case "user_not_active":
      return "This Square location can't take card payments yet."
    case "data_invalid":
    case "invalid_tender_type":
    case "unsupported_api_version":
      return "Square could not read the payment request (" + code + "). Check SQUARE_APPLICATION_ID and the Web callback URL."
    default:
      return "Square did not take the payment" + (code ? " (" + code + ")." : ".")
  }
}

/**
 * Looks the payment up in Square to confirm it went through and how much was taken.
 * Gives the amount in cents, or null when Square can't be asked (no token, or an offline payment).
 */
export async function confirmedAmount(transactionId: string): Promise<number | null> {
  if (!process.env.SQUARE_ACCESS_TOKEN?.trim() || !transactionId) return null
  try {
    const reply = await square<{
      order?: { state?: string; total_money?: Money; total_tip_money?: Money }
    }>("/orders/" + encodeURIComponent(transactionId))
    const order = reply.order
    if (!order?.total_money) return null
    // A tip is the technician's, not part of the repair price, so it is left out.
    return Math.max(0, Number(order.total_money.amount ?? 0) - Number(order.total_tip_money?.amount ?? 0))
  } catch {
    return null
  }
}
