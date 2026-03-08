import { NextResponse, type NextRequest } from "next/server"
import { getCalendarClient } from "@/lib/google-calendar"

const TIMEZONE = "America/Chicago"

const SLOT_TIMES = (() => {
  const times: string[] = []
  for (let hour = 11; hour <= 20; hour++) {
    for (const minutes of [0, 30]) {
      if (hour === 20 && minutes === 30) continue
      const h = hour > 12 ? hour - 12 : hour === 12 ? 12 : hour
      const ampm = hour >= 12 ? "PM" : "AM"
      const m = minutes.toString().padStart(2, "0")
      times.push(`${h}:${m} ${ampm}`)
    }
  }
  return times
})()

function slotTo24h(slot: string): { hours: number; minutes: number } {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return { hours: 0, minutes: 0 }
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0
  return { hours, minutes }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const date = request.nextUrl.searchParams.get("date")
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Missing or invalid date param (YYYY-MM-DD)" }, { status: 400 })
  }

  try {
    const { calendar, calendarId } = getCalendarClient()

    const dayStart = `${date}T00:00:00`
    const dayEnd = `${date}T23:59:59`

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(dayStart).toISOString(),
        timeMax: new Date(dayEnd).toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    })

    const busySlots = res.data.calendars?.[calendarId]?.busy ?? []

    const unavailable = new Set<string>()

    for (const busy of busySlots) {
      if (!busy.start || !busy.end) continue
      const busyStart = new Date(busy.start).getTime()
      const busyEnd = new Date(busy.end).getTime()

      for (const slot of SLOT_TIMES) {
        const { hours, minutes } = slotTo24h(slot)
        const slotStart = new Date(`${date}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`).getTime()
        const slotEnd = slotStart + 30 * 60 * 1000

        if (slotStart < busyEnd && slotEnd > busyStart) {
          unavailable.add(slot)
        }
      }
    }

    const slots = SLOT_TIMES.map((time) => ({
      time,
      available: !unavailable.has(time),
    }))

    return NextResponse.json({ slots })
  } catch (err) {
    console.error("Google Calendar freebusy error:", err)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
