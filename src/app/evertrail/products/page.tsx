import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, text, toCents, toInt, type Search } from "@/lib/evertrail/format"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

async function addProduct(formData: FormData) {
  "use server"
  await requireAuth()

  const name = text(formData.get("name"))
  const sku = text(formData.get("sku"))
  const barcode = text(formData.get("barcode"))
  let target = ""

  if (!name) {
    target = "/evertrail/products?err=" + encodeURIComponent("Product name is required.")
  } else {
    try {
      // A blank SKU or barcode gets filled in automatically from the product number.
      const rows = await sql(
        `insert into products (sku, barcode, name, price_cents, cost_cents, quantity_on_hand)
         values (coalesce($1, 'TMP-' || md5(random()::text || clock_timestamp()::text)), $2, $3, $4, $5, $6)
         returning id`,
        [
          sku || null,
          barcode || null,
          name,
          toCents(formData.get("price")),
          toCents(formData.get("cost")),
          Math.max(0, toInt(formData.get("quantity"))),
        ]
      )
      const id = rows[0].id
      await sql(
        `update products
            set sku = case when sku like 'TMP-%' then 'GT-' || lpad(id::text, 6, '0') else sku end,
                barcode = coalesce(barcode, 'ET' || lpad(id::text, 6, '0'))
          where id = $1`,
        [id]
      )
      target = "/evertrail/products?ok=" + encodeURIComponent(`Added "${name}".`)
    } catch (e) {
      target = "/evertrail/products?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function ProductsPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const q = one(params.q).trim()
  const prefillBarcode = one(params.barcode)

  let error = one(params.err)
  let products: Awaited<ReturnType<typeof sql>> = []
  try {
    products = q
      ? await sql(
          `select * from products
            where name ilike $1 or sku ilike $1 or barcode ilike $1
            order by name limit 500`,
          ["%" + q + "%"]
        )
      : await sql(`select * from products order by name limit 500`)
  } catch (e) {
    error = "Could not load products: " + friendlyError(e)
  }

  return (
    <Shell title="Products" error={error} notice={one(params.ok)}>
      <section className="mb-8 rounded-lg border border-neutral-300 p-4">
        <h2 className="mb-3 text-lg font-semibold">Add a product</h2>
        <form action={addProduct} className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Field label="Name (required)">
              <input name="name" required className={inputClass} placeholder="iPhone 15 screen protector" />
            </Field>
          </div>
          <Field label="Barcode (scan it here, or leave blank)">
            <input name="barcode" defaultValue={prefillBarcode} className={inputClass} />
          </Field>
          <Field label="SKU (leave blank to auto-create)">
            <input name="sku" className={inputClass} />
          </Field>
          <Field label="Quantity in stock">
            <input name="quantity" type="number" min="0" defaultValue="0" className={inputClass} />
          </Field>
          <Field label="Price ($)">
            <input name="price" inputMode="decimal" placeholder="0.00" className={inputClass} />
          </Field>
          <Field label="Cost ($)">
            <input name="cost" inputMode="decimal" placeholder="0.00" className={inputClass} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={buttonClass}>
              Add product
            </button>
          </div>
        </form>
      </section>

      <form method="get" className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, SKU or barcode" className={inputClass} />
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-400 text-left">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">SKU</th>
              <th className="py-2 pr-3">Barcode</th>
              <th className="py-2 pr-3 text-right">Price</th>
              <th className="py-2 pr-3 text-right">Cost</th>
              <th className="py-2 pr-3 text-right">In stock</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-200">
                <td className="py-2 pr-3">{p.name}</td>
                <td className="py-2 pr-3 font-mono">{p.sku}</td>
                <td className="py-2 pr-3 font-mono">{p.barcode}</td>
                <td className="py-2 pr-3 text-right">${dollars(p.price_cents)}</td>
                <td className="py-2 pr-3 text-right">${dollars(p.cost_cents)}</td>
                <td className="py-2 pr-3 text-right">{p.quantity_on_hand}</td>
                <td className="py-2 whitespace-nowrap">
                  <Link href={`/evertrail/products/${p.id}`} className={linkClass}>
                    Edit
                  </Link>{" "}
                  <Link href={`/evertrail/labels?ids=${p.id}`} className={linkClass}>
                    Label
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="py-6 text-sm text-neutral-600">
            {q ? "No products match that search." : "No products yet. Add your first one above."}
          </p>
        ) : null}
      </div>
    </Shell>
  )
}
