import { createBrowserRouter, type RouteObject } from "react-router"
import { AppShell } from "@/components/layout/AppShell"
import App from "./App"

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [{ index: true, element: <App /> }], //test route
  },
]

export const router = createBrowserRouter(routes)
