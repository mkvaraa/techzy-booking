import { useCallback } from "react"
import { useSearchParams } from "react-router"

// Returns a function that opens the booking details dialog via the URL
export function useOpenBooking() {
  const [, setSearchParams] = useSearchParams()
  return useCallback(
    (bookingId: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set("booking", bookingId)
          return next
        },
        { replace: false }
      )
    },
    [setSearchParams]
  )
}
