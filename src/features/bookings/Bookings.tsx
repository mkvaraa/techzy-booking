import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TicketIcon } from "lucide-react"
import type { Booking } from "@/types"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBookings } from "@/hooks/useBookings"
import { useRooms } from "@/hooks/useRooms"
import { useEmployees } from "@/hooks/useEmployees"
import { useRoomMap, useEmployeeMap } from "@/hooks/useLookups"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useOpenBooking } from "@/hooks/useOpenBooking"
import { useBookingDialogStore } from "@/store/bookingDialogStore"
import { formatDay, formatTimeRange, toDate } from "@/lib/date"
import {
  BookingsFilters,
  type BookingFilters,
} from "@/features/bookings/BookingsFilters"
import { BookingStatusBadge } from "@/features/bookings/BookingStatusBadge"
import { BookingRowActions } from "@/features/bookings/BookingRowActions"
import { cn } from "@/lib/utils"

type SortField = "start" | "title" | "room"
type SortDir = "asc" | "desc"

function SortHeader({
  field,
  label,
  sortField,
  sortDir,
  onToggle,
}: {
  field: SortField
  label: string
  sortField: SortField
  sortDir: SortDir
  onToggle: (field: SortField) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className="inline-flex items-center gap-1 hover:text-foreground"
    >
      {label}
      {sortField === field ? (
        sortDir === "asc" ? (
          <ArrowUpIcon className="size-3.5" />
        ) : (
          <ArrowDownIcon className="size-3.5" />
        )
      ) : null}
    </button>
  )
}

function matchesFilters(
  booking: Booking,
  filters: BookingFilters,
  roomName: string,
  currentUserId: string,
  now: Date
): boolean {
  if (filters.q) {
    const haystack =
      `${booking.title} ${booking.description ?? ""} ${roomName}`.toLowerCase()
    if (!haystack.includes(filters.q.toLowerCase())) return false
  }
  if (filters.room && booking.roomId !== filters.room) return false
  if (filters.organizer && booking.organizerId !== filters.organizer) {
    return false
  }
  if (filters.status && booking.status !== filters.status) return false

  const scope = filters.scope || "upcoming"
  const isPast = toDate(booking.end) < now
  if (scope === "upcoming" && isPast) return false
  if (scope === "past" && !isPast) return false

  if (filters.mine) {
    const involved =
      booking.organizerId === currentUserId ||
      booking.attendeeIds.includes(currentUserId)
    if (!involved) return false
  }
  return true
}

export function Bookings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: bookings, isLoading } = useBookings()
  const { data: rooms } = useRooms()
  const { data: employees } = useEmployees()
  const roomMap = useRoomMap()
  const employeeMap = useEmployeeMap()
  const { currentUserId } = useCurrentUser()
  const openBooking = useOpenBooking()
  const openCreate = useBookingDialogStore((s) => s.openCreate)

  const filters: BookingFilters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      room: searchParams.get("room") ?? "",
      organizer: searchParams.get("organizer") ?? "",
      status: searchParams.get("status") ?? "",
      scope: searchParams.get("scope") ?? "",
      mine: searchParams.get("mine") === "1",
    }),
    [searchParams]
  )

  const sortField = (searchParams.get("sort") as SortField) || "start"
  const sortDir = (searchParams.get("dir") as SortDir) || "asc"

  const updateFilters = (patch: Partial<BookingFilters>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(patch)) {
          if (key === "mine") {
            if (value) next.set("mine", "1")
            else next.delete("mine")
            continue
          }
          if (!value) next.delete(key)
          else next.set(key, String(value))
        }
        return next
      },
      { replace: true }
    )
  }

  const clearFilters = () =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams()
        const sort = prev.get("sort")
        const dir = prev.get("dir")
        if (sort) next.set("sort", sort)
        if (dir) next.set("dir", dir)
        return next
      },
      { replace: true }
    )

  const toggleSort = (field: SortField) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const currentField = next.get("sort") || "start"
        const currentDir = next.get("dir") || "asc"
        if (currentField === field) {
          next.set("dir", currentDir === "asc" ? "desc" : "asc")
        } else {
          next.set("sort", field)
          next.set("dir", "asc")
        }
        return next
      },
      { replace: true }
    )
  }

  const filtered = useMemo(() => {
    const now = new Date()

    const list = (bookings ?? []).filter((booking) =>
      matchesFilters(
        booking,
        filters,
        roomMap.get(booking.roomId)?.name ?? "",
        currentUserId,
        now
      )
    )

    const compare = (a: Booking, b: Booking): number => {
      if (sortField === "start") {
        return toDate(a.start).getTime() - toDate(b.start).getTime()
      }
      if (sortField === "title") {
        return a.title.localeCompare(b.title)
      }
      return (roomMap.get(a.roomId)?.name ?? "").localeCompare(
        roomMap.get(b.roomId)?.name ?? ""
      )
    }

    const sorted = [...list].sort((a, b) => {
      const result = compare(a, b)
      return sortDir === "asc" ? result : -result
    })
    return sorted
  }, [bookings, filters, roomMap, currentUserId, sortField, sortDir])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Search, filter and manage meeting bookings."
        actions={
          <Button onClick={() => openCreate()}>
            <PlusIcon />
            New booking
          </Button>
        }
      />

      <BookingsFilters
        filters={filters}
        rooms={rooms ?? []}
        employees={employees ?? []}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No bookings found"
          description="Adjust your filters or create a new booking to get started."
          action={
            <Button onClick={() => openCreate()}>
              <PlusIcon />
              New booking
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader
                    field="title"
                    label="Meeting"
                    sortField={sortField}
                    sortDir={sortDir}
                    onToggle={toggleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortHeader
                    field="room"
                    label="Room"
                    sortField={sortField}
                    sortDir={sortDir}
                    onToggle={toggleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortHeader
                    field="start"
                    label="Date & time"
                    sortField={sortField}
                    sortDir={sortDir}
                    onToggle={toggleSort}
                  />
                </TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => {
                const room = roomMap.get(booking.roomId)
                const organizer = employeeMap.get(booking.organizerId)
                return (
                  <TableRow
                    key={booking.id}
                    onClick={() => openBooking(booking.id)}
                    className={cn(
                      "cursor-pointer",
                      booking.status === "cancelled" && "opacity-60"
                    )}
                  >
                    <TableCell className="font-medium">
                      {booking.title}
                    </TableCell>
                    <TableCell>{room?.name ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDay(booking.start)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeRange(booking.start, booking.end)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{organizer?.name ?? "-"}</TableCell>
                    <TableCell>
                      <BookingStatusBadge booking={booking} />
                    </TableCell>
                    <TableCell>
                      <BookingRowActions booking={booking} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
