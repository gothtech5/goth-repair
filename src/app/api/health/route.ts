import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(): Promise<NextResponse> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  if (!keyJson) return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_KEY is missing" })
  if (!calendarId) return NextResponse.json({ error: "GOOGLE_CALENDAR_ID is missing" })

  let key: { client_email: string; private_key: string }
  try {
    key = JSON.parse(keyJson)
  } catch {
    return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON — check for extra quotes or line breaks" })
  }

  if (!key.client_email || !key.private_key) {
    return NextResponse.json({ error: "JSON parsed but missing client_email or private_key fields" })
  }

  try {
    const auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    })

    const calendar = google.calendar({ version: "v3", auth })
    await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 86400000).toISOString(),
        timeZone: "America/Chicago",
        items: [{ id: calendarId }],
      },
    })

    return NextResponse.json({ status: "ok", calendarId, serviceAccount: key.client_email })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Calendar API call failed: ${message}` })
  }
}
