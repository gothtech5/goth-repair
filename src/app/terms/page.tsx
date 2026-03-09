import type { Metadata } from "next"
import { BUSINESS } from "@/config/business"

export const metadata: Metadata = {
  title: `Terms of Service | ${BUSINESS.name}`,
  description: `${BUSINESS.name} terms of service for device repair services.`,
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="text-3xl font-bold text-balance">Terms of Service</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Last updated: January 1, 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Service Description
          </h2>
          <p className="mt-2">
            {BUSINESS.name} provides repair services for iPhones, iPads, and Apple
            Watches at our {BUSINESS.location.city} location. By booking a repair through our
            website, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Repair Liability
          </h2>
          <p className="mt-2">
            {BUSINESS.name} is not responsible for pre-existing conditions, defects, or
            damage unrelated to the repair service requested. We are not liable
            for data loss during repair — customers are responsible for backing
            up their devices before service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Warranty
          </h2>
          <p className="mt-2">
            All repairs performed by {BUSINESS.name} include a {BUSINESS.trust.warrantyDays}-day warranty covering
            the specific repair completed. This warranty does not cover
            subsequent damage, water damage, or issues unrelated to the original
            repair. Warranty is void if the device is opened or repaired by
            another party after our service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Payment
          </h2>
          <p className="mt-2">
            Payment is due upon completion of the repair. We reserve the right
            to hold a device until payment is received in full. Final pricing
            may vary from initial estimates if additional issues are discovered
            during repair — we will contact you for approval before proceeding
            with any additional work.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Limitation of Liability
          </h2>
          <p className="mt-2">
            {BUSINESS.name}&apos;s liability is limited to the cost of the repair
            service performed. We are not liable for indirect, incidental, or
            consequential damages including but not limited to lost profits,
            data, or business opportunities.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Right to Refuse Service
          </h2>
          <p className="mt-2">
            {BUSINESS.name} reserves the right to refuse service at our discretion,
            including but not limited to devices that show signs of tampering,
            stolen property, or conditions that pose a safety risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Governing Law
          </h2>
          <p className="mt-2">
            These terms are governed by and construed in accordance with the
            laws of the State of {BUSINESS.location.stateName}. Any disputes arising from these
            terms or our services shall be subject to the exclusive jurisdiction
            of the courts in {BUSINESS.location.jurisdiction}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary">
            Contact Us
          </h2>
          <p className="mt-2">
            If you have questions about these terms, contact us at:
          </p>
          <p className="mt-2">
            {BUSINESS.name}
            <br />
            {BUSINESS.location.address}
            <br />
            {BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.zip}
          </p>
        </section>
      </div>
    </main>
  )
}
