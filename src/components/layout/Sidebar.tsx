import { NavLink } from "react-router"
import { CalendarCheck2Icon } from "lucide-react"
import { NAV_ITEMS } from "@/components/layout/navItems"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarProps) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )
          }
        >
          <item.icon className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2 px-5 py-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CalendarCheck2Icon className="size-4" />
      </div>
      <div className="leading-tight">
        <p className="font-heading text-sm font-semibold">Techzy Rooms</p>
        <p className="text-xs text-muted-foreground">Meeting booking</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <SidebarBrand />
      <SidebarNav />
    </aside>
  )
}
