import { useMemo, useCallback } from "react"
import { useSearchParams } from "react-router"
import { Calendar, Views, type View, type SlotInfo } from "react-big-calendar"
import { addDays, addWeeks, format, formatISO } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import type { Booking } from "@/types"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookings } from "@/hooks/useBookings"
import { useRooms } from "@/hooks/useRooms"
import { useRoomMap } from "@/hooks/useLookups"
import { useOpenBooking } from "@/hooks/useOpenBooking"
import { useBookingDialogStore } from "@/store/bookingDialogStore"
import { WORKING_HOURS } from "@/lib/constants"
import { formatDateParam, parseDateParam, weekEnd, weekStart } from "@/lib/date"
import { localizer } from "@/features/calendar/localizer"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Booking
}

const ALL = "all"

export function BookingCalendar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: bookings, isLoading } = useBookings()
  const { data: rooms } = useRooms()
  const roomMap = useRoomMap()
  const openBooking = useOpenBooking()
  const openCreate = useBookingDialogStore((s) => s.openCreate)

  const view: View = searchParams.get("view") === "day" ? Views.DAY : Views.WEEK
  const date = parseDateParam(searchParams.get("date")) ?? new Date()
  const roomFilter = searchParams.get("room") ?? ""

  const setParam = useCallback(
    (patch: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === "") next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const events: CalendarEvent[] = useMemo(() => {
    return (bookings ?? [])
      .filter((b) => b.status === "confirmed")
      .filter((b) => (roomFilter ? b.roomId === roomFilter : true))
      .map((b) => {
        const roomName = roomMap.get(b.roomId)?.name
        return {
          id: b.id,
          title: roomFilter ? b.title : `${b.title} · ${roomName ?? ""}`,
          start: new Date(b.start),
          end: new Date(b.end),
          resource: b,
        }
      })
  }, [bookings, roomFilter, roomMap])

  const goToday = () => setParam({ date: formatDateParam(new Date()) })
  const goPrev = () =>
    setParam({
      date: formatDateParam(
        view === Views.DAY ? addDays(date, -1) : addWeeks(date, -1)
      ),
    })
  const goNext = () =>
    setParam({
      date: formatDateParam(
        view === Views.DAY ? addDays(date, 1) : addWeeks(date, 1)
      ),
    })

  const label =
    view === Views.DAY
      ? format(date, "EEEE, MMMM d, yyyy")
      : `${format(weekStart(date), "MMM d")} - ${format(weekEnd(date), "MMM d, yyyy")}`

  const handleSelectSlot = (slot: SlotInfo) => {
    openCreate({
      roomId: roomFilter || undefined,
      start: formatISO(slot.start as Date),
      end: formatISO(slot.end as Date),
    })
  }

  const minTime = new Date()
  minTime.setHours(WORKING_HOURS.start, 0, 0, 0)
  const maxTime = new Date()
  maxTime.setHours(WORKING_HOURS.end, 0, 0, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="View room availability and bookings across the day or week."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goPrev}
              aria-label="Previous"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goNext}
              aria-label="Next"
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={roomFilter || ALL}
            onValueChange={(v) => setParam({ room: v === ALL ? null : v })}
          >
            <SelectTrigger className="w-44" size="sm">
              <SelectValue placeholder="All rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All rooms</SelectItem>
              {(rooms ?? []).map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={view === Views.DAY ? "day" : "week"}
            onValueChange={(v) => setParam({ view: v })}
          >
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-150 w-full rounded-xl" />
      ) : (
        <div className="h-160 rounded-xl">
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            date={date}
            onView={(v) => setParam({ view: v === Views.DAY ? "day" : "week" })}
            onNavigate={(d) => setParam({ date: formatDateParam(d) })}
            views={[Views.DAY, Views.WEEK]}
            toolbar={false}
            selectable
            step={30}
            timeslots={2}
            min={minTime}
            max={maxTime}
            scrollToTime={minTime}
            popup
            onSelectEvent={(event) => openBooking(event.id)}
            onSelectSlot={handleSelectSlot}
            dayLayoutAlgorithm="no-overlap"
          />
        </div>
      )}
    </div>
  )
}
