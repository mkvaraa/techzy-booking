import type { Room } from "@/types"
import { db } from "@/api/db"
import { ApiError, delay } from "@/api/client"

export function fetchRooms(): Promise<Room[]> {
  return delay(db.getRooms())
}

export function fetchRoom(id: string): Promise<Room> {
  const room = db.getRooms().find((r) => r.id === id)
  if (!room) {
    throw new ApiError(`Room ${id} not found`, 404)
  }
  return delay(room)
}
