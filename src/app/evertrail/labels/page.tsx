import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, salePriceCents, type Search } from "@/lib/evertrail/format"
import { ensureProductSchema } from "@/lib/evertrail/products"
import { Shell } from "@/components/evertrail/shell"
import { LabelPrinter, type LabelProduct } from "@/components/evertrail/label-printer"

export const dynamic = "force-dynamic"

export default async function LabelsPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const preselected = one(params.ids)
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id))

  let error = ""
  let products: LabelProduct[] = []
  try {
    await ensureProductSchema()
    const rows = await sql(
      `select id, name, sku, barcode, price_cents, discount_cents from products order by name limit 2000`
    )
    products = rows.map((r) => ({
      id: r.id ?? "",
      name: r.name ?? "",
      code: r.barcode || r.sku || "",
      // The sale price: the price minus any discount.
      price: dollars(salePriceCents(r.price_cents, r.discount_cents)),
    }))
  } catch (e) {
    error = "Could not load products: " + friendlyError(e)
  }

  return (
    <Shell title="Print labels" error={error}>
      <LabelPrinter products={products} preselected={preselected} />
    </Shell>
  )
}
