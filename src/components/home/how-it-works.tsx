const STEPS = [
  {
    number: "1",
    title: "Book Online",
    description: "Select your device, describe the issue, and pick a time that works.",
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
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary text-pretty">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
