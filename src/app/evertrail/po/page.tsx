import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { one, text, type Search } from "@/lib/evertrail/format"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"

export const dynamic = "force-dynamic"

async function createOrder(formData: FormData) {
  "use server"
  await requireAuth()

  const vendor = text(formData.get("vendor"))
  let target = ""
  if (!vendor) {
    target = "/evertrail/po?err=" + encodeURIComponent("Vendor name is required.")
  } else {
    try {
      const rows = await sql(`insert into purchase_orders (vendor) values ($1) returning id`, [vendor])
      target = `/evertrail/po/${rows[0].id}`
    } catch (e) {
      target = "/evertrail/po?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function PurchaseOrdersPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams

  let error = one(params.err)
  let orders: Awaited<ReturnType<typeof sql>> = []
  try {
    orders = await sql(
      `select po.id, po.vendor, po.status, to_char(po.created_at, 'Mon DD, YYYY') as created,
              coalesce(sum(i.qty_ordered), 0) as ordered,
              coalesce(sum(i.qty_received), 0) as received
         from purchase_orders po
         left join purchase_order_items i on i.po_id = po.id
        group by po.id
        order by po.id desc
        limit 300`
    )
  } catch (e) {
    error = "Could not load purchase orders: " + friendlyError(e)
  }

  return (
    <Shell title="Purchase orders" error={error} notice={one(params.ok)}>
      <section className="mb-8 rounded-lg border border-neutral-300 p-4">
        <h2 className="mb-3 text-lg font-semibold">Start a new purchase order</h2>
        <form action={createOrder} className="flex flex-wrap items-end gap-3">
          <div className="min-w-64 flex-1">
            <Field label="Vendor (who you are ordering from)">
              <input name="vendor" required className={inputClass} placeholder="MobileSentrix" />
            </Field>
          </div>
          <button type="submit" className={buttonClass}>
            Create purchase order
          </button>
        </form>
      </section>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-400 text-left">
            <th className="py-2 pr-3">PO #</th>
            <th className="py-2 pr-3">Vendor</th>
            <th className="py-2 pr-3">Created</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3 text-right">Received / ordered</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((po) => (
            <tr key={po.id} className="border-b border-neutral-200">
              <td className="py-2 pr-3 font-mono">{po.id}</td>
              <td className="py-2 pr-3">{po.vendor}</td>
              <td className="py-2 pr-3">{po.created}</td>
              <td className="py-2 pr-3">{po.status}</td>
              <td className="py-2 pr-3 text-right">
                {po.received} / {po.ordered}
              </td>
              <td className="py-2">
                <Link href={`/evertrail/po/${po.id}`} className={linkClass}>
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 ? <p className="py-6 text-sm text-neutral-600">No purchase orders yet.</p> : null}
    </Shell>
  )
}
