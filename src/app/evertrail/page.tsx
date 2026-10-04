import Link from "next/link"
import { isLoggedIn } from "@/lib/evertrail/auth"
import { sql } from "@/lib/evertrail/db"
import { Shell } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

const CARDS = [
  { href: "/evertrail/products", title: "Products", text: "Add products and set prices, barcodes and stock." },
  { href: "/evertrail/labels", title: "Labels", text: "Print barcode labels on the DYMO printer." },
  { href: "/evertrail/scan", title: "Scan", text: "Scan a barcode to look up a product and adjust stock." },
  { href: "/evertrail/po", title: "Purchase orders", text: "Order from vendors and receive shipments." },
]

export default async function EvertrailHome() {
  // The login form itself lives in layout.tsx, so this page just shows nothing until logged in.
  if (!(await isLoggedIn())) return null

  let summary = ""
  let error = ""
  try {
    const rows = await sql(
      `select (select count(*) from products) as products,
              (select coalesce(sum(quantity_on_hand), 0) from products) as units,
              (select count(*) from purchase_orders where status = 'open') as open_pos`
    )
    const r = rows[0]
    summary = `${r.products} products · ${r.units} units in stock · ${r.open_pos} open purchase orders`
  } catch (e) {
    error = "Could not reach the database: " + (e instanceof Error ? e.message : String(e))
  }

  return (
    <Shell title="Evertrail" error={error}>
      {summary ? <p className="mb-6 text-sm text-neutral-700">{summary}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-lg border border-neutral-300 p-4 hover:bg-neutral-50"
          >
            <span className="block text-lg font-semibold">{card.title}</span>
            <span className="block text-sm text-neutral-700">{card.text}</span>
          </Link>
        ))}
      </div>
    </Shell>
  )
}
