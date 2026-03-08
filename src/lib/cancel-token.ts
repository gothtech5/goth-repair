import { createHmac } from "crypto"

function getSecret(): string {
  const secret = process.env.CANCEL_TOKEN_SECRET
  if (!secret) throw new Error("CANCEL_TOKEN_SECRET is not configured")
  return secret
}

function toBase64Url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input
  return buf.toString("base64url")
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, "base64url").toString()
}

export function createCancelToken(eventId: string): string {
  const hmac = createHmac("sha256", getSecret()).update(eventId).digest()
  return `${toBase64Url(eventId)}.${toBase64Url(hmac)}`
}

export function verifyCancelToken(token: string): string | null {
  const dotIndex = token.indexOf(".")
  if (dotIndex === -1) return null

  try {
    const eventId = fromBase64Url(token.slice(0, dotIndex))
    const expected = createCancelToken(eventId)
    if (token !== expected) return null
    return eventId
  } catch {
    return null
  }
}
