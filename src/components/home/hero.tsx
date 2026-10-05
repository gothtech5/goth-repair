"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import type { DeviceCategory } from "@/types/booking"

const DEVICE_CARDS: { category: DeviceCategory; label: string; image: string }[] = [
  { category: "phone", label: "Phone", image: "/images/iphone.png" },
  { category: "computer", label: "Computer", image: "/images/computer.png" },
  { category: "tablet", label: "Tablet", image: "/images/ipad.png" },
]

const SERVICES = [
  { title: "Walk-In Repair", subtitle: "No appointment needed", linkText: "Get directions", linkHref: "/#location" },
  { title: "Screen Repair", subtitle: "iPhone, iPad & Samsung", linkText: "Book a repair", linkHref: "/book" },
  { title: "Battery Service", subtitle: "Same-day replacement", linkText: "Book now", linkHref: "/book" },
  { title: "Free Diagnostics", subtitle: "Professional assessment", linkText: "Schedule", linkHref: "/book" },
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
      {/* Store name, hours and the four in-store services */}
      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-14 text-center md:pb-16 md:pt-24">
        <h1 className="text-[40px] font-semibold leading-[1.05] tracking-tight text-balance sm:text-[56px] md:text-[64px]">
          GothTech Minneapolis
        </h1>

        <div className="mt-4 flex items-center justify-center gap-2.5 md:mt-5">
          <span className="relative flex size-2.5">
            <span className={`absolute inline-flex size-full rounded-full opacity-75 ${status.open ? "bg-success animate-ping" : "bg-destructive"}`} />
            <span className={`relative inline-flex size-2.5 rounded-full ${status.open ? "bg-success" : "bg-destructive"}`} />
          </span>
          {status.open ? (
            <span className="text-lg text-text-secondary md:text-xl">{status.label}</span>
          ) : (
            <span className="text-lg md:text-xl">
              <span className="text-destructive">{status.label}</span>{" "}
              <span className="text-text-tertiary">{status.next}</span>
            </span>
          )}
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-y-10 md:mt-16">
          {SERVICES.map((service) => (
            <li
              key={service.title}
              className="flex w-1/2 flex-col items-center gap-1.5 px-3 md:w-1/4"
            >
              <CheckCircle className="mb-1 size-6 fill-success stroke-white" aria-hidden="true" />
              <p className="text-base font-semibold">{service.title}</p>
              <p className="text-sm text-text-secondary">{service.subtitle}</p>
              <Link href={service.linkHref} className="mt-0.5 text-sm text-accent hover:underline">
                {service.linkText} &rsaquo;
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Large store photo: nearly the full width of the screen, with a small margin on each side */}
      <div className="mx-auto max-w-[2000px] px-3 sm:px-4 lg:px-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-secondary sm:aspect-[16/9] sm:rounded-3xl lg:aspect-[21/9]">
          <Image
            src="/images/store.jpg"
            alt="GothTech repair shop with phone cases and accessories on display"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Pick a device to start a repair */}
      <div className="mx-auto max-w-[1120px] px-6 py-12 text-center md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Phones &amp; iPad repair in Minneapolis.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-text-secondary text-pretty">
          Certified technicians with over 15,000 screen repairs completed. Walk in or book online — free diagnostics, every time.
        </p>

        <p className="mt-8 text-sm font-medium text-text-tertiary">Select your device to get started</p>
        <div className="mx-auto mt-3 grid max-w-md grid-cols-3 gap-3">
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
    </section>
  )
}
