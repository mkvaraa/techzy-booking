import { dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek as dfnsStartOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import { WEEK_STARTS_ON } from "@/lib/date"

const locales = { "en-US": enUS }

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) =>
    dfnsStartOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
  getDay,
  locales,
})
