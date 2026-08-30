import { lazy } from "react"

export const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
)
export const RoomsPage = lazy(() =>
  import("@/pages/RoomsPage").then((m) => ({ default: m.RoomsPage }))
)
export const RoomDetailsPage = lazy(() =>
  import("@/pages/RoomDetailsPage").then((m) => ({
    default: m.RoomsDetailsPage,
  }))
)
export const CalendarPage = lazy(() =>
  import("@/pages/CalendarPage").then((m) => ({ default: m.CalendarPage }))
)
export const BookingsPage = lazy(() =>
  import("@/pages/BookingsPage").then((m) => ({ default: m.BookingsPage }))
)
export const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
)
