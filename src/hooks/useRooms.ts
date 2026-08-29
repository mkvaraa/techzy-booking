import { useQuery } from "@tanstack/react-query"
import { fetchRoom, fetchRooms } from "@/api/rooms"
import { queryKeys } from "@/hooks/queryKeys"

export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: fetchRooms,
  })
}

export function useRoom(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.room(id ?? ""),
    queryFn: () => fetchRoom(id as string),
    enabled: Boolean(id),
  })
}
