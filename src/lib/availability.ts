import type { Booking } from "@/types"
import { intervalsOverlap, toDate } from "@/lib/date"

export interface AvailabilityQuery {
  roomId: string
  start: Date
  end: Date
  // Booking id to ignore (used when editing an existing booking).
  ignoreBookingId?: string
}

/**
 * Returns confirmed bookings in the same room that overlap the given interval.
 * Cancelled bookings never count as conflicts.
 */
export function findConflicts(
  bookings: Booking[],
  query: AvailabilityQuery
): Booking[] {
  return bookings.filter((booking) => {
    if (booking.status === "cancelled") return false
    if (booking.roomId !== query.roomId) return false
    if (booking.id === query.ignoreBookingId) return false

    return intervalsOverlap(
      query.start,
      query.end,
      toDate(booking.start),
      toDate(booking.end)
    )
  })
}

export function isRoomAvailable(
  bookings: Booking[],
  query: AvailabilityQuery
): boolean {
  return findConflicts(bookings, query).length === 0
}
