import Link from "next/link"
import { Package, Truck, Wrench } from "lucide-react"

const STEPS = [
  {
    icon: Package,
    title: "Request a Shipping Label",
    description: "Visit our website and request a prepaid shipping label for your device.",
  },
  {
    icon: Truck,
    title: "Ship Your Device",
    description: "Pack your device securely and send it to us using the provided label.",
  },
  {
    icon: Wrench,
    title: "Repaired & Returned",
    description: "We complete the repair and ship it back to your home address.",
  },
] as const

export function MailInRepair() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-accent">
          Nationwide
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Not in Minnesota? Ship it to us.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-secondary text-pretty">
          We repair devices from customers across the country. Request a shipping label, send in your phone or iPad, and we'll ship it back once it's fixed.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-border-light bg-surface p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10">
                <step.icon className="size-6 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary text-pretty">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            Questions? Email us at{" "}
            <a href="mailto:gothtechnology5@gmail.com" className="font-medium text-accent hover:underline">
              gothtechnology5@gmail.com
            </a>
          </p>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/book?type=mail-in"
            className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Start a Mail-In Repair
          </Link>
        </div>
      </div>
    </section>
  )
}
