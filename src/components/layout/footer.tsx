import Link from "next/link"
import { BUSINESS } from "@/config/business"

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-secondary">
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{BUSINESS.name}</p>
            <p className="mt-2 text-sm text-text-secondary text-pretty">
              {BUSINESS.seo.shortDescription}
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
                <Link href="/book" className="hover:text-text-primary">
                  Book a Repair
                </Link>
              </li>
              <li>
                <Link href="/#location" className="hover:text-text-primary">
                  Location
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Visit Us</p>
            <a
              href={BUSINESS.google.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm"
              aria-label={`${BUSINESS.google.rating} out of 5 stars on Google, ${BUSINESS.google.reviewCount} reviews`}
            >
              <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
                {"★★★★★"}
              </span>
              <span className="font-medium tabular-nums">{BUSINESS.google.rating}</span>
              <span className="text-text-tertiary">({BUSINESS.google.reviewCount} reviews)</span>
            </a>
            <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
              <li>{BUSINESS.location.address}</li>
              <li>{BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.zip}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-light pt-6 text-center text-sm text-text-tertiary">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
            This website and its content are owned and operated by {BUSINESS.name}.
            Unauthorized reproduction or distribution of any material from this
            site is prohibited.
          </p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-text-secondary">
              Privacy Policy
            </Link>
            <span className="mx-2">&middot;</span>
            <Link href="/terms" className="hover:text-text-secondary">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
