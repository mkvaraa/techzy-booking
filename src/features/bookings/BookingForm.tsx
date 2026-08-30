import { useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { formatISO } from "date-fns"
import { TriangleAlertIcon } from "lucide-react"
import { toast } from "sonner"
import type { Booking } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { AttendeesSelect } from "@/features/bookings/AttendeesSelect"
import { bookingFormSchema, type BookingFormValues } from "@/lib/validation"
import { roomTypeLabel } from "@/lib/constants"
import { findConflicts } from "@/lib/availability"
import { parseDateParam, withTime } from "@/lib/date"
import { useRooms } from "@/hooks/useRooms"
import { useEmployees } from "@/hooks/useEmployees"
import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
} from "@/hooks/useBookings"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import type { BookingDialogDefaults } from "@/store/bookingDialogStore"

interface BookingFormProps {
  mode: "create" | "edit"
  booking?: Booking
  defaults?: BookingDialogDefaults
  onSuccess: () => void
  onCancel: () => void
}

function buildDefaultValues(
  mode: "create" | "edit",
  booking: Booking | undefined,
  defaults: BookingDialogDefaults | undefined,
  currentUserId: string
): BookingFormValues {
  if (mode === "edit" && booking) {
    const start = new Date(booking.start)
    const end = new Date(booking.end)
    return {
      roomId: booking.roomId,
      title: booking.title,
      organizerId: booking.organizerId,
      attendeeIds: booking.attendeeIds,
      date: formatISO(start, { representation: "date" }),
      startTime: formatTimeInput(start),
      endTime: formatTimeInput(end),
      description: booking.description ?? "",
    }
  }

  const start = defaults?.start ? new Date(defaults.start) : defaultStart()
  const end = defaults?.end ? new Date(defaults.end) : addOneHour(start)

  return {
    roomId: defaults?.roomId ?? "",
    title: "",
    organizerId: currentUserId,
    attendeeIds: [],
    date: formatISO(start, { representation: "date" }),
    startTime: formatTimeInput(start),
    endTime: formatTimeInput(end),
    description: "",
  }
}

function formatTimeInput(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`
}

function defaultStart(): Date {
  const date = new Date()
  date.setMinutes(0, 0, 0)
  date.setHours(date.getHours() + 1)
  return date
}

function addOneHour(date: Date): Date {
  const next = new Date(date)
  next.setHours(next.getHours() + 1)
  return next
}

export function BookingForm({
  mode,
  booking,
  defaults,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const { data: rooms } = useRooms()
  const { data: employees } = useEmployees()
  const { data: bookings } = useBookings()
  const { currentUserId } = useCurrentUser()
  const createBooking = useCreateBooking()
  const updateBooking = useUpdateBooking()

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: yupResolver(bookingFormSchema),
    defaultValues: buildDefaultValues(mode, booking, defaults, currentUserId),
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const roomId = watch("roomId")
  const organizerId = watch("organizerId")
  const date = watch("date")
  const startTime = watch("startTime")
  const endTime = watch("endTime")

  const conflict = useMemo(() => {
    if (!roomId || !date || !startTime || !endTime) return null
    const baseDate = parseDateParam(date)
    if (!baseDate) return null
    const start = withTime(baseDate, startTime)
    const end = withTime(baseDate, endTime)
    if (!(start < end)) return null
    const conflicts = findConflicts(bookings ?? [], {
      roomId,
      start,
      end,
      ignoreBookingId: booking?.id,
    })
    return conflicts[0] ?? null
  }, [roomId, date, startTime, endTime, bookings, booking?.id])

  const availableRooms = useMemo(
    () => (rooms ?? []).filter((r) => r.isActive || r.id === booking?.roomId),
    [rooms, booking?.roomId]
  )

  const isSubmitting = createBooking.isPending || updateBooking.isPending

  const onSubmit = handleSubmit((values) => {
    const baseDate = parseDateParam(values.date)
    if (!baseDate) return
    const start = formatISO(withTime(baseDate, values.startTime))
    const end = formatISO(withTime(baseDate, values.endTime))

    if (mode === "edit" && booking) {
      updateBooking.mutate(
        {
          id: booking.id,
          input: {
            roomId: values.roomId,
            title: values.title.trim(),
            description: values.description.trim() || undefined,
            organizerId: values.organizerId,
            attendeeIds: values.attendeeIds,
            start,
            end,
          },
        },
        {
          onSuccess: () => {
            toast.success("Booking updated")
            onSuccess()
          },
          onError: (error) => toast.error((error as Error).message),
        }
      )
      return
    }

    createBooking.mutate(
      {
        roomId: values.roomId,
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        organizerId: values.organizerId,
        attendeeIds: values.attendeeIds,
        start,
        end,
      },
      {
        onSuccess: () => {
          toast.success("Booking created")
          onSuccess()
        },
        onError: (error) => toast.error((error as Error).message),
      }
    )
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g. Sprint planning"
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Room</Label>
          <Controller
            control={control}
            name="roomId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(errors.roomId)}
                >
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} · {roomTypeLabel(room.type)} ({room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.roomId ? (
            <p className="text-xs text-destructive">{errors.roomId.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Organizer</Label>
          <Controller
            control={control}
            name="organizerId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(errors.organizerId)}
                >
                  <SelectValue placeholder="Select organizer" />
                </SelectTrigger>
                <SelectContent>
                  {(employees ?? []).map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            aria-invalid={Boolean(errors.date)}
            {...register("date")}
          />
          {errors.date ? (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startTime">Start</Label>
          <Input
            id="startTime"
            type="time"
            step={300}
            aria-invalid={Boolean(errors.startTime)}
            {...register("startTime")}
          />
          {errors.startTime ? (
            <p className="text-xs text-destructive">
              {errors.startTime.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endTime">End</Label>
          <Input
            id="endTime"
            type="time"
            step={300}
            aria-invalid={Boolean(errors.endTime)}
            {...register("endTime")}
          />
          {errors.endTime ? (
            <p className="text-xs text-destructive">{errors.endTime.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Attendees</Label>
        <Controller
          control={control}
          name="attendeeIds"
          render={({ field }) => (
            <AttendeesSelect
              employees={employees ?? []}
              value={field.value}
              onChange={field.onChange}
              excludeId={organizerId}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Agenda, notes, dial-in details..."
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      {conflict ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            This room is already booked during the selected time by{" "}
            <span className="font-medium">"{conflict.title}"</span>. Pick a
            different time or room.
          </span>
        </div>
      ) : null}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || Boolean(conflict)}>
          {mode === "edit" ? "Save changes" : "Create booking"}
        </Button>
      </DialogFooter>
    </form>
  )
}
