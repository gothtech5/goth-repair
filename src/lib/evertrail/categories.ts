import { sql } from "@/lib/evertrail/db"

export type Category = {
  id: string
  name: string
  parentId: string | null
  /** Full name including parents, for example "Screens > iPhone". */
  path: string
  /** 0 for a top-level category, 1 for its children, and so on. */
  depth: number
}

/** All categories, sorted so each one comes right after its parent. */
export async function loadCategories(): Promise<Category[]> {
  const rows = await sql(`select id, name, parent_id from categories order by lower(name), id`)
  const byId = new Map(rows.map((r) => [r.id ?? "", r]))
  const children = new Map<string, string[]>()
  for (const r of rows) {
    // A parent that no longer exists counts as "no parent".
    const parent = r.parent_id && byId.has(r.parent_id) ? r.parent_id : ""
    children.set(parent, [...(children.get(parent) ?? []), r.id ?? ""])
  }

  const out: Category[] = []
  const seen = new Set<string>()
  const walk = (parent: string, prefix: string, depth: number) => {
    for (const id of children.get(parent) ?? []) {
      if (seen.has(id)) continue
      seen.add(id)
      const row = byId.get(id)
      const name = row?.name ?? ""
      const path = prefix ? `${prefix} > ${name}` : name
      out.push({ id, name, parentId: parent || null, path, depth })
      walk(id, path, depth + 1)
    }
  }
  walk("", "", 0)
  return out
}

/** The category itself plus everything underneath it. A category cannot be moved under any of these. */
export function selfAndDescendants(categories: Category[], id: string): Set<string> {
  const blocked = new Set<string>([id])
  let grew = true
  while (grew) {
    grew = false
    for (const c of categories) {
      if (c.parentId && blocked.has(c.parentId) && !blocked.has(c.id)) {
        blocked.add(c.id)
        grew = true
      }
    }
  }
  return blocked
}

/** Reads a category picked in a form. Blank or "None" means no category. */
export function pickedCategory(input: FormDataEntryValue | null): number | null {
  const raw = String(input ?? "").trim()
  return /^\d+$/.test(raw) ? Number(raw) : null
}
