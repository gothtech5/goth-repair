// Product changes that reach past the products table: the discount column and deleting a product.
// Server-side only: never import this file from a "use client" component.

import { sql } from "@/lib/evertrail/db"

let schemaReady: Promise<void> | null = null

/**
 * Adds what discounts and product deletion need to the evertrail-db database, once.
 * Safe to run any number of times: it only adds things that are missing
 * and never changes or removes existing data.
 */
export function ensureProductSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((error) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

async function createSchema() {
  const columns = await sql(
    `select table_name, column_name, is_nullable
       from information_schema.columns
      where table_schema = current_schema() and table_name in ('products', 'purchase_order_items')`
  )
  const has = (table: string, column: string) =>
    columns.find((c) => c.table_name === table && c.column_name === column)

  const statements: string[] = []
  // The discount is kept apart from the price. Existing products get 0, which means no discount.
  if (!has("products", "discount_cents")) {
    statements.push(`alter table products add column if not exists discount_cents integer not null default 0`)
  }
  // A purchase order line keeps a copy of the product's name, SKU and barcode,
  // so the order still reads correctly after the product itself is deleted.
  for (const column of ["product_name", "product_sku", "product_barcode"]) {
    if (!has("purchase_order_items", column)) {
      statements.push(`alter table purchase_order_items add column if not exists ${column} text`)
    }
  }
  if (has("purchase_order_items", "product_id")?.is_nullable === "NO") {
    statements.push(`alter table purchase_order_items alter column product_id drop not null`)
  }

  for (const statement of statements) {
    try {
      await sql(statement)
    } catch (error) {
      // Two requests adding the same thing at the same moment: the other one won, which is fine.
      const text = error instanceof Error ? error.message : String(error)
      if (!/already exists|duplicate key/i.test(text)) throw error
    }
  }
}

export type DeletedProduct = {
  name: string
  sku: string | null
  barcode: string | null
  square_item_id: string | null
  square_variation_id: string | null
}

/**
 * Deletes a product for good. Returns null if it was already gone.
 *
 * Purchase orders that list it are kept: each of those lines keeps a copy of the product's
 * name, SKU and barcode and lets go of the product, so old orders still read correctly.
 * Deleting the row frees its barcode and SKU, so the same barcode can be added again later.
 */
export async function deleteProduct(id: number): Promise<DeletedProduct | null> {
  await ensureProductSchema()

  // Tried twice in case the product is added to a purchase order at the very same moment.
  for (let attempt = 1; ; attempt++) {
    const lines = await sql(
      `update purchase_order_items i
          set product_name = p.name, product_sku = p.sku, product_barcode = p.barcode, product_id = null
         from products p
        where p.id = $1 and i.product_id = p.id
       returning i.po_id`,
      [id]
    )

    let gone: Awaited<ReturnType<typeof sql>>
    try {
      gone = await sql(`delete from products where id = $1 returning *`, [id])
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error)
      if (attempt < 2 && text.includes("purchase_order_items_product_id_fkey")) continue
      throw error
    }
    if (!gone.length) return null

    // Same rule as the purchase order page: an order is "received" once every line that
    // still has a product is fully received. Lines for deleted products no longer count.
    const poIds = [...new Set(lines.map((l) => l.po_id).filter((v): v is string => Boolean(v)))]
    if (poIds.length) {
      await sql(
        `update purchase_orders po
            set status = case
              when exists (select 1 from purchase_order_items i where i.po_id = po.id)
               and not exists (select 1 from purchase_order_items i
                                where i.po_id = po.id and i.product_id is not null and i.qty_received < i.qty_ordered)
              then 'received' else 'open' end
          where po.id = any($1::int[])`,
        ["{" + poIds.join(",") + "}"]
      )
    }

    const row = gone[0]
    return {
      name: row.name ?? "",
      sku: row.sku ?? null,
      barcode: row.barcode ?? null,
      square_item_id: row.square_item_id ?? null,
      square_variation_id: row.square_variation_id ?? null,
    }
  }
}
