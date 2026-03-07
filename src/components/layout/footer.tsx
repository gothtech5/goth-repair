import Link from "next/link"
import { BOOKING_URL } from "@/data/devices"

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-secondary">
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">GothTech</p>
            <p className="mt-2 text-sm text-text-secondary text-pretty">
              Expert repair services for iPhones, iPads, and Apple Watches in
              Minneapolis.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Quick Links</p>
            <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
              <li>
                <Link href="/#services" className="hover:text-text-primary">
                  Services
                </Link>
              </li>
              <li>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary">
                  Book a Repair
                </a>
              </li>
              <li>
                <Link href="/#location" className="hover:text-text-primary">
                  Location
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Contact</p>
            <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
              <li>200 W Lake St #203</li>
              <li>Minneapolis, MN 55408</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-light pt-6 text-center text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} GothTech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
