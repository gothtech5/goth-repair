"use client"

import { useEffect, useState, type MouseEvent } from "react"
import { isHalloweenActive, openHalloweenPopup } from "@/lib/halloween"
import { Pumpkin } from "./pumpkin"

/** Opens the signup popup in place; falls back to the /halloween page without JavaScript. */
function handleClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  if (openHalloweenPopup()) e.preventDefault()
}

/** Hides banners once the offer has ended (pages are built ahead of time). */
function useActive() {
  const [active, setActive] = useState(true)
  useEffect(() => {
    setActive(isHalloweenActive())
  }, [])
  return active
}

/** Strip along the bottom of a homepage service card. */
export function HalloweenCardBanner({ service }: { service: string }) {
  const active = useActive()
  if (!active) return null
  return (
    <a
      href="/halloween"
      onClick={handleClick}
      aria-label={`Halloween offer: get $10 off your ${service.toLowerCase()}. Get your code.`}
      className="group/promo flex items-center gap-3 border-t border-[#2c2231] bg-[#17121b] px-6 py-3 text-sm text-[#f4eff6] hover:bg-[#1f1824] md:px-8"
    >
      <Pumpkin className="size-6 shrink-0" />
      <span className="flex-1">
        <span className="font-bold text-[#ff8a1f]">$10 OFF</span> this repair for Halloween
      </span>
      <span className="shrink-0 font-semibold text-[#ff8a1f] group-hover/promo:underline">
        Get code &rarr;
      </span>
    </a>
  )
}

/** Wide banner for the booking page. */
export function HalloweenWideBanner({ className = "" }: { className?: string }) {
  const active = useActive()
  if (!active) return null
  return (
    <a
      href="/halloween"
      onClick={handleClick}
      className={`group/promo relative flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden rounded-2xl border border-[#2c2231] bg-[#17121b] px-4 py-3.5 text-[#f4eff6] hover:bg-[#1f1824] sm:px-5 ${className}`}
    >
      <Pumpkin className="size-8 shrink-0" />
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-bold text-white">
          Halloween offer: <span className="text-[#ff8a1f]">$10 OFF</span> your repair
        </span>
        <span className="block text-xs text-[#cfc6d4]">
          Ends October 31, 2026. One per customer on a repair service. Cannot be combined with other offers.
        </span>
      </span>
      <span className="shrink-0 rounded-lg bg-[#ff8a1f] px-3 py-1.5 text-sm font-bold text-[#140f17] group-hover/promo:bg-[#ff9d42]">
        Get my code
      </span>
    </a>
  )
}
