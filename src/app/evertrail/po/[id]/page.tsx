import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { one, text, toInt, type Search } from "@/lib/evertrail/format"
import { checkLowStock } from "@/lib/evertrail/low-stock"
import { ScanInput } from "@/components/evertrail/scan-input"
import { Shell, Field, inputClass, buttonClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

function back(poId: number, kind: "ok" | "err", message: string) {
  return `/evertrail/po/${poId}?${kind}=${encodeURIComponent(message)}`
}

/** Marks the PO "received" once every line is fully received, otherwise "open". */
async function refreshStatus(poId: number) {
  await sql(
    `update purchase_orders po
        set status = case
          when exists (select 1 from purchase_order_items i where i.po_id = po.id)
           and not exists (select 1 from purchase_order_items i where i.po_id = po.id and i.qty_received < i.qty_ordered)
          then 'received' else 'open' end
      where po.id = $1`,
    [poId]
  )
}

/**
 * Adds stock for one product on this PO.
 * One statement updates the PO line and the product together, so they can never disagree.
 * Returns how many units were actually received (0 if the line is already full or missing).
 */
async function receiveUnits(poId: number, productId: number, wanted: number | null) {
  const rows = await sql(
    `with line as (
       select id, least(qty_ordered - qty_received, coalesce($3::int, qty_ordered - qty_received)) as take
         from purchase_order_items
        where po_id = $1 and product_id = $2 and qty_received < qty_ordered
        order by id
        limit 1
     ), upd as (
       update purchase_order_items i
          set qty_received = i.qty_received + line.take
         from line
        where i.id = line.id and line.take > 0
       returning i.product_id, line.take
     )
     update products p
        set quantity_on_hand = p.quantity_on_hand + upd.take
       from upd
      where p.id = upd.product_id
     returning upd.take`,
    [poId, productId, wanted]
  )
  // Stock went up: this clears the "already emailed" mark once stock is back above the reminder level.
  if (rows.length) await checkLowStock(productId)
  return rows.length ? Number(rows[0].take) : 0
}

async function addItem(formData: FormData) {
  "use server"
  await requireAuth()

  const poId = toInt(formData.get("po_id"))
  const code = text(formData.get("code"))
  const qty = toInt(formData.get("qty"), 1)
  let target = ""
  if (!code || qty < 1) {
    target = back(poId, "err", "Enter a barcode or SKU and a quantity of at least 1.")
  } else {
    try {
      const found = await sql(
        `select id, name from products where barcode = $1 or sku = $1 order by (barcode = $1) desc nulls last limit 1`,
        [code]
      )
      if (!found.length) {
        target = back(poId, "err", `No product has the barcode or SKU "${code}". Add it under Products first.`)
      } else {
        const productId = Number(found[0].id)
        // If the product is already on this PO, raise that line instead of adding a second one.
        const raised = await sql(
          `update purchase_order_items set qty_ordered = qty_ordered + $3
            where id = (select id from purchase_order_items where po_id = $1 and product_id = $2 order by id limit 1)
           returning id`,
          [poId, productId, qty]
        )
        if (!raised.length) {
          await sql(`insert into purchase_order_items (po_id, product_id, qty_ordered) values ($1, $2, $3)`, [
            poId,
            productId,
            qty,
          ])
        }
        await refreshStatus(poId)
        target = back(poId, "ok", `Added ${qty} x ${found[0].name}.`)
      }
    } catch (e) {
      target = back(poId, "err", friendlyError(e))
    }
  }
  redirect(target)
}

async function receiveScan(formData: FormData) {
  "use server"
  await requireAuth()

  const poId = toInt(formData.get("po_id"))
  const code = text(formData.get("code"))
  let target = ""
  if (!code) {
    target = `/evertrail/po/${poId}`
  } else {
    try {
      const found = await sql(
        `select p.id, p.name
           from products p
           join purchase_order_items i on i.product_id = p.id and i.po_id = $2
          where p.barcode = $1 or p.sku = $1
          limit 1`,
        [code, poId]
      )
      if (!found.length) {
        target = back(poId, "err", `"${code}" is not on this purchase order. Nothing was received.`)
      } else {
        const took = await receiveUnits(poId, Number(found[0].id), 1)
        await refreshStatus(poId)
        target =
          took > 0
            ? back(poId, "ok", `Received 1 x ${found[0].name}.`)
            : back(poId, "err", `${found[0].name} is already fully received. Nothing was added.`)
      }
    } catch (e) {
      target = back(poId, "err", friendlyError(e))
    }
  }
  redirect(target)
}

async function receiveRest(formData: FormData) {
  "use server"
  await requireAuth()

  const poId = toInt(formData.get("po_id"))
  const productId = toInt(formData.get("product_id"))
  let target = ""
  try {
    const took = await receiveUnits(poId, productId, null)
    await refreshStatus(poId)
    target = back(poId, "ok", `Received ${took} more.`)
  } catch (e) {
    target = back(poId, "err", friendlyError(e))
  }
  redirect(target)
}

async function removeLine(formData: FormData) {
  "use server"
  await requireAuth()

  const poId = toInt(formData.get("po_id"))
  const lineId = toInt(formData.get("line_id"))
  let target = ""
  try {
    // Only lines with nothing received yet can be removed.
    const gone = await sql(
      `delete from purchase_order_items where id = $1 and po_id = $2 and qty_received = 0 returning id`,
      [lineId, poId]
    )
    await refreshStatus(poId)
    target = gone.length
      ? back(poId, "ok", "Line removed.")
      : back(poId, "err", "That line already has items received, so it was not removed.")
  } catch (e) {
    target = back(poId, "err", friendlyError(e))
  }
  redirect(target)
}

export default async function PurchaseOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Search
}) {
  await requireAuth()
  const { id } = await params
  const query = await searchParams
  const poId = toInt(id, -1)

  let error = one(query.err)
  let po: Awaited<ReturnType<typeof sql>>[number] | undefined
  let lines: Awaited<ReturnType<typeof sql>> = []
  try {
    const rows = await sql(
      `select id, vendor, status, to_char(created_at, 'Mon DD, YYYY') as created from purchase_orders where id = $1`,
      [poId]
    )
    po = rows[0]
    if (po) {
      lines = await sql(
        `select i.id, i.product_id, i.qty_ordered, i.qty_received, p.name, p.sku, p.barcode
           from purchase_order_items i
           join products p on p.id = i.product_id
          where i.po_id = $1
          order by i.id`,
        [poId]
      )
    }
  } catch (e) {
    error = "Could not load the purchase order: " + friendlyError(e)
  }

  if (!po) {
    return (
      <Shell title="Purchase order not found" error={error}>
        <Link href="/evertrail/po" className={linkClass}>
          Back to purchase orders
        </Link>
      </Shell>
    )
  }

  const hasLines = lines.length > 0
  const allReceived = po.status === "received"

  return (
    <Shell title={`PO #${po.id} - ${po.vendor}`} error={error} notice={one(query.ok)}>
      <p className="mb-6 text-sm text-neutral-700">
        Created {po.created} · Status: <span className="font-semibold">{po.status}</span> ·{" "}
        <Link href="/evertrail/po" className={linkClass}>
          All purchase orders
        </Link>
      </p>

      {hasLines && !allReceived ? (
        <section className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4">
          <h2 className="mb-2 text-lg font-semibold">Receive a shipment</h2>
          <form action={receiveScan} className="flex gap-2">
            <input type="hidden" name="po_id" value={po.id ?? ""} />
            <ScanInput
              name="code"
              stamp={Date.now()}
              placeholder="Scan each item as you unpack it (1 scan = 1 item)"
              className={inputClass}
            />
            <button type="submit" className={buttonClass}>
              Receive 1
            </button>
          </form>
        </section>
      ) : null}

      <section className="mb-6 rounded-lg border border-neutral-300 p-4">
        <h2 className="mb-2 text-lg font-semibold">Add a product to this order</h2>
        <form action={addItem} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="po_id" value={po.id ?? ""} />
          <div className="min-w-64 flex-1">
            <Field label="Barcode or SKU">
              <input name="code" autoFocus={!hasLines} autoComplete="off" className={inputClass} />
            </Field>
          </div>
          <div className="w-28">
            <Field label="Quantity">
              <input name="qty" type="number" min="1" defaultValue="1" className={inputClass} />
            </Field>
          </div>
          <button type="submit" className={buttonClass}>
            Add to order
          </button>
        </form>
      </section>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-400 text-left">
            <th className="py-2 pr-3">Product</th>
            <th className="py-2 pr-3">SKU</th>
            <th className="py-2 pr-3">Barcode</th>
            <th className="py-2 pr-3 text-right">Ordered</th>
            <th className="py-2 pr-3 text-right">Received</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => {
            const ordered = Number(line.qty_ordered)
            const received = Number(line.qty_received)
            return (
              <tr key={line.id} className="border-b border-neutral-200">
                <td className="py-2 pr-3">{line.name}</td>
                <td className="py-2 pr-3 font-mono">{line.sku}</td>
                <td className="py-2 pr-3 font-mono">{line.barcode}</td>
                <td className="py-2 pr-3 text-right">{ordered}</td>
                <td className="py-2 pr-3 text-right">
                  {received}
                  {received >= ordered ? " (done)" : ""}
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {received < ordered ? (
                      <form action={receiveRest}>
                        <input type="hidden" name="po_id" value={po.id ?? ""} />
                        <input type="hidden" name="product_id" value={line.product_id ?? ""} />
                        <button type="submit" className={smallButtonClass}>
                          Receive remaining {ordered - received}
                        </button>
                      </form>
                    ) : null}
                    {received === 0 ? (
                      <form action={removeLine}>
                        <input type="hidden" name="po_id" value={po.id ?? ""} />
                        <input type="hidden" name="line_id" value={line.id ?? ""} />
                        <button type="submit" className={smallButtonClass}>
                          Remove
                        </button>
                      </form>
                    ) : null}
                    <Link href={`/evertrail/labels?ids=${line.product_id}`} className={linkClass}>
                      Label
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!hasLines ? (
        <p className="py-6 text-sm text-neutral-600">Nothing on this order yet. Add products above.</p>
      ) : null}
    </Shell>
  )
}
