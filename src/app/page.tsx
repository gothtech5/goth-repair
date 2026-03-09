import { Hero } from "@/components/home/hero"
import { ServicesOverview } from "@/components/home/services-overview"
import { HowItWorks } from "@/components/home/how-it-works"
import { TrustSignals } from "@/components/home/trust-signals"
import { LocationHours } from "@/components/home/location-hours"
import { BUSINESS } from "@/config/business"

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS.name,
  description: BUSINESS.seo.shortDescription,
  url: `https://${BUSINESS.domain}`,
  telephone: BUSINESS.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.location.address,
    addressLocality: BUSINESS.location.city,
    addressRegion: BUSINESS.location.state,
    postalCode: BUSINESS.location.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.location.geo.latitude,
    longitude: BUSINESS.location.geo.longitude,
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
    opens: BUSINESS.hours.opensSchema,
    closes: BUSINESS.hours.closesSchema,
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
