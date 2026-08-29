import { create } from "zustand"

export interface BookingDialogDefaults {
  roomId?: string
  start?: string
  end?: string
}

interface BookingDialogState {
  open: boolean
  mode: "create" | "edit"
  bookingId?: string
  defaults?: BookingDialogDefaults
  openCreate: (defaults?: BookingDialogDefaults) => void
  openEdit: (bookingId: string) => void
  close: () => void
}

export const useBookingDialogStore = create<BookingDialogState>((set) => ({
  open: false,
  mode: "create",
  bookingId: undefined,
  defaults: undefined,
  openCreate: (defaults) =>
    set({ open: true, mode: "create", bookingId: undefined, defaults }),
  openEdit: (bookingId) =>
    set({ open: true, mode: "edit", bookingId, defaults: undefined }),
  close: () => set({ open: false, bookingId: undefined, defaults: undefined }),
}))
