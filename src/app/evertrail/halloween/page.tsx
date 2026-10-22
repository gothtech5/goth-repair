import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError } from "@/lib/evertrail/db"
import { listHalloweenSignups, type HalloweenSignupRow } from "@/lib/halloween-signup"
import { HALLOWEEN_CODE } from "@/lib/halloween"
import { Shell } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

function when(value: string | null): string {
  if (!value) return "—"
  const d = new Date(value.replace(" ", "T"))
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/** Private list of Halloween offer signups (behind the Evertrail password). */
export default async function HalloweenSignupsPage() {
  await requireAuth()
  let rows: HalloweenSignupRow[] = []
  let error = ""
  try {
    rows = await listHalloweenSignups()
  } catch (e) {
    error = "Could not load signups. " + friendlyError(e)
  }
  const marketing = rows.filter((r) => r.marketingOptIn).length

  return (
    <Shell title="Halloween signups" error={error}>
      <p className="mb-4 text-sm text-neutral-700">
        Code <strong>{HALLOWEEN_CODE}</strong>: {rows.length} signup{rows.length === 1 ? "" : "s"},{" "}
        {marketing} said yes to marketing emails. Only email people marked &ldquo;Yes&rdquo; with
        news and offers.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-left">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Marketing emails</th>
              <th className="py-2 pr-4">Signed up</th>
              <th className="py-2 pr-4">Code emailed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email} className="border-b border-neutral-200">
                <td className="py-2 pr-4 break-all">{r.email}</td>
                <td className="py-2 pr-4">{r.marketingOptIn ? "Yes" : "No"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{when(r.createdAt)}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {r.codeSentAt ? `${when(r.codeSentAt)}${r.sendCount > 1 ? ` (${r.sendCount}×)` : ""}` : "Not sent"}
                </td>
              </tr>
            ))}
            {!rows.length && !error ? (
              <tr>
                <td colSpan={4} className="py-4 text-neutral-600">No signups yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}
