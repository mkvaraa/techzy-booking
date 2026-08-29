import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"
import type { AmenityId } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AMENITY_OPTIONS, ROOM_TYPE_OPTIONS } from "@/lib/constants"

export interface RoomFilters {
  q: string
  type: string
  building: string
  capacity: string
  amenities: AmenityId[]
}

interface RoomsFiltersProps {
  filters: RoomFilters
  buildings: string[]
  onChange: (patch: Partial<RoomFilters>) => void
  onClear: () => void
}

const CAPACITY_OPTIONS = [
  { value: "2", label: "2+ people" },
  { value: "4", label: "4+ people" },
  { value: "6", label: "6+ people" },
  { value: "10", label: "10+ people" },
  { value: "20", label: "20+ people" },
]

const ALL = "all"

export function RoomsFilters({
  filters,
  buildings,
  onChange,
  onClear,
}: RoomsFiltersProps) {
  const hasActiveFilters =
    filters.q !== "" ||
    filters.type !== "" ||
    filters.building !== "" ||
    filters.capacity !== "" ||
    filters.amenities.length > 0

  const toggleAmenity = (id: AmenityId, checked: boolean) => {
    const next = checked
      ? [...filters.amenities, id]
      : filters.amenities.filter((a) => a !== id)
    onChange({ amenities: next })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Search rooms..."
          className="pl-8"
        />
      </div>

      <Select
        value={filters.type || ALL}
        onValueChange={(v) => onChange({ type: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All types</SelectItem>
          {ROOM_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.building || ALL}
        onValueChange={(v) => onChange({ building: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Building" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All buildings</SelectItem>
          {buildings.map((building) => (
            <SelectItem key={building} value={building}>
              {building}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.capacity || ALL}
        onValueChange={(v) => onChange({ capacity: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Capacity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any capacity</SelectItem>
          {CAPACITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start sm:w-auto">
            <SlidersHorizontalIcon />
            Amenities
            {filters.amenities.length > 0 ? (
              <Badge variant="secondary">{filters.amenities.length}</Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56">
          <div className="space-y-2">
            {AMENITY_OPTIONS.map((option) => {
              const checked = filters.amenities.includes(option.id)
              return (
                <div key={option.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`amenity-${option.id}`}
                    checked={checked}
                    onCheckedChange={(value) =>
                      toggleAmenity(option.id, value === true)
                    }
                  />
                  <Label
                    htmlFor={`amenity-${option.id}`}
                    className="text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters ? (
        <Button variant="ghost" onClick={onClear}>
          <XIcon />
          Clear
        </Button>
      ) : null}
    </div>
  )
}
