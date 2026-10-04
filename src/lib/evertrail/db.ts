// Talks to the evertrail-db Neon database over HTTPS.
// Uses the DATABASE_URL that Vercel added when the database was connected.
// Server-side only: never import this file from a "use client" component.

export type Row = Record<string, string | null>
export type Param = string | number | null

export async function sql(query: string, params: Param[] = []): Promise<Row[]> {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set for this environment.")
  }
  const host = new URL(connectionString).hostname
  const endpoint = "https://" + host.replace(/^[^.]+\./, "api.") + "/sql"

  const response = await fetch(endpoint, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
      "Neon-Raw-Text-Output": "true",
      "Neon-Array-Mode": "true",
    },
    body: JSON.stringify({
      query,
      params: params.map((p) => (p === null ? null : String(p))),
    }),
  })

  if (!response.ok) {
    let message = "Database error (HTTP " + response.status + ")"
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep the generic message
    }
    throw new Error(message)
  }

  const data = (await response.json()) as {
    fields: { name: string }[]
    rows: (string | null)[][]
  }
  const names = data.fields.map((f) => f.name)
  return data.rows.map((row) => {
    const out: Row = {}
    row.forEach((value, i) => {
      out[names[i]] = value
    })
    return out
  })
}

/** Turns a database error into a short message a person can act on. */
export function friendlyError(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error)
  if (text.includes("products_sku_key")) return "That SKU is already used by another product."
  if (text.includes("products_barcode_key")) return "That barcode is already used by another product."
  if (text.includes("purchase_order_items_product_id_fkey"))
    return "This product is on a purchase order, so it cannot be removed."
  return text
}
