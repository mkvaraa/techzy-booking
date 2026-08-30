import { useMemo } from "react"
import { Link, useParams } from "react-router"
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useRoom } from "@/hooks/useRooms"
import { useBookings } from "@/hooks/useBookings"
import { useEmployeeMap } from "@/hooks/useLookups"
import { roomTypeLabel, AMENITIES } from "@/lib/constants"
import { AMENITY_ICONS } from "@/lib/amenityIcons"
import { getRoomStatus } from "@/lib/roomStatus"
import { formatDay, formatTimeRange, toDate } from "@/lib/date"
import { useBookingDialogStore } from "@/store/bookingDialogStore"

export function RoomDetails() {
  const { roomId } = useParams()
  const { data: room, isLoading, isError } = useRoom(roomId)
  const { data: bookings } = useBookings()
  const employeeMap = useEmployeeMap()
  const openCreate = useBookingDialogStore((s) => s.openCreate)

  const upcoming = useMemo(() => {
    const now = new Date()
    return (bookings ?? [])
      .filter(
        (b) =>
          b.roomId === roomId &&
          b.status === "confirmed" &&
          toDate(b.end) >= now
      )
      .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())
      .slice(0, 12)
  }, [bookings, roomId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !room) {
    return (
      <EmptyState
        title="Room not found"
        description="The room you are looking for does not exist."
        action={
          <Button asChild variant="outline">
            <Link to="/rooms">Back to rooms</Link>
          </Button>
        }
      />
    )
  }

  const status = getRoomStatus(bookings ?? [], room.id)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/rooms">
          <ArrowLeftIcon />
          Back to rooms
        </Link>
      </Button>

      <PageHeader
        title={room.name}
        description={`${roomTypeLabel(room.type)} · ${room.building}, Floor ${room.floor}`}
        actions={
          <Button
            disabled={!room.isActive}
            onClick={() => openCreate({ roomId: room.id })}
          >
            Book this room
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="aspect-video w-full object-cover"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this room</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {room.description}
              </p>
              <Separator />
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon className="size-4 text-muted-foreground" />
                  Capacity: {room.capacity}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-muted-foreground" />
                  {room.building} · Floor {room.floor}
                </span>
                <span>
                  {room.isActive ? (
                    status.isBusy ? (
                      <Badge variant="destructive">Busy now</Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-600 text-white"
                      >
                        Free now
                      </Badge>
                    )
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </span>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity]
                    return (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="gap-1.5"
                      >
                        <Icon className="size-3.5" />
                        {AMENITIES[amenity]}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              Upcoming bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming bookings. This room is wide open.
              </p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((booking) => {
                  const organizer = employeeMap.get(booking.organizerId)
                  return (
                    <li
                      key={booking.id}
                      className="flex flex-col gap-0.5 border-l-2 border-primary/40 pl-3"
                    >
                      <span className="text-sm font-medium">
                        {booking.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDay(booking.start)} ·{" "}
                        {formatTimeRange(booking.start, booking.end)}
                      </span>
                      {organizer ? (
                        <span className="text-xs text-muted-foreground">
                          {organizer.name}
                        </span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
