import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { DoorClosedIcon } from "lucide-react"
import type { AmenityId, Room } from "@/types"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useRooms } from "@/hooks/useRooms"
import { useBookings } from "@/hooks/useBookings"
import { RoomCard } from "@/features/rooms/RoomCard"
import { RoomsFilters, type RoomFilters } from "@/features/rooms/RoomsFilters"

function matchesFilters(room: Room, filters: RoomFilters): boolean {
  if (filters.q) {
    const haystack =
      `${room.name} ${room.description} ${room.building}`.toLowerCase()
    if (!haystack.includes(filters.q.toLowerCase())) return false
  }
  if (filters.type && room.type !== filters.type) return false
  if (filters.building && room.building !== filters.building) return false
  if (filters.capacity && room.capacity < Number(filters.capacity)) return false
  if (filters.amenities.length > 0) {
    const hasAll = filters.amenities.every((a) => room.amenities.includes(a))
    if (!hasAll) return false
  }
  return true
}

export function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: rooms, isLoading } = useRooms()
  const { data: bookings } = useBookings()

  const filters: RoomFilters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      type: searchParams.get("type") ?? "",
      building: searchParams.get("building") ?? "",
      capacity: searchParams.get("capacity") ?? "",
      amenities: (searchParams.get("amenities")?.split(",").filter(Boolean) ??
        []) as AmenityId[],
    }),
    [searchParams]
  )

  const updateFilters = (patch: Partial<RoomFilters>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(patch)) {
          const serialized = Array.isArray(value) ? value.join(",") : value
          if (!serialized) {
            next.delete(key)
          } else {
            next.set(key, serialized)
          }
        }
        return next
      },
      { replace: true }
    )
  }

  const clearFilters = () => setSearchParams({}, { replace: true })

  const buildings = useMemo(
    () => Array.from(new Set((rooms ?? []).map((r) => r.building))).sort(),
    [rooms]
  )

  const filteredRooms = useMemo(
    () => (rooms ?? []).filter((room) => matchesFilters(room, filters)),
    [rooms, filters]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms"
        description="Browse and filter the company's meeting rooms."
      />

      <RoomsFilters
        filters={filters}
        buildings={buildings}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          icon={DoorClosedIcon}
          title="No rooms found"
          description="Try adjusting your search or filters to find an available room."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {filteredRooms.length} room{filteredRooms.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} bookings={bookings ?? []} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
