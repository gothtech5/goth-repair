"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HALLOWEEN_END_LABEL,
  HALLOWEEN_TERMS,
  SIGNED_UP_KEY,
  isValidEmail,
} from "@/lib/halloween"

type Status = "idle" | "sending" | "success" | "error"

/**
 * The Halloween email form, used by the popup and the /halloween page.
 * The success message only appears after the server confirms the email was
 * saved and the code email was accepted for delivery.
 */
export function HalloweenSignupForm({
  autoFocus = false,
  onBookClick,
}: {
  autoFocus?: boolean
  /** Called when "Book My Repair" is clicked (the popup uses it to close itself). */
  onBookClick?: () => void
}) {
  const id = useId()
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [alreadySent, setAlreadySent] = useState(false)
  const [sentTo, setSentTo] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    const form = new FormData(e.currentTarget)
    const value = email.trim()
    if (!isValidEmail(value)) {
      setStatus("error")
      setError("Please enter a valid email address.")
      return
    }
    setStatus("sending")
    setError(null)
    try {
      const res = await fetch("/api/halloween", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          marketingOptIn: marketing,
          website: String(form.get("website") ?? ""),
        }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string; alreadySent?: boolean }
        | null
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.")
      }
      try {
        localStorage.setItem(SIGNED_UP_KEY, "1")
      } catch {
        // storage blocked: the popup may show again next visit, nothing breaks
      }
      setAlreadySent(!!data.alreadySent)
      setSentTo(value)
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  if (status === "success") {
    const onBookPage = pathname === "/book" || pathname?.startsWith("/book/")
    return (
      <div role="status" className="text-center">
        <p className="text-xl font-bold text-white">Check your inbox!</p>
        <p className="mt-2 text-sm text-[#cfc6d4] text-pretty">
          {alreadySent
            ? <>We already sent your $10 discount code to <strong className="text-white">{sentTo}</strong> a few minutes ago. Check your spam folder if you can&apos;t see it.</>
            : <>We&apos;ve emailed your $10 discount code to <strong className="text-white">{sentTo}</strong>.</>}
        </p>
        {onBookPage ? (
          <button
            type="button"
            onClick={onBookClick}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ff8a1f] px-6 text-base font-bold text-[#140f17] hover:bg-[#ff9d42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book My Repair
          </button>
        ) : (
          <Link
            href="/book"
            onClick={onBookClick}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ff8a1f] px-6 text-base font-bold text-[#140f17] hover:bg-[#ff9d42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book My Repair
          </Link>
        )}
        <p className="mt-3 text-xs text-[#a99fae]">
          Open 11 AM–9 PM every day. Book ahead or walk in.
        </p>
        <Terms />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="text-left">
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        autoFocus={autoFocus}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        aria-invalid={status === "error" ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="block min-h-12 w-full rounded-xl border border-[#3a2e40] bg-[#0f0c12] px-4 text-base text-white placeholder:text-[#8d8392] outline-none focus:border-[#ff8a1f] focus:ring-2 focus:ring-[#ff8a1f]/40"
      />

      {/* Spam trap: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ff8a1f] px-6 text-base font-bold text-[#140f17] hover:bg-[#ff9d42] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {status === "sending" ? "Sending your code…" : "Get My $10 Discount"}
      </button>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-[#ff9b8f]">
          {error}
        </p>
      )}

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#cfc6d4]">
        <input
          type="checkbox"
          name="marketingOptIn"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[#ff8a1f]"
        />
        <span>
          Optional: send me occasional GothTech news and offers by email. I can unsubscribe at any time.
        </span>
      </label>

      <p className="mt-3 text-xs leading-relaxed text-[#a99fae]">
        We&apos;ll use your email to send your discount code. See our{" "}
        <Link href="/privacy" className="font-medium text-[#ff8a1f] underline underline-offset-2 hover:text-[#ff9d42]">
          Privacy Policy
        </Link>
        .
      </p>
      <Terms />
    </form>
  )
}

function Terms() {
  return (
    <p className="mt-3 border-t border-[#2c2231] pt-3 text-[11px] leading-relaxed text-[#a99fae]">
      Offer ends {HALLOWEEN_END_LABEL}. {HALLOWEEN_TERMS}
    </p>
  )
}
