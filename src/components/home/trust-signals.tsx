const SIGNALS = [
  { title: "Free Diagnostics", description: "No charge to assess the issue" },
  { title: "90-Day Warranty", description: "On all parts and labor" },
  { title: "Same-Day Repairs", description: "Most repairs done in hours" },
  { title: "Certified Technicians", description: "Experienced Apple device specialists" },
] as const

export function TrustSignals() {
  return (
    <section className="border-y border-border-light bg-surface-secondary px-6 py-12">
      <div className="mx-auto grid max-w-[1120px] gap-6 sm:grid-cols-2 md:grid-cols-4">
        {SIGNALS.map((signal) => (
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
