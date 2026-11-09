// Repair tickets: the table, the list of statuses, and reading the ticket form.
// Server-side only: never import this file from a "use client" component.
// (The statuses and shop details live in ticket-info.ts, which pages may share.)

import { sql, type Row } from "@/lib/evertrail/db"
import { dollars, text, toCents } from "@/lib/evertrail/format"
import { TICKET_STATUSES, type TicketStatus } from "@/lib/evertrail/ticket-info"

let schemaReady: Promise<void> | null = null

/**
 * Creates the repair_tickets table in the evertrail-db database, once.
 * Safe to run any number of times: it only adds what is missing and never changes or removes data.
 *
 * Each ticket gets its own number from a counter, like GT-01001, GT-01002, ...
 * The database makes sure no two tickets ever share a number.
 *
 * There is deliberately no column for a phone passcode.
 */
export function ensureTicketSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((error) => {
      schemaReady = null
      throw error
    })
  }
  return schemaReady
}

async function createSchema() {
  const statements = [
    `create sequence if not exists repair_ticket_number_seq start 1001`,
    `create table if not exists repair_tickets (
       id serial primary key,
       ticket_number text not null unique
         default ('GT-' || lpad(nextval('repair_ticket_number_seq')::text, 5, '0')),
       customer_name text not null,
       customer_phone text not null,
       device_brand text not null default '',
       device_model text not null default '',
       issue text not null default '',
       device_condition text not null default '',
       price_cents integer not null default 0,
       deposit_cents integer not null default 0,
       date_received date not null default current_date,
       estimated_completion date,
       status text not null default 'Received',
       technician_notes text not null default '',
       created_at timestamptz not null default now(),
       updated_at timestamptz not null default now()
     )`,
    `create index if not exists repair_tickets_created_idx on repair_tickets (created_at desc)`,
  ]
  for (const statement of statements) {
    try {
      await sql(statement)
    } catch (error) {
      // Two requests creating the same thing at the same moment: the other one won, which is fine.
      const message = error instanceof Error ? error.message : String(error)
      if (!/already exists|duplicate key/i.test(message)) throw error
    }
  }
}

/** What the ticket form sends, checked and ready to save. */
export type TicketInput = {
  customer_name: string
  customer_phone: string
  device_brand: string
  device_model: string
  issue: string
  device_condition: string
  price_cents: number
  deposit_cents: number
  date_received: string
  estimated_completion: string | null
  status: TicketStatus
  technician_notes: string
}

const DATE = /^\d{4}-\d{2}-\d{2}$/

/** Reads and checks the ticket form. Gives the ticket, or a message saying what to fix. */
export function readTicketForm(formData: FormData): { ticket: TicketInput; error: string } {
  const statusRaw = text(formData.get("status"))
  const status = (TICKET_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as TicketStatus)
    : "Received"
  const received = text(formData.get("date_received"))
  const estimate = text(formData.get("estimated_completion"))

  const ticket: TicketInput = {
    customer_name: text(formData.get("customer_name")),
    customer_phone: text(formData.get("customer_phone")),
    device_brand: text(formData.get("device_brand")),
    device_model: text(formData.get("device_model")),
    issue: text(formData.get("issue")),
    device_condition: text(formData.get("device_condition")),
    price_cents: toCents(formData.get("price")),
    deposit_cents: toCents(formData.get("deposit")),
    date_received: DATE.test(received) ? received : "",
    estimated_completion: DATE.test(estimate) ? estimate : null,
    status,
    technician_notes: text(formData.get("technician_notes")),
  }

  const phoneDigits = ticket.customer_phone.replace(/\D/g, "")
  let error = ""
  if (!ticket.customer_name) error = "Customer name is required."
  else if (phoneDigits.length < 7) error = "Enter the customer's phone number (at least 7 digits)."
  else if (!ticket.device_brand || !ticket.device_model) error = "Device brand and model are required."
  else if (!ticket.issue) error = "Describe the repair issue."
  else if (!ticket.date_received) error = "Enter the date received."
  else if (ticket.estimated_completion && ticket.estimated_completion < ticket.date_received)
    error = "Estimated completion can't be before the date received."
  else if (ticket.deposit_cents > ticket.price_cents)
    error = `Deposit can't be more than the estimated price ($${dollars(ticket.price_cents)}).`
  return { ticket, error }
}

/** The values in the order the insert and update statements below expect them ($1 ... $12). */
function values(t: TicketInput) {
  return [
    t.customer_name,
    t.customer_phone,
    t.device_brand,
    t.device_model,
    t.issue,
    t.device_condition,
    t.price_cents,
    t.deposit_cents,
    t.date_received,
    t.estimated_completion,
    t.status,
    t.technician_notes,
  ]
}

/** Saves a new ticket. Gives back its id and its new ticket number. */
export async function createTicket(t: TicketInput): Promise<{ id: string; ticket_number: string }> {
  await ensureTicketSchema()
  const rows = await sql(
    `insert into repair_tickets
            (customer_name, customer_phone, device_brand, device_model, issue, device_condition,
             price_cents, deposit_cents, date_received, estimated_completion, status, technician_notes)
     values ($1, $2, $3, $4, $5, $6, $7::int, $8::int, $9::date, $10::date, $11, $12)
     returning id, ticket_number`,
    values(t)
  )
  return { id: rows[0].id ?? "", ticket_number: rows[0].ticket_number ?? "" }
}

/** Saves changes to a ticket. Gives back its ticket number, or null if the ticket no longer exists. */
export async function updateTicket(id: number, t: TicketInput): Promise<string | null> {
  await ensureTicketSchema()
  const rows = await sql(
    `update repair_tickets
        set customer_name = $2, customer_phone = $3, device_brand = $4, device_model = $5, issue = $6,
            device_condition = $7, price_cents = $8::int, deposit_cents = $9::int, date_received = $10::date,
            estimated_completion = $11::date, status = $12, technician_notes = $13, updated_at = now()
      where id = $1
      returning ticket_number`,
    [id, ...values(t)]
  )
  return rows[0]?.ticket_number ?? null
}

/** One ticket by its id, or undefined. */
export async function loadTicket(id: string): Promise<Row | undefined> {
  if (!/^\d+$/.test(id)) return undefined
  await ensureTicketSchema()
  const rows = await sql(
    `select *,
            to_char(created_at at time zone 'America/Chicago', 'Mon FMDD, YYYY FMHH12:MI AM') as created_text,
            to_char(updated_at at time zone 'America/Chicago', 'Mon FMDD, YYYY FMHH12:MI AM') as updated_text
       from repair_tickets where id = $1`,
    [id]
  )
  return rows[0]
}

/**
 * Finds tickets by customer name, phone number or ticket number.
 * Phone and ticket numbers match on their digits, so "612-987-8107", "6129878107",
 * "GT-01001" and "1001" all work. Newest tickets first.
 */
export async function searchTickets(query: string, status: string): Promise<Row[]> {
  await ensureTicketSchema()
  const q = query.trim()
  const digits = q.replace(/\D/g, "")
  const statusFilter = (TICKET_STATUSES as readonly string[]).includes(status) ? status : ""
  return sql(
    `select * from repair_tickets
      where ($3::text = '' or status = $3::text)
        and ($1::text = ''
             or customer_name ilike '%' || $1::text || '%'
             or ticket_number ilike '%' || $1::text || '%'
             or ($2::text <> '' and regexp_replace(customer_phone, '[^0-9]', '', 'g') like '%' || $2::text || '%')
             or ($2::text <> '' and ltrim(regexp_replace(ticket_number, '[^0-9]', '', 'g'), '0') = ltrim($2::text, '0')))
      order by created_at desc
      limit 300`,
    [q, digits, statusFilter]
  )
}

/** "2026-11-08" -> "Nov 8, 2026". Blank stays blank. */
export function niceDate(value: string | null | undefined): string {
  if (!value || !DATE.test(value.slice(0, 10))) return ""
  const [y, m, d] = value.slice(0, 10).split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Today's date in Minneapolis, as "2026-11-08". */
export function todayInMinneapolis(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" })
}
