"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import type { DeviceCategory } from "@/types/booking"

const DEVICE_CARDS: { category: DeviceCategory; label: string; image: string }[] = [
  { category: "phone", label: "iPhone", image: "/images/iphone.png" },
  { category: "computer", label: "Computer", image: "/images/computer.png" },
  { category: "tablet", label: "iPad", image: "/images/ipad.png" },
]

const SERVICES = [
  { title: "Walk-In Repair", subtitle: "no appointment needed", linkText: "Get directions", linkHref: "/#location" },
  { title: "Screen Replacement", subtitle: "iPhone & iPad", linkText: "Book now" },
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
      <div className="mx-auto max-w-[1120px] px-6 py-12 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5">
              <span className="relative flex size-2.5">
                <span className={`absolute inline-flex size-full rounded-full opacity-75 ${status.open ? "bg-success animate-ping" : "bg-destructive"}`} />
                <span className={`relative inline-flex size-2.5 rounded-full ${status.open ? "bg-success" : "bg-destructive"}`} />
              </span>
              {status.open ? (
                <span className="text-sm font-medium">{status.label}</span>
              ) : (
                <span className="text-sm font-medium">
                  <span className="text-destructive">{status.label}</span>{" "}
                  <span className="text-text-tertiary">{status.next}</span>
                </span>
              )}
            </div>
            <h1 className="mt-3 text-[36px] font-semibold leading-tight tracking-tight text-balance sm:text-[44px] md:text-[48px]">
              Expert repairs. Walk in, walk out.
            </h1>
            <p className="mt-4 text-lg text-text-secondary text-pretty">
              Quality repairs for the devices you depend on most. Walk in or book online — free diagnostics, every time.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <div key={service.title} className="flex flex-col gap-1.5">
                  <CheckCircle className="size-5 fill-success stroke-white" />
                  <p className="text-sm font-semibold">{service.title}</p>
                  <p className="text-sm text-text-secondary">{service.subtitle}</p>
                  <p className="text-xs text-text-tertiary">Available</p>
                  {"linkText" in service && (
                    <Link
                      href={"linkHref" in service ? service.linkHref : "/book"}
                      className="text-sm text-accent hover:underline"
                    >
                      {service.linkText} &rsaquo;
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm font-medium text-text-tertiary">Select your device to get started</p>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:max-w-md">
              {DEVICE_CARDS.map((device) => (
                <Link
                  key={device.category}
                  href={`/book?category=${device.category}`}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-border-light p-4 hover:border-accent hover:bg-surface-secondary"
                >
                  <Image src={device.image} alt="" width={48} height={48} className="size-12 object-contain" />
                  <span className="text-sm font-medium">{device.label}</span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-sm text-text-tertiary">
              Don&apos;t see your device?{" "}
              <Link href="/book" className="text-accent hover:underline">
                Start a repair
              </Link>
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/store.jpg"
              alt="GothTech repair shop with phone cases and accessories on display"
              width={640}
              height={480}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
