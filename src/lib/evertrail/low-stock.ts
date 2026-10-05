import { Resend } from "resend"
import { sql } from "@/lib/evertrail/db"

// Same sender, same inbox and same RESEND_API_KEY as the booking emails
// in src/lib/send-confirmation-email.ts. No new email service or settings.
const FROM = "bookings@gothtechnology.com"
const TO = "gothtechnology5@gmail.com"

export type LowStockResult = "sent" | "failed" | "none"

/**
 * Call this after anything that changes a product's stock or its reminder level.
 *
 * - Stock is back above the reminder level (or the reminder was removed):
 *   clears the "already emailed" mark so the next drop sends a new email.
 * - Stock is at or below the reminder level and no email was sent yet:
 *   marks it as emailed and sends ONE email.
 *
 * It never throws, so a problem with the email can never block a stock change.
 */
export async function checkLowStock(productId: number | string): Promise<LowStockResult> {
  try {
    // 1. Back above the level: allow a future alert again.
    await sql(
      `update products
          set low_stock_alerted = false
        where id = $1
          and low_stock_alerted = true
          and (low_stock_threshold is null or quantity_on_hand > low_stock_threshold)`,
      [productId]
    )

    // 2. At or below the level and not emailed yet: claim it.
    //    Only one request can flip false -> true, so only one email goes out.
    const rows = await sql(
      `update products
          set low_stock_alerted = true
        where id = $1
          and low_stock_alerted = false
          and low_stock_threshold is not null
          and quantity_on_hand <= low_stock_threshold
        returning name, quantity_on_hand, low_stock_threshold`,
      [productId]
    )
    if (!rows.length) return "none"

    const product = rows[0]
    try {
      await sendLowStockEmail(product.name ?? "", product.quantity_on_hand ?? "", product.low_stock_threshold ?? "")
      return "sent"
    } catch (error) {
      console.error("Low-stock email failed:", error)
      // The email did not go out, so remove the mark. The next stock change tries again.
      await sql(`update products set low_stock_alerted = false where id = $1`, [productId])
      return "failed"
    }
  } catch (error) {
    console.error("Low-stock check failed:", error)
    return "failed"
  }
}

async function sendLowStockEmail(name: string, stock: string, threshold: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Low stock: ${name}`,
    text: `Low stock alert\n\nProduct: ${name}\nCurrent stock: ${stock}\nReminder level: ${threshold} (alert when stock is at or below this)\n\nSent by Evertrail.`,
  })
  if (error) throw new Error(error.message)
}

/** Short text to add to the on-screen message after a stock change. */
export function lowStockNote(result: LowStockResult): string {
  if (result === "sent") return " Low-stock email sent."
  if (result === "failed") return " Low stock, but the alert email could not be sent."
  return ""
}
