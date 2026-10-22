import { NextResponse } from "next/server"
import { isHalloweenActive, isValidEmail } from "@/lib/halloween"
import { missingSignupSettings, signUpForHalloween } from "@/lib/halloween-signup"

export const dynamic = "force-dynamic"

/**
 * Halloween signup. Answers { ok: true } only after the email address has been
 * saved AND Resend has accepted the email with the code.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 400 })
  }

  // Hidden "website" field: people never fill it in, spam bots do.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 400 })
  }

  if (!isHalloweenActive()) {
    return NextResponse.json(
      { ok: false, error: "Sorry, our Halloween offer ended on October 31, 2026." },
      { status: 410 },
    )
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 })
  }
  const marketingOptIn = body.marketingOptIn === true

  const missing = missingSignupSettings()
  if (missing.length) {
    console.error(`[halloween] signup unavailable, missing env vars: ${missing.join(", ")}`)
    return NextResponse.json(
      { ok: false, error: "Signups are not available right now. Please try again later or call us at (612) 987-8107." },
      { status: 503 },
    )
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  try {
    const result = await signUpForHalloween({ email, marketingOptIn, ip })
    if (result.status === "rate-limited") {
      return NextResponse.json(
        { ok: false, error: "Too many signups from this connection. Please try again later." },
        { status: 429 },
      )
    }
    return NextResponse.json({ ok: true, alreadySent: result.status === "already-sent" })
  } catch (error) {
    console.error("[halloween] signup failed:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { ok: false, error: "We couldn't send your code just now. Please try again in a minute." },
      { status: 502 },
    )
  }
}
