"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"

export type CleanupItem = {
  id: string
  name: string
  skus: string
  price: string
  archived: boolean
  variations: number
}

const redButton =
  "rounded-md bg-red-600 px-5 py-3 text-base font-semibold text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-40"

function YesDelete({ count }: { count: number }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={redButton + " flex-1 sm:flex-none"}>
      {pending ? "Deleting..." : `Yes, delete ${count}`}
    </button>
  )
}

/** Square items with a tick box each (none ticked), and a delete button that asks first. */
export function SquareCleanupList({
  items,
  action,
}: {
  items: CleanupItem[]
  action: (formData: FormData) => Promise<void>
}) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set())
  const [asking, setAsking] = useState(false)

  function toggle(id: string, on: boolean) {
    setPicked((old) => {
      const next = new Set(old)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
    setAsking(false)
  }

  const count = picked.size

  return (
    <form action={action}>
      <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-300">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 px-3 py-3">
              <input
                type="checkbox"
                name="item_id"
                value={item.id}
                checked={picked.has(item.id)}
                onChange={(e) => toggle(item.id, e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">
                  {item.name}
                  {item.archived ? <span className="ml-2 text-xs text-neutral-600">(archived in Square)</span> : null}
                </span>
                <span className="block text-sm text-neutral-700">
                  SKU <span className="font-mono">{item.skus || "none"}</span> · {item.price}
                  {item.variations > 1 ? ` · ${item.variations} variations` : ""}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 mt-4 border-t border-neutral-200 bg-white py-3">
        {asking && count > 0 ? (
          <div role="alertdialog" aria-labelledby="cleanup-question" className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
            <p id="cleanup-question" className="text-base font-semibold text-red-900">
              Are you sure? This deletes {count} item{count === 1 ? "" : "s"} from your Square item list.
            </p>
            <p className="mt-1 text-sm text-red-900">Past Square sales and payments are not changed.</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setAsking(false)}
                className="flex-1 rounded-md border border-neutral-400 bg-white px-5 py-3 text-base font-semibold text-black hover:bg-neutral-100 sm:flex-none"
              >
                Cancel
              </button>
              <YesDelete count={count} />
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={count === 0}
            onClick={() => setAsking(true)}
            className={redButton + " w-full sm:w-auto"}
          >
            Delete selected from Square{count ? ` (${count})` : ""}
          </button>
        )}
      </div>
    </form>
  )
}
