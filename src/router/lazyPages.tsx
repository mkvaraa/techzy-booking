import { lazy } from "react"

export const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
export const RoomsPage = lazy(() => import("@/pages/RoomsPage"))
export const RoomDetailsPage = lazy(() => import("@/pages/RoomDetailsPage"))
export const CalendarPage = lazy(() => import("@/pages/CalendarPage"))
export const BookingsPage = lazy(() => import("@/pages/BookingsPage"))
export const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
