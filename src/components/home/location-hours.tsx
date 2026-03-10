const HOURS = [
  { day: "Monday", time: "11:00 AM - 9:00 PM" },
  { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
  { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
  { day: "Thursday", time: "11:00 AM - 9:00 PM" },
  { day: "Friday", time: "11:00 AM - 9:00 PM" },
  { day: "Saturday", time: "11:00 AM - 9:00 PM" },
  { day: "Sunday", time: "11:00 AM - 9:00 PM" },
] as const

export function LocationHours() {
  return (
    <section id="location" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-accent">
          Location
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Visit us
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-secondary text-pretty">
          Conveniently located in Minneapolis, MN. Walk in any day of the week.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium">GothTech</h3>
            <a
              href="https://maps.app.goo.gl/RpGRgnfvj8TSac8B6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm"
              aria-label="5.0 out of 5 stars on Google, 257 reviews"
            >
              <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
                {"★★★★★"}
              </span>
              <span className="font-medium tabular-nums">5.0</span>
              <span className="text-text-tertiary">(257 reviews)</span>
            </a>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-text-secondary">Call us:</span>
              <a href="tel:+16129878107" className="font-medium text-accent hover:text-accent-hover">
                (612)-987-8107
              </a>
            </div>
            <address className="mt-3 space-y-1 text-sm not-italic text-text-secondary">
              <p>200 W Lake St #203</p>
              <p>Minneapolis, MN 55408</p>
            </address>
            <table className="mt-6 w-full text-sm">
              <tbody>
                {HOURS.map((row) => (
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
              title="GothTech location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.0!2d-93.2814591!3d44.9484517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b333a4ebdf80e3%3A0xd7c1f279d9208b88!2sGothTech%3A%20Expert%20Repair%20Services%20for%20Phones%20and%20iPads.!5e0!3m2!1sen!2sus!4v1"
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
