import Link from "next/link"

const STEPS = [
  {
    number: "1",
    title: "Book Online",
    description: "Select your device, describe the issue, and pick a time that works.",
    href: "/book",
  },
  {
    number: "2",
    title: "Drop Off Your Device",
    description: "Bring it to our Minneapolis location. Free diagnostics included.",
  },
  {
    number: "3",
    title: "Get It Back",
    description: "Most repairs are done the same day. We'll text you when it's ready.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => {
            const content = (
              <div className="rounded-2xl border border-border-light bg-surface p-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-white">
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary text-pretty">
                  {step.description}
                </p>
              </div>
            )

            return "href" in step ? (
              <Link key={step.number} href={step.href} className="hover:opacity-90">
                {content}
              </Link>
            ) : (
              <div key={step.number}>
                {content}
              </div>
            )
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Start a Repair
          </Link>
        </div>
      </div>
    </section>
  )
}
