import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toDate } from "@/lib/date"
import type { RoomStatus } from "@/lib/roomStatus"
import type { Room } from "@/types"
import { format } from "date-fns"
import { Link } from "react-router"

type RoomAvailabilityProps = {
  roomStatuses: {
    room: Room
    status: RoomStatus
  }[]
}

export function RoomAvailability({ roomStatuses }: RoomAvailabilityProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Room availability</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {roomStatuses.map(({ room, status }) => (
            <li
              key={room.id}
              className="flex items-center justify-between gap-2"
            >
              <Link
                to={`/rooms/${room.id}`}
                className="text-sm font-medium hover:underline"
              >
                {room.name}
              </Link>
              {status.isBusy ? (
                <Badge variant="destructive">
                  Busy till {format(toDate(status.current!.end), "HH:mm")}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-emerald-600 text-white"
                >
                  {status.next
                    ? `Free till ${format(toDate(status.next.start), "HH:mm")}`
                    : "Free"}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
