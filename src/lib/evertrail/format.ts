export type Search = Promise<Record<string, string | string[] | undefined>>

/** Reads one value from the page address (?name=value). */
export function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

/** 1299 -> "12.99" */
export function dollars(cents: string | number | null): string {
  return (Number(cents ?? 0) / 100).toFixed(2)
}

/** "12.99" or "$12.99" -> 1299. Blank or junk -> 0. */
export function toCents(input: FormDataEntryValue | null): number {
  const n = parseFloat(String(input ?? "").replace(/[^0-9.]/g, ""))
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

/** Whole number from a form field, never negative unless allowed. */
export function toInt(input: FormDataEntryValue | null, fallback = 0): number {
  const n = parseInt(String(input ?? "").trim(), 10)
  return Number.isFinite(n) ? n : fallback
}

/** Whole number that is 0 or more, or null when the field is left blank. */
export function toIntOrNull(input: FormDataEntryValue | null): number | null {
  const raw = String(input ?? "").trim()
  if (!raw) return null
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? Math.max(0, n) : null
}

export function text(input: FormDataEntryValue | null): string {
  return String(input ?? "").trim()
}

/** Sale price in cents: price minus discount, never below 0. */
export function salePriceCents(price: string | number | null | undefined, discount: string | number | null | undefined): number {
  return Math.max(0, Number(price ?? 0) - Number(discount ?? 0))
}

/**
 * Reads the optional "Discount ($)" box. Blank or 0 means no discount.
 * Gives the discount in cents, or a message when it is negative, not a dollar amount, or more than the price.
 * Used both while typing (on the page) and when saving (on the server).
 */
export function readDiscount(
  priceInput: FormDataEntryValue | null,
  discountInput: FormDataEntryValue | null
): { cents: number; error: string } {
  const raw = String(discountInput ?? "").trim()
  if (!raw) return { cents: 0, error: "" }
  if (raw.includes("-")) return { cents: 0, error: "Discount can't be negative." }
  if (!/^\$?\s*(\d+(\.\d*)?|\.\d+)$/.test(raw.replace(/,/g, ""))) {
    return { cents: 0, error: "Discount must be a dollar amount, like 10.00." }
  }
  const cents = toCents(raw)
  const price = toCents(priceInput)
  if (cents > price) return { cents, error: `Discount can't be more than the price ($${dollars(price)}).` }
  return { cents, error: "" }
}
