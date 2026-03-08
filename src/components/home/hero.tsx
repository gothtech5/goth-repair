"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

const SERVICES = [
  { title: "Walk-In Repair", subtitle: "no appointment needed" },
  { title: "Screen Replacement", subtitle: "iPhone & iPad", linkText: "See pricing" },
  { title: "Battery Service", subtitle: "same-day swap", linkText: "Book now" },
  { title: "Diagnostics", subtitle: "free assessment", linkText: "Schedule" },
] as const

type StoreStatus =
  | { open: false; label: string; next: string }
  | { open: true; label: string }

function getStoreStatus(): StoreStatus {
  const now = new Date()
  const hour = now.getHours()

  if (hour >= 21)
    return { open: false, label: "Closed for today.", next: "Back tomorrow at 11:00 a.m." }
  if (hour < 11)
    return { open: true, label: "Opens at 11:00 a.m." }
  return { open: true, label: "Open until 9:00 p.m." }
}

export function Hero() {
  const status = getStoreStatus()

  return (
    <section className="border-b border-border-light">
      <div className="mx-auto max-w-[980px] px-4 py-12 text-center sm:px-6">
        <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-balance sm:text-[48px]">
          Goth Mall of Karmel
        </h1>
        <p className="mt-2 text-lg">
          {status.open ? (
            <span className="text-text-secondary">{status.label}</span>
          ) : (
            <>
              <span className="text-destructive">{status.label}</span>{" "}
              <span className="text-text-secondary">{status.next}</span>
            </>
          )}
        </p>
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {SERVICES.map((service) => (
            <div key={service.title} className="flex min-w-[140px] flex-col gap-2">
              <CheckCircle className="size-6 fill-success stroke-white" />
              <div>
                <p className="text-sm font-semibold">{service.title}</p>
                <p className="text-sm text-text-secondary">{service.subtitle}</p>
              </div>
              <p className="text-xs text-text-tertiary">Available</p>
              {"linkText" in service && (
                <Link href="/book" className="text-sm text-accent hover:text-accent-hover hover:underline">
                  {service.linkText} &rsaquo;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
