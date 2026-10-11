import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError, type Row } from "@/lib/evertrail/db"
import { one, toInt, type Search } from "@/lib/evertrail/format"
import { ensureSquareSchema, squareSettings, SQUARE_WEBHOOK_URL } from "@/lib/evertrail/square"
import { applyToProduct, ignoreLine } from "@/lib/evertrail/square-sales"
import { Shell, buttonClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

async function matchToProduct(formData: FormData) {
  "use server"
  await requireAuth()
  const saleId = toInt(formData.get("sale_id"))
  const productId = toInt(formData.get("product_id"))
  let target = "/evertrail/square"
  if (!productId) {
    target += "?err=" + encodeURIComponent("Pick the Evertrail product first.")
  } else {
    try {
      const message = await applyToProduct(saleId, productId)
      target += message
        ? "?ok=" + encodeURIComponent(message)
        : "?err=" + encodeURIComponent("That line was already fixed, or the product no longer exists.")
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function ignore(formData: FormData) {
  "use server"
  await requireAuth()
  const saleId = toInt(formData.get("sale_id"))
  let target = "/evertrail/square"
  try {
    target += (await ignoreLine(saleId))
      ? "?ok=" + encodeURIComponent("Marked as not an Evertrail product. Stock was not changed.")
      : "?err=" + encodeURIComponent("That line was already fixed.")
  } catch (e) {
    target += "?err=" + encodeURIComponent(friendlyError(e))
  }
  redirect(target)
}

const STATUS_TEXT: Record<string, string> = {
  matched: "",
  fixed: "Matched by hand",
  unmatched: "Not matched",
  custom: "Custom amount",
  ignored: "Not an Evertrail product",
}

export default async function SquareSalesPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  const settings = squareSettings()

  let error = one(params.err)
  let unmatched: Row[] = []
  let custom: Row[] = []
  let sales: Row[] = []
  let products: Row[] = []
  try {
    await ensureSquareSchema()
    const listColumns = `s.id, s.kind, s.item_name, s.quantity, s.status, s.stock_after, s.product_id,
        p.name as product_name,
        to_char(s.sold_at at time zone 'America/Chicago', 'Mon DD, YYYY HH12:MI AM') as sold`
    unmatched = await sql(
      `select ${listColumns} from square_sales s left join products p on p.id = s.product_id
        where s.status = 'unmatched' order by s.sold_at desc, s.id desc limit 200`
    )
    custom = await sql(
      `select ${listColumns} from square_sales s left join products p on p.id = s.product_id
        where s.status = 'custom' order by s.sold_at desc, s.id desc limit 50`
    )
    sales = await sql(
      `select ${listColumns} from square_sales s left join products p on p.id = s.product_id
        order by s.sold_at desc, s.id desc limit 300`
    )
    if (unmatched.length || custom.length) {
      products = await sql(`select id, name, barcode from products order by name limit 1000`)
    }
  } catch (e) {
    error = "Could not load Square sales: " + friendlyError(e)
  }

  const missing = [
    !settings.accessToken && "SQUARE_ACCESS_TOKEN",
    !settings.signatureKey && "SQUARE_WEBHOOK_SIGNATURE_KEY",
    !settings.locationId && "SQUARE_LOCATION_ID",
  ].filter(Boolean)

  return (
    <Shell title="Square sales" error={error} notice={one(params.ok)}>
      <section className="mb-8 rounded-lg border border-neutral-300 p-4 text-sm">
        <p>
          When something sells in Square, its stock goes down here automatically. An itemized refund puts the items
          back in stock. Stock never goes below 0.
        </p>
        {missing.length ? (
          <p className="mt-2 font-semibold text-red-800">Not connected yet. Missing in Vercel: {missing.join(", ")}.</p>
        ) : (
          <p className="mt-2 font-semibold text-green-800">Connected: all three Square settings are in Vercel.</p>
        )}
        <p className="mt-2">
          Square webhook address: <span className="font-mono break-all">{SQUARE_WEBHOOK_URL}</span>
        </p>
        <p className="mt-2">
          To get products into Square, use{" "}
          <Link href="/evertrail/products" className={linkClass}>
            Send products to Square
          </Link>{" "}
          on the Products page. To delete Square items that are no longer in Evertrail, use{" "}
          <Link href="/evertrail/square/cleanup" className={linkClass}>
            Square cleanup
          </Link>
          .
        </p>
      </section>

      {unmatched.length ? (
        <section className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
          <h2 className="text-lg font-semibold">Sold in Square, but not matched to a product ({unmatched.length})</h2>
          <p className="mt-1 mb-3 text-sm">
            Stock has not changed for these. Pick the Evertrail product to take the stock off now; future sales of that
            Square item will then match by themselves. Or mark it as not an Evertrail product.
          </p>
          <FixList rows={unmatched} products={products} />
        </section>
      ) : null}

      <h2 className="mb-2 text-lg font-semibold">All Square sales and returns</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-400 text-left">
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Sold in Square as</th>
              <th className="py-2 pr-3">Evertrail product</th>
              <th className="py-2 pr-3 text-right">Quantity</th>
              <th className="py-2 pr-3 text-right">Stock after</th>
              <th className="py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-b border-neutral-200 align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{s.sold}</td>
                <td className="py-2 pr-3">{s.item_name}</td>
                <td className="py-2 pr-3">
                  {s.product_id ? (
                    <Link href={`/evertrail/products/${s.product_id}`} className={linkClass}>
                      {s.product_name ?? "(deleted product)"}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2 pr-3 text-right font-semibold">
                  {s.kind === "return" ? `+${s.quantity}` : `-${s.quantity}`}
                </td>
                <td className="py-2 pr-3 text-right">{s.stock_after ?? "-"}</td>
                <td className="py-2">
                  {s.kind === "return" ? "Returned. " : ""}
                  {STATUS_TEXT[s.status ?? ""] ?? s.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 ? (
          <p className="py-6 text-sm text-neutral-600">No Square sales yet.</p>
        ) : null}
      </div>

      {custom.length ? (
        <details className="mt-8 rounded-lg border border-neutral-300 p-4">
          <summary className="cursor-pointer text-sm font-semibold">
            Custom amounts typed into Square ({custom.length}) - match one to a product if it was a product sale
          </summary>
          <div className="mt-3">
            <FixList rows={custom} products={products} />
          </div>
        </details>
      ) : null}
    </Shell>
  )
}

function FixList({ rows, products }: { rows: Row[]; products: Row[] }) {
  return (
    <ul className="space-y-3">
      {rows.map((s) => (
        <li key={s.id} className="rounded-md border border-neutral-300 bg-white p-3 text-sm">
          <p>
            <span className="font-semibold">{s.item_name}</span> - {s.kind === "return" ? "returned" : "sold"}{" "}
            {s.quantity} - {s.sold}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <form action={matchToProduct} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="sale_id" value={s.id ?? ""} />
              <select
                name="product_id"
                required
                defaultValue=""
                className="max-w-xs rounded-md border border-neutral-400 bg-white px-2 py-2 text-sm text-black"
              >
                <option value="" disabled>
                  Pick the Evertrail product
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id ?? ""}>
                    {p.name} {p.barcode ? `(${p.barcode})` : ""}
                  </option>
                ))}
              </select>
              <button type="submit" className={buttonClass}>
                {s.kind === "return" ? "Add back to this product" : "Take off this product"}
              </button>
            </form>
            <form action={ignore}>
              <input type="hidden" name="sale_id" value={s.id ?? ""} />
              <button type="submit" className={smallButtonClass}>
                Not an Evertrail product
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  )
}
