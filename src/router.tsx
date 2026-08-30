import { createBrowserRouter, type RouteObject } from "react-router"
import { AppShell } from "@/components/layout/AppShell"
import RoomsPage from "./features/rooms/RoomsPage"
import RoomDetailsPage from "./features/rooms/RoomDetailsPage"
import BookingsPage from "./features/bookings/BookingsPage"
import CalendarPage from "./features/calendar/CalendarPage"
import DashboardPage from "./features/dashboard/DashboardPage"

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/:roomId", element: <RoomDetailsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "bookings", element: <BookingsPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
