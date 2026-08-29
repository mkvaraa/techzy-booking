import { useMemo } from "react"
import type { Employee, Room } from "@/types"
import { useRooms } from "@/hooks/useRooms"
import { useEmployees } from "@/hooks/useEmployees"

export function useRoomMap(): Map<string, Room> {
  const { data } = useRooms()
  return useMemo(() => {
    const map = new Map<string, Room>()
    for (const room of data ?? []) map.set(room.id, room)
    return map
  }, [data])
}

export function useEmployeeMap(): Map<string, Employee> {
  const { data } = useEmployees()
  return useMemo(() => {
    const map = new Map<string, Employee>()
    for (const employee of data ?? []) map.set(employee.id, employee)
    return map
  }, [data])
}
