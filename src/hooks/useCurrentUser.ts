// import type { Employee } from "@/types"
// import { useUserStore } from "@/store/userStore"
// import { useEmployees } from "@/hooks/useEmployees"

// export function useCurrentUser(): {
//   currentUserId: string
//   currentUser: Employee | undefined
// } {
//   const currentUserId = useUserStore((s) => s.currentUserId)
//   const { data: employees } = useEmployees()
//   const currentUser = employees?.find((e) => e.id === currentUserId)
//   return { currentUserId, currentUser }
// }

//For future dev, we need useUserStore
