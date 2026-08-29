import {
  addDays,
  endOfDay,
  endOfWeek,
  format,
  isValid,
  parse,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns"

// Monday-based week to match business scheduling conventions.
export const WEEK_STARTS_ON = 1 as const

export function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value
}

export function weekStart(date: Date | string = new Date()): Date {
  return startOfWeek(toDate(date), { weekStartsOn: WEEK_STARTS_ON })
}

export function weekEnd(date: Date | string = new Date()): Date {
  return endOfWeek(toDate(date), { weekStartsOn: WEEK_STARTS_ON })
}

export function dayStart(date: Date | string = new Date()): Date {
  return startOfDay(toDate(date))
}

export function dayEnd(date: Date | string = new Date()): Date {
  return endOfDay(toDate(date))
}

export { addDays }

// Build a Date from a base day plus a "HH:mm" time string.
export function withTime(base: Date, time: string): Date {
  return parse(time, "HH:mm", base)
}

export function formatDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function parseDateParam(value: string | null): Date | null {
  if (!value) return null
  const parsed = parse(value, "yyyy-MM-dd", new Date())
  return isValid(parsed) ? parsed : null
}

export function formatTimeRange(
  start: string | Date,
  end: string | Date
): string {
  return `${format(toDate(start), "HH:mm")} - ${format(toDate(end), "HH:mm")}`
}

export function formatDay(date: string | Date): string {
  return format(toDate(date), "EEE, MMM d")
}

export function formatFullDate(date: string | Date): string {
  return format(toDate(date), "EEEE, MMMM d, yyyy")
}

export function formatDateTime(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy 'at' HH:mm")
}

// Half-open interval overlap check: [aStart, aEnd) vs [bStart, bEnd).
export function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd
}
