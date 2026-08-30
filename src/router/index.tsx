import { createBrowserRouter, type RouteObject } from "react-router"

import { AppShell } from "@/components/layout/AppShell"

import {
  BookingsPage,
  CalendarPage,
  DashboardPage,
  NotFoundPage,
  RoomDetailsPage,
  RoomsPage,
} from "./lazyPages"

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/:roomId", element: <RoomDetailsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "bookings", element: <BookingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
