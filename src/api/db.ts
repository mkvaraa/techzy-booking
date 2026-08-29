import type { Booking, Employee, Room } from "@/types"
import { addDays, formatISO } from "date-fns"
import { weekStart, withTime } from "@/lib/date"

import employeesSeed from "@/data/employees.json"
import roomsSeed from "@/data/rooms.json"
import bookingsSeed from "@/data/bookings.json"

/**
 * Shape of a booking as stored in the seed JSON. Booking times are expressed
 * relative to the current week so the demo data always stays relevant.
 */
interface BookingSeed {
  id: string
  roomId: string
  title: string
  description?: string
  organizerId: string
  attendeeIds: string[]
  dayOffset: number
  startTime: string
  endTime: string
  status: Booking["status"]
}

const STORAGE_KEYS = {
  rooms: "techzy:rooms",
  employees: "techzy:employees",
  bookings: "techzy:bookings",
  version: "techzy:schema-version",
} as const

// Bump to force a re-seed when the seed data shape changes.
const SCHEMA_VERSION = "1"

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage
}

function materializeBookings(seed: BookingSeed[]): Booking[] {
  const monday = weekStart(new Date())
  const now = formatISO(new Date())

  return seed.map((item) => {
    const day = addDays(monday, item.dayOffset)
    const start = withTime(day, item.startTime)
    const end = withTime(day, item.endTime)

    return {
      id: item.id,
      roomId: item.roomId,
      title: item.title,
      description: item.description,
      organizerId: item.organizerId,
      attendeeIds: item.attendeeIds,
      start: formatISO(start),
      end: formatISO(end),
      status: item.status,
      createdAt: now,
      updatedAt: now,
    }
  })
}

function seed(): void {
  if (!isBrowser()) return

  localStorage.setItem(STORAGE_KEYS.rooms, JSON.stringify(roomsSeed))
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employeesSeed))
  localStorage.setItem(
    STORAGE_KEYS.bookings,
    JSON.stringify(materializeBookings(bookingsSeed as BookingSeed[]))
  )
  localStorage.setItem(STORAGE_KEYS.version, SCHEMA_VERSION)
}

/**
 * Ensures the local "database" is seeded. Called once before the app renders.
 * Re-seeds when data is missing or the schema version changed.
 */
export function ensureSeeded(): void {
  if (!isBrowser()) return

  const version = localStorage.getItem(STORAGE_KEYS.version)
  const hasData = localStorage.getItem(STORAGE_KEYS.rooms) !== null

  if (version !== SCHEMA_VERSION || !hasData) {
    seed()
  }
}

// Wipes all app data and re-seeds from the JSON files.
export function resetData(): void {
  seed()
}

function read<T>(key: string): T[] {
  if (!isBrowser()) return []
  const raw = localStorage.getItem(key)
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function write<T>(key: string, value: T[]): void {
  if (!isBrowser()) return
  localStorage.setItem(key, JSON.stringify(value))
}

export const db = {
  getRooms: () => read<Room>(STORAGE_KEYS.rooms),
  setRooms: (rooms: Room[]) => write(STORAGE_KEYS.rooms, rooms),
  getEmployees: () => read<Employee>(STORAGE_KEYS.employees),
  setEmployees: (employees: Employee[]) =>
    write(STORAGE_KEYS.employees, employees),
  getBookings: () => read<Booking>(STORAGE_KEYS.bookings),
  setBookings: (bookings: Booking[]) => write(STORAGE_KEYS.bookings, bookings),
}
