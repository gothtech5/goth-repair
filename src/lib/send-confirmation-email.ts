import { Resend } from "resend"
import { createCancelToken } from "./cancel-token"

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")
  return new Resend(apiKey)
}

interface ConfirmationEmailParams {
  eventId: string
  customerName: string
  email: string
  date: string
  timeSlot: string
  category: string
  brand: string
  modelName: string
  issues: string
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  const { eventId, customerName, email, date, timeSlot, brand, modelName, issues } = params

  const cancelToken = createCancelToken(eventId)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goth-repair.vercel.app"
  const cancelUrl = `${baseUrl}/cancel?token=${encodeURIComponent(cancelToken)}`
  const deviceDisplay = brand ? `${brand} ${modelName}` : modelName

  const subject = `Your GothTech repair appointment — ${date} at ${timeSlot}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">Your appointment is confirmed</h1>
      <p style="color: #6b7280; margin: 0 0 24px;">We'll see you soon at GothTech.</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Device</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${deviceDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Issues</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${issues}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Date</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b7280;">Time</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 500;">${timeSlot}</td>
        </tr>
      </table>

      <p style="margin: 32px 0 16px; font-size: 14px; color: #6b7280;">
        Need to cancel? Use the link below.
      </p>
      <a href="${cancelUrl}" style="display: inline-block; padding: 10px 20px; background: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
        Cancel Appointment
      </a>

      <p style="margin: 32px 0 0; font-size: 12px; color: #9ca3af;">
        GothTech · Minneapolis, MN · gothtechnology.com
      </p>
    </div>
  `.trim()

  const text = [
    "Your appointment is confirmed",
    "",
    `Name: ${customerName}`,
    `Device: ${deviceDisplay}`,
    `Issues: ${issues}`,
    `Date: ${date}`,
    `Time: ${timeSlot}`,
    "",
    `Need to cancel? Visit: ${cancelUrl}`,
    "",
    "GothTech · Minneapolis, MN · gothtechnology.com",
  ].join("\n")

  const resend = getResendClient()
  await resend.emails.send({
    from: "bookings@gothtechnology.com",
    to: email,
    subject,
    html,
    text,
  })
}
