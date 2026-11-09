// Repair ticket statuses and the shop details printed on customer receipts.
// Safe to use from any page or component.

export const TICKET_STATUSES = [
  "Received",
  "Diagnosing",
  "Waiting for Parts",
  "In Progress",
  "Ready for Pickup",
  "Collected",
] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]

/** Colour for each status badge on the ticket list. */
export const STATUS_STYLE: Record<TicketStatus, string> = {
  Received: "bg-neutral-100 text-neutral-800 border-neutral-300",
  Diagnosing: "bg-blue-50 text-blue-800 border-blue-300",
  "Waiting for Parts": "bg-amber-50 text-amber-800 border-amber-300",
  "In Progress": "bg-indigo-50 text-indigo-800 border-indigo-300",
  "Ready for Pickup": "bg-green-50 text-green-800 border-green-400",
  Collected: "bg-neutral-50 text-neutral-500 border-neutral-200",
}

/** Printed at the top and bottom of every customer receipt. Change these here if anything changes. */
export const SHOP = {
  name: "GothTech",
  website: "gothtechnology.com",
  phone: "(612) 987-8107",
  email: "gothtechnology5@gmail.com",
  addressLine1: "200 W Lake St #203",
  addressLine2: "Minneapolis, MN 55408",
  hours: "Open every day, 11:00 AM – 9:00 PM",
}

// ---------- Text messages ----------
// Square has no way for other apps to send texts, so Evertrail prepares the message and opens
// the Messages app on the shop's iPhone or iPad with it filled in. Staff check it and tap Send.
// No texting service, no monthly cost, and nothing is sent without a person pressing Send.

/** The ticket fields the messages use. */
export type TicketForText = {
  ticket_number?: string | null
  customer_name?: string | null
  device_brand?: string | null
  device_model?: string | null
  issue?: string | null
  date_received_text?: string
  balance_text?: string
}

function firstName(name: string | null | undefined): string {
  return (name ?? "").trim().split(/\s+/)[0] || "there"
}

function device(t: TicketForText): string {
  return [t.device_brand, t.device_model].filter(Boolean).join(" ").trim() || "device"
}

/** The drop-off ticket, as a text message. */
export function dropOffText(t: TicketForText): string {
  return [
    `GothTech repair ticket ${t.ticket_number}`,
    `Device: ${device(t)}`,
    `Repair: ${(t.issue ?? "").trim()}`,
    `Received: ${t.date_received_text ?? ""}`,
    t.balance_text ? `Balance due at pickup: ${t.balance_text}` : "",
    `Questions? Call ${SHOP.phone} and mention your ticket number.`,
    `${SHOP.addressLine1}, ${SHOP.addressLine2} · ${SHOP.website} · Open daily 11 AM – 9 PM`,
  ]
    .filter(Boolean)
    .join("\n")
}

/** The "ready for pickup" message. */
export function readyText(t: TicketForText): string {
  return (
    `Hi ${firstName(t.customer_name)}, your ${device(t)} is ready for pickup at GothTech. ` +
    `Your ticket number is ${t.ticket_number}. We're open daily from 11 AM to 9 PM.`
  )
}

/**
 * A link that opens the Messages app addressed to `phone` with `body` filled in.
 * The "?&body=" form works on both iPhone/iPad and Android.
 */
export function smsHref(phone: string, body: string): string {
  const digits = phone.replace(/[^\d+]/g, "")
  return `sms:${digits}?&body=${encodeURIComponent(body)}`
}
