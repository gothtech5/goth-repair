"use client"

import { useEffect } from "react"
import { buttonClass } from "@/components/evertrail/shell"

/** "Print" button. With autoPrint, the print window also opens by itself once the page has loaded. */
export function PrintButton({ autoPrint = false, label = "Print" }: { autoPrint?: boolean; label?: string }) {
  useEffect(() => {
    if (!autoPrint) return
    const timer = setTimeout(() => window.print(), 300)
    return () => clearTimeout(timer)
  }, [autoPrint])

  return (
    <button type="button" onClick={() => window.print()} className={buttonClass}>
      {label}
    </button>
  )
}
