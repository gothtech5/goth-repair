import { NextResponse } from "next/server"
import { Resend } from "resend"

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error("RESEND_API_KEY is not configured")
  return new Resend(key)
}

const SHOP_EMAIL = process.env.SHOP_EMAIL ?? "bookings@gothtech.repair"

interface BookingPayload {
  deviceType: string
  modelName: string
  issueName: string
  date: string
  timeSlot: string
  contact: {
    firstName: string
    lastName: string
    phone: string
    email: string
    notes: string
  }
}

function validatePayload(body: unknown): body is BookingPayload {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>

  if (typeof b.deviceType !== "string" || !b.deviceType) return false
  if (typeof b.modelName !== "string" || !b.modelName) return false
  if (typeof b.issueName !== "string" || !b.issueName) return false
  if (typeof b.date !== "string" || !b.date) return false
  if (typeof b.timeSlot !== "string" || !b.timeSlot) return false

  const c = b.contact
  if (!c || typeof c !== "object") return false
  const contact = c as Record<string, unknown>

  if (typeof contact.firstName !== "string" || !contact.firstName.trim()) return false
  if (typeof contact.lastName !== "string" || !contact.lastName.trim()) return false
  if (typeof contact.phone !== "string" || !contact.phone.trim()) return false
  if (typeof contact.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return false

  return true
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!validatePayload(body)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
  }

  const { contact, modelName, issueName, date, timeSlot } = body

  try {
    const resend = getResend()
    await Promise.all([
      resend.emails.send({
        from: "GothTech Bookings <bookings@gothtech.repair>",
        to: SHOP_EMAIL,
        subject: `New Booking: ${contact.firstName} ${contact.lastName} — ${issueName}`,
        html: `
          <h2>New Repair Booking</h2>
          <table style="border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Name</td><td>${contact.firstName} ${contact.lastName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Phone</td><td>${contact.phone}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Email</td><td>${contact.email}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Device</td><td>${modelName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Issue</td><td>${issueName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Date</td><td>${date}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Time</td><td>${timeSlot}</td></tr>
            ${contact.notes ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600">Notes</td><td>${contact.notes}</td></tr>` : ""}
          </table>
        `,
      }),
      resend.emails.send({
        from: "GothTech <bookings@gothtech.repair>",
        to: contact.email,
        subject: "Your GothTech Repair Appointment",
        html: `
          <h2>Hi ${contact.firstName},</h2>
          <p>Your repair appointment has been booked.</p>
          <table style="border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Device</td><td>${modelName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Issue</td><td>${issueName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Date</td><td>${date}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;font-weight:600">Time</td><td>${timeSlot}</td></tr>
          </table>
          <p style="margin-top:16px">Bring your device to:<br><strong>200 W Lake St #203, Minneapolis, MN 55408</strong></p>
          <p>See you soon!<br>— GothTech</p>
        `,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 })
  }
}
