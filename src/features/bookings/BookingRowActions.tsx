import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { Booking } from "@/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCancelBooking } from "@/hooks/useBookings"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useOpenBooking } from "@/hooks/useOpenBooking"
import { useBookingDialogStore } from "@/store/bookingDialogStore"
import { toDate } from "@/lib/date"

export function BookingRowActions({ booking }: { booking: Booking }) {
  const openBooking = useOpenBooking()
  const openEdit = useBookingDialogStore((s) => s.openEdit)
  const cancelBooking = useCancelBooking()
  const { currentUserId } = useCurrentUser()

  const isPast = toDate(booking.end) < new Date()
  const canManage =
    booking.organizerId === currentUserId &&
    !isPast &&
    booking.status !== "cancelled"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Booking actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => openBooking(booking.id)}>
          <EyeIcon />
          View details
        </DropdownMenuItem>
        {canManage ? (
          <>
            <DropdownMenuItem onClick={() => openEdit(booking.id)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                cancelBooking.mutate(booking.id, {
                  onSuccess: () => toast.success("Booking cancelled"),
                  onError: (error) => toast.error((error as Error).message),
                })
              }
            >
              <XCircleIcon />
              Cancel booking
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
