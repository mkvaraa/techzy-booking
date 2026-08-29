import type { Employee } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface EmployeeAvatarProps {
  employee: Pick<Employee, "name" | "avatarUrl">
  size?: "sm" | "default" | "lg"
  className?: string
}

export function EmployeeAvatar({
  employee,
  size = "default",
  className,
}: EmployeeAvatarProps) {
  return (
    <Avatar size={size} className={cn(className)}>
      {employee.avatarUrl ? (
        <AvatarImage src={employee.avatarUrl} alt={employee.name} />
      ) : null}
      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
    </Avatar>
  )
}
