import type { Category } from "@/lib/evertrail/categories"
import { inputClass } from "@/components/evertrail/shell"

/** Drop-down list of categories. "None" is always the first choice. */
export function CategorySelect({
  name,
  categories,
  selected,
  exclude,
}: {
  name: string
  categories: Category[]
  selected?: string | null
  exclude?: Set<string>
}) {
  return (
    <select name={name} defaultValue={selected ?? ""} className={inputClass}>
      <option value="">None</option>
      {categories
        .filter((c) => !exclude?.has(c.id))
        .map((c) => (
          <option key={c.id} value={c.id}>
            {c.path}
          </option>
        ))}
    </select>
  )
}
