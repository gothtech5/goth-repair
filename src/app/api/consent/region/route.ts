import { NextResponse } from "next/server"
import { requiresOptIn } from "@/lib/consent"

/**
 * Tells the cookie banner whether this visitor is in a place where
 * non-essential cookies must stay off until they say yes.
 * Uses the visitor's country as reported by Vercel; nothing is stored.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const country = request.headers.get("x-vercel-ip-country")
  return NextResponse.json(
    { optIn: requiresOptIn(country) },
    { headers: { "Cache-Control": "private, no-store" } },
  )
}
