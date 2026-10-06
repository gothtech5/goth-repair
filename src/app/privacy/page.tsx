import type { Metadata } from "next"
import Link from "next/link"
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"

export const metadata: Metadata = {
  title: "Privacy Policy | GothTech",
  description: "GothTech privacy policy — how we collect, use, and protect your data.",
}

const linkClass = "text-accent hover:text-accent-hover"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="text-3xl font-bold text-balance">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Last updated: October 5, 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Information We Collect
          </h2>
          <p className="mt-2">
            <strong>Information you give us.</strong> When you book a repair
            through our website, we collect:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Device type, repair details, and any notes you add</li>
            <li>Your mailing address, if you request a mail-in repair</li>
          </ul>
          <p className="mt-4">
            <strong>Information collected automatically.</strong> When you
            browse this website, we and the tools listed below may collect:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Your IP address and approximate location (country, region or
              city)
            </li>
            <li>Browser and device type</li>
            <li>
              The pages you view, how you reached the site, and what you click
            </li>
            <li>
              Cookie identifiers and ad-click identifiers, when analytics or
              advertising cookies are switched on
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            How We Use Your Information
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              To schedule and manage your repair: we create a Google Calendar
              event for your booking and email you a confirmation and reminders.
            </li>
            <li>To contact you about your repair.</li>
            <li>
              To send you repair tips and offers, only if you tick that box
              when booking. You can unsubscribe at any time.
            </li>
            <li>
              To understand our website traffic and how visitors use the site,
              so we can improve it.
            </li>
            <li>
              To run advertising campaigns, measure how they perform, and show
              GothTech ads to people who have visited this site.
            </li>
            <li>To keep the website secure and working.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Third-Party Services
          </h2>
          <p className="mt-2">
            We use the following third-party services, which receive the
            information needed to do their job:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Google Calendar API</strong> — to schedule and manage
              repair appointments
            </li>
            <li>
              <strong>Resend</strong> — to send booking confirmation emails
            </li>
            <li>
              <strong>Vercel</strong> — to host this website, and Vercel Web
              Analytics to count page views without cookies
            </li>
            <li>
              <strong>Google Analytics</strong> — to measure website traffic
              and how visitors use the site
            </li>
            <li>
              <strong>Google Ads</strong> — to run ads and measure whether
              they lead to bookings and calls
            </li>
            <li>
              <strong>Meta (Facebook &amp; Instagram) Pixel</strong> — to run
              ads on Facebook and Instagram and measure how they perform
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Advertising and Sharing of Information
          </h2>
          <p className="mt-2">
            We do not sell your personal information for money, and we do not
            give your booking details to advertisers. When advertising cookies
            are switched on, Google and Meta receive information about your
            visit (such as cookie identifiers, your IP address, and the pages
            you viewed) and may combine it with information they already hold
            to measure and personalize ads. Some privacy laws call this
            &ldquo;sharing&rdquo; or &ldquo;targeted advertising&rdquo;.
          </p>
          <p className="mt-2">
            You can opt out at any time by turning off{" "}
            <strong>Advertising &amp; tracking</strong> in{" "}
            <CookieSettingsButton className={linkClass} />. We also honor
            Global Privacy Control signals sent by your browser.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Cookies and Tracking Technologies
          </h2>
          <p className="mt-2">
            This website uses three kinds of cookies and similar technologies:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Essential</strong> — needed for the site to work, such
              as remembering your cookie choices. Always on.
            </li>
            <li>
              <strong>Analytics</strong> — Google Analytics and Vercel Web
              Analytics.
            </li>
            <li>
              <strong>Advertising &amp; tracking</strong> — Google Ads and the
              Meta Pixel.
            </li>
          </ul>
          <p className="mt-2">
            Where the law requires your consent (for example in the European
            Union and the United Kingdom), analytics and advertising cookies
            stay off unless you accept them. Elsewhere they are on by default
            and you can turn them off at any time. Our{" "}
            <Link href="/cookies" className={linkClass}>
              Cookie Policy
            </Link>{" "}
            lists each cookie, what it does, and how long it lasts.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Your Choices and Rights
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Change your cookie choices at any time in{" "}
              <CookieSettingsButton className={linkClass} />.
            </li>
            <li>
              Ask us for a copy of the personal information we hold about you,
              or ask us to correct or delete it.
            </li>
            <li>Unsubscribe from marketing emails at any time.</li>
          </ul>
          <p className="mt-2">
            Depending on where you live, you may have additional rights under
            your local privacy law. To make a request, contact us using the
            details below. We will not treat you differently for making one.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Data Retention and Deletion
          </h2>
          <p className="mt-2">
            We retain your booking information only as long as necessary to
            complete your repair service. You may request deletion of your
            personal data at any time by contacting us. Cookie lifetimes are
            listed in our{" "}
            <Link href="/cookies" className={linkClass}>
              Cookie Policy
            </Link>
            ; information collected by Google and Meta is kept according to
            their own policies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Changes to This Policy
          </h2>
          <p className="mt-2">
            If we change how we handle your information, we will update this
            page and the date at the top.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Contact Us
          </h2>
          <p className="mt-2">
            If you have questions about this privacy policy or your personal
            data, contact us at:
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
