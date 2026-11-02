// Thanksgiving 2026 offer: settings shared by the booking page, booking API and emails.
// Safe to import from client and server code (no secrets here).

export const THANKSGIVING_CODE = "THANKSGIVING10"

/** Starts at the beginning of November 5, 2026 in Minneapolis (CST, UTC-6). */
export const THANKSGIVING_STARTS_AT = Date.parse("2026-11-05T06:00:00Z")

/** Ends at the end of November 30, 2026 in Minneapolis (CST, UTC-6). */
export const THANKSGIVING_ENDS_AT = Date.parse("2026-12-01T06:00:00Z")

/** Appointments after this date do not qualify. Same format as the booking date. */
export const THANKSGIVING_LAST_APPOINTMENT = "2026-11-30"

export const THANKSGIVING_DATES_LABEL = "November 5\u201330, 2026"

export const THANKSGIVING_DISCOUNT_LABEL = "$10 off repair (Thanksgiving offer)"

export const THANKSGIVING_TERMS =
  "Book online for a walk-in appointment by November 30, 2026. One $10 discount per customer on a repair service. Cannot be combined with other offers."

/**
 * Test deployments act as if the offer is running, so it can be checked before
 * November 5. The live site never uses this.
 */
function offerClock(now: number): number {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? THANKSGIVING_STARTS_AT : now
}

export function isThanksgivingActive(now: number = Date.now()): boolean {
  const time = offerClock(now)
  return time >= THANKSGIVING_STARTS_AT && time < THANKSGIVING_ENDS_AT
}

/** True when a booking made now gets the discount. The booking API has the final say. */
export function qualifiesForThanksgiving(
  booking: { repairType: string | null; date: string | null },
  now: number = Date.now(),
): boolean {
  if (!isThanksgivingActive(now)) return false
  if (booking.repairType !== "walk-in" || !booking.date) return false
  return booking.date <= THANKSGIVING_LAST_APPOINTMENT
}
