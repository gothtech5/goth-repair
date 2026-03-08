import { Hero } from "@/components/home/hero"
import { ServicesOverview } from "@/components/home/services-overview"
import { HowItWorks } from "@/components/home/how-it-works"
import { TrustSignals } from "@/components/home/trust-signals"
import { LocationHours } from "@/components/home/location-hours"

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GothTech",
  description:
    "Expert repair services for iPhones, iPads, Apple Watches, and Macs in Minneapolis.",
  url: "https://gothtech.repair",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "200 W Lake St #203",
    addressLocality: "Minneapolis",
    addressRegion: "MN",
    postalCode: "55408",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 44.9484517,
    longitude: -93.2814591,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "11:00",
    closes: "21:00",
  },
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Repair Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Screen Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Battery Replacement" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Charging Port Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Camera Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Damage Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Software Diagnostics" } },
    ],
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
      />
      <Hero />
      <ServicesOverview />
      <HowItWorks />
      <TrustSignals />
      <LocationHours />
    </>
  )
}
