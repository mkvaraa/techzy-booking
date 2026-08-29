import { createBrowserRouter, type RouteObject } from "react-router"
import { AppShell } from "@/components/layout/AppShell"
import App from "./App"
import RoomsPage from "./features/rooms/RoomsPage"
import RoomDetailsPage from "./features/rooms/RoomDetailsPage"

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <App /> }, //test route
      { path: "rooms", element: <RoomsPage /> },
      { path: "rooms/:roomId", element: <RoomDetailsPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
