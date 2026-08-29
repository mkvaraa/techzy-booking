import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  // Id of the "logged in" employee. Defaults to the first seeded employee.
  currentUserId: string
  setCurrentUserId: (id: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUserId: "emp-01",
      setCurrentUserId: (id) => set({ currentUserId: id }),
    }),
    {
      name: "techzy:current-user",
    }
  )
)
