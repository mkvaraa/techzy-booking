import { useState } from "react"
import { useSearchParams } from "react-router"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { EmployeeAvatar } from "@/components/common/EmployeeAvatar"
import { useBooking, useCancelBooking } from "@/hooks/useBookings"
import { useRoomMap, useEmployeeMap } from "@/hooks/useLookups"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useBookingDialogStore } from "@/store/bookingDialogStore"
import { formatFullDate, formatTimeRange, toDate } from "@/lib/date"

export function BookingDetailsDialog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const bookingId = searchParams.get("booking") ?? undefined
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const { data: booking, isLoading } = useBooking(bookingId)
  const roomMap = useRoomMap()
  const employeeMap = useEmployeeMap()
  const { currentUserId } = useCurrentUser()
  const cancelBooking = useCancelBooking()
  const openEdit = useBookingDialogStore((s) => s.openEdit)

  const close = () => {
    setConfirmingCancel(false)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete("booking")
        return next
      },
      { replace: true }
    )
  }

  const room = booking ? roomMap.get(booking.roomId) : undefined
  const organizer = booking ? employeeMap.get(booking.organizerId) : undefined
  const attendees = booking
    ? booking.attendeeIds
        .map((id) => employeeMap.get(id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
    : []

  const isPast = booking ? toDate(booking.end) < new Date() : false
  const isCancelled = booking?.status === "cancelled"
  const isOwner = booking?.organizerId === currentUserId
  const canManage = Boolean(booking) && isOwner && !isPast && !isCancelled

  const handleCancel = () => {
    if (!booking) return
    cancelBooking.mutate(booking.id, {
      onSuccess: () => {
        toast.success("Booking cancelled")
        close()
      },
      onError: (error) => toast.error((error as Error).message),
    })
  }

  const handleEdit = () => {
    if (!booking) return
    close()
    openEdit(booking.id)
  }

  return (
    <Dialog
      open={Boolean(bookingId)}
      onOpenChange={(next) => (next ? null : close())}
    >
      <DialogContent className="sm:max-w-lg">
        {isLoading || !booking ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{booking.title}</DialogTitle>
                {isCancelled ? (
                  <Badge variant="destructive">Cancelled</Badge>
                ) : isPast ? (
                  <Badge variant="secondary">Past</Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-600 text-white"
                  >
                    Confirmed
                  </Badge>
                )}
              </div>
              <DialogDescription>
                {room ? room.name : "Unknown room"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {formatFullDate(booking.start)}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4 text-muted-foreground" />
                {formatTimeRange(booking.start, booking.end)}
              </div>
              {room ? (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground" />
                  {room.building} · Floor {room.floor}
                </div>
              ) : null}

              <Separator />

              <div className="flex items-center gap-2">
                <UserIcon className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Organizer:</span>
                {organizer ? (
                  <span className="inline-flex items-center gap-1.5">
                    <EmployeeAvatar employee={organizer} size="sm" />
                    {organizer.name}
                  </span>
                ) : (
                  "Unknown"
                )}
              </div>

              {attendees.length > 0 ? (
                <div className="flex items-start gap-2">
                  <UsersIcon className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1.5">
                    {attendees.map((attendee) => (
                      <Badge key={attendee.id} variant="outline">
                        {attendee.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {booking.description ? (
                <>
                  <Separator />
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {booking.description}
                  </p>
                </>
              ) : null}

              {!isOwner && !isPast && !isCancelled ? (
                <p className="text-xs text-muted-foreground">
                  Only the organizer ({organizer?.name}) can edit or cancel this
                  booking.
                </p>
              ) : null}
            </div>

            <DialogFooter>
              {confirmingCancel ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    Cancel this booking?
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmingCancel(false)}
                    >
                      Keep
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancel}
                      disabled={cancelBooking.isPending}
                    >
                      Cancel booking
                    </Button>
                  </div>
                </div>
              ) : canManage ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmingCancel(true)}
                  >
                    <XCircleIcon />
                    Cancel booking
                  </Button>
                  <Button onClick={handleEdit}>
                    <PencilIcon />
                    Edit
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={close}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
