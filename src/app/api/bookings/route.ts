import { NextResponse } from "next/server"
import { getCalendarClient } from "@/lib/google-calendar"
import { sendConfirmationEmail } from "@/lib/send-confirmation-email"

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

function parseTimeSlot(date: string, timeSlot: string): { start: string; end: string } {
  const match = timeSlot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) throw new Error("Invalid time slot format")

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0

  const hh = hours.toString().padStart(2, "0")
  const mm = minutes.toString().padStart(2, "0")
  const endHour = (hours + 1).toString().padStart(2, "0")

  return {
    start: `${date}T${hh}:${mm}:00`,
    end: `${date}T${endHour}:${mm}:00`,
  }
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

  const { contact, modelName, issueName, date, timeSlot, deviceType } = body
  const customerName = `${contact.firstName} ${contact.lastName}`

  let times: { start: string; end: string }
  try {
    times = parseTimeSlot(date, timeSlot)
  } catch {
    return NextResponse.json({ error: "Invalid date or time" }, { status: 400 })
  }

  try {
    const { calendar, calendarId } = getCalendarClient()

    const description = [
      `Customer: ${customerName}`,
      `Phone: ${contact.phone}`,
      `Email: ${contact.email}`,
      `Device: ${deviceType} — ${modelName}`,
      `Issue: ${issueName}`,
      contact.notes ? `Notes: ${contact.notes}` : "",
    ].filter(Boolean).join("\n")

    const event = await calendar.events.insert({
      calendarId,
      sendUpdates: "all",
      requestBody: {
        summary: `Repair: ${modelName} — ${issueName} (${customerName})`,
        description,
        start: {
          dateTime: times.start,
          timeZone: "America/Chicago",
        },
        end: {
          dateTime: times.end,
          timeZone: "America/Chicago",
        },
      },
    })

    const eventId = event.data.id
    if (eventId) {
      try {
        await sendConfirmationEmail({
          eventId,
          customerName,
          email: contact.email,
          date,
          timeSlot,
          deviceType,
          modelName,
          issueName,
        })
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Google Calendar API error:", err)
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
  }
}
