import { useState } from "react"
import { MenuIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarBrand, SidebarNav } from "@/components/layout/Sidebar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { UserSwitcher } from "@/components/layout/UserSwitcher"
import { useBookingDialogStore } from "@/store/bookingDialogStore"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openCreate = useBookingDialogStore((s) => s.openCreate)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBrand />
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" onClick={() => openCreate()}>
          <PlusIcon />
          <span className="hidden sm:inline">New booking</span>
        </Button>
        <ThemeToggle />
        <UserSwitcher />
      </div>
    </header>
  )
}
