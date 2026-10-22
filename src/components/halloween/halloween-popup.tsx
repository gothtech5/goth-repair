"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import {
  OPEN_HALLOWEEN_EVENT,
  SHOWN_THIS_VISIT_KEY,
  SIGNED_UP_KEY,
  isHalloweenActive,
} from "@/lib/halloween"
import { HalloweenSignupForm } from "./signup-form"
import { Pumpkin } from "./pumpkin"

/** Pages where the popup never opens by itself (booking, cancelling, policies). */
const NO_AUTO_OPEN = ["/book", "/cancel", "/halloween", "/privacy", "/terms", "/cookies"]
/** Wait this long after the page loads before showing the popup. */
const DELAY_MS = 4000

function readStorage(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key)
  } catch {
    return null
  }
}

function writeStorage(store: "local" | "session", key: string, value: string) {
  try {
    ;(store === "local" ? localStorage : sessionStorage).setItem(key, value)
  } catch {
    // storage blocked: nothing else to do
  }
}

/** The cookie banner is on screen; wait for the visitor to answer it first. */
function cookieBannerVisible(): boolean {
  return !!document.querySelector('[aria-label="Cookie consent"], #cookie-settings-title')
}

/** Halloween 2026 popup. Shows once per visit, never after a successful signup. */
export function HalloweenPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    if (!isHalloweenActive()) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    writeStorage("session", SHOWN_THIS_VISIT_KEY, "1")
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    returnFocusRef.current?.focus?.()
  }, [])

  // Show by itself once per visit, a few seconds in, after the cookie banner is answered.
  useEffect(() => {
    if (!isHalloweenActive()) return
    if (NO_AUTO_OPEN.some((p) => pathname === p || pathname?.startsWith(p + "/"))) return
    if (readStorage("local", SIGNED_UP_KEY)) return
    if (readStorage("session", SHOWN_THIS_VISIT_KEY)) return

    let timer: ReturnType<typeof setTimeout>
    const tryShow = () => {
      if (readStorage("session", SHOWN_THIS_VISIT_KEY)) return
      if (cookieBannerVisible()) {
        timer = setTimeout(tryShow, 1500)
        return
      }
      show()
    }
    timer = setTimeout(tryShow, DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname, show])

  // Banners ask for the popup with an event.
  useEffect(() => {
    window.addEventListener(OPEN_HALLOWEEN_EVENT, show)
    return () => window.removeEventListener(OPEN_HALLOWEEN_EVENT, show)
  }, [show])

  // While open: focus the panel, Escape closes, Tab stays inside, page does not scroll.
  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close()
        return
      }
      if (e.key !== "Tab" || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  // Close if the visitor navigates to another page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="halloween-title"
        aria-describedby="halloween-desc"
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-24px)] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-3xl border border-[#2c2231] bg-[#17121b] px-5 pb-5 pt-6 text-[#f4eff6] shadow-[0_24px_80px_rgba(0,0,0,0.6)] outline-none sm:px-7 sm:pb-7 sm:pt-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a1f]"
        >
          <X className="size-5" strokeWidth={2.5} />
        </button>

        <HalloweenOfferHeading titleId="halloween-title" descId="halloween-desc" />

        <div className="relative mt-5">
          <HalloweenSignupForm onBookClick={close} />
        </div>
      </div>
    </div>
  )
}

/** "GOTHTECH / Spooky Savings! / $10 OFF" block shared by the popup and the /halloween page. */
export function HalloweenOfferHeading({
  titleId,
  descId,
  as: Heading = "h2",
}: {
  titleId?: string
  descId?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className="relative text-center">
      {/* soft orange glow + subtle pumpkins */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-40 w-64 -translate-x-1/2 rounded-full bg-[#ff8a1f]/15 blur-3xl"
      />
      <Pumpkin className="pointer-events-none absolute -left-1 top-12 size-10 opacity-30 sm:size-12" />
      <Pumpkin className="pointer-events-none absolute -right-1 top-24 size-8 -scale-x-100 opacity-20 sm:size-10" />

      <p className="relative text-xs font-bold tracking-[0.35em] text-[#ff8a1f]">GOTHTECH</p>
      <Heading id={titleId} className="relative mt-2 text-2xl font-bold tracking-tight text-white">
        Spooky Savings!
      </Heading>
      <p
        className="relative mt-1 text-6xl font-black leading-none tracking-tight text-[#ff8a1f] [text-shadow:0_0_28px_rgba(255,138,31,0.35)] sm:text-7xl"
        aria-hidden="true"
      >
        $10 OFF
      </p>
      <div id={descId} className="relative">
        <p className="mt-3 text-base font-semibold text-white">
          Get $10 OFF your next device repair.
        </p>
        <p className="mt-1 text-sm text-[#cfc6d4]">
          Enter your email to receive your Halloween discount code.
        </p>
      </div>
    </div>
  )
}
