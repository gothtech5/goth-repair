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

export function text(input: FormDataEntryValue | null): string {
  return String(input ?? "").trim()
}
