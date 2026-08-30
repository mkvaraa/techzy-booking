import { SearchIcon, XIcon } from "lucide-react"
import type { Employee, Room } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface BookingFilters {
  q: string
  room: string
  organizer: string
  status: string
  scope: string
  mine: boolean
}

interface BookingsFiltersProps {
  filters: BookingFilters
  rooms: Room[]
  employees: Employee[]
  onChange: (patch: Partial<BookingFilters>) => void
  onClear: () => void
}

const ALL = "all"

export function BookingsFilters({
  filters,
  rooms,
  employees,
  onChange,
  onClear,
}: BookingsFiltersProps) {
  const hasActive =
    filters.q !== "" ||
    filters.room !== "" ||
    filters.organizer !== "" ||
    filters.status !== "" ||
    (filters.scope !== "" && filters.scope !== "upcoming") ||
    filters.mine

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative flex-1 lg:max-w-xs">
        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Search bookings..."
          className="pl-8"
        />
      </div>

      <Select
        value={filters.scope || "upcoming"}
        onValueChange={(v) => onChange({ scope: v })}
      >
        <SelectTrigger className="w-full lg:w-36">
          <SelectValue placeholder="When" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="past">Past</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.room || ALL}
        onValueChange={(v) => onChange({ room: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full lg:w-40">
          <SelectValue placeholder="Room" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All rooms</SelectItem>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.organizer || ALL}
        onValueChange={(v) => onChange({ organizer: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full lg:w-44">
          <SelectValue placeholder="Organizer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All organizers</SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || ALL}
        onValueChange={(v) => onChange({ status: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full lg:w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          id="mine"
          checked={filters.mine}
          onCheckedChange={(v) => onChange({ mine: v === true })}
        />
        <Label htmlFor="mine" className="font-normal">
          My bookings
        </Label>
      </div>

      {hasActive ? (
        <Button variant="ghost" onClick={onClear}>
          <XIcon />
          Clear
        </Button>
      ) : null}
    </div>
  )
}
