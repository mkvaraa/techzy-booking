import * as yup from "yup"

export interface BookingFormValues {
  roomId: string
  title: string
  organizerId: string
  attendeeIds: string[]
  date: string
  startTime: string
  endTime: string
  description: string
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const bookingFormSchema: yup.ObjectSchema<BookingFormValues> =
  yup.object({
    roomId: yup.string().required("Please select a room."),
    title: yup
      .string()
      .trim()
      .required("Please enter a meeting title.")
      .max(120, "Title must be at most 120 characters."),
    organizerId: yup.string().required("Please select an organizer."),
    attendeeIds: yup.array().of(yup.string().required()).default([]),
    date: yup.string().required("Please pick a date."),
    startTime: yup
      .string()
      .required("Start time is required.")
      .matches(TIME_REGEX, "Enter a valid time."),
    endTime: yup
      .string()
      .required("End time is required.")
      .matches(TIME_REGEX, "Enter a valid time.")
      .test(
        "after-start",
        "End time must be after the start time.",
        function (value) {
          const { startTime } = this.parent as BookingFormValues
          if (!value || !startTime) return true
          return value > startTime
        }
      ),
    description: yup
      .string()
      .default("")
      .max(500, "Description must be at most 500 characters."),
  })
