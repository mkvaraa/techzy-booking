import { Suspense } from "react"
import { Outlet } from "react-router"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BookingDialogs } from "@/features/bookings/BookingDialogs"
import { PageFallback } from "../common/PageFallback"

export function AppShell() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh bg-muted/30">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
        <BookingDialogs />
        <Toaster position="top-right" />
      </div>
    </TooltipProvider>
  )
}
