"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"

const redButton =
  "rounded-md bg-red-600 px-5 py-3 text-base font-semibold text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-60"

function ConfirmDelete() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={redButton + " flex-1 sm:flex-none"}>
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}

/** Red "Delete product" button that asks on the page before anything is deleted. */
export function DeleteProduct({
  id,
  name,
  action,
}: {
  id: string
  name: string
  action: (formData: FormData) => Promise<void>
}) {
  const [asking, setAsking] = useState(false)

  return (
    <section className="mt-12 max-w-2xl border-t-2 border-neutral-200 pt-6">
      {asking ? (
        <div role="alertdialog" aria-labelledby="delete-question" className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
          <p id="delete-question" className="text-base font-semibold text-red-900">
            Delete {name}? This cannot be undone.
          </p>
          <form action={action} className="mt-4 flex gap-3">
            <input type="hidden" name="id" value={id} />
            <button
              type="button"
              autoFocus
              onClick={() => setAsking(false)}
              className="flex-1 rounded-md border border-neutral-400 bg-white px-5 py-3 text-base font-semibold text-black hover:bg-neutral-100 sm:flex-none"
            >
              Cancel
            </button>
            <ConfirmDelete />
          </form>
        </div>
      ) : (
        <button type="button" onClick={() => setAsking(true)} className={redButton + " w-full sm:w-auto"}>
          Delete product
        </button>
      )}
    </section>
  )
}
