import { Suspense } from "react"
import { BookingWizard } from "@/components/booking/booking-wizard"

export const metadata = {
  title: "Book a Repair | GothTech",
  description: "Schedule your Apple device repair online. Free diagnostics, same-day service.",
}

export default function BookPage() {
  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  )
}
