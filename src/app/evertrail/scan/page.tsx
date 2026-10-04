import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, text, toInt, type Search } from "@/lib/evertrail/format"
import { ScanInput } from "@/components/evertrail/scan-input"
import { Shell, inputClass, buttonClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

async function adjustStock(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const change = toInt(formData.get("change"))
  const code = text(formData.get("code"))
  let target = "/evertrail/scan?code=" + encodeURIComponent(code)
  try {
    // Stock never goes below zero.
    await sql(`update products set quantity_on_hand = greatest(0, quantity_on_hand + $2) where id = $1`, [id, change])
  } catch (e) {
    target += "&err=" + encodeURIComponent(friendlyError(e))
  }
  redirect(target)
}

export default async function ScanPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const code = one(params.code).trim()

  let error = one(params.err)
  let product: Awaited<ReturnType<typeof sql>>[number] | undefined
  if (code) {
    try {
      const rows = await sql(
        `select * from products where barcode = $1 or sku = $1 order by (barcode = $1) desc nulls last limit 1`,
        [code]
      )
      product = rows[0]
    } catch (e) {
      error = "Could not look that up: " + friendlyError(e)
    }
  }

  return (
    <Shell title="Scan" error={error}>
      <form method="get" className="mb-6 flex gap-2">
        <ScanInput
          name="code"
          stamp={Date.now()}
          placeholder="Scan a barcode (or type a SKU and press Enter)"
          className={inputClass}
        />
        <button type="submit" className={buttonClass}>
          Look up
        </button>
      </form>

      {code && product ? (
        <section className="rounded-lg border border-neutral-300 p-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="mt-1 text-sm text-neutral-700">
            SKU <span className="font-mono">{product.sku}</span> · Barcode{" "}
            <span className="font-mono">{product.barcode ?? "none"}</span>
          </p>
          <p className="mt-3 text-sm">
            Price ${dollars(product.price_cents)} · Cost ${dollars(product.cost_cents)}
          </p>
          <p className="mt-3 text-3xl font-bold">{product.quantity_on_hand} in stock</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[-1, 1, 5, 10].map((change) => (
              <form key={change} action={adjustStock}>
                <input type="hidden" name="id" value={product.id ?? ""} />
                <input type="hidden" name="code" value={code} />
                <input type="hidden" name="change" value={change} />
                <button type="submit" className={smallButtonClass}>
                  {change > 0 ? `+${change}` : change}
                </button>
              </form>
            ))}
            <Link href={`/evertrail/products/${product.id}`} className={linkClass}>
              Edit
            </Link>
            <Link href={`/evertrail/labels?ids=${product.id}`} className={linkClass}>
              Print label
            </Link>
          </div>
        </section>
      ) : null}

      {code && !product && !error ? (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="mb-2">
            No product has the barcode or SKU <span className="font-mono font-semibold">{code}</span>.
          </p>
          <Link href={`/evertrail/products?barcode=${encodeURIComponent(code)}`} className={linkClass}>
            Add it as a new product
          </Link>
        </section>
      ) : null}
    </Shell>
  )
}
