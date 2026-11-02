// Remembers which ad or link brought a visitor to the booking page, so the
// booking record can say where it came from. Holds only the ad's labels (no
// personal data) and lasts until the browser tab is closed.

const KEY = "gt_booking_source"

export interface BookingSource {
  source?: string
  medium?: string
  campaign?: string
  content?: string
}

/** Call when the booking page opens. Keeps the first source seen in this tab. */
export function captureBookingSource(params: URLSearchParams): void {
  try {
    if (window.sessionStorage.getItem(KEY)) return
    const found: BookingSource = {}
    for (const name of ["source", "medium", "campaign", "content"] as const) {
      const value = params.get(`utm_${name}`)
      if (value) found[name] = value.slice(0, 60)
    }
    if (found.source) window.sessionStorage.setItem(KEY, JSON.stringify(found))
  } catch {
    // Storage blocked (private mode etc.) — the booking still works.
  }
}

export function readBookingSource(): BookingSource | null {
  try {
    const saved = window.sessionStorage.getItem(KEY)
    return saved ? (JSON.parse(saved) as BookingSource) : null
  } catch {
    return null
  }
}
