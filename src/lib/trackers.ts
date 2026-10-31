/**
 * Loads Google Analytics, Google Ads and the Meta (Facebook) Pixel —
 * but only the ones the visitor has allowed.
 *
 * Nothing here runs until applyTrackers() is called by the cookie banner
 * (src/components/consent/consent-manager.tsx). Until then no tracking
 * script is downloaded and no tracking cookie is set.
 */

import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  META_PIXEL_ID,
  type ConsentChoice,
} from "@/lib/consent"

interface MetaPixel {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: MetaPixel
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: MetaPixel
    _fbq?: MetaPixel
  }
}

const started = { googleScript: false, analytics: false, ads: false, pixel: false }

function addScript(src: string): void {
  const script = document.createElement("script")
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

/** Google Consent Mode v2 signals for the visitor's choice. */
function googleConsent(choice: ConsentChoice) {
  return {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.advertising ? "granted" : "denied",
    ad_user_data: choice.advertising ? "granted" : "denied",
    ad_personalization: choice.advertising ? "granted" : "denied",
  }
}

/** Sets up Google's command queue with everything denied by default. */
function ensureGtag(): void {
  if (window.gtag) return
  const dataLayer = (window.dataLayer = window.dataLayer || [])
  window.gtag = function gtag() {
    // Google's tag expects the raw `arguments` object here, not an array.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
  }
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

function startGoogle(choice: ConsentChoice): void {
  ensureGtag()
  const gtag = window.gtag!
  gtag("consent", "update", googleConsent(choice))

  if (!choice.analytics && !choice.advertising) return

  if (!started.googleScript) {
    started.googleScript = true
    gtag("js", new Date())
    const firstId = choice.analytics ? GA_MEASUREMENT_ID : GOOGLE_ADS_ID
    addScript(`https://www.googletagmanager.com/gtag/js?id=${firstId}`)
  }
  if (choice.analytics && !started.analytics) {
    started.analytics = true
    gtag("config", GA_MEASUREMENT_ID, isGaDebug() ? { debug_mode: true } : {})
  }
  if (choice.advertising && !started.ads) {
    started.ads = true
    gtag("config", GOOGLE_ADS_ID)
  }
}

function startMetaPixel(): void {
  if (started.pixel) return
  started.pixel = true

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    } as MetaPixel
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = "2.0"
    fbq.queue = []
    window.fbq = fbq
    if (!window._fbq) window._fbq = fbq
    addScript("https://connect.facebook.net/en_US/fbevents.js")
  }

  window.fbq!("consent", "grant")
  window.fbq!("init", META_PIXEL_ID)
  window.fbq!("track", "PageView")
}

/** Turns on the trackers the visitor allowed. Safe to call more than once. */
export function applyTrackers(choice: ConsentChoice): void {
  if (choice.analytics || choice.advertising || window.gtag) startGoogle(choice)
  if (choice.advertising) startMetaPixel()
}

/** Remembers which bookings were already reported, so each is counted once. */
const LEAD_SENT_KEY = "gt_leads_sent"
const leadsSentThisPage = new Set<string>()

function leadAlreadySent(bookingRef: string): boolean {
  if (leadsSentThisPage.has(bookingRef)) return true
  try {
    const list = JSON.parse(window.localStorage.getItem(LEAD_SENT_KEY) ?? "[]")
    return Array.isArray(list) && list.includes(bookingRef)
  } catch {
    return false
  }
}

function markLeadSent(bookingRef: string): void {
  leadsSentThisPage.add(bookingRef)
  try {
    const list = JSON.parse(window.localStorage.getItem(LEAD_SENT_KEY) ?? "[]")
    const next = (Array.isArray(list) ? list : []).concat(bookingRef).slice(-20)
    window.localStorage.setItem(LEAD_SENT_KEY, JSON.stringify(next))
  } catch {
    // Storage blocked (private mode etc.) — the in-page guard still applies.
  }
}

/**
 * True when the page was opened with ?ga_debug=1 (kept for the browser tab),
 * so test bookings show up in GA4 DebugView and can be told apart.
 */
function isGaDebug(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("ga_debug") === "1") {
      window.sessionStorage.setItem("gt_ga_debug", "1")
    }
    return window.sessionStorage.getItem("gt_ga_debug") === "1"
  } catch {
    return false
  }
}

/**
 * Reports one successful booking to Google Analytics as `generate_lead`.
 *
 * Call ONLY after the server has confirmed the booking was saved.
 * - Sends nothing unless the visitor allowed analytics cookies.
 * - Sends each booking reference at most once (double clicks, re-renders,
 *   going back to the confirmation screen).
 * - Sends no personal details: only the repair type and device category.
 */
export function trackBookingLead(
  bookingRef: string,
  details: { repairType: string; deviceCategory: string },
): void {
  if (typeof window === "undefined" || !bookingRef) return
  if (!started.analytics || !window.gtag) return
  if (leadAlreadySent(bookingRef)) return
  markLeadSent(bookingRef)

  window.gtag("event", "generate_lead", {
    send_to: GA_MEASUREMENT_ID,
    lead_source: "online_booking",
    repair_type: details.repairType,
    device_category: details.deviceCategory,
    ...(isGaDebug() ? { debug_mode: true } : {}),
  })
}

/** Tells any tracker that is already running to stop using cookies. */
export function revokeTrackers(choice: ConsentChoice): void {
  if (window.gtag) window.gtag("consent", "update", googleConsent(choice))
  if (!choice.advertising && window.fbq) window.fbq("consent", "revoke")
}
