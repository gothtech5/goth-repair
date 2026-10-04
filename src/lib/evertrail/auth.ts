import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

// Must match tokenFor() in src/app/evertrail/layout.tsx
function tokenFor(password: string) {
  return createHash("sha256").update("evertrail:" + password).digest("hex")
}

/**
 * Call at the top of every Evertrail page and every server action.
 * Sends anyone who is not logged in back to the login screen.
 */
export async function requireAuth() {
  if (!(await isLoggedIn())) redirect("/evertrail")
}

/** True when the visitor has the Evertrail login cookie. */
export async function isLoggedIn(): Promise<boolean> {
  const password = process.env.EVERTRAIL_PASSWORD
  const jar = await cookies()
  return !!password && jar.get("evertrail_auth")?.value === tokenFor(password)
}
