import { BUSINESS } from "@/config/business"

export function TrustSignals() {
  return (
    <section className="border-y border-border-light bg-surface-secondary px-6 py-12">
      <div className="mx-auto grid max-w-[1120px] gap-6 sm:grid-cols-2 md:grid-cols-4">
        {BUSINESS.trust.signals.map((signal) => (
          <div key={signal.title} className="text-center">
            <p className="font-medium">{signal.title}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {signal.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
