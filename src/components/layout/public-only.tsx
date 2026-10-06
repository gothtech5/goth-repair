"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Shows its children on the public GothTech site only.
 * On any Evertrail page (/evertrail and below) it shows nothing,
 * so the public header, footer and cookie banner stay hidden there.
 */
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/evertrail" || pathname?.startsWith("/evertrail/")) return null
  return <>{children}</>
}
