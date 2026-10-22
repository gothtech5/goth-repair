// Halloween 2026 signups: saves the email in the evertrail-db database (the same
// Neon database the site already uses) and emails the discount code with Resend
// (the same sender the booking confirmations use).
// Server-side only: never import this file from a "use client" component.

import { createHash } from "crypto"
import { Resend } from "resend"
import { sql } from "@/lib/evertrail/db"
import {
  HALLOWEEN_CODE,
  HALLOWEEN_END_LABEL,
  HALLOWEEN_TERMS,
} from "@/lib/halloween"

const FROM = "GothTech <bookings@gothtechnology.com>"
const REPLY_TO = "gothtechnology5@gmail.com"

/** How long before the same email address can be sent the code again. */
const RESEND_AFTER_MINUTES = 10
/** Most new signups allowed from one connection per hour (stops abuse). */
const MAX_SIGNUPS_PER_HOUR = 5

export const MARKETING_CONSENT_TEXT =
  "Yes, send me occasional GothTech news and offers by email. I can unsubscribe at any time."

let schemaReady: Promise<void> | null = null

/** Creates the halloween_signups table once. Never changes existing data. */
export function ensureHalloweenSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql(
      `create table if not exists halloween_signups (
         id serial primary key,
         email text not null unique,
         marketing_opt_in boolean not null default false,
         marketing_opt_in_at timestamptz,
         marketing_consent_text text,
         ip_hash text,
         created_at timestamptz not null default now(),
         code_sent_at timestamptz,
         send_count integer not null default 0
       )`,
    )
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null
        throw error
      })
  }
  return schemaReady
}

/** What is missing in Vercel for signups to work. Empty when ready. */
export function missingSignupSettings(): string[] {
  const missing: string[] = []
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL")
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY")
  return missing
}

export function hashIp(ip: string): string {
  return createHash("sha256").update("gt-halloween:" + ip).digest("hex").slice(0, 32)
}

const isTrue = (v: string | null | undefined) => v === "t" || v === "true"

export type SignupResult =
  | { status: "sent" }
  | { status: "already-sent" }
  | { status: "rate-limited" }

/**
 * Saves the signup, then emails the code.
 * Throws if saving or sending fails, so the caller never reports a false success.
 */
export async function signUpForHalloween(input: {
  email: string
  marketingOptIn: boolean
  ip: string
}): Promise<SignupResult> {
  await ensureHalloweenSchema()

  const email = input.email.trim().toLowerCase()
  const ipHash = hashIp(input.ip)

  const existing = await sql(
    `select id from halloween_signups where email = $1`,
    [email],
  )

  if (!existing.length) {
    const recent = await sql(
      `select count(*) as n from halloween_signups
        where ip_hash = $1 and created_at > now() - interval '1 hour'`,
      [ipHash],
    )
    if (Number(recent[0]?.n ?? 0) >= MAX_SIGNUPS_PER_HOUR) {
      return { status: "rate-limited" }
    }
  }

  // Save first. A ticked marketing box is recorded with the time and the exact
  // wording shown; an unticked box never removes an earlier "yes".
  const saved = await sql(
    `insert into halloween_signups
       (email, marketing_opt_in, marketing_opt_in_at, marketing_consent_text, ip_hash)
     values ($1, $2::boolean,
             case when $2::boolean then now() else null end,
             case when $2::boolean then $3::text else null end,
             $4::text)
     on conflict (email) do update set
       marketing_opt_in = halloween_signups.marketing_opt_in or excluded.marketing_opt_in,
       marketing_opt_in_at = coalesce(halloween_signups.marketing_opt_in_at, excluded.marketing_opt_in_at),
       marketing_consent_text = coalesce(halloween_signups.marketing_consent_text, excluded.marketing_consent_text)
     returning id,
       (code_sent_at is not null
         and code_sent_at > now() - interval '${RESEND_AFTER_MINUTES} minutes') as sent_recently`,
    [email, input.marketingOptIn ? "true" : "false", MARKETING_CONSENT_TEXT, ipHash],
  )

  const row = saved[0]
  if (!row?.id) throw new Error("Signup was not saved.")

  if (isTrue(row.sent_recently)) return { status: "already-sent" }

  await sendHalloweenCodeEmail(email)

  await sql(
    `update halloween_signups
        set code_sent_at = now(), send_count = send_count + 1
      where id = $1`,
    [row.id],
  )
  return { status: "sent" }
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://gothtechnology.com").replace(/\/$/, "")
}

/** Sends the discount code. Throws if Resend does not accept the email. */
export async function sendHalloweenCodeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")

  const base = siteUrl()
  const bookUrl = `${base}/book`
  const privacyUrl = `${base}/privacy`

  const subject = `Your GothTech Halloween code: $10 off your repair`

  const html = `
<div style="background:#0f0c12;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#17121b;border:1px solid #2c2231;border-radius:16px;padding:32px 24px;color:#f4eff6;">
    <p style="margin:0;font-size:12px;letter-spacing:4px;font-weight:700;color:#ff8a1f;">GOTHTECH</p>
    <h1 style="margin:12px 0 4px;font-size:22px;font-weight:700;color:#ffffff;">Spooky Savings!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#cfc6d4;">Here is your $10 OFF code for your next device repair.</p>

    <div style="text-align:center;background:#0f0c12;border:2px dashed #ff8a1f;border-radius:12px;padding:20px 12px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;color:#cfc6d4;">YOUR CODE</p>
      <p style="margin:0;font-size:30px;font-weight:800;letter-spacing:3px;color:#ff8a1f;">${HALLOWEEN_CODE}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#ffffff;font-weight:600;">$10 OFF a repair service</p>
    </div>

    <p style="margin:24px 0 8px;font-size:14px;color:#f4eff6;font-weight:600;">How to use it</p>
    <ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.7;color:#cfc6d4;">
      <li>Book online and type ${HALLOWEEN_CODE} in the notes box, or just walk in.</li>
      <li>Show this email or tell us the code at the counter before you pay.</li>
    </ol>

    <div style="text-align:center;margin:28px 0;">
      <a href="${bookUrl}" style="display:inline-block;padding:12px 24px;background:#ff8a1f;color:#140f17;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;">Book My Repair</a>
    </div>

    <p style="margin:0 0 4px;font-size:12px;color:#a99fae;">Offer ends ${HALLOWEEN_END_LABEL}. ${HALLOWEEN_TERMS}</p>
    <p style="margin:16px 0 0;font-size:12px;color:#a99fae;">
      GothTech · 200 W Lake St #203, Minneapolis, MN 55408 · Open 11 AM–9 PM<br>
      Questions? Reply to this email or call (612) 987-8107.<br>
      <a href="${privacyUrl}" style="color:#ff8a1f;">Privacy Policy</a>
    </p>
  </div>
</div>`.trim()

  const text = [
    "GOTHTECH — Spooky Savings!",
    "",
    "Here is your $10 OFF code for your next device repair:",
    "",
    `    ${HALLOWEEN_CODE}`,
    "",
    "How to use it:",
    `1. Book online and type ${HALLOWEEN_CODE} in the notes box, or just walk in.`,
    "2. Show this email or tell us the code at the counter before you pay.",
    "",
    `Book My Repair: ${bookUrl}`,
    "",
    `Offer ends ${HALLOWEEN_END_LABEL}. ${HALLOWEEN_TERMS}`,
    "",
    "GothTech · 200 W Lake St #203, Minneapolis, MN 55408 · Open 11 AM–9 PM",
    "Questions? Reply to this email or call (612) 987-8107.",
    `Privacy Policy: ${privacyUrl}`,
  ].join("\n")

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: REPLY_TO,
    subject,
    html,
    text,
  })
  if (error) throw new Error(`Resend rejected the email: ${error.message}`)
}

export interface HalloweenSignupRow {
  email: string
  marketingOptIn: boolean
  createdAt: string
  codeSentAt: string | null
  sendCount: number
}

/** All signups, newest first (for the private Evertrail list). */
export async function listHalloweenSignups(): Promise<HalloweenSignupRow[]> {
  await ensureHalloweenSchema()
  const rows = await sql(
    `select email, marketing_opt_in, created_at, code_sent_at, send_count
       from halloween_signups order by created_at desc`,
  )
  return rows.map((r) => ({
    email: r.email ?? "",
    marketingOptIn: isTrue(r.marketing_opt_in),
    createdAt: r.created_at ?? "",
    codeSentAt: r.code_sent_at,
    sendCount: Number(r.send_count ?? 0),
  }))
}
