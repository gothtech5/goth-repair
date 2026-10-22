"use client"

import { useEffect, useState, type ReactNode } from "react"
import { isHalloweenActive } from "@/lib/halloween"

/** Shows the signup while the offer runs and the "ended" message afterwards. */
export function HalloweenEndedGate({ children, ended }: { children: ReactNode; ended: ReactNode }) {
  const [active, setActive] = useState(true)
  useEffect(() => {
    setActive(isHalloweenActive())
  }, [])
  return <>{active ? children : ended}</>
}
