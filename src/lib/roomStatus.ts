import type { Booking } from "@/types"
import { toDate } from "@/lib/date"

export interface RoomStatus {
  isBusy: boolean
  // Booking happening right now, if any
  current?: Booking
  // Next upcoming booking today/after now, if any
  next?: Booking
}

export function getRoomStatus(
  bookings: Booking[],
  roomId: string,
  now: Date = new Date()
): RoomStatus {
  const roomBookings = bookings
    .filter((b) => b.roomId === roomId && b.status === "confirmed")
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())

  const current = roomBookings.find(
    (b) => toDate(b.start) <= now && toDate(b.end) > now
  )
  const next = roomBookings.find((b) => toDate(b.start) > now)

  return { isBusy: Boolean(current), current, next }
}
