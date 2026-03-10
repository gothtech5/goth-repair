import { ShieldCheck, Shield, Clock, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const SIGNALS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ShieldCheck, title: "Free Diagnostics", description: "No charge to assess the issue" },
  { icon: Shield, title: "90-Day Warranty", description: "On all parts and labor" },
  { icon: Clock, title: "Same-Day Repairs", description: "Most repairs done in hours" },
  { icon: Zap, title: "Certified Technicians", description: "Experienced device specialists" },
]

export function TrustSignals() {
  return (
    <section className="border-y border-border-light bg-surface-secondary px-6 py-12">
      <div className="mx-auto grid max-w-[1120px] gap-6 sm:grid-cols-2 md:grid-cols-4">
        {SIGNALS.map((signal) => (
          <div key={signal.title} className="flex flex-col items-center text-center">
            <signal.icon className="size-6 text-accent" />
            <p className="mt-3 font-medium">{signal.title}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {signal.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
