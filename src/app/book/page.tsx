import { Suspense } from "react"
import { BookingWizard } from "@/components/booking/booking-wizard"
import { BUSINESS } from "@/config/business"

export const metadata = {
  title: `Book a Repair | ${BUSINESS.name}`,
  description: "Schedule your Apple device repair online. Free diagnostics, same-day service.",
}

export default function BookPage() {
  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  )
}
