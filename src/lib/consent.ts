/**
 * Cookie consent — shared settings and helpers.
 *
 * The visitor's choice is saved in one first-party cookie (CONSENT_COOKIE).
 * Nothing in this file loads a tracker; that happens in
 * src/components/consent/consent-manager.tsx.
 */

/** IDs of the tracking tools used on the public site. */
export const GA_MEASUREMENT_ID = "G-50CTNL3LTG"
export const GOOGLE_ADS_ID = "AW-5933503394"
export const META_PIXEL_ID = "511183678414751"

/** Name of the cookie that remembers the visitor's choice. */
export const CONSENT_COOKIE = "gt_consent"
/** Bump this to ask every visitor again (for example after adding a new tool). */
export const CONSENT_VERSION = 1
/** How long a saved choice lasts before we ask again: 180 days. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

/** Fired on window to open the "Manage Preferences" panel from anywhere. */
export const OPEN_SETTINGS_EVENT = "gt:open-cookie-settings"

/** The optional categories. Essential cookies are always on and not listed. */
export interface ConsentChoice {
  /** Google Analytics and Vercel Web Analytics. */
  analytics: boolean
  /** Google Ads and Meta (Facebook) Pixel. */
  advertising: boolean
}

export const ACCEPT_ALL: ConsentChoice = { analytics: true, advertising: true }
export const REJECT_ALL: ConsentChoice = { analytics: false, advertising: false }

/**
 * Countries where non-essential cookies must stay OFF until the visitor
 * says yes: the EU and EEA, the United Kingdom, Switzerland, Brazil and
 * Canada. Everywhere else (including the United States) non-essential
 * cookies start ON and the visitor can turn them off at any time.
 */
const OPT_IN_COUNTRIES = new Set([
  // European Union
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE",
  // Rest of the European Economic Area
  "IS", "LI", "NO",
  // United Kingdom, Switzerland, Brazil, Canada
  "GB", "CH", "BR", "CA",
])

/**
 * True when the visitor must opt in before any non-essential cookie is used.
 * An unknown country is treated as opt-in, to stay on the safe side.
 */
export function requiresOptIn(countryCode: string | null | undefined): boolean {
  if (!countryCode) return true
  return OPT_IN_COUNTRIES.has(countryCode.toUpperCase())
}

/** Reads the saved choice, or null if the visitor has not chosen yet. */
export function readStoredConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null
  const prefix = CONSENT_COOKIE + "="
  const entry = document.cookie.split("; ").find((part) => part.startsWith(prefix))
  if (!entry) return null
  try {
    const data = JSON.parse(decodeURIComponent(entry.slice(prefix.length)))
    if (!data || data.v !== CONSENT_VERSION) return null
    return { analytics: data.a === 1, advertising: data.m === 1 }
  } catch {
    return null
  }
}

/** Saves the visitor's choice for 180 days. */
export function writeStoredConsent(choice: ConsentChoice): void {
  const value = encodeURIComponent(
    JSON.stringify({
      v: CONSENT_VERSION,
      a: choice.analytics ? 1 : 0,
      m: choice.advertising ? 1 : 0,
      t: Date.now(),
    }),
  )
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie =
    `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`
}

/** Cookie name prefixes set by each optional category. */
const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"]
const ADVERTISING_COOKIE_PREFIXES = ["_gcl_", "_gac_", "_fbp", "_fbc"]

/**
 * Deletes the first-party cookies of every category the visitor has
 * turned off. (Cookies set on google.com or facebook.com belong to those
 * companies and can only be cleared in the visitor's browser.)
 */
export function clearRejectedCookies(choice: ConsentChoice): void {
  const prefixes = [
    ...(choice.analytics ? [] : ANALYTICS_COOKIE_PREFIXES),
    ...(choice.advertising ? [] : ADVERTISING_COOKIE_PREFIXES),
  ]
  if (prefixes.length === 0) return

  // Trackers save their cookies on the widest domain they can, so try each one.
  const parts = window.location.hostname.split(".")
  const domains: string[] = [""]
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push("; Domain=." + parts.slice(i).join("."))
  }

  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0]
    if (!name || !prefixes.some((prefix) => name.startsWith(prefix))) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${domain}`
    }
  }
}
