import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router"

import type { Booking, Employee, Room } from "@/types"
import { BookingRow } from "./BookingRow"

type MyUpcomingBookingsProps = {
  bookings: Booking[]
  roomMap: Map<string, Room>
  employeeMap: Map<string, Employee>
  onOpenBooking: (bookingId: string) => void
}

export default function MyUpcomingBookings({
  bookings,
  roomMap,
  employeeMap,
  onOpenBooking,
}: MyUpcomingBookingsProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>My upcoming bookings</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/bookings?mine=1">
            View all
            <ArrowRightIcon />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You have no upcoming meetings.
          </p>
        ) : (
          <ul className="divide-y">
            {bookings.slice(0, 5).map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                roomName={roomMap.get(booking.roomId)?.name}
                organizerName={employeeMap.get(booking.organizerId)?.name ?? ""}
                showDate
                onClick={() => onOpenBooking(booking.id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
