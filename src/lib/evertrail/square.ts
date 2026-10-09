// Talks to Square's API for Evertrail.
// Server-side only: never import this file from a "use client" component.
//
// Secrets come only from Vercel environment variables:
//   SQUARE_ACCESS_TOKEN           - lets Evertrail read orders and write the item list
//   SQUARE_WEBHOOK_SIGNATURE_KEY  - proves a webhook really came from Square
//   SQUARE_LOCATION_ID            - only sales from this store location change stock

import { sql } from "@/lib/evertrail/db"

const SQUARE_API = "https://connect.squareup.com/v2"
// Square API version this code was written and checked against (Square changelog, Sept 2026).
export const SQUARE_VERSION = "2026-09-16"

/** The exact address to paste into Square's webhook subscription. */
export const SQUARE_WEBHOOK_URL = "https://www.gothtechnology.com/api/square/webhook"

/** Which of the three settings are filled in (never the values themselves). */
export function squareSettings() {
  return {
    accessToken: Boolean(process.env.SQUARE_ACCESS_TOKEN?.trim()),
    signatureKey: Boolean(process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim()),
    locationId: Boolean(process.env.SQUARE_LOCATION_ID?.trim()),
  }
}

export class SquareError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type SquareErrorBody = { errors?: { code?: string; detail?: string; field?: string }[] }

/** Calls Square and returns the JSON reply. Throws SquareError with Square's own message on failure. */
export async function square<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim()
  if (!token) throw new SquareError("Square is not connected yet: SQUARE_ACCESS_TOKEN is not set in Vercel.", 0)

  const response = await fetch(SQUARE_API + path, {
    method: init.method ?? "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    // keep null
  }
  if (!response.ok) {
    throw new SquareError(squareMessage(data, response.status), response.status)
  }
  return data as T
}

/** Turns Square's error reply into one short sentence. */
export function squareMessage(data: unknown, status: number): string {
  const first = (data as SquareErrorBody | null)?.errors?.[0]
  if (status === 401) return "Square rejected the access token. Check SQUARE_ACCESS_TOKEN in Vercel."
  if (status === 403) return "The Square access token is missing a permission Evertrail needs."
  if (status === 429) return "Square is busy right now. Wait a minute and try again."
  if (first?.detail) return "Square said: " + first.detail
  return "Square error (HTTP " + status + ")"
}

// ---------- Square object shapes (only the fields Evertrail uses) ----------

export type Money = { amount?: number | null; currency?: string }

export type CatalogObject = {
  type: string
  id: string
  version?: number
  is_deleted?: boolean
  present_at_all_locations?: boolean
  item_data?: {
    name?: string
    variations?: CatalogObject[]
    [key: string]: unknown
  }
  item_variation_data?: {
    item_id?: string
    name?: string
    sku?: string
    upc?: string
    pricing_type?: string
    price_money?: Money
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type OrderLineItem = {
  uid?: string
  name?: string
  variation_name?: string
  quantity?: string
  catalog_object_id?: string
}

export type Order = {
  id: string
  location_id?: string
  state?: string
  created_at?: string
  closed_at?: string
  tenders?: unknown[]
  net_amount_due_money?: Money
  line_items?: OrderLineItem[]
  returns?: { source_order_id?: string; return_line_items?: OrderLineItem[] }[]
}

// ---------- Database: the few columns and tables Square needs ----------

let schemaReady: Promise<void> | null = null

/**
 * Adds what the Square link needs to the evertrail-db database, once.
 * Safe to run any number of times: it only adds things that are missing
 * and never changes or removes existing data.
 */
export function ensureSquareSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((error) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

async function createSchema() {
  const statements = [
    `alter table products add column if not exists square_item_id text`,
    `alter table products add column if not exists square_variation_id text`,
    `alter table products add column if not exists square_synced_at timestamptz`,
    `create unique index if not exists products_square_variation_id_key
       on products (square_variation_id) where square_variation_id is not null`,
    `create table if not exists square_sales (
       id bigserial primary key,
       kind text not null,
       square_order_id text not null,
       line_uid text not null,
       square_catalog_object_id text,
       item_name text,
       quantity integer not null,
       product_id integer,
       status text not null,
       stock_after integer,
       sold_at timestamptz,
       created_at timestamptz not null default now(),
       unique (kind, square_order_id, line_uid)
     )`,
    `create index if not exists square_sales_sold_at_idx on square_sales (sold_at desc)`,
  ]
  for (const statement of statements) {
    try {
      await sql(statement)
    } catch (error) {
      // Two requests creating the same thing at the same moment: the other one won, which is fine.
      const text = error instanceof Error ? error.message : String(error)
      if (!/already exists|duplicate key/i.test(text)) throw error
    }
  }
}

/**
 * Remembers which Square variation is this product, so later sales match by Square ID.
 * A Square variation can belong to only one Evertrail product.
 */
export async function linkVariation(productId: number | string, itemId: string | null, variationId: string) {
  await sql(
    `update products set square_variation_id = null, square_item_id = null
      where square_variation_id = $2 and id <> $1`,
    [productId, variationId]
  )
  await sql(
    `update products set square_item_id = coalesce($3, square_item_id), square_variation_id = $2 where id = $1`,
    [productId, variationId, itemId]
  )
}
