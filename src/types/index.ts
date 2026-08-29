export type AmenityId =
  | "projector"
  | "whiteboard"
  | "video_conference"
  | "tv_screen"
  | "conference_phone"
  | "wifi"
  | "standing_desk"
  | "accessible"
  | "catering"
  | "natural_light"

export interface Amenity {
  id: AmenityId
  label: string
}

export type RoomType =
  "meeting" | "conference" | "huddle" | "boardroom" | "phone_booth" | "training"

export interface Room {
  id: string
  name: string
  building: string
  floor: number
  capacity: number
  type: RoomType
  amenities: AmenityId[]
  imageUrl: string
  description: string
  isActive: boolean
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  jobTitle: string
  avatarUrl?: string
}

export type BookingStatus = "confirmed" | "cancelled"

export interface Booking {
  id: string
  roomId: string
  title: string
  description?: string
  organizerId: string
  attendeeIds: string[]
  // ISO 8601 datetime string
  start: string
  end: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

// Payload used when creating a booking (server assigns id/timestamps).
export interface CreateBookingInput {
  roomId: string
  title: string
  description?: string
  organizerId: string
  attendeeIds: string[]
  start: string
  end: string
}

// Payload used when updating a booking.
export interface UpdateBookingInput {
  roomId?: string
  title?: string
  description?: string
  organizerId?: string
  attendeeIds?: string[]
  start?: string
  end?: string
  status?: BookingStatus
}
