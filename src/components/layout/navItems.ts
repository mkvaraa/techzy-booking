import {
  CalendarDaysIcon,
  DoorOpenIcon,
  LayoutDashboardIcon,
  TicketIcon,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  // Match nested routes (e.g. /rooms/:id) as active too.
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: "/rooms", label: "Rooms", icon: DoorOpenIcon },
  { to: "/calendar", label: "Calendar", icon: CalendarDaysIcon },
  { to: "/bookings", label: "Bookings", icon: TicketIcon },
]
