// Halloween 2026 offer: settings shared by the popup, banners, signup page and API.
// Safe to import from client and server code (no secrets here).

export const HALLOWEEN_CODE = "HALLOWEEN10"

/** The offer runs until the end of October 31, 2026 in Minneapolis (CDT, UTC-5). */
export const HALLOWEEN_ENDS_AT = Date.parse("2026-11-01T05:00:00Z")

export const HALLOWEEN_END_LABEL = "October 31, 2026"

export const HALLOWEEN_TERMS =
  "One $10 discount per customer on a repair service. Cannot be combined with other offers."

/** Fired on window to open the Halloween popup from a banner. */
export const OPEN_HALLOWEEN_EVENT = "gt:open-halloween"

/** localStorage key: set after a successful signup so the popup never shows again. */
export const SIGNED_UP_KEY = "gt_halloween_signed_up"

/** sessionStorage key: set once the popup has shown during this visit. */
export const SHOWN_THIS_VISIT_KEY = "gt_halloween_shown"

export function isHalloweenActive(now: number = Date.now()): boolean {
  return now < HALLOWEEN_ENDS_AT
}

/** Opens the Halloween popup. Returns false when it could not (e.g. no window). */
export function openHalloweenPopup(): boolean {
  if (typeof window === "undefined") return false
  window.dispatchEvent(new Event(OPEN_HALLOWEEN_EVENT))
  return true
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
