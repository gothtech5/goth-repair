import Image from "next/image"
import Link from "next/link"

const SERVICES = [
  {
    title: "Phone Repair",
    image: "/images/iphone.png",
    category: "phone",
    cta: "Book phone repair",
    description:
      "Screen replacement, battery swap, charging port, camera, and more for iPhone, Samsung, Google Pixel, and Motorola.",
    repairs: ["Screen Repair", "Battery Swap", "Charging Port", "Back Glass", "Camera Repair", "Speaker Fix"],
  },
  {
    title: "Computer Repair",
    image: "/images/computer.png",
    category: "computer",
    cta: "Book computer repair",
    description:
      "Screen repair, battery, keyboard, and software fixes for MacBooks, Dell, HP, Lenovo, and Asus.",
    repairs: ["Screen Repair", "Battery Swap", "Keyboard Repair", "Virus Removal", "Data Recovery", "OS Reinstall"],
  },
  {
    title: "Tablet Repair",
    image: "/images/ipad.png",
    category: "tablet",
    cta: "Book tablet repair",
    description:
      "Cracked screens, battery issues, and port repairs for iPad, Samsung Galaxy Tab, Amazon Fire, and more.",
    repairs: ["Screen Repair", "Battery Swap", "Charging Port", "Software Fix", "Button Repair", "Glass Repair"],
  },
  {
    title: "Smartwatch Repair",
    image: "/images/smartwatch.png",
    category: "smartwatch",
    cta: "Book smartwatch repair",
    description:
      "Screen fixes, battery swaps, and more for Apple Watch.",
    repairs: ["Screen Repair", "Battery Swap", "Water Damage", "Software Fix", "Crown Repair", "Band Connector"],
  },
] as const

export function ServicesOverview() {
  return (
    <section id="services" className="bg-surface-secondary px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-accent">
          Services
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          What we repair
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-secondary text-pretty">
          From cracked screens to dead batteries, we fix the devices Minneapolis depends on.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {service.repairs.map((repair) => (
                  <li key={repair} className="text-sm text-text-tertiary before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-accent before:align-middle before:content-['']">
                    {repair}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-sm font-medium text-accent group-hover:underline">
                {service.cta} &rarr;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
