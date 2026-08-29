export const queryKeys = {
  rooms: ["rooms"] as const,
  room: (id: string) => ["rooms", id] as const,
  employees: ["employees"] as const,
  bookings: ["bookings"] as const,
  booking: (id: string) => ["bookings", id] as const,
}
