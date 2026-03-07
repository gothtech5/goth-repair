import { Hero } from "@/components/home/hero"
import { ServicesOverview } from "@/components/home/services-overview"
import { HowItWorks } from "@/components/home/how-it-works"
import { TrustSignals } from "@/components/home/trust-signals"
import { LocationHours } from "@/components/home/location-hours"

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <HowItWorks />
      <TrustSignals />
      <LocationHours />
    </>
  )
}
