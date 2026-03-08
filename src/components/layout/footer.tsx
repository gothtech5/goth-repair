import Link from "next/link"

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
            <p className="text-sm font-medium">Contact</p>
            <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
              <li>200 W Lake St #203</li>
              <li>Minneapolis, MN 55408</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-light pt-6 text-center text-sm text-text-tertiary">
          <p>
            &copy; {new Date().getFullYear()} GothTech. All rights reserved.
            This website and its content are owned and operated by GothTech.
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
