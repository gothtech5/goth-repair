"use client"

import { useEffect, useState } from "react"
import { Leaf } from "lucide-react"
import {
  THANKSGIVING_DATES_LABEL,
  THANKSGIVING_TERMS,
  isThanksgivingActive,
} from "@/lib/thanksgiving"

/** Wide banner for the booking page. Shows only while the offer is running. */
export function ThanksgivingWideBanner({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    setActive(isThanksgivingActive())
  }, [])
  if (!active) return null

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-[#e7c9a3] bg-[#fdf3e4] px-4 py-3.5 text-[#4a2c12] sm:px-5 ${className}`}
    >
      <Leaf className="mt-0.5 size-6 shrink-0 text-[#c2571a]" aria-hidden="true" />
      <p className="min-w-0 text-sm">
        <span className="block font-bold">
          Thanksgiving Special: <span className="text-[#b84a12]">$10 off</span> your repair
          when you book online
        </span>
        <span className="block font-medium">{THANKSGIVING_DATES_LABEL}. No code needed.</span>
        <span className="mt-1 block text-xs text-[#6f4a2a]">{THANKSGIVING_TERMS}</span>
      </p>
    </div>
  )
}
