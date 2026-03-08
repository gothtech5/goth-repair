import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | GothTech",
  description: "GothTech privacy policy — how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="text-3xl font-bold text-balance">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Last updated: January 1, 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Information We Collect
          </h2>
          <p className="mt-2">
            When you book a repair through our website, we collect the following
            information:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Device type and repair details</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            How We Use Your Information
          </h2>
          <p className="mt-2">
            Your information is used solely to schedule and manage your repair
            appointment. We create a calendar event via Google Calendar to
            confirm your booking and send you reminders.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Third-Party Services
          </h2>
          <p className="mt-2">We use the following third-party services:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Google Calendar API</strong> — to schedule and manage
              repair appointments
            </li>
            <li>
              <strong>Vercel</strong> — to host this website
            </li>
          </ul>
          <p className="mt-2">
            We do not sell, trade, or otherwise share your personal information
            with any other third parties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Cookies
          </h2>
          <p className="mt-2">
            This website does not use tracking cookies or analytics. Only
            essential cookies required for hosting functionality may be set by
            our hosting provider (Vercel).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Data Retention and Deletion
          </h2>
          <p className="mt-2">
            We retain your booking information only as long as necessary to
            complete your repair service. You may request deletion of your
            personal data at any time by contacting us.
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
          </p>
        </section>
      </div>
    </main>
  )
}
