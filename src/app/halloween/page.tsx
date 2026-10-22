import type { Metadata } from "next"
import Link from "next/link"
import { HalloweenOfferHeading } from "@/components/halloween/halloween-popup"
import { HalloweenSignupForm } from "@/components/halloween/signup-form"
import { HALLOWEEN_END_LABEL, HALLOWEEN_TERMS } from "@/lib/halloween"
import { HalloweenEndedGate } from "./ended-gate"

export const metadata: Metadata = {
  title: "Halloween Offer: $10 Off Your Repair | GothTech",
  description:
    "Get $10 off your next phone or iPad repair at GothTech Minneapolis. Sign up for your Halloween discount code. Offer ends October 31, 2026.",
  alternates: { canonical: "/halloween" },
}

export default function HalloweenPage() {
  return (
    <div className="bg-[#0f0c12] px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-[460px] rounded-3xl border border-[#2c2231] bg-[#17121b] px-5 pb-6 pt-8 text-[#f4eff6] shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:px-8 sm:pb-8">
        <HalloweenEndedGate
          ended={
            <div className="text-center">
              <p className="text-xs font-bold tracking-[0.35em] text-[#ff8a1f]">GOTHTECH</p>
              <h1 className="mt-2 text-2xl font-bold text-white">Our Halloween offer has ended</h1>
              <p className="mt-2 text-sm text-[#cfc6d4]">
                Thanks for your interest. You can still book a repair any day, 11 AM–9 PM.
              </p>
              <Link
                href="/book"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ff8a1f] px-6 text-base font-bold text-[#140f17] hover:bg-[#ff9d42]"
              >
                Book My Repair
              </Link>
            </div>
          }
        >
          <HalloweenOfferHeading as="h1" />
          <div className="mt-6">
            <HalloweenSignupForm />
          </div>
        </HalloweenEndedGate>
      </div>

      <div className="mx-auto mt-8 max-w-[460px] text-sm leading-relaxed text-[#cfc6d4]">
        <h2 className="text-base font-semibold text-white">How it works</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Enter your email and we&apos;ll send you your Halloween discount code.</li>
          <li>
            <Link href="/book" className="text-[#ff8a1f] underline underline-offset-2">Book your repair</Link>{" "}
            and add the code in the notes box, or just walk in.
          </li>
          <li>Show the code at the counter before you pay to get $10 off.</li>
        </ol>
        <h2 className="mt-6 text-base font-semibold text-white">Offer terms</h2>
        <p className="mt-2">
          Offer ends {HALLOWEEN_END_LABEL}. {HALLOWEEN_TERMS} Valid at GothTech, 200 W Lake St #203,
          Minneapolis. See our{" "}
          <Link href="/privacy" className="text-[#ff8a1f] underline underline-offset-2">Privacy Policy</Link>{" "}
          for how we handle your email.
        </p>
      </div>
    </div>
  )
}
