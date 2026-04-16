import { Resend } from "resend"
import { createCancelToken } from "./cancel-token"

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")
  return new Resend(apiKey)
}

interface WalkInEmailParams {
  type: "walk-in"
  eventId: string
  customerName: string
  email: string
  date: string
  timeSlot: string
  brand: string
  modelName: string
  issues: string
}

interface MailInEmailParams {
  type: "mail-in"
  customerName: string
  email: string
  phone: string
  brand: string
  modelName: string
  issues: string
  issueDescription: string
  shippingAddress: {
    street: string
    apartment: string
    city: string
    state: string
    zip: string
  }
}

export type ConfirmationEmailParams = WalkInEmailParams | MailInEmailParams

function formatAddress(addr: MailInEmailParams["shippingAddress"]): string {
  const lines = [addr.street]
  if (addr.apartment) lines.push(addr.apartment)
  lines.push(`${addr.city}, ${addr.state} ${addr.zip}`)
  return lines.join(", ")
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  if (params.type === "mail-in") {
    await sendMailInCustomerEmail(params)
    return
 }

  await sendWalkInConfirmationEmail(params)
}

async function sendWalkInConfirmationEmail(params: WalkInEmailParams): Promise<void> {
  const { eventId, customerName, email, date, timeSlot, brand, modelName, issues } = params

  const cancelToken = createCancelToken(eventId)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goth-repair.vercel.app"
  const cancelUrl = `${baseUrl}/cancel?token=${encodeURIComponent(cancelToken)}`
  const deviceDisplay = brand ? `${brand} ${modelName}` : modelName

  const friendlyDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const subject = `Your GothTech repair — ${friendlyDate} at ${timeSlot}`

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
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${friendlyDate}</td>
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
    `Date: ${friendlyDate}`,
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

async function sendMailInCustomerEmail(params: MailInEmailParams): Promise<void> {
  const { customerName, email, brand, modelName, issues, shippingAddress } = params
  const deviceDisplay = brand ? `${brand} ${modelName}` : modelName
  const returnAddress = formatAddress(shippingAddress)

  const subject = `Your GothTech mail-in repair request — ${deviceDisplay}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">Mail-in repair request received</h1>
      <p style="color: #6b7280; margin: 0 0 24px;">Here's a summary of your request and what to do next.</p>

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
          <td style="padding: 10px 0; color: #6b7280;">Return address</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 500;">${returnAddress}</td>
        </tr>
      </table>

      <div style="margin: 24px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <p style="font-size: 14px; font-weight: 600; margin: 0 0 12px;">Ship your device to:</p>
        <p style="font-size: 14px; margin: 0; line-height: 1.6;">
          GothTech<br>
          200 W Lake St #203<br>
          Minneapolis, MN 55408
        </p>
      </div>

      <div style="margin: 0 0 24px;">
        <p style="font-size: 14px; font-weight: 600; margin: 0 0 12px;">Next steps:</p>
        <ol style="font-size: 14px; color: #374151; padding-left: 20px; margin: 0; line-height: 1.8;">
          <li>Pack your device securely (original box or padded shipping box recommended)</li>
          <li>Mail it to the address above</li>
          <li>We'll run free diagnostics and contact you with a quote</li>
          <li>Once repaired, we'll ship it back to your address</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">
        Questions? Reply to this email or contact us:
      </p>
      <p style="font-size: 14px; margin: 0 0 4px;">
        <a href="mailto:gothtechnology5@gmail.com" style="color: #2563eb; text-decoration: none;">gothtechnology5@gmail.com</a>
      </p>
      <p style="font-size: 14px; margin: 0;">
        <a href="tel:+16129878107" style="color: #2563eb; text-decoration: none;">(612) 987-8107</a>
      </p>

      <p style="margin: 32px 0 0; font-size: 12px; color: #9ca3af;">
        GothTech · Minneapolis, MN · gothtechnology.com
      </p>
    </div>
  `.trim()

  const text = [
    "Mail-in repair request received",
    "",
    `Name: ${customerName}`,
    `Device: ${deviceDisplay}`,
    `Issues: ${issues}`,
    `Return address: ${returnAddress}`,
    "",
    "SHIP YOUR DEVICE TO:",
    "GothTech",
    "200 W Lake St #203",
    "Minneapolis, MN 55408",
    "",
    "NEXT STEPS:",
    "1. Pack your device securely",
    "2. Mail it to the address above",
    "3. We'll run free diagnostics and contact you with a quote",
    "4. Once repaired, we'll ship it back to your address",
    "",
    "Questions? Email gothtechnology5@gmail.com or call (612) 987-8107",
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
  await resend.emails.send({
from: "bookings@gothtechnology.com",
to: "gothtechnology5@gmail.com",
subject: `New Walk-In Booking: ${customerName}`,
text: `New booking!\nName: ${customerName}\nEmail: ${email}\nDate: ${date}\nTime: ${timeSlot}\nDevice: ${deviceDisplay}`,
})
async function sendMailInStoreNotification(params: MailInEmailParams): Promise<void> {
  const { customerName, email, phone, brand, modelName, issues, issueDescription, shippingAddress } = params
  const deviceDisplay = brand ? `${brand} ${modelName}` : modelName
  const returnAddress = formatAddress(shippingAddress)

  const subject = `[Mail-In Request] ${deviceDisplay} — ${customerName}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">New mail-in repair request</h1>
      <p style="color: #6b7280; margin: 0 0 24px;">A customer has submitted a mail-in repair. Expect their device in the mail.</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Customer</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Device</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${deviceDisplay}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Issues</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${issues}</td>
        </tr>
        ${issueDescription ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Description</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${issueDescription}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; color: #6b7280;">Return address</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 500;">${returnAddress}</td>
        </tr>
      </table>

      <p style="margin: 32px 0 0; font-size: 12px; color: #9ca3af;">
        This is an automated notification from the GothTech booking system.
      </p>
    </div>
  `.trim()

  const resend = getResendClient()
  await resend.emails.send({
    from: "bookings@gothtechnology.com",
    to: "gothtechnology5@gmail.com",
    subject,
    html,
    text: `New mail-in request from ${customerName}\n\nPhone: ${phone}\nEmail: ${email}\nDevice: ${deviceDisplay}\nIssues: ${issues}\n${issueDescription ? `Description: ${issueDescription}\n` : ""}Return address: ${returnAddress}`,
  })
  
await resend.emails.send({
from: "bookings@gothtechnology.com",
to: "gothtechnology5@gmail.com",
subject: `New Booking: ${customerName}`,
text: `New booking received from ${customerName}\nPhone: ${phone}\nEmail: ${email}`, 
}) 
}
}
