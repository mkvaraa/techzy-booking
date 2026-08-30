import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking, Employee, Room } from "@/types"
import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router"
import { BookingRow } from "./BookingRow"

type TodayScheduleProps = {
  bookings: Booking[]
  roomMap: Map<string, Room>
  employeeMap: Map<string, Employee>
  onOpenBooking: (bookingId: string) => void
}

export function TodaySchedule({
  bookings,
  roomMap,
  employeeMap,
  onOpenBooking,
}: TodayScheduleProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Today's schedule</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/calendar">
            Open calendar
            <ArrowRightIcon />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No meetings scheduled for today.
          </p>
        ) : (
          <ul className="divide-y">
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                roomName={roomMap.get(booking.roomId)?.name}
                organizerName={employeeMap.get(booking.organizerId)?.name ?? ""}
                onClick={() => onOpenBooking(booking.id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
