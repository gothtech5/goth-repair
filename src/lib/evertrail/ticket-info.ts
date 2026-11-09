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
