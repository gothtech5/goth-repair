// Removing items from Square's item list (never sales or payments).
//
// - When a product is deleted in Evertrail, its Square item is deleted too, so it leaves the
//   Square terminal. Matched by the Square ID Evertrail saved; if there is none, by SKU, then by
//   barcode. Never by name.
// - The "Square cleanup" page lists Square items that match no Evertrail product, and deletes only
//   the ones ticked there.
//
// Square keeps deleted items for its own records, so past orders, payments and reports in Square
// are not changed. Evertrail's own Square sales list is not touched either.

import { sql } from "@/lib/evertrail/db"
import { square, SquareError, type CatalogObject, type Money } from "@/lib/evertrail/square"
import { codesOf, listCatalogItems, type CatalogEntry } from "@/lib/evertrail/square-sync"

// Square runs one delete at a time and answers "busy" (HTTP 429) to others meanwhile.
const DELETE_BUDGET_MS = 25_000
const IDS_PER_DELETE = 200
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Deletes these Square objects. Returns the IDs Square actually deleted. */
async function batchDelete(ids: string[], budgetMs = DELETE_BUDGET_MS): Promise<Set<string>> {
  const deleted = new Set<string>()
  const deadline = Date.now() + budgetMs
  for (let i = 0; i < ids.length; i += IDS_PER_DELETE) {
    const chunk = ids.slice(i, i + IDS_PER_DELETE)
    let wait = 1_000
    for (;;) {
      try {
        const reply = await square<{ deleted_object_ids?: string[] }>("/catalog/batch-delete", {
          method: "POST",
          body: { object_ids: chunk },
        })
        for (const id of reply.deleted_object_ids ?? []) deleted.add(id)
        break
      } catch (error) {
        const busy = error instanceof SquareError && error.status === 429
        if (!busy || Date.now() + wait > deadline) throw error
        await sleep(wait + Math.floor(Math.random() * 300))
        wait = Math.min(wait * 2, 8_000)
      }
    }
  }
  return deleted
}

/**
 * What to delete for these variations: the whole item when every variation of it is going,
 * otherwise only those variations (so other sizes on the same Square item stay).
 */
function objectsToDelete(targets: CatalogEntry[]): string[] {
  const byItem = new Map<string, { item: CatalogObject; variationIds: Set<string> }>()
  for (const t of targets) {
    const entry = byItem.get(t.item.id) ?? { item: t.item, variationIds: new Set<string>() }
    entry.variationIds.add(t.variation.id)
    byItem.set(t.item.id, entry)
  }
  const ids: string[] = []
  for (const { item, variationIds } of byItem.values()) {
    const all = (item.item_data?.variations ?? []).filter((v) => !v.is_deleted).map((v) => v.id)
    if (all.every((id) => variationIds.has(id))) ids.push(item.id)
    else ids.push(...variationIds)
  }
  return ids
}

export type DeletedProductInfo = {
  sku: string | null
  barcode: string | null
  square_item_id?: string | null
  square_variation_id?: string | null
}

/**
 * Removes a just-deleted Evertrail product from Square's item list.
 * "removed": deleted in Square. "none": nothing in Square matched. "failed": Square could not be
 * reached or refused (also when Square is not connected). Never throws.
 */
export async function removeProductFromSquare(product: DeletedProductInfo): Promise<"removed" | "none" | "failed"> {
  if (!process.env.SQUARE_ACCESS_TOKEN?.trim()) return "failed"
  try {
    const catalog = await listCatalogItems()
    // Square items still used by other Evertrail products (linked, or same SKU / barcode) are never touched.
    const others = await sql(`select sku, barcode, square_variation_id from products`)
    const kept = new Set(others.map((r) => r.square_variation_id ?? "").filter(Boolean))
    const otherCodes = new Set(others.flatMap((r) => [r.sku, r.barcode]).map((c) => (c ?? "").trim()).filter(Boolean))
    const usable = catalog.filter((e) => !kept.has(e.variation.id) && !codesOf(e.variation).some((c) => otherCodes.has(c)))

    const sku = (product.sku ?? "").trim()
    const barcode = (product.barcode ?? "").trim()
    let targets: CatalogEntry[] = []
    // 1. The Square item Evertrail saved for this product.
    if (product.square_variation_id) targets = usable.filter((e) => e.variation.id === product.square_variation_id)
    if (!targets.length && product.square_item_id) targets = usable.filter((e) => e.item.id === product.square_item_id)
    // 2. Same SKU.  3. Same barcode (Square SKU or UPC).
    if (!targets.length && sku) targets = usable.filter((e) => (e.variation.item_variation_data?.sku ?? "").trim() === sku)
    if (!targets.length && barcode) targets = usable.filter((e) => codesOf(e.variation).includes(barcode))
    if (!targets.length) return "none"

    const ids = objectsToDelete(targets)
    const deleted = await batchDelete(ids)
    return ids.every((id) => deleted.has(id)) ? "removed" : "failed"
  } catch (error) {
    console.error("Removing a product from Square failed:", error)
    return "failed"
  }
}

// ---------- Square cleanup page ----------

export type LeftoverItem = {
  id: string
  name: string
  skus: string
  price: string
  archived: boolean
  variations: number
}

function priceText(variations: CatalogObject[]): string {
  const amounts = variations
    .map((v) => (v.item_variation_data?.price_money as Money | undefined)?.amount)
    .filter((a): a is number => typeof a === "number")
  if (!amounts.length) return "Price set at sale"
  const low = Math.min(...amounts) / 100
  const high = Math.max(...amounts) / 100
  return low === high ? `$${low.toFixed(2)}` : `$${low.toFixed(2)} - $${high.toFixed(2)}`
}

/** Square items where no variation matches any Evertrail product (by Square ID, SKU or barcode). */
export async function findLeftoverItems(): Promise<LeftoverItem[]> {
  const catalog = await listCatalogItems()
  const rows = await sql(`select * from products`)
  const ids = new Set<string>()
  const codes = new Set<string>()
  for (const r of rows) {
    for (const v of [r.square_item_id, r.square_variation_id]) if (v) ids.add(v)
    for (const c of [r.sku, r.barcode]) if (c?.trim()) codes.add(c.trim())
  }

  const items = new Map<string, { item: CatalogObject; archived: boolean; matched: boolean; variations: CatalogObject[] }>()
  for (const { item, variation, archived } of catalog) {
    const entry = items.get(item.id) ?? { item, archived, matched: false, variations: [] }
    entry.variations.push(variation)
    if (ids.has(item.id) || ids.has(variation.id) || codesOf(variation).some((c) => codes.has(c))) entry.matched = true
    items.set(item.id, entry)
  }

  return [...items.values()]
    .filter((e) => !e.matched)
    .map((e) => ({
      id: e.item.id,
      name: (e.item.item_data?.name ?? "").trim() || "(no name)",
      skus: [...new Set(e.variations.map((v) => (v.item_variation_data?.sku ?? "").trim()).filter(Boolean))].join(", "),
      price: priceText(e.variations),
      archived: e.archived,
      variations: e.variations.length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export type CleanupResult = { asked: number; deleted: number; skipped: number; failed: number }

/**
 * Deletes the ticked Square items. Each one is checked again first: an item that now matches an
 * Evertrail product (or is already gone) is skipped, never deleted.
 */
export async function deleteLeftoverItems(itemIds: string[]): Promise<CleanupResult> {
  const asked = [...new Set(itemIds.filter(Boolean))]
  const stillLeftover = new Set((await findLeftoverItems()).map((i) => i.id))
  const allowed = asked.filter((id) => stillLeftover.has(id))
  const result: CleanupResult = { asked: asked.length, deleted: 0, skipped: asked.length - allowed.length, failed: 0 }
  if (!allowed.length) return result
  const deleted = await batchDelete(allowed, 60_000)
  result.deleted = allowed.filter((id) => deleted.has(id)).length
  result.failed = allowed.length - result.deleted
  return result
}
