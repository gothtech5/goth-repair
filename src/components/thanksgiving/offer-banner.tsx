"use client"

import { useEffect, useState } from "react"
import { Leaf } from "lucide-react"
import {
  OFFER_DATES,
  OFFER_DISCOUNT,
  OFFER_TERMS,
  OFFER_TITLE,
  appointmentQualifies,
  isOfferActive,
} from "@/lib/thanksgiving-offer"

/**
 * Offer banner for the booking page. Switches itself on and off by date.
 * `date` is the appointment picked so far, if any.
 */
export function ThanksgivingBanner({
  date,
  className = "",
}: {
  date: string | null
  className?: string
}) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    setActive(isOfferActive())
  }, [])
  if (!active) return null

  const outsideDates = date !== null && !appointmentQualifies(date)

  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-2xl border border-[#f3c9a0] bg-[#fff5ea] px-4 py-3.5 text-[#4a2a10] sm:px-5 ${className}`}
    >
      <Leaf className="mt-0.5 size-6 shrink-0 text-[#c8571b]" aria-hidden="true" />
      <div className="min-w-0 text-sm">
        <p className="font-bold">
          {OFFER_TITLE}: <span className="text-[#c8571b]">{OFFER_DISCOUNT}</span>
        </p>
        <p className="mt-0.5 text-xs text-[#7a5536]">
          {outsideDates
            ? "The date you picked is after November 30, so this offer won't apply. Pick a date by November 30 to get $10 off."
            : `Book online ${OFFER_DATES}. No code needed. Appointment by November 30. ${OFFER_TERMS}`}
        </p>
      </div>
    </div>
  )
}
