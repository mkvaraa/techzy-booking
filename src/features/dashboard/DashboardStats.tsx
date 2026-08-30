import {
  CalendarClockIcon,
  DoorOpenIcon,
  TicketIcon,
  UserCheckIcon,
} from "lucide-react"
import StatCard from "./StatCard"

type DashboardStatsProps = {
  availableNow: number
  totalActiveRooms: number
  todaysMeetings: number
  upcomingMeetings: number
  totalRooms: number
}

export function DashboardStats({
  availableNow,
  totalActiveRooms,
  todaysMeetings,
  upcomingMeetings,
  totalRooms,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={DoorOpenIcon}
        label="Rooms free now"
        value={`${availableNow}/${totalActiveRooms}`}
        hint="Available meeting rooms"
      />
      <StatCard
        icon={CalendarClockIcon}
        label="Meetings today"
        value={String(todaysMeetings)}
        hint="Scheduled for today"
      />
      <StatCard
        icon={UserCheckIcon}
        label="My upcoming"
        value={String(upcomingMeetings)}
        hint="Meetings I'm part of"
      />
      <StatCard
        icon={TicketIcon}
        label="Total rooms"
        value={String(totalRooms)}
        hint="Across all buildings"
      />
    </div>
  )
}
