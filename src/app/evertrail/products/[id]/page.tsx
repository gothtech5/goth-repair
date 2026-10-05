import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, text, toCents, toInt, toIntOrNull, type Search } from "@/lib/evertrail/format"
import { checkLowStock, lowStockNote } from "@/lib/evertrail/low-stock"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

async function saveProduct(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const name = text(formData.get("name"))
  const sku = text(formData.get("sku"))
  const barcode = text(formData.get("barcode"))
  let target = `/evertrail/products/${id}`

  if (!name || !sku) {
    target += "?err=" + encodeURIComponent("Name and SKU are required.")
  } else {
    try {
      await sql(
        `update products
            set name = $2, sku = $3, barcode = $4, price_cents = $5, cost_cents = $6, quantity_on_hand = $7,
                low_stock_threshold = $8
          where id = $1`,
        [
          id,
          name,
          sku,
          barcode || null,
          toCents(formData.get("price")),
          toCents(formData.get("cost")),
          Math.max(0, toInt(formData.get("quantity"))),
          toIntOrNull(formData.get("low_stock_threshold")),
        ]
      )
      const alert = await checkLowStock(id)
      target = "/evertrail/products?ok=" + encodeURIComponent(`Saved "${name}".` + lowStockNote(alert))
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Search
}) {
  await requireAuth()
  const { id } = await params
  const query = await searchParams

  let error = one(query.err)
  let product: Awaited<ReturnType<typeof sql>>[number] | undefined
  try {
    const rows = await sql(`select * from products where id = $1`, [toInt(id, -1)])
    product = rows[0]
  } catch (e) {
    error = "Could not load the product: " + friendlyError(e)
  }

  if (!product) {
    return (
      <Shell title="Product not found" error={error}>
        <Link href="/evertrail/products" className={linkClass}>
          Back to products
        </Link>
      </Shell>
    )
  }

  return (
    <Shell title={`Edit: ${product.name}`} error={error}>
      <form action={saveProduct} className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={product.id ?? ""} />
        <div className="sm:col-span-2">
          <Field label="Name">
            <input name="name" required defaultValue={product.name ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="SKU">
          <input name="sku" required defaultValue={product.sku ?? ""} className={inputClass} />
        </Field>
        <Field label="Barcode">
          <input name="barcode" defaultValue={product.barcode ?? ""} className={inputClass} />
        </Field>
        <Field label="Price ($)">
          <input name="price" inputMode="decimal" defaultValue={dollars(product.price_cents)} className={inputClass} />
        </Field>
        <Field label="Cost ($)">
          <input name="cost" inputMode="decimal" defaultValue={dollars(product.cost_cents)} className={inputClass} />
        </Field>
        <Field label="Quantity in stock">
          <input
            name="quantity"
            type="number"
            min="0"
            defaultValue={product.quantity_on_hand ?? "0"}
            className={inputClass}
          />
        </Field>
        <Field label="Remind me when stock is at or below (optional)">
          <input
            name="low_stock_threshold"
            type="number"
            min="0"
            placeholder="No reminder"
            defaultValue={product.low_stock_threshold ?? ""}
            className={inputClass}
          />
        </Field>
        <div className="flex items-end gap-4 sm:col-span-2">
          <button type="submit" className={buttonClass}>
            Save
          </button>
          <Link href="/evertrail/products" className={linkClass}>
            Cancel
          </Link>
          <Link href={`/evertrail/labels?ids=${product.id}`} className={linkClass}>
            Print label
          </Link>
        </div>
      </form>
    </Shell>
  )
}
