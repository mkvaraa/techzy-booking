import { PlusIcon, XIcon } from "lucide-react"
import type { Employee } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface AttendeesSelectProps {
  employees: Employee[]
  value: string[]
  onChange: (ids: string[]) => void
  // Employee id to exclude from the list (usually the organizer).
  excludeId?: string
}

export function AttendeesSelect({
  employees,
  value,
  onChange,
  excludeId,
}: AttendeesSelectProps) {
  const selectable = employees.filter((e) => e.id !== excludeId)
  const selected = employees.filter((e) => value.includes(e.id))

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    )
  }

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
          >
            <PlusIcon />
            Add attendees
            {selected.length > 0 ? (
              <Badge variant="secondary" className="ml-auto">
                {selected.length}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0">
          <Command>
            <CommandInput placeholder="Search employees..." />
            <CommandList>
              <CommandEmpty>No employees found.</CommandEmpty>
              <CommandGroup>
                {selectable.map((employee) => {
                  const checked = value.includes(employee.id)
                  return (
                    <CommandItem
                      key={employee.id}
                      value={`${employee.name} ${employee.department}`}
                      onSelect={() => toggle(employee.id)}
                      data-checked={checked}
                    >
                      <span className="flex flex-col">
                        <span className="text-sm">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {employee.jobTitle} · {employee.department}
                        </span>
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((employee) => (
            <Badge key={employee.id} variant="secondary" className="gap-1 pr-1">
              {employee.name}
              <button
                type="button"
                onClick={() => toggle(employee.id)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remove ${employee.name}`}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
