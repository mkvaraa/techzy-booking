import type { Booking } from "@/types"
import { Badge } from "@/components/ui/badge"
import { toDate } from "@/lib/date"

export function BookingStatusBadge({ booking }: { booking: Booking }) {
  if (booking.status === "cancelled") {
    return <Badge variant="destructive">Cancelled</Badge>
  }
  if (toDate(booking.end) < new Date()) {
    return <Badge variant="secondary">Past</Badge>
  }
  return (
    <Badge variant="secondary" className="bg-emerald-600 text-white">
      Confirmed
    </Badge>
  )
}
