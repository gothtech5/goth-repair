// What happens when Square tells Evertrail about a sale or a return.
//
// - Every request must carry a valid Square signature, or it is rejected.
// - Each sold item is matched to an Evertrail product: by Square ID first, then by barcode.
// - Stock goes down for a sale and back up for an itemized refund (items returned).
// - Each sold or returned line is recorded once in square_sales. Square resends webhooks and
//   sends several events for one sale, so the same line is never counted twice.
// - Stock never goes below 0, and the existing low-stock email check runs after every change.

import { createHmac, timingSafeEqual } from "crypto"
import { sql } from "@/lib/evertrail/db"
import { checkLowStock } from "@/lib/evertrail/low-stock"
import {
  ensureSquareSchema,
  linkVariation,
  square,
  SquareError,
  SQUARE_WEBHOOK_URL,
  type CatalogObject,
  type Order,
  type OrderLineItem,
} from "@/lib/evertrail/square"

// ---------- signature ----------

/**
 * Square signs every webhook: base64( HMAC-SHA256( signature key, notification URL + raw body ) ).
 * The check is done against each address this site can be reached at, with a constant-time compare.
 */
export function isFromSquare(rawBody: string, signature: string | null, urls: string[]): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim()
  if (!key || !signature) return false
  const given = Buffer.from(signature.trim(), "utf8")
  return [...new Set(urls)].some((url) => {
    const expected = Buffer.from(createHmac("sha256", key).update(url + rawBody, "utf8").digest("base64"), "utf8")
    return expected.length === given.length && timingSafeEqual(expected, given)
  })
}

/** The registered address first, then the address this request actually arrived at. */
export function notificationUrls(request: Request): string[] {
  const urls = [SQUARE_WEBHOOK_URL]
  try {
    const url = new URL(request.url)
    const host = request.headers.get("x-forwarded-host") ?? url.host
    const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
    urls.push(`${proto}://${host}${url.pathname}${url.search}`)
  } catch {
    // keep only the registered address
  }
  return urls
}

// ---------- events ----------

type SquareEvent = {
  type?: string
  event_id?: string
  data?: {
    id?: string
    object?: {
      order_created?: { order_id?: string }
      order_updated?: { order_id?: string }
      payment?: { order_id?: string; status?: string }
      refund?: { order_id?: string; status?: string }
    }
  }
}

export type HandleResult = { orderId: string | null; changes: number; note: string }

/** Works out which Square order an event is about, then applies it to Evertrail stock. */
export async function handleSquareEvent(event: SquareEvent): Promise<HandleResult> {
  const type = event.type ?? ""
  const object = event.data?.object ?? {}
  let orderId: string | undefined

  if (type === "order.created") orderId = object.order_created?.order_id ?? event.data?.id
  else if (type === "order.updated") orderId = object.order_updated?.order_id ?? event.data?.id
  else if (type === "payment.created" || type === "payment.updated") {
    if (object.payment?.status === "COMPLETED") orderId = object.payment.order_id
  } else if (type === "refund.created" || type === "refund.updated") {
    if (object.refund?.status === "COMPLETED") orderId = object.refund.order_id
  }

  if (!orderId) return { orderId: null, changes: 0, note: `Nothing to do for ${type || "this event"}.` }
  return processOrder(orderId)
}

/** Reads the order from Square and records every sold and returned line on it, once. */
export async function processOrder(orderId: string): Promise<HandleResult> {
  await ensureSquareSchema()

  let order: Order | undefined
  try {
    order = (await square<{ order?: Order }>(`/orders/${encodeURIComponent(orderId)}`)).order
  } catch (error) {
    // Square's "send test event" uses made-up order IDs. Nothing to do for those.
    if (error instanceof SquareError && error.status === 404) {
      return { orderId, changes: 0, note: "Square has no such order." }
    }
    throw error
  }
  if (!order) return { orderId, changes: 0, note: "Square has no such order." }

  const location = process.env.SQUARE_LOCATION_ID?.trim()
  if (location && order.location_id && order.location_id !== location) {
    return { orderId, changes: 0, note: "Order is for a different Square location." }
  }
  if (order.state === "CANCELED") return { orderId, changes: 0, note: "Order was canceled." }

  const when = order.closed_at || order.created_at || null
  let changes = 0

  // Items sold: counted once the order is paid (completed, or open with nothing left to pay).
  const paid =
    order.state === "COMPLETED" ||
    (order.state === "OPEN" && (order.tenders?.length ?? 0) > 0 && Number(order.net_amount_due_money?.amount ?? 1) === 0)
  if (paid) {
    for (const line of order.line_items ?? []) {
      if (await recordLine("sale", order.id, line, when)) changes++
    }
  }

  // Items returned on an itemized refund (Square makes a separate "return" order for these).
  if (order.state === "COMPLETED") {
    for (const ret of order.returns ?? []) {
      for (const line of ret.return_line_items ?? []) {
        if (await recordLine("return", order.id, line, when)) changes++
      }
    }
  }

  return { orderId, changes, note: changes ? `Recorded ${changes} line(s).` : "Already recorded, or nothing to record." }
}

/** Whole units from Square's decimal quantity ("2" -> 2). Anything below 1 is ignored. */
function units(quantity: string | undefined): number {
  const n = Math.round(Number(quantity ?? "0"))
  return Number.isFinite(n) && n > 0 ? n : 0
}

function lineName(line: OrderLineItem): string {
  const name = (line.name ?? "").trim()
  const variation = (line.variation_name ?? "").trim()
  if (!name) return variation || (line.catalog_object_id ? "Square item" : "Custom amount")
  return variation && variation !== "Regular" ? `${name} (${variation})` : name
}

/**
 * Records one sold or returned line and changes stock, in a single database statement:
 * if the line was recorded before, nothing happens at all.
 * Returns true when this call changed something.
 */
async function recordLine(
  kind: "sale" | "return",
  orderId: string,
  line: OrderLineItem,
  when: string | null
): Promise<boolean> {
  const quantity = units(line.quantity)
  if (!quantity) return false
  const catalogId = line.catalog_object_id?.trim() || null
  const uid = line.uid?.trim() || `${catalogId ?? "custom"}:${lineName(line)}`

  const match = catalogId ? await findProduct(catalogId) : null
  const status = match ? "matched" : catalogId ? "unmatched" : "custom"

  const rows = await sql(
    `with ins as (
       insert into square_sales
              (kind, square_order_id, line_uid, square_catalog_object_id, item_name, quantity, product_id, status, sold_at)
       values ($1, $2, $3, $4, $5, $6::int, $7::int, $8, coalesce($9::timestamptz, now()))
       on conflict (kind, square_order_id, line_uid) do nothing
       returning id, product_id, quantity
     ),
     upd as (
       update products p
          set quantity_on_hand = greatest(0, p.quantity_on_hand + case when $1 = 'return' then ins.quantity else -ins.quantity end)
         from ins
        where p.id = ins.product_id
       returning p.id, p.quantity_on_hand
     )
     select ins.id, ins.product_id, upd.quantity_on_hand from ins left join upd on upd.id = ins.product_id`,
    [kind, orderId, uid, catalogId, lineName(line), quantity, match?.productId ?? null, status, when]
  )
  if (!rows.length) return false // already recorded

  const saleId = rows[0].id
  const productId = rows[0].product_id
  if (productId) {
    await sql(`update square_sales set stock_after = $2::int where id = $1`, [saleId, rows[0].quantity_on_hand])
    // Matched by barcode: remember the Square ID so the next sale matches directly.
    if (match?.linkItemId !== undefined && catalogId) {
      await linkVariation(productId, match.linkItemId, catalogId)
    }
    await checkLowStock(productId)
  }
  return true
}

/** Square ID first, then the barcode saved on the Square variation (its SKU or UPC). */
async function findProduct(
  variationId: string
): Promise<{ productId: string; linkItemId?: string | null } | null> {
  const byId = await sql(`select id from products where square_variation_id = $1 limit 1`, [variationId])
  if (byId.length) return { productId: byId[0].id ?? "" }

  let variation: CatalogObject | undefined
  try {
    const reply = await square<{ objects?: CatalogObject[] }>("/catalog/batch-retrieve", {
      method: "POST",
      body: { object_ids: [variationId], include_deleted_objects: true },
    })
    variation = reply.objects?.find((o) => o.id === variationId)
  } catch (error) {
    if (error instanceof SquareError && error.status === 404) return null
    throw error
  }
  const data = variation?.item_variation_data
  const codes = [data?.sku, data?.upc].map((c) => (c ?? "").trim()).filter(Boolean)
  if (!codes.length) return null

  const byCode = await sql(`select id, square_variation_id from products where barcode = any($1::text[]) limit 1`, [
    "{" + codes.map((c) => '"' + c.replace(/["\\]/g, "\\$&") + '"').join(",") + "}",
  ])
  if (!byCode.length) return null
  const alreadyLinked = Boolean(byCode[0].square_variation_id)
  return {
    productId: byCode[0].id ?? "",
    // Link only a product that is not linked to another Square item yet.
    linkItemId: alreadyLinked ? undefined : (data?.item_id ?? null),
  }
}

// ---------- fixing unmatched lines from the Square sales page ----------

/**
 * Applies an unmatched (or custom amount) line to the product picked on the Square sales page.
 * Changes stock the same way a matched sale would, once, and remembers the Square ID for next time.
 */
export async function applyToProduct(saleId: number, productId: number): Promise<string> {
  await ensureSquareSchema()
  const rows = await sql(
    `with s as (
       update square_sales
          set product_id = $2::int, status = 'fixed'
        where id = $1 and status in ('unmatched', 'custom')
          and exists (select 1 from products where id = $2::int)
       returning id, kind, quantity, product_id, square_catalog_object_id
     ),
     upd as (
       update products p
          set quantity_on_hand = greatest(0, p.quantity_on_hand + case when s.kind = 'return' then s.quantity else -s.quantity end)
         from s
        where p.id = s.product_id
       returning p.id, p.name, p.quantity_on_hand, p.square_variation_id
     )
     select s.id, s.kind, s.quantity, s.square_catalog_object_id, upd.id as product_id, upd.name,
            upd.quantity_on_hand, upd.square_variation_id
       from s join upd on upd.id = s.product_id`,
    [saleId, productId]
  )
  if (!rows.length) return ""
  const r = rows[0]
  await sql(`update square_sales set stock_after = $2::int where id = $1`, [r.id, r.quantity_on_hand])
  if (r.square_catalog_object_id && !r.square_variation_id) {
    await linkVariation(productId, null, r.square_catalog_object_id)
  }
  await checkLowStock(productId)
  const change = r.kind === "return" ? `Added ${r.quantity} back to` : `Took ${r.quantity} off`
  return `${change} "${r.name}". Stock is now ${r.quantity_on_hand}.`
}

/** Marks a line as "not an Evertrail product" so it leaves the to-fix list. Stock is not changed. */
export async function ignoreLine(saleId: number): Promise<boolean> {
  await ensureSquareSchema()
  const rows = await sql(
    `update square_sales set status = 'ignored' where id = $1 and status in ('unmatched', 'custom') returning id`,
    [saleId]
  )
  return rows.length > 0
}
