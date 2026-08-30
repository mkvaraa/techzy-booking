import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/hooks/useBookings"
import { useRooms } from "@/hooks/useRooms"
import { useRoomMap, useEmployeeMap } from "@/hooks/useLookups"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useOpenBooking } from "@/hooks/useOpenBooking"
import { useBookingDialogStore } from "@/store/bookingDialogStore"
import { getRoomStatus } from "@/lib/roomStatus"
import { dayEnd, dayStart, toDate } from "@/lib/date"
import { format } from "date-fns"
import DashboardStats from "./DashboardStats"
import TodaySchedule from "./TodaySchedule"
import RoomAvailability from "./RoomAvailability"
import MyUpcomingBookings from "./MyUpcomingBookings"
import { PlusIcon } from "lucide-react"
import DashboardSkeleton from "./DashboardSkeleton"

export default function DashboardPage() {
  const { data: bookings, isLoading } = useBookings()
  const { data: rooms } = useRooms()
  const roomMap = useRoomMap()
  const employeeMap = useEmployeeMap()
  const { currentUserId, currentUser } = useCurrentUser()
  const openBooking = useOpenBooking()
  const openCreate = useBookingDialogStore((s) => s.openCreate)

  const now = new Date()

  const activeRooms = (rooms ?? []).filter((room) => room.isActive)

  const roomStatuses = activeRooms.map((room) => ({
    room,
    status: getRoomStatus(bookings ?? [], room.id, now),
  }))

  const availableNow = roomStatuses.filter((room) => !room.status.isBusy).length

  const start = dayStart(now)
  const end = dayEnd(now)

  const todaysBookings = (bookings ?? [])
    .filter(
      (booking) =>
        booking.status === "confirmed" &&
        toDate(booking.start) >= start &&
        toDate(booking.start) <= end
    )
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())

  const myUpcoming = (bookings ?? [])
    .filter(
      (booking) =>
        booking.status === "confirmed" &&
        toDate(booking.end) >= now &&
        (booking.organizerId === currentUserId ||
          booking.attendeeIds.includes(currentUserId))
    )
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome${currentUser ? `, ${currentUser.name.split(" ")[0]}` : ""}`}
        description={format(now, "EEEE, MMMM d, yyyy")}
        actions={
          <Button onClick={() => openCreate()}>
            <PlusIcon />
            New booking
          </Button>
        }
      />

      <DashboardStats
        availableNow={availableNow}
        totalActiveRooms={activeRooms.length}
        todaysMeetings={todaysBookings.length}
        upcomingMeetings={myUpcoming.length}
        totalRooms={rooms?.length ?? 0}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <TodaySchedule
          bookings={todaysBookings}
          roomMap={roomMap}
          employeeMap={employeeMap}
          onOpenBooking={openBooking}
        />

        <RoomAvailability roomStatuses={roomStatuses} />
      </div>

      <MyUpcomingBookings
        bookings={myUpcoming}
        roomMap={roomMap}
        employeeMap={employeeMap}
        onOpenBooking={openBooking}
      />
    </div>
  )
}
