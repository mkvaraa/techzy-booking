import { formatTimeRange, toDate } from "@/lib/date"
import type { Booking } from "@/types"
import { format } from "date-fns"

export function BookingRow({
  booking,
  roomName,
  organizerName,
  showDate,
  onClick,
}: {
  booking: Booking
  roomName?: string
  organizerName: string
  showDate?: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-muted/50"
      >
        <div className="w-24 shrink-0 text-sm font-medium tabular-nums">
          {showDate ? (
            <span className="flex flex-col">
              <span>{format(toDate(booking.start), "MMM d")}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {format(toDate(booking.start), "HH:mm")}
              </span>
            </span>
          ) : (
            formatTimeRange(booking.start, booking.end)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{booking.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {roomName ?? "Unknown room"} · {organizerName}
          </p>
        </div>
      </button>
    </li>
  )
}
