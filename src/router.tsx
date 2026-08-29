import { createBrowserRouter, type RouteObject } from "react-router"
import { AppShell } from "@/components/layout/AppShell"
import App from "./App"
import RoomsPage from "./features/rooms/RoomsPage"

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <App /> }, //test route
      { path: "rooms", element: <RoomsPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
