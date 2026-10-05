import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { loadCategories, pickedCategory, selfAndDescendants, type Category } from "@/lib/evertrail/categories"
import { one, text, toInt, type Search } from "@/lib/evertrail/format"
import { Shell, Field, inputClass, buttonClass, smallButtonClass, linkClass } from "@/components/evertrail/shell"
import { CategorySelect } from "@/components/evertrail/category-select"

export const dynamic = "force-dynamic"

async function saveCategory(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  const name = text(formData.get("name"))
  const parentId = pickedCategory(formData.get("parent_id"))
  let target = `/evertrail/categories/${id}`
  if (!name) {
    target += "?err=" + encodeURIComponent("Category name is required.")
  } else {
    try {
      // A category cannot be placed under itself or under one of its own sub-categories.
      const all = await loadCategories()
      const blocked = selfAndDescendants(all, String(id))
      if (parentId !== null && blocked.has(String(parentId))) {
        target += "?err=" + encodeURIComponent("A category cannot be placed inside itself or one of its own sub-categories.")
      } else {
        const same = await sql(
          `select id from categories
            where lower(name) = lower($1) and parent_id is not distinct from $2::int and id <> $3
            limit 1`,
          [name, parentId, id]
        )
        if (same.length) {
          target += "?err=" + encodeURIComponent(`A category named "${name}" already exists there.`)
        } else {
          await sql(`update categories set name = $2, parent_id = $3::int where id = $1`, [id, name, parentId])
          target = "/evertrail/categories?ok=" + encodeURIComponent(`Saved "${name}".`)
        }
      }
    } catch (e) {
      target += "?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

async function deleteCategory(formData: FormData) {
  "use server"
  await requireAuth()

  const id = toInt(formData.get("id"))
  let target = ""
  try {
    // Products in this category are kept (they just lose the category).
    // Sub-categories are kept too and move up to the top level.
    const gone = await sql(`delete from categories where id = $1 returning name`, [id])
    target =
      "/evertrail/categories?ok=" +
      encodeURIComponent(gone.length ? `Deleted "${gone[0].name}". Its products were kept.` : "That category was already gone.")
  } catch (e) {
    target = `/evertrail/categories/${id}?err=` + encodeURIComponent(friendlyError(e))
  }
  redirect(target)
}

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Search
}) {
  await requireAuth()
  const { id } = await params
  const query = await searchParams
  const confirming = one(query.confirm) === "delete"

  let error = one(query.err)
  let categories: Category[] = []
  let productCount = 0
  try {
    categories = await loadCategories()
    const rows = await sql(`select count(*) as n from products where category_id = $1`, [toInt(id, -1)])
    productCount = Number(rows[0]?.n ?? 0)
  } catch (e) {
    error = "Could not load the category: " + friendlyError(e)
  }
  const category = categories.find((c) => c.id === id)

  if (!category) {
    return (
      <Shell title="Category not found" error={error}>
        <Link href="/evertrail/categories" className={linkClass}>
          Back to categories
        </Link>
      </Shell>
    )
  }

  const blocked = selfAndDescendants(categories, category.id)
  const subCount = blocked.size - 1

  return (
    <Shell title={`Category: ${category.name}`} error={error}>
      <form action={saveCategory} className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={category.id} />
        <Field label="Name">
          <input name="name" required defaultValue={category.name} className={inputClass} />
        </Field>
        <Field label="Parent category">
          <CategorySelect name="parent_id" categories={categories} selected={category.parentId} exclude={blocked} />
        </Field>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" className={buttonClass}>
            Save
          </button>
          <Link href="/evertrail/categories" className={linkClass}>
            Cancel
          </Link>
        </div>
      </form>

      <section className="mt-8 max-w-2xl rounded-lg border border-red-300 p-4">
        <h2 className="mb-2 text-lg font-semibold">Delete this category</h2>
        <p className="mb-3 text-sm text-neutral-700">
          {productCount} product{productCount === 1 ? "" : "s"} and {subCount} sub-categor{subCount === 1 ? "y" : "ies"}{" "}
          use it. Deleting the category never deletes products or stock: those products simply have no category
          afterwards, and sub-categories move to the top level.
        </p>
        {confirming ? (
          <form action={deleteCategory} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={category.id} />
            <span className="text-sm font-semibold">Delete &quot;{category.name}&quot; for good?</span>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Yes, delete it
            </button>
            <Link href={`/evertrail/categories/${category.id}`} className={linkClass}>
              No, keep it
            </Link>
          </form>
        ) : (
          <Link href={`/evertrail/categories/${category.id}?confirm=delete`} className={smallButtonClass}>
            Delete category
          </Link>
        )}
      </section>
    </Shell>
  )
}
