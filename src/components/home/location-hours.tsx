import { BUSINESS } from "@/config/business"

export function LocationHours() {
  return (
    <section id="location" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Visit us
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium">{BUSINESS.name}</h3>
            <a
              href={BUSINESS.google.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm"
              aria-label={`${BUSINESS.google.rating} out of 5 stars on Google, ${BUSINESS.google.reviewCount} reviews`}
            >
              <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
                {"★★★★★"}
              </span>
              <span className="font-medium tabular-nums">{BUSINESS.google.rating}</span>
              <span className="text-text-tertiary">({BUSINESS.google.reviewCount} reviews)</span>
            </a>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <a href={BUSINESS.contact.phoneHref} className="font-medium hover:text-accent">
                {BUSINESS.contact.phone}
              </a>
            </div>
            <address className="mt-3 space-y-1 text-sm not-italic text-text-secondary">
              <p>{BUSINESS.location.address}</p>
              <p>{BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.zip}</p>
            </address>
            <table className="mt-6 w-full text-sm">
              <tbody>
                {BUSINESS.hours.displayHours.map((row) => (
                  <tr key={row.day} className="border-b border-border-light">
                    <td className="py-2.5 font-medium">{row.day}</td>
                    <td className="py-2.5 text-right text-text-secondary">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="min-h-[300px] overflow-hidden rounded-xl border border-border-light">
            <iframe
              title={`${BUSINESS.name} location`}
              src={BUSINESS.location.googleMapsEmbed}
              className="size-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
