import { sql } from "@/lib/evertrail/db"
import { checkLowStock, lowStockNote } from "@/lib/evertrail/low-stock"

/**
 * Adds to a product's current stock (5 in stock + 5 added = 10) and then runs the low-stock email check.
 * Returns a sentence for the on-screen message, or null if the product does not exist.
 */
export async function addStock(productId: number, quantity: number): Promise<string | null> {
  const rows = await sql(
    `update products set quantity_on_hand = quantity_on_hand + $2 where id = $1 returning name, quantity_on_hand`,
    [productId, quantity]
  )
  if (!rows.length) return null
  const alert = await checkLowStock(productId)
  return `Added ${quantity} to "${rows[0].name}". Stock is now ${rows[0].quantity_on_hand}.` + lowStockNote(alert)
}

/** Reads the "how many to add" box. Returns 0 when it is not a whole number from 1 to 100000. */
export function stockToAdd(input: FormDataEntryValue | null): number {
  const raw = String(input ?? "").trim()
  if (!/^\d+$/.test(raw)) return 0
  const n = Number(raw)
  return n >= 1 && n <= 100000 ? n : 0
}
