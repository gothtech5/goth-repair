import { STATUS_STYLE, type TicketStatus } from "@/lib/evertrail/ticket-info"

/** A small coloured pill showing a repair ticket's status. */
export function StatusBadge({ status }: { status: string | null }) {
  const style = STATUS_STYLE[(status ?? "") as TicketStatus] ?? STATUS_STYLE.Received
  return (
    <span className={"inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold " + style}>
      {status}
    </span>
  )
}
