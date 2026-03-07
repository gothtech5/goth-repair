import Image from "next/image"
import { BOOKING_URL } from "@/data/devices"

const SERVICES = [
  {
    title: "iPhone Repair",
    image: "/images/iphone.png",
    description:
      "Screen replacement, battery swap, charging port, camera, and more.",
    repairs: ["Screen Repair", "Battery Replacement", "Charging Port", "Back Glass"],
  },
  {
    title: "iPad Repair",
    image: "/images/ipad.png",
    description:
      "Cracked screens, battery issues, and port repairs for all iPad models.",
    repairs: ["Screen Repair", "Battery Replacement", "Charging Port", "Software Issues"],
  },
  {
    title: "Apple Watch Repair",
    image: "/images/apple-watch.png",
    description:
      "Screen repair, battery replacement, and diagnostics for Apple Watch.",
    repairs: ["Screen Repair", "Battery Replacement", "Diagnostics"],
  },
  {
    title: "Mac Repair",
    image: "/images/computer.png",
    description:
      "Screen repair, battery replacement, keyboard, and software fixes for MacBooks.",
    repairs: ["Screen Repair", "Battery Replacement", "Keyboard Repair", "Software Issues"],
  },
] as const

export function ServicesOverview() {
  return (
    <section id="services" className="bg-surface-secondary px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          What we repair
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <a
              key={service.title}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border-light bg-surface p-6 md:p-8"
            >
              {service.image && (
                <div className="mb-4 flex justify-end">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={160}
                    height={80}
                    className="h-[80px] w-auto object-contain"
                  />
                </div>
              )}
              <h3 className="text-lg font-medium">{service.title}</h3>
              <p className="mt-2 text-sm text-text-secondary text-pretty">
                {service.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {service.repairs.map((repair) => (
                  <li key={repair} className="text-sm text-text-tertiary">
                    {repair}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-medium text-accent group-hover:underline">
                Book now
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
