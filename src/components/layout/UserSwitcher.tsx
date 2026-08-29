import { ChevronsUpDownIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmployeeAvatar } from "@/components/common/EmployeeAvatar"
import { useEmployees } from "@/hooks/useEmployees"
import { useUserStore } from "@/store/userStore"
import { resetData } from "@/api/db"

export function UserSwitcher() {
  const { data: employees } = useEmployees()
  const currentUserId = useUserStore((s) => s.currentUserId)
  const setCurrentUserId = useUserStore((s) => s.setCurrentUserId)

  const currentUser = employees?.find((e) => e.id === currentUserId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto justify-start gap-2 px-2 py-1.5"
        >
          {currentUser ? (
            <>
              <EmployeeAvatar employee={currentUser} size="sm" />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium">
                  {currentUser.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {currentUser.department}
                </span>
              </span>
            </>
          ) : (
            <span className="text-sm">Select employee</span>
          )}
          <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto">
          {employees?.map((employee) => (
            <DropdownMenuItem
              key={employee.id}
              onClick={() => setCurrentUserId(employee.id)}
              className="gap-2"
            >
              <EmployeeAvatar employee={employee} size="sm" />
              <span className="flex-1 leading-tight">
                <span className="block text-sm font-medium">
                  {employee.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {employee.jobTitle}
                </span>
              </span>
              {employee.id === currentUserId ? (
                <span className="text-xs text-muted-foreground">Current</span>
              ) : null}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            resetData()
            window.location.reload()
          }}
        >
          <RotateCcwIcon />
          Reset demo data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
