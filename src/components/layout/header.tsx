import Link from "next/link"
import { BOOKING_URL } from "@/data/devices"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          GothTech
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/#services"
            className="hidden text-sm text-text-secondary hover:text-text-primary sm:block"
          >
            Services
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden text-sm text-text-secondary hover:text-text-primary sm:block"
          >
            How It Works
          </Link>
          <Link
            href="/#location"
            className="hidden text-sm text-text-secondary hover:text-text-primary sm:block"
          >
            Location
          </Link>
          <a
            href="tel:+16129878107"
            className="text-sm font-bold text-accent hover:text-accent-hover"
          >
            (612)-987-8107
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Book a Repair
          </a>
        </div>
      </nav>
    </header>
  )
}
