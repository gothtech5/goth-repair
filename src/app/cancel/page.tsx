import type { Metadata } from "next"
import { CancelForm } from "./cancel-form"

export const metadata: Metadata = {
  title: "Cancel Appointment | GothTech",
  description: "Cancel your upcoming GothTech repair appointment.",
  robots: { index: false, follow: false },
}

interface CancelPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[60dvh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-destructive">Invalid Link</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
          Missing cancellation token
        </h1>
        <p className="mt-3 text-text-secondary">
          This link appears to be incomplete. Please use the link from your confirmation email.
        </p>
      </div>
    )
  }

  return <CancelForm token={token} />
}
