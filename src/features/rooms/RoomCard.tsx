import { Link } from "react-router"
import { MapPinIcon, UsersIcon } from "lucide-react"
import type { Booking, Room } from "@/types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { roomTypeLabel } from "@/lib/constants"
import { AMENITY_ICONS } from "@/lib/amenityIcons"
import { AMENITIES } from "@/lib/constants"
import { getRoomStatus } from "@/lib/roomStatus"
import { useBookingDialogStore } from "@/store/bookingDialogStore"

interface RoomCardProps {
  room: Room
  bookings: Booking[]
}

export function RoomCard({ room, bookings }: RoomCardProps) {
  const openCreate = useBookingDialogStore((s) => s.openCreate)
  const status = getRoomStatus(bookings, room.id)

  return (
    <Card className="group/room gap-0 py-0">
      <Link to={`/rooms/${room.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={room.imageUrl}
            alt={room.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover/room:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge variant="secondary">{roomTypeLabel(room.type)}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            {!room.isActive ? (
              <Badge variant="destructive">Unavailable</Badge>
            ) : status.isBusy ? (
              <Badge variant="destructive">Busy now</Badge>
            ) : (
              <Badge variant="secondary" className="bg-emerald-600 text-white">
                Free now
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardHeader className="pt-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <Link to={`/rooms/${room.id}`} className="hover:underline">
            {room.name}
          </Link>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPinIcon className="size-3.5" />
            {room.building} · Floor {room.floor}
          </span>
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="size-3.5" />
            Up to {room.capacity}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 py-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {room.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity]
            return (
              <Tooltip key={amenity}>
                <TooltipTrigger asChild>
                  <span className="flex size-7 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                    <Icon className="size-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{AMENITIES[amenity]}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          size="sm"
          className="flex-1"
          disabled={!room.isActive}
          onClick={() => openCreate({ roomId: room.id })}
        >
          Book room
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/rooms/${room.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
