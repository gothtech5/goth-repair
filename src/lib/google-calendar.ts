import { google } from "googleapis"

export function getCalendarClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not configured")

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) throw new Error("GOOGLE_CALENDAR_ID is not configured")

  const key = JSON.parse(keyJson) as { client_email: string; private_key: string }

  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  })

  return { calendar: google.calendar({ version: "v3", auth }), calendarId }
}
