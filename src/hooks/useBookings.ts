import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Booking, CreateBookingInput, UpdateBookingInput } from "@/types"
import {
  cancelBooking,
  createBooking,
  fetchBooking,
  fetchBookings,
  updateBooking,
} from "@/api/bookings"
import { queryKeys } from "@/hooks/queryKeys"

export function useBookings() {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: fetchBookings,
  })
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.booking(id ?? ""),
    queryFn: () => fetchBooking(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBookingInput }) =>
      updateBooking(id, input),
    onSuccess: (booking: Booking) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings })
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(booking.id) })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: (booking: Booking) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings })
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(booking.id) })
    },
  })
}
