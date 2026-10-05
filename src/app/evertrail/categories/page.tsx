import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/evertrail/auth"
import { sql, friendlyError } from "@/lib/evertrail/db"
import { loadCategories, pickedCategory, type Category } from "@/lib/evertrail/categories"
import { one, text, type Search } from "@/lib/evertrail/format"
import { Shell, Field, inputClass, buttonClass, linkClass } from "@/components/evertrail/shell"
import { CategorySelect } from "@/components/evertrail/category-select"

export const dynamic = "force-dynamic"

async function createCategory(formData: FormData) {
  "use server"
  await requireAuth()

  const name = text(formData.get("name"))
  const parentId = pickedCategory(formData.get("parent_id"))
  let target = ""
  if (!name) {
    target = "/evertrail/categories?err=" + encodeURIComponent("Category name is required.")
  } else {
    try {
      const same = await sql(
        `select id from categories
          where lower(name) = lower($1) and parent_id is not distinct from $2::int
          limit 1`,
        [name, parentId]
      )
      if (same.length) {
        target = "/evertrail/categories?err=" + encodeURIComponent(`A category named "${name}" already exists there.`)
      } else {
        await sql(`insert into categories (name, parent_id) values ($1, $2::int)`, [name, parentId])
        target = "/evertrail/categories?ok=" + encodeURIComponent(`Created "${name}".`)
      }
    } catch (e) {
      target = "/evertrail/categories?err=" + encodeURIComponent(friendlyError(e))
    }
  }
  redirect(target)
}

export default async function CategoriesPage({ searchParams }: { searchParams: Search }) {
  await requireAuth()
  const params = await searchParams

  let error = one(params.err)
  let categories: Category[] = []
  const counts = new Map<string, string>()
  try {
    categories = await loadCategories()
    const rows = await sql(
      `select category_id, count(*) as n from products where category_id is not null group by category_id`
    )
    for (const r of rows) counts.set(r.category_id ?? "", r.n ?? "0")
  } catch (e) {
    error = "Could not load categories: " + friendlyError(e)
  }

  return (
    <Shell title="Categories" error={error} notice={one(params.ok)}>
      <p className="mb-4 text-sm">
        <Link href="/evertrail/products" className={linkClass}>
          Back to products
        </Link>
      </p>

      <section className="mb-8 rounded-lg border border-neutral-300 p-4">
        <h2 className="mb-3 text-lg font-semibold">Create a category</h2>
        <form action={createCategory} className="grid gap-3 sm:grid-cols-3">
          <Field label="Name (required)">
            <input name="name" required className={inputClass} placeholder="Screens" />
          </Field>
          <Field label="Parent category (optional)">
            <CategorySelect name="parent_id" categories={categories} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={buttonClass}>
              Create category
            </button>
          </div>
        </form>
      </section>

      <h2 className="mb-2 text-lg font-semibold">All categories</h2>
      <p className="mb-2 text-sm text-neutral-700">Tap a category to edit or delete it.</p>
      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-300">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/evertrail/categories/${c.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-50"
              style={{ paddingLeft: 16 + c.depth * 24 }}
            >
              <span className="font-medium">{c.name}</span>
              <span className="text-sm text-neutral-600">
                {counts.get(c.id) ?? "0"} product{(counts.get(c.id) ?? "0") === "1" ? "" : "s"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {categories.length === 0 ? (
        <p className="py-6 text-sm text-neutral-600">No categories yet. Create your first one above.</p>
      ) : null}
    </Shell>
  )
}
