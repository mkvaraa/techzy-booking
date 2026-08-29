import type { Booking, CreateBookingInput, UpdateBookingInput } from "@/types"
import { db } from "@/api/db"
import { ApiError, delay, generateId } from "@/api/client"
import { findConflicts } from "@/lib/availability"
import { toDate } from "@/lib/date"
import { formatISO } from "date-fns"

export function fetchBookings(): Promise<Booking[]> {
  return delay(db.getBookings())
}

export function fetchBooking(id: string): Promise<Booking> {
  const booking = db.getBookings().find((b) => b.id === id)
  if (!booking) {
    throw new ApiError(`Booking ${id} not found`, 404)
  }
  return delay(booking)
}

function assertValidRange(start: Date, end: Date): void {
  if (!(start < end)) {
    throw new ApiError("Booking end time must be after the start time.")
  }
}

function assertNoConflicts(
  bookings: Booking[],
  roomId: string,
  start: Date,
  end: Date,
  ignoreBookingId?: string
): void {
  const conflicts = findConflicts(bookings, {
    roomId,
    start,
    end,
    ignoreBookingId,
  })
  if (conflicts.length > 0) {
    throw new ApiError(
      `This room is already booked during the selected time ("${conflicts[0].title}").`,
      409
    )
  }
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  const bookings = db.getBookings()
  const start = toDate(input.start)
  const end = toDate(input.end)

  assertValidRange(start, end)
  assertNoConflicts(bookings, input.roomId, start, end)

  const now = formatISO(new Date())
  const booking: Booking = {
    id: generateId("bk"),
    roomId: input.roomId,
    title: input.title,
    description: input.description,
    organizerId: input.organizerId,
    attendeeIds: input.attendeeIds,
    start: input.start,
    end: input.end,
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  }

  db.setBookings([...bookings, booking])
  return delay(booking)
}

export function updateBooking(
  id: string,
  input: UpdateBookingInput
): Promise<Booking> {
  const bookings = db.getBookings()
  const index = bookings.findIndex((b) => b.id === id)
  if (index === -1) {
    throw new ApiError(`Booking ${id} not found`, 404)
  }

  const current = bookings[index]
  const next: Booking = {
    ...current,
    ...input,
    updatedAt: formatISO(new Date()),
  }

  const start = toDate(next.start)
  const end = toDate(next.end)

  if (next.status !== "cancelled") {
    assertValidRange(start, end)
    assertNoConflicts(bookings, next.roomId, start, end, id)
  }

  const updated = [...bookings]
  updated[index] = next
  db.setBookings(updated)
  return delay(next)
}

export function cancelBooking(id: string): Promise<Booking> {
  return updateBooking(id, { status: "cancelled" })
}
