"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Analytics } from "@vercel/analytics/react"
import {
  ACCEPT_ALL,
  OPEN_SETTINGS_EVENT,
  REJECT_ALL,
  clearRejectedCookies,
  readStoredConsent,
  writeStoredConsent,
  type ConsentChoice,
} from "@/lib/consent"
import { applyTrackers, revokeTrackers } from "@/lib/trackers"

/**
 * The cookie consent system for the public site:
 *  - the banner (Accept All / Reject Non-Essential / Manage Preferences)
 *  - the Manage Preferences panel
 *  - switching Google Analytics, Google Ads, Meta Pixel and Vercel
 *    Analytics on only when the visitor's choice allows them
 */
export function ConsentManager() {
  /** What is allowed right now. null = still working it out, nothing loads. */
  const [choice, setChoice] = useState<ConsentChoice | null>(null)
  /** True once the visitor has clicked a choice (now or on an earlier visit). */
  const [decided, setDecided] = useState(false)
  /** True where the law needs a "yes" before non-essential cookies. */
  const [optIn, setOptIn] = useState(true)
  /** True when the browser sends a Global Privacy Control signal. */
  const [gpc, setGpc] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState<ConsentChoice>(REJECT_ALL)

  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // On first load: use the saved choice, or work out the starting point.
  useEffect(() => {
    let cancelled = false
    const hasGpc =
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl === true
    setGpc(hasGpc)

    const stored = readStoredConsent()
    if (stored) {
      setDecided(true)
      setChoice(stored)
      clearRejectedCookies(stored)
      applyTrackers(stored)
      return
    }

    fetch("/api/consent/region")
      .then((res) => (res.ok ? res.json() : { optIn: true }))
      .catch(() => ({ optIn: true }))
      .then((data: { optIn?: boolean }) => {
        if (cancelled) return
        const mustOptIn = data.optIn !== false
        const starting: ConsentChoice = mustOptIn
          ? REJECT_ALL
          : { analytics: true, advertising: !hasGpc }
        setOptIn(mustOptIn)
        setChoice(starting)
        clearRejectedCookies(starting)
        applyTrackers(starting)
      })

    return () => {
      cancelled = true
    }
  }, [])

  /** Saves a choice the visitor clicked and switches trackers to match. */
  const save = useCallback(
    (next: ConsentChoice) => {
      const turnedOff =
        !!choice &&
        ((choice.analytics && !next.analytics) ||
          (choice.advertising && !next.advertising))

      writeStoredConsent(next)
      setDecided(true)
      setSettingsOpen(false)

      if (turnedOff) {
        // A tracker that was running has been switched off. Tell it to stop,
        // remove its cookies, then reload so its script is gone completely.
        revokeTrackers(next)
        clearRejectedCookies(next)
        window.location.reload()
        return
      }

      setChoice(next)
      clearRejectedCookies(next)
      applyTrackers(next)
    },
    [choice],
  )

  const openSettings = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null
    setDraft(choice ?? REJECT_ALL)
    setSettingsOpen(true)
  }, [choice])

  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
    returnFocusRef.current?.focus()
  }, [])

  // "Cookie Settings" links elsewhere on the site open the panel.
  useEffect(() => {
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings)
  }, [openSettings])

  // While the panel is open: move focus into it and let Escape close it.
  useEffect(() => {
    if (!settingsOpen) return
    dialogRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSettings()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [settingsOpen, closeSettings])

  const showBanner = choice !== null && !decided && !settingsOpen

  return (
    <>
      {choice?.analytics && <Analytics />}

      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-[1120px] rounded-2xl border border-border-light bg-surface p-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] sm:p-5 lg:flex lg:items-center lg:gap-6">
            <div className="text-sm text-text-secondary lg:flex-1">
              <p className="font-semibold text-text-primary">
                Cookies on GothTech
              </p>
              <p className="mt-1 text-pretty">
                {optIn
                  ? "We use essential cookies to make this site work. With your permission, we would also like to use analytics and advertising cookies to understand our traffic and measure our ads."
                  : "We use essential cookies to make this site work, plus analytics and advertising cookies to understand our traffic and measure our ads. You can turn the optional ones off."}{" "}
                <Link
                  href="/cookies"
                  className="whitespace-nowrap text-accent hover:text-accent-hover"
                >
                  Cookie Policy
                </Link>
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:mt-0 lg:shrink-0">
              <button
                type="button"
                onClick={openSettings}
                className="order-3 col-span-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary sm:order-1"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={() => save(REJECT_ALL)}
                className="order-1 rounded-lg bg-text-primary px-3 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:order-2 sm:px-4"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => save(ACCEPT_ALL)}
                className="order-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-white hover:bg-accent-hover sm:order-3 sm:px-4"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSettings()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            tabIndex={-1}
            className="max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl outline-none sm:rounded-2xl"
          >
            <h2
              id="cookie-settings-title"
              className="text-xl font-semibold text-text-primary"
            >
              Cookie Preferences
            </h2>
            <p className="mt-2 text-sm text-text-secondary text-pretty">
              Choose which cookies GothTech may use. You can change this at any
              time from the Cookie Settings link at the bottom of every page.
              See our{" "}
              <Link
                href="/cookies"
                onClick={closeSettings}
                className="text-accent hover:text-accent-hover"
              >
                Cookie Policy
              </Link>{" "}
              for details.
            </p>

            <div className="mt-5 divide-y divide-border-light border-y border-border-light">
              <Category
                title="Essential"
                description="Needed for the site to work, such as remembering your cookie choice. These cannot be turned off."
                locked
                checked
              />
              <Category
                title="Analytics"
                description="Helps us understand how many people visit and which pages they use, so we can improve the site. Tools: Google Analytics, Vercel Web Analytics."
                checked={draft.analytics}
                onChange={(analytics) => setDraft({ ...draft, analytics })}
              />
              <Category
                title="Advertising & tracking"
                description="Lets us measure how our ads perform and show GothTech ads to people who have visited this site. Tools: Google Ads, Meta (Facebook & Instagram) Pixel."
                checked={draft.advertising}
                onChange={(advertising) => setDraft({ ...draft, advertising })}
              />
            </div>

            {gpc && !decided && (
              <p className="mt-3 text-xs text-text-tertiary">
                Your browser sent a Global Privacy Control signal, so
                advertising cookies start switched off.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={() => save(REJECT_ALL)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => save(ACCEPT_ALL)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => save(draft)}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** One row in the preferences panel: a title, a description and a switch. */
function Category({
  title,
  description,
  checked,
  locked = false,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  locked?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-secondary text-pretty">
          {description}
        </p>
      </div>
      {locked ? (
        <span className="mt-0.5 shrink-0 whitespace-nowrap text-xs font-medium text-text-tertiary">
          Always on
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={() => onChange?.(!checked)}
          className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${
            checked ? "bg-success" : "bg-border"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      )}
    </div>
  )
}
