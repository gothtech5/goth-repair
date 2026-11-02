// Thanksgiving 2026 offer: $10 off a repair when booked online.
// Safe to import from client and server code (no secrets here).
// To change the dates, edit this file only.

export const OFFER_CODE = "THANKS10"
export const OFFER_TITLE = "Thanksgiving Special"
export const OFFER_DISCOUNT = "$10 off your repair"
export const OFFER_DATES = "Nov 2–30, 2026"
export const OFFER_TERMS =
  "One per customer on a repair service. Cannot be combined with other offers."

/** Bookings are accepted from Nov 2 through the end of Nov 30 in Minneapolis (CST, UTC-6). */
const OFFER_STARTS_AT = Date.parse("2026-11-02T06:00:00Z")
const OFFER_ENDS_AT = Date.parse("2026-12-01T06:00:00Z")

/** The appointment itself must also fall inside the offer dates. */
const FIRST_APPOINTMENT = "2026-11-02"
const LAST_APPOINTMENT = "2026-11-30"

export function isOfferActive(now: number = Date.now()): boolean {
  return now >= OFFER_STARTS_AT && now < OFFER_ENDS_AT
}

/** `date` is the appointment date as YYYY-MM-DD. */
export function appointmentQualifies(date: string | null | undefined): boolean {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  return date >= FIRST_APPOINTMENT && date <= LAST_APPOINTMENT
}

/** The server's decision: is this online booking getting the discount? */
export function offerAppliesToBooking(
  date: string | null | undefined,
  now: number = Date.now(),
): boolean {
  return isOfferActive(now) && appointmentQualifies(date)
}
