import type { Metadata } from "next"
import Link from "next/link"
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"

export const metadata: Metadata = {
  title: "Cookie Policy | GothTech",
  description:
    "Which cookies and tracking technologies GothTech uses, what they do, and how to change your choices.",
  alternates: { canonical: "/cookies" },
}

interface CookieRow {
  name: string
  provider: string
  purpose: string
  duration: string
}

const ESSENTIAL: CookieRow[] = [
  {
    name: "gt_consent",
    provider: "GothTech",
    purpose: "Remembers the cookie choices you made in the cookie banner.",
    duration: "180 days",
  },
  {
    name: "evertrail_auth, evertrail_err",
    provider: "GothTech",
    purpose:
      "Staff sign-in for our internal inventory tool. Set only when a GothTech team member logs in; never set for customers.",
    duration: "Up to 12 hours",
  },
]

const ANALYTICS: CookieRow[] = [
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Tells visitors apart so we can count visits and returning visitors.",
    duration: "2 years",
  },
  {
    name: "_ga_50CTNL3LTG",
    provider: "Google Analytics",
    purpose: "Keeps track of your current visit (pages viewed, time on site).",
    duration: "2 years",
  },
  {
    name: "No cookie",
    provider: "Vercel Web Analytics",
    purpose:
      "Counts page views without cookies and without identifying you. We still switch it off if you turn Analytics off.",
    duration: "Not applicable",
  },
]

const ADVERTISING: CookieRow[] = [
  {
    name: "_gcl_au",
    provider: "Google Ads",
    purpose:
      "Measures whether visits that came from our Google ads lead to a booking or a call.",
    duration: "90 days",
  },
  {
    name: "_gcl_aw",
    provider: "Google Ads",
    purpose: "Set when you arrive by clicking one of our Google ads; stores the ad click.",
    duration: "90 days",
  },
  {
    name: "_fbp",
    provider: "Meta (Facebook & Instagram) Pixel",
    purpose:
      "Tells browsers apart so Meta can measure our ads and show GothTech ads to people who visited this site.",
    duration: "90 days",
  },
  {
    name: "_fbc",
    provider: "Meta (Facebook & Instagram) Pixel",
    purpose: "Set when you arrive by clicking one of our Facebook or Instagram ads; stores the ad click.",
    duration: "90 days",
  },
  {
    name: "Cookies on google.com, doubleclick.net and facebook.com",
    provider: "Google and Meta",
    purpose:
      "Google and Meta may read or set their own cookies on their own websites to measure ads and personalize the ads you see. These are controlled by Google and Meta, not by us.",
    duration: "Up to about 2 years",
  },
]

const linkClass = "text-accent hover:text-accent-hover"

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="text-3xl font-bold text-balance">Cookie Policy</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Last updated: October 5, 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <p>
            This Cookie Policy explains which cookies and similar tracking
            technologies GothTech uses on gothtechnology.com, what they do, and
            how you can control them. For how we handle personal information
            more generally, see our{" "}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-4">
            <CookieSettingsButton className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
              Change my cookie settings
            </CookieSettingsButton>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            What Cookies Are
          </h2>
          <p className="mt-2">
            Cookies are small text files a website saves in your browser.
            &ldquo;Pixels&rdquo; and &ldquo;tags&rdquo; are small pieces of
            code that load from another company (such as Google or Meta) and
            report that a page was viewed. In this policy we call all of these
            &ldquo;cookies&rdquo;.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Your Choices
          </h2>
          <p className="mt-2">
            The first time you visit, a banner lets you{" "}
            <strong>Accept All</strong>, <strong>Reject Non-Essential</strong>,
            or <strong>Manage Preferences</strong> to switch each category on
            or off. You can change your mind at any time using the{" "}
            <strong>Cookie Settings</strong> link at the bottom of every page.
            We remember your choice for 180 days, then ask again.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>
                European Union, European Economic Area, United Kingdom,
                Switzerland, Brazil and Canada:
              </strong>{" "}
              analytics and advertising cookies stay off unless you turn them
              on.
            </li>
            <li>
              <strong>United States and everywhere else:</strong> analytics and
              advertising cookies are on by default, and you can turn them off
              at any time.
            </li>
            <li>
              <strong>Global Privacy Control:</strong> if your browser sends a
              Global Privacy Control signal, advertising cookies stay off
              unless you turn them on yourself.
            </li>
          </ul>
          <p className="mt-2">
            When you turn a category off, we stop loading its tools and delete
            the cookies it saved for this website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Essential Cookies
          </h2>
          <p className="mt-2">
            Needed for the website to work. They cannot be switched off.
          </p>
          <CookieTable rows={ESSENTIAL} />
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Analytics Cookies
          </h2>
          <p className="mt-2">
            Help us understand how much traffic the site gets and how visitors
            use it, so we can improve it.
          </p>
          <CookieTable rows={ANALYTICS} />
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Advertising, Marketing and Tracking Cookies
          </h2>
          <p className="mt-2">
            Let us run advertising campaigns, measure how they perform, and
            show GothTech ads on Google, Facebook and Instagram to people who
            have visited this site. These tools can recognize your browser
            across different websites.
          </p>
          <CookieTable rows={ADVERTISING} />
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Other Ways to Control Cookies
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Your browser settings let you block or delete cookies for any
              website.
            </li>
            <li>
              Google:{" "}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                My Ad Center
              </a>{" "}
              and the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google Analytics opt-out add-on
              </a>
              .
            </li>
            <li>
              Meta:{" "}
              <a
                href="https://www.facebook.com/adpreferences"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Ad Preferences
              </a>{" "}
              in your Facebook or Instagram account.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Changes to This Policy
          </h2>
          <p className="mt-2">
            If we add or remove a tool, we will update this page and the date
            at the top.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Contact Us
          </h2>
          <p className="mt-2">
            Questions about cookies on this site? Contact us at:
          </p>
          <p className="mt-2">
            GothTech
            <br />
            200 W Lake St #203
            <br />
            Minneapolis, MN 55408
            <br />
            <a href="tel:+16129878107" className={linkClass}>
              (612) 987-8107
            </a>
            <br />
            <a href="mailto:gothtechnology5@gmail.com" className={linkClass}>
              gothtechnology5@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-border-light">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-surface-secondary text-text-primary">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">Cookie</th>
            <th scope="col" className="px-3 py-2 font-medium">Set by</th>
            <th scope="col" className="px-3 py-2 font-medium">What it does</th>
            <th scope="col" className="px-3 py-2 font-medium">How long</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="px-3 py-2 font-medium text-text-primary">{row.name}</td>
              <td className="px-3 py-2">{row.provider}</td>
              <td className="px-3 py-2">{row.purpose}</td>
              <td className="px-3 py-2 whitespace-nowrap">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
