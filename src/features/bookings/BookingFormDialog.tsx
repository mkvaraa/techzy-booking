import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingForm } from "@/features/bookings/BookingForm"
import { useBooking } from "@/hooks/useBookings"
import { useBookingDialogStore } from "@/store/bookingDialogStore"

export function BookingFormDialog() {
  const open = useBookingDialogStore((s) => s.open)
  const mode = useBookingDialogStore((s) => s.mode)
  const bookingId = useBookingDialogStore((s) => s.bookingId)
  const defaults = useBookingDialogStore((s) => s.defaults)
  const close = useBookingDialogStore((s) => s.close)

  const { data: booking, isLoading } = useBooking(
    mode === "edit" ? bookingId : undefined
  )

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : close())}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit booking" : "New booking"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the details of this meeting."
              : "Reserve a meeting room by filling in the details below."}
          </DialogDescription>
        </DialogHeader>

        {mode === "edit" && isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <BookingForm
            key={mode === "edit" ? bookingId : "create"}
            mode={mode}
            booking={mode === "edit" ? booking : undefined}
            defaults={defaults}
            onSuccess={close}
            onCancel={close}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
