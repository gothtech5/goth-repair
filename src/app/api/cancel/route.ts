import { NextResponse } from "next/server"
import { verifyCancelToken } from "@/lib/cancel-token"
import { getCalendarClient } from "@/lib/google-calendar"

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const eventId = verifyCancelToken(token)
  if (!eventId) {
    return NextResponse.json({ error: "Invalid or tampered token" }, { status: 403 })
  }

  try {
    const { calendar, calendarId } = getCalendarClient()
    const event = await calendar.events.get({ calendarId, eventId })

    if (event.data.status === "cancelled") {
      return NextResponse.json({ cancelled: true })
    }

    return NextResponse.json({
      summary: event.data.summary ?? "",
      start: event.data.start?.dateTime ?? "",
      end: event.data.end?.dateTime ?? "",
    })
  } catch (err: unknown) {
    const status = (err as { code?: number }).code
    if (status === 404 || status === 410) {
      return NextResponse.json({ cancelled: true })
    }
    console.error("Failed to fetch event:", err)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: { token?: string }
  try {
    body = await request.json() as { token?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const token = body.token
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const eventId = verifyCancelToken(token)
  if (!eventId) {
    return NextResponse.json({ error: "Invalid or tampered token" }, { status: 403 })
  }

  try {
    const { calendar, calendarId } = getCalendarClient()
    await calendar.events.delete({ calendarId, eventId, sendUpdates: "all" })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const status = (err as { code?: number }).code
    if (status === 404 || status === 410) {
      return NextResponse.json({ cancelled: true })
    }
    console.error("Failed to delete event:", err)
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 })
  }
}
