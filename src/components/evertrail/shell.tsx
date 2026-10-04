import Link from "next/link"
import type { ReactNode } from "react"

const LINKS = [
  { href: "/evertrail", label: "Home" },
  { href: "/evertrail/products", label: "Products" },
  { href: "/evertrail/labels", label: "Labels" },
  { href: "/evertrail/scan", label: "Scan" },
  { href: "/evertrail/po", label: "Purchase orders" },
]

export const inputClass =
  "w-full rounded-md border border-neutral-400 bg-white px-3 py-2 text-base text-black"
export const buttonClass =
  "whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
export const smallButtonClass =
  "rounded-md border border-neutral-400 bg-white px-3 py-1 text-sm text-black hover:bg-neutral-100"
export const linkClass = "text-blue-700 underline"

/** Page frame used by every Evertrail screen: top menu, title, messages. */
export function Shell({
  title,
  error,
  notice,
  children,
}: {
  title: string
  error?: string
  notice?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-black print:m-0 print:max-w-none print:p-0">
      <nav className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-neutral-300 pb-3 print:hidden">
        <span className="text-lg font-bold">Evertrail</span>
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm font-medium text-blue-700 hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
      <h1 className="mb-4 text-2xl font-bold print:hidden">{title}</h1>
      {error ? (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800 print:hidden">
          {notice}
        </p>
      ) : null}
      {children}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  )
}
