"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

const SERVICES = [
  { title: "Walk-In Repair", subtitle: "no appointment needed" },
  { title: "Screen Replacement", subtitle: "iPhone & iPad", linkText: "See pricing", href: "/book" },
  { title: "Battery Service", subtitle: "same-day swap", linkText: "Book now", href: "/book" },
  { title: "Diagnostics", subtitle: "free assessment", linkText: "Schedule", href: "/book" },
  { title: "Data Recovery", subtitle: "by consultation", linkText: "Learn more", href: "/book" },
] as const

function getOpenUntil(): string {
  const now = new Date()
  const hour = now.getHours()

  if (hour >= 21) return "Closed for today"
  if (hour < 11) return "Opens at 11:00 a.m."
  return "Open until 9:00 p.m."
}

export function Hero() {
  const status = getOpenUntil()
  const isOpen = !status.startsWith("Closed")

  return (
    <section className="border-b border-border-light">
      <div className="mx-auto max-w-[980px] px-4 py-12 text-center sm:px-6">
        <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-balance sm:text-[48px]">
          Goth Mall of Karmel
        </h1>
        <p className={`mt-2 text-lg ${isOpen ? "text-text-secondary" : "text-destructive"}`}>
          {status}
        </p>
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {SERVICES.map((service) => (
            <div key={service.title} className="flex min-w-[140px] flex-col gap-2">
              <CheckCircle className="size-6 fill-success stroke-white" />
              <div>
                <p className="text-sm font-semibold">{service.title}</p>
                <p className="text-sm text-text-secondary">{service.subtitle}</p>
              </div>
              <p className="text-xs text-text-tertiary">Available</p>
              {"linkText" in service && (
                <Link href={service.href} className="text-sm text-accent hover:text-accent-hover hover:underline">
                  {service.linkText} ›
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/book"
            className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Book a Repair
          </Link>
        </div>
      </div>
    </section>
  )
}
