import { NextResponse } from "next/server"
import { handleSquareEvent, isFromSquare, notificationUrls } from "@/lib/evertrail/square-sales"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Square calls this address when something sells or is refunded.
 * Address to register in Square: https://www.gothtechnology.com/api/square/webhook
 *
 * Every request must carry a valid Square signature. Anything else is rejected and changes nothing.
 * A failure while updating stock answers 500, so Square sends the event again later; the same
 * sale is never counted twice.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // The signature covers the exact bytes Square sent, so read the body as raw text first.
  const rawBody = await request.text()
  const signature = request.headers.get("x-square-hmacsha256-signature")

  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim()) {
    console.error("Square webhook: SQUARE_WEBHOOK_SIGNATURE_KEY is not set in Vercel.")
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  if (!isFromSquare(rawBody, signature, notificationUrls(request))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: Parameters<typeof handleSquareEvent>[0]
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const result = await handleSquareEvent(event)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error("Square webhook failed:", event.type, event.event_id, error)
    return NextResponse.json({ error: "Could not process this event yet" }, { status: 500 })
  }
}
