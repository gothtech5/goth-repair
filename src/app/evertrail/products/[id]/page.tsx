import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, text, toCents, toInt, toIntOrNull, type Search } from "@/lib/evertrail/format"
import { checkLowStock, lowStockNote } from "@/lib/evertrail/low-stock"
import { loadCategories, pickedCategory, type Category } from "@/lib/evertrail/categories"
import { addStock, stockToAdd } from "@/lib/evertrail/stock"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"
import { CategorySelect } from "@/components/evertrail/category-select"

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
                low_stock_threshold = $8, category_id = $9::int
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
          pickedCategory(formData.get("category_id")),
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

async function addStockHere(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const quantity = stockToAdd(formData.get("quantity"))
  let target = `/evertrail/products/${id}`
  if (!quantity) {
    target += "?err=" + encodeURIComponent("Enter how many to add (a whole number, 1 or more).")
  } else {
    try {
      const message = await addStock(id, quantity)
      target += message
        ? "?ok=" + encodeURIComponent(message)
        : "?err=" + encodeURIComponent("That product no longer exists.")
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
  let categories: Category[] = []
  try {
    const rows = await sql(`select * from products where id = $1`, [toInt(id, -1)])
    product = rows[0]
    categories = await loadCategories()
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
    <Shell title={`Edit: ${product.name}`} error={error} notice={one(query.ok)}>
      <section className="mb-8 max-w-2xl rounded-lg border border-green-300 bg-green-50 p-4">
        <h2 className="text-lg font-semibold">Add stock</h2>
        <p className="mt-1 text-sm">
          In stock now: <span className="text-2xl font-bold">{product.quantity_on_hand}</span>
        </p>
        <form action={addStockHere} className="mt-3 flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={product.id ?? ""} />
          <div className="w-40">
            <Field label="How many to add">
              <input
                name="quantity"
                type="number"
                inputMode="numeric"
                min="1"
                required
                placeholder="5"
                className={inputClass}
              />
            </Field>
          </div>
          <button type="submit" className={buttonClass}>
            Add stock
          </button>
        </form>
      </section>

      <form action={saveProduct} className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={product.id ?? ""} />
        <div className="sm:col-span-2">
          <Field label="Name">
            <input name="name" required defaultValue={product.name ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Barcode">
          <input name="barcode" defaultValue={product.barcode ?? ""} className={inputClass} />
        </Field>
        <Field label="SKU">
          <input name="sku" required defaultValue={product.sku ?? ""} className={inputClass} />
        </Field>
        <Field label="Cost ($)">
          <input name="cost" inputMode="decimal" defaultValue={dollars(product.cost_cents)} className={inputClass} />
        </Field>
        <Field label="Price ($)">
          <input name="price" inputMode="decimal" defaultValue={dollars(product.price_cents)} className={inputClass} />
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
        <Field label="Category">
          <CategorySelect name="category_id" categories={categories} selected={product.category_id} />
        </Field>
        <Field label="Quantity in stock (change only to correct a count)">
          <input
            name="quantity"
            type="number"
            min="0"
            defaultValue={product.quantity_on_hand ?? "0"}
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
