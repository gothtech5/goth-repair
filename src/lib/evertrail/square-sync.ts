// "Send products to Square": copies every Evertrail product into Square's item list.
//
// - Same name, same price, and the barcode as the SKU (and as the UPC when it is a 12-14 digit code).
// - Running it again never creates duplicates: a product is matched to its Square item by the
//   Square ID saved last time, otherwise by its barcode, before anything new is created.
// - Only those fields are changed on items that already exist in Square. Anything else set up in
//   Square (category, tax, photo, other variations) is kept.
// - Evertrail stays in charge of stock: no stock counts are sent to Square.

import { randomUUID } from "crypto"
import { sql } from "@/lib/evertrail/db"
import {
  ensureSquareSchema,
  square,
  squareMessage,
  SQUARE_VERSION,
  type CatalogObject,
} from "@/lib/evertrail/square"

export type SyncResult = {
  total: number
  created: number
  updated: number
  /** Products that were already in Square (same barcode) and are now linked to that item. */
  linked: number
  failed: number
  /** Not sent yet because Square was still busy. Pressing the button again finishes them. */
  pending: number
  errors: string[]
}

type ProductRow = {
  id: string
  name: string
  barcode: string
  priceCents: number
  itemId: string | null
  variationId: string | null
}

type Plan =
  | { kind: "new"; product: ProductRow }
  | { kind: "existing"; product: ProductRow; itemId: string; variationId: string; linked: boolean }

// Square locks the item list while it saves a request, and a big request keeps it locked for a
// long time. Small requests, one after another, with waiting and retrying when Square answers
// "busy" (HTTP 429), is what Square recommends.
const ITEMS_PER_REQUEST = 20
const BATCH_OBJECT_LIMIT = 900
// Stop starting new requests after this long, so the page always answers (the limit is 120 s).
const TIME_BUDGET_MS = 85_000
const FIRST_RETRY_WAIT_MS = 2_000
const LONGEST_RETRY_WAIT_MS = 20_000

export async function sendProductsToSquare(): Promise<SyncResult> {
  await ensureSquareSchema()

  const rows = await sql(
    `select id, name, barcode, price_cents, square_item_id, square_variation_id from products order by id`
  )
  const products: ProductRow[] = rows.map((r) => ({
    id: r.id ?? "",
    name: (r.name ?? "").trim() || "Unnamed product",
    barcode: (r.barcode ?? "").trim(),
    priceCents: Math.max(0, Math.round(Number(r.price_cents ?? 0)) || 0),
    itemId: r.square_item_id,
    variationId: r.square_variation_id,
  }))

  const result: SyncResult = {
    total: products.length,
    created: 0,
    updated: 0,
    linked: 0,
    failed: 0,
    pending: 0,
    errors: [],
  }
  const deadline = Date.now() + TIME_BUDGET_MS
  if (!products.length) return result

  // 1. Everything already in Square's item list, by variation ID and by SKU / UPC.
  const variations = await listAllVariations()
  const byId = new Map<string, CatalogObject>()
  const byCode = new Map<string, CatalogObject>()
  for (const v of variations) {
    byId.set(v.id, v)
    for (const code of [v.item_variation_data?.sku, v.item_variation_data?.upc]) {
      const key = (code ?? "").trim()
      if (key && !byCode.has(key)) byCode.set(key, v)
    }
  }
  const takenVariationIds = new Set(products.map((p) => p.variationId).filter(Boolean) as string[])

  // 2. Decide for each product: update the Square item it is linked to, link to an item with the
  //    same barcode, or create a new item.
  const plans: Plan[] = []
  for (const product of products) {
    let target = product.variationId ? byId.get(product.variationId) : undefined
    let linked = false
    if (!target && product.barcode) {
      const sameCode = byCode.get(product.barcode)
      if (sameCode && !takenVariationIds.has(sameCode.id)) {
        target = sameCode
        linked = true
        takenVariationIds.add(sameCode.id)
      }
    }
    const itemId = target?.item_variation_data?.item_id
    if (target && itemId) {
      plans.push({ kind: "existing", product, itemId, variationId: target.id, linked })
    } else {
      plans.push({ kind: "new", product })
    }
  }

  // 3. Load the full Square items that will be updated, so nothing else on them is lost.
  const items = await retrieveItems([
    ...new Set(plans.flatMap((p) => (p.kind === "existing" ? [p.itemId] : []))),
  ])

  // 4. One batch per Square item. Square saves each batch all-or-nothing, and one failed batch
  //    does not stop the others.
  type Batch = { objects: CatalogObject[]; plans: Plan[] }
  const batches: Batch[] = []
  const byItem = new Map<string, Plan[]>()
  for (const plan of plans) {
    if (plan.kind === "existing" && items.has(plan.itemId)) {
      byItem.set(plan.itemId, [...(byItem.get(plan.itemId) ?? []), plan])
    } else {
      const product = plan.product
      batches.push({ objects: [newItem(product)], plans: [{ kind: "new", product }] })
    }
  }
  for (const [itemId, itemPlans] of byItem) {
    batches.push({ objects: [updatedItem(items.get(itemId)!, itemPlans)], plans: itemPlans })
  }

  // 5. Send to Square a few items at a time. The Square IDs are saved after every request, so
  //    nothing is lost if the page stops early, and pressing the button again simply continues.
  const groups = groupBatches(batches)
  for (let g = 0; g < groups.length; g++) {
    const group = groups[g]
    const reply = Date.now() < deadline ? await upsertWithRetry(group.map((b) => ({ objects: b.objects })), deadline) : null
    if (!reply || reply.busy) {
      // Square is still busy (or time is up): leave the rest for the next press of the button.
      for (const later of groups.slice(g)) result.pending += later.reduce((n, b) => n + b.plans.length, 0)
      break
    }
    const mapped = new Map(reply.idMappings.map((m) => [m.client_object_id, m.object_id]))
    const returned = new Set(reply.objects.map((o) => o.id))

    const saved: { pid: number; item_id: string; var_id: string }[] = []
    for (const batch of group) {
      for (const plan of batch.plans) {
        const pid = Number(plan.product.id)
        if (plan.kind === "new") {
          const itemId = mapped.get(tempItemId(plan.product))
          const variationId = mapped.get(tempVariationId(plan.product))
          if (itemId && variationId) {
            saved.push({ pid, item_id: itemId, var_id: variationId })
            result.created++
            continue
          }
        } else if (returned.has(plan.itemId)) {
          saved.push({ pid, item_id: plan.itemId, var_id: plan.variationId })
          if (plan.linked) result.linked++
          else result.updated++
          continue
        }
        result.failed++
      }
    }
    for (const message of reply.errors) {
      if (result.errors.length < 3 && !result.errors.includes(message)) result.errors.push(message)
    }
    await saveSquareIds(saved)
  }
  return result
}

async function saveSquareIds(saved: { pid: number; item_id: string; var_id: string }[]) {
  if (!saved.length) return
  const payload = JSON.stringify(saved)
  // A Square variation belongs to one Evertrail product only.
  await sql(
    `update products set square_item_id = null, square_variation_id = null
      where square_variation_id in (select var_id from json_to_recordset($1::json) as t(pid int, item_id text, var_id text))
        and id not in (select pid from json_to_recordset($1::json) as t(pid int, item_id text, var_id text))`,
    [payload]
  )
  await sql(
    `update products p
        set square_item_id = t.item_id, square_variation_id = t.var_id, square_synced_at = now()
       from json_to_recordset($1::json) as t(pid int, item_id text, var_id text)
      where p.id = t.pid`,
    [payload]
  )
}

/** One sentence for the Products page. */
export function syncSummary(r: SyncResult): string {
  if (!r.total) return "There are no products to send yet."
  const parts = [`Sent ${r.total - r.failed - r.pending} of ${r.total} products to Square`]
  const details = [
    r.created ? `${r.created} new` : "",
    r.updated ? `${r.updated} updated` : "",
    r.linked ? `${r.linked} matched to items already in Square by barcode` : "",
  ].filter(Boolean)
  if (details.length) parts.push(`(${details.join(", ")})`)
  let text = parts.join(" ") + "."
  if (r.failed) text += ` ${r.failed} could not be sent.` + (r.errors.length ? " " + r.errors.join(" ") : "")
  if (r.pending) {
    text += ` ${r.pending} are still to go because Square is busy saving. Wait a minute, then press Send products to Square again to finish.`
  }
  return text
}

// ---------- helpers ----------

function tempItemId(p: ProductRow) {
  return `#evertrail-item-${p.id}`
}
function tempVariationId(p: ProductRow) {
  return `#evertrail-variation-${p.id}`
}

/** Barcodes that are 12-14 digits are also saved as the UPC (Square's GTIN field). */
function upcFor(barcode: string): string | null {
  return /^\d{12,14}$/.test(barcode) ? barcode : null
}

/** Price and codes for one variation. A $0 product is "price entered at sale" in Square. */
function applyProduct(variation: CatalogObject, product: ProductRow) {
  const data = { ...(variation.item_variation_data ?? {}) }
  if (product.priceCents > 0) {
    data.pricing_type = "FIXED_PRICING"
    data.price_money = { amount: product.priceCents, currency: data.price_money?.currency || "USD" }
  } else {
    data.pricing_type = "VARIABLE_PRICING"
    delete data.price_money
  }
  if (product.barcode) {
    data.sku = product.barcode
    const upc = upcFor(product.barcode)
    if (upc) data.upc = upc
  }
  return { ...variation, item_variation_data: data }
}

function newItem(product: ProductRow): CatalogObject {
  const variation: CatalogObject = {
    type: "ITEM_VARIATION",
    id: tempVariationId(product),
    present_at_all_locations: true,
    item_variation_data: { item_id: tempItemId(product), name: "Regular" },
  }
  return {
    type: "ITEM",
    id: tempItemId(product),
    present_at_all_locations: true,
    item_data: { name: product.name, variations: [applyProduct(variation, product)] },
  }
}

function updatedItem(item: CatalogObject, plans: Plan[]): CatalogObject {
  const variations = item.item_data?.variations ?? []
  const byVariation = new Map(
    plans.flatMap((p) => (p.kind === "existing" ? [[p.variationId, p.product] as const] : []))
  )
  const itemData = {
    ...(item.item_data ?? {}),
    variations: variations.map((v) => {
      const product = byVariation.get(v.id)
      return product ? applyProduct(v, product) : v
    }),
  }
  // Rename the Square item only when it is just this one product (not an item with several sizes).
  if (variations.length === 1 && plans.length === 1) itemData.name = plans[0].product.name
  return { ...item, item_data: itemData }
}

async function listAllVariations(): Promise<CatalogObject[]> {
  const out: CatalogObject[] = []
  let cursor = ""
  for (let page = 0; page < 500; page++) {
    const query = "?types=ITEM_VARIATION" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : "")
    const reply = await square<{ objects?: CatalogObject[]; cursor?: string }>("/catalog/list" + query)
    for (const o of reply.objects ?? []) if (!o.is_deleted) out.push(o)
    cursor = reply.cursor ?? ""
    if (!cursor) break
  }
  return out
}

async function retrieveItems(ids: string[]): Promise<Map<string, CatalogObject>> {
  const items = new Map<string, CatalogObject>()
  for (let i = 0; i < ids.length; i += 1000) {
    const reply = await square<{ objects?: CatalogObject[] }>("/catalog/batch-retrieve", {
      method: "POST",
      body: { object_ids: ids.slice(i, i + 1000), include_related_objects: false },
    })
    for (const o of reply.objects ?? []) {
      if (o.type === "ITEM" && !o.is_deleted) items.set(o.id, o)
    }
  }
  return items
}

function groupBatches<T extends { objects: CatalogObject[] }>(batches: T[]): T[][] {
  const groups: T[][] = []
  let current: T[] = []
  let count = 0
  for (const batch of batches) {
    const size = batch.objects.reduce((n, o) => n + 1 + (o.item_data?.variations?.length ?? 0), 0)
    if (current.length && (count + size > BATCH_OBJECT_LIMIT || current.length >= ITEMS_PER_REQUEST)) {
      groups.push(current)
      current = []
      count = 0
    }
    current.push(batch)
    count += size
  }
  if (current.length) groups.push(current)
  return groups
}

type UpsertReply = {
  objects: CatalogObject[]
  idMappings: { client_object_id: string; object_id: string }[]
  errors: string[]
  /** Square answered "busy" (HTTP 429, for example "Catalog locked by prior request"). */
  busy: boolean
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Sends one request, and when Square says it is busy, waits and sends the same request again
 * (same idempotency key, so Square never saves it twice), waiting longer each time.
 */
async function upsertWithRetry(batches: { objects: CatalogObject[] }[], deadline: number): Promise<UpsertReply> {
  const key = randomUUID()
  let wait = FIRST_RETRY_WAIT_MS
  for (;;) {
    const reply = await upsert(batches, key)
    if (!reply.busy) return reply
    const pause = wait + Math.floor(Math.random() * 500)
    if (Date.now() + pause + 5_000 > deadline) return reply
    await sleep(pause)
    wait = Math.min(wait * 2, LONGEST_RETRY_WAIT_MS)
  }
}

/**
 * Square's batch upsert. Some batches can succeed while others fail, so this reads the reply
 * even when Square reports an error, instead of throwing it away.
 */
async function upsert(batches: { objects: CatalogObject[] }[], idempotencyKey: string): Promise<UpsertReply> {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim()
  if (!token) throw new Error("Square is not connected yet: SQUARE_ACCESS_TOKEN is not set in Vercel.")
  const response = await fetch("https://connect.squareup.com/v2/catalog/batch-upsert", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ idempotency_key: idempotencyKey, batches }),
  })
  let data: {
    objects?: CatalogObject[]
    id_mappings?: { client_object_id: string; object_id: string }[]
    errors?: { detail?: string }[]
  } = {}
  try {
    data = await response.json()
  } catch {
    // keep empty
  }
  const errors = (data.errors ?? []).map((e) => (e.detail ? "Square said: " + e.detail : "")).filter(Boolean)
  if (!response.ok && !errors.length) errors.push(squareMessage(data, response.status))
  if ((response.status === 401 || response.status === 429) && errors.length) {
    errors.splice(0, errors.length, squareMessage(data, response.status))
  }
  return {
    objects: data.objects ?? [],
    idMappings: data.id_mappings ?? [],
    errors,
    busy: response.status === 429,
  }
}
