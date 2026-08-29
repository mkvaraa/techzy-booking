import type { AmenityId, RoomType } from "@/types"

export const AMENITIES: Record<AmenityId, string> = {
  projector: "Projector",
  whiteboard: "Whiteboard",
  video_conference: "Video conference",
  tv_screen: "TV screen",
  conference_phone: "Conference phone",
  wifi: "Wi-Fi",
  standing_desk: "Standing desk",
  accessible: "Wheelchair accessible",
  catering: "Catering allowed",
  natural_light: "Natural light",
}

export const AMENITY_OPTIONS = Object.entries(AMENITIES).map(([id, label]) => ({
  id: id as AmenityId,
  label,
}))

export const ROOM_TYPES: Record<RoomType, string> = {
  meeting: "Meeting room",
  conference: "Conference room",
  huddle: "Huddle space",
  boardroom: "Boardroom",
  phone_booth: "Phone booth",
  training: "Training room",
}

export const ROOM_TYPE_OPTIONS = Object.entries(ROOM_TYPES).map(
  ([id, label]) => ({ id: id as RoomType, label })
)

// Working hours shown in the calendar / used as defaults.
export const WORKING_HOURS = {
  start: 7,
  end: 21,
} as const

export function amenityLabel(id: AmenityId): string {
  return AMENITIES[id] ?? id
}

export function roomTypeLabel(type: RoomType): string {
  return ROOM_TYPES[type] ?? type
}
