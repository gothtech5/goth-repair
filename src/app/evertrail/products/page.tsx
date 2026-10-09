import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { dollars, one, text, toCents, toInt, toIntOrNull, type Search } from "@/lib/evertrail/format"
import { checkLowStock, lowStockNote } from "@/lib/evertrail/low-stock"
import { loadCategories, pickedCategory, type Category } from "@/lib/evertrail/categories"
import { addStock, stockToAdd } from "@/lib/evertrail/stock"
import { sendProductsToSquare, syncSummary } from "@/lib/evertrail/square-sync"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"
import { CategorySelect } from "@/components/evertrail/category-select"

export const dynamic = "force-dynamic"
// "Send products to Square" can take a while with many products.
export const maxDuration = 120

async function addProduct(formData: FormData) {
  "use server"
  await requireAuth()

  const name = text(formData.get("name"))
  const sku = text(formData.get("sku"))
  const barcode = text(formData.get("barcode"))
  const quantity = Math.max(0, toInt(formData.get("quantity")))
  let target = ""

  if (!name) {
    target = "/evertrail/products?err=" + encodeURIComponent("Product name is required.")
  } else {
    try {
      // No duplicates: if this barcode is already on a product, do not create a second one.
      // Offer to add stock to the existing product instead.
      const existing = barcode ? await sql(`select id from products where barcode = $1 limit 1`, [barcode]) : []
      if (existing.length) {
        target = `/evertrail/products?dup=${existing[0].id}&qty=${quantity}`
      } else {
        // A blank SKU or barcode gets filled in automatically from the product number.
        const rows = await sql(
          `insert into products (sku, barcode, name, price_cents, cost_cents, quantity_on_hand, low_stock_threshold, category_id)
           values (coalesce($1, 'TMP-' || md5(random()::text || clock_timestamp()::text)), $2, $3, $4, $5, $6, $7, $8::int)
           returning id`,
          [
            sku || null,
            barcode || null,
            name,
            toCents(formData.get("price")),
            toCents(formData.get("cost")),
            quantity,
            toIntOrNull(formData.get("low_stock_threshold")),
            pickedCategory(formData.get("category_id")),
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
        const alert = await checkLowStock(id ?? "")
        target = "/evertrail/products?ok=" + encodeURIComponent(`Added "${name}".` + lowStockNote(alert))
      }
    } catch (e) {
      target = "/evertrail/products?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function addStockToExisting(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const quantity = stockToAdd(formData.get("quantity"))
  let target = ""
  if (!quantity) {
    target = `/evertrail/products?dup=${id}&err=` + encodeURIComponent("Enter how many to add (a whole number, 1 or more).")
  } else {
    try {
      const message = await addStock(id, quantity)
      target = message
        ? "/evertrail/products?ok=" + encodeURIComponent(message)
        : "/evertrail/products?err=" + encodeURIComponent("That product no longer exists.")
    } catch (e) {
      target = `/evertrail/products?dup=${id}&err=` + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function sendToSquare() {
  "use server"
  await requireAuth()

  let target = ""
  try {
    const result = await sendProductsToSquare()
    const message = syncSummary(result)
    target = "/evertrail/products?" + (result.failed ? "err=" : "ok=") + encodeURIComponent(message)
  } catch (e) {
    target = "/evertrail/products?err=" + encodeURIComponent("Could not send products to Square. " + friendlyError(e))
  }
  redirect(target)
}

export default async function ProductsPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const q = one(params.q).trim()
  const prefillBarcode = one(params.barcode)
  const dupId = one(params.dup)
  const dupQty = Math.max(1, toInt(one(params.qty), 1))

  let error = one(params.err)
  let products: Awaited<ReturnType<typeof sql>> = []
  let categories: Category[] = []
  let duplicate: Awaited<ReturnType<typeof sql>>[number] | undefined
  try {
    categories = await loadCategories()
    products = q
      ? await sql(
          `select * from products
            where name ilike $1 or sku ilike $1 or barcode ilike $1
            order by name limit 500`,
          ["%" + q + "%"]
        )
      : await sql(`select * from products order by name limit 500`)
    if (/^\d+$/.test(dupId)) {
      const rows = await sql(`select * from products where id = $1`, [dupId])
      duplicate = rows[0]
    }
  } catch (e) {
    error = "Could not load products: " + friendlyError(e)
  }
  const categoryPath = new Map(categories.map((c) => [c.id, c.path]))

  return (
    <Shell title="Products" error={error} notice={one(params.ok)}>
      {duplicate ? (
        <section className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
          <h2 className="text-lg font-semibold">This product already exists. Add stock to it?</h2>
          <p className="mt-1 text-sm">
            <span className="font-semibold">{duplicate.name}</span> already has the barcode{" "}
            <span className="font-mono">{duplicate.barcode}</span>, so a second product was not created. In stock now:{" "}
            <span className="font-semibold">{duplicate.quantity_on_hand}</span>.
          </p>
          <form action={addStockToExisting} className="mt-3 flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={duplicate.id ?? ""} />
            <div className="w-40">
              <Field label="How many to add">
                <input
                  name="quantity"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  defaultValue={dupQty}
                  required
                  className={inputClass}
                />
              </Field>
            </div>
            <button type="submit" className={buttonClass}>
              Add stock
            </button>
            <Link href="/evertrail/products" className={linkClass}>
              No, cancel
            </Link>
            <Link href={`/evertrail/products/${duplicate.id}`} className={linkClass}>
              Open this product
            </Link>
          </form>
        </section>
      ) : null}

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
          <Field label="Remind me when stock is at or below (optional)">
            <input name="low_stock_threshold" type="number" min="0" placeholder="No reminder" className={inputClass} />
          </Field>
          <Field label="Category (optional)">
            <CategorySelect name="category_id" categories={categories} />
          </Field>
          <div className="flex items-end sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add product
            </button>
          </div>
        </form>
      </section>

      <section className="mb-8 rounded-lg border border-neutral-300 p-4">
        <h2 className="text-lg font-semibold">Square</h2>
        <p className="mt-1 mb-3 text-sm text-neutral-700">
          Copies every product into Square&apos;s item list with the same name, price and barcode. Products already in
          Square are updated, not copied twice. Stock stays in Evertrail.{" "}
          <Link href="/evertrail/square" className={linkClass}>
            See Square sales
          </Link>
        </p>
        <form action={sendToSquare}>
          <button type="submit" className={buttonClass}>
            Send products to Square
          </button>
        </form>
      </section>

      <form method="get" className="mb-2 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, SKU or barcode" className={inputClass} />
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>
      <p className="mb-4 text-sm text-neutral-700">
        Tap a product name to edit it or add stock.{" "}
        <Link href="/evertrail/categories" className={linkClass}>
          Manage categories
        </Link>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-400 text-left">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">SKU</th>
              <th className="py-2 pr-3">Barcode</th>
              <th className="py-2 pr-3 text-right">Price</th>
              <th className="py-2 pr-3 text-right">Cost</th>
              <th className="py-2 pr-3 text-right">In stock</th>
              <th className="py-2 pr-3 text-right">Remind at</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-200">
                <td className="pr-3">
                  <Link
                    href={`/evertrail/products/${p.id}`}
                    className="block py-3 font-medium text-blue-700 underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="py-2 pr-3">{(p.category_id && categoryPath.get(p.category_id)) || "-"}</td>
                <td className="py-2 pr-3 font-mono">{p.sku}</td>
                <td className="py-2 pr-3 font-mono">{p.barcode}</td>
                <td className="py-2 pr-3 text-right">${dollars(p.price_cents)}</td>
                <td className="py-2 pr-3 text-right">${dollars(p.cost_cents)}</td>
                <td className="py-2 pr-3 text-right">{p.quantity_on_hand}</td>
                <td className="py-2 pr-3 text-right">{p.low_stock_threshold ?? "-"}</td>
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
