import type { Employee } from "@/types"
import { db } from "@/api/db"
import { delay } from "@/api/client"

export function fetchEmployees(): Promise<Employee[]> {
  return delay(db.getEmployees())
}
