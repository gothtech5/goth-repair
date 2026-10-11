import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { friendlyError } from "@/lib/evertrail/db"
import { one, type Search } from "@/lib/evertrail/format"
import { ensureSquareSchema, squareSettings } from "@/lib/evertrail/square"
import { deleteLeftoverItems, findLeftoverItems, type LeftoverItem } from "@/lib/evertrail/square-delete"
import { Shell, linkClass } from "@/components/evertrail/shell"
import { SquareCleanupList } from "@/components/evertrail/square-cleanup-list"

export const dynamic = "force-dynamic"
// Reading the whole Square item list and deleting can take a while.
export const maxDuration = 90

const PAGE = "/evertrail/square/cleanup"

async function deleteSelected(formData: FormData) {
  "use server"
  await requireAuth()
  const ids = formData.getAll("item_id").map((v) => String(v).trim()).filter(Boolean)
  let target = PAGE
  if (!ids.length) {
    target += "?err=" + encodeURIComponent("Nothing was ticked, so nothing was deleted.")
  } else {
    try {
      const r = await deleteLeftoverItems(ids)
      let text = `Deleted ${r.deleted} item${r.deleted === 1 ? "" : "s"} from Square.`
      if (r.skipped) text += ` ${r.skipped} skipped because they now match an Evertrail product or were already gone.`
      if (r.failed) text += ` ${r.failed} could not be deleted; try again in a minute.`
      target += (r.failed ? "?err=" : "?ok=") + encodeURIComponent(text)
    } catch (e) {
      target += "?err=" + encodeURIComponent("Could not reach Square, nothing was deleted. " + friendlyError(e))
    }
  }
  redirect(target)
}

export default async function SquareCleanupPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams
  let error = one(params.err)
  let items: LeftoverItem[] = []
  let loaded = false

  if (!squareSettings().accessToken) {
    error = error || "Square is not connected: SQUARE_ACCESS_TOKEN is not set in Vercel for this site."
  } else {
    try {
      await ensureSquareSchema()
      items = await findLeftoverItems()
      loaded = true
    } catch (e) {
      error = "Could not read the Square item list: " + friendlyError(e)
    }
  }

  return (
    <Shell title="Square cleanup" error={error} notice={one(params.ok)}>
      <p className="mb-4 max-w-2xl text-sm text-neutral-700">
        Items in your Square item list that match no Evertrail product (no saved Square link, and no matching SKU or
        barcode). Nothing is deleted unless you tick it and confirm. Deleting removes the item from the Square
        terminal; past sales and payments in Square stay. Items you sell that are not in Evertrail on purpose (for
        example repair labor) will show here too: leave those unticked.{" "}
        <Link href="/evertrail/products" className={linkClass}>
          Back to products
        </Link>
      </p>

      {loaded && items.length === 0 ? (
        <p className="rounded-md border border-green-300 bg-green-50 px-3 py-4 text-sm text-green-800">
          Every Square item matches an Evertrail product. Nothing to clean up.
        </p>
      ) : null}
      {items.length ? (
        <>
          <p className="mb-2 text-sm font-medium">
            {items.length} Square item{items.length === 1 ? "" : "s"} with no matching Evertrail product:
          </p>
          <SquareCleanupList items={items} action={deleteSelected} />
        </>
      ) : null}
    </Shell>
  )
}
