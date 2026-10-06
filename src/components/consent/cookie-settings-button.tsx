"use client"

import { OPEN_SETTINGS_EVENT } from "@/lib/consent"

/** A link-style button that opens the cookie "Manage Preferences" panel. */
export function CookieSettingsButton({
  className,
  children = "Cookie Settings",
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
    >
      {children}
    </button>
  )
}
