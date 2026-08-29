import { useQuery } from "@tanstack/react-query"
import { fetchEmployees } from "@/api/employees"
import { queryKeys } from "@/hooks/queryKeys"

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: fetchEmployees,
  })
}
