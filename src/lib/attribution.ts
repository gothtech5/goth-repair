/**
 * Remembers which ad or tracked link brought a visitor to the booking page, so
 * the booking can be labeled with its source. Kept for this browser tab only
 * and contains no personal details.
 */

const STORAGE_KEY = "gt_booking_source"

export interface BookingSource {
  source: string
  medium: string
  campaign: string
  content: string
}

/** Call when the booking page opens. A link with tracking details replaces any earlier one. */
export function captureBookingSource(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    const source = params.get("utm_source")
    const fromFacebookClick = params.has("fbclid")
    if (!source && !fromFacebookClick) return

    const saved: BookingSource = {
      source: source ?? "facebook",
      medium: params.get("utm_medium") ?? (source ? "" : "click"),
      campaign: params.get("utm_campaign") ?? "",
      content: params.get("utm_content") ?? "",
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Storage blocked (private mode etc.) — the booking still works, without a source.
  }
}

export function readBookingSource(): BookingSource | null {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as BookingSource) : null
  } catch {
    return null
  }
}
