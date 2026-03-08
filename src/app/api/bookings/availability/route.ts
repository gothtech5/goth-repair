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

function slotToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes
}

function eventToLocalMinutes(dateTime: string): number {
  const d = new Date(dateTime)
  const local = new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }))
  return local.getHours() * 60 + local.getMinutes()
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const date = request.nextUrl.searchParams.get("date")
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Missing or invalid date param (YYYY-MM-DD)" }, { status: 400 })
  }

  try {
    const { calendar, calendarId } = getCalendarClient()

    const nextDay = new Date(`${date}T12:00:00Z`)
    nextDay.setUTCDate(nextDay.getUTCDate() + 1)
    const nextDateStr = nextDay.toISOString().slice(0, 10)

    const res = await calendar.events.list({
      calendarId,
      timeMin: `${date}T05:00:00Z`,
      timeMax: `${nextDateStr}T05:00:00Z`,
      timeZone: TIMEZONE,
      singleEvents: true,
    })

    const events = res.data.items ?? []

    const unavailable = new Set<string>()

    for (const event of events) {
      const start = event.start?.dateTime
      const end = event.end?.dateTime
      if (!start || !end) continue

      const busyStartMin = eventToLocalMinutes(start)
      const busyEndMin = eventToLocalMinutes(end)

      for (const slot of SLOT_TIMES) {
        const { hours, minutes } = slotTo24h(slot)
        const slotStartMin = slotToMinutes(hours, minutes)
        const slotEndMin = slotStartMin + 30

        if (slotStartMin < busyEndMin && slotEndMin > busyStartMin) {
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
