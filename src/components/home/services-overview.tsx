import Image from "next/image"
import Link from "next/link"

const SERVICES = [
  {
    title: "iPhone Repair",
    image: "/images/iphone.png",
    category: "phone",
    description:
      "Screen replacement, battery swap, charging port, camera, and more for iPhone, Samsung, Google Pixel, and Motorola.",
    repairs: ["Screen Repair", "Battery Replacement", "Charging Port", "Back Glass"],
  },
  {
    title: "Computer Repair",
    image: "/images/computer.png",
    category: "computer",
    description:
      "Screen repair, battery, keyboard, and software fixes for MacBooks, Dell, HP, Lenovo, and Asus.",
    repairs: ["Screen Repair", "Battery Replacement", "Keyboard Repair", "Virus Removal"],
  },
  {
    title: "iPad Repair",
    image: "/images/ipad.png",
    category: "tablet",
    description:
      "Cracked screens, battery issues, and port repairs for iPad, Samsung Galaxy Tab, Amazon Fire, and more.",
    repairs: ["Screen Repair", "Battery Replacement", "Charging Port", "Software Issues"],
  },
] as const

export function ServicesOverview() {
  return (
    <section id="services" className="bg-surface-secondary px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          What we repair
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={`/book?category=${service.category}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border-light bg-surface p-6 md:p-8"
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
              <p className="mt-auto pt-5 text-sm font-medium text-accent group-hover:underline">
                Book now
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
