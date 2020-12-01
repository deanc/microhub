import { time } from "console"
import { formatDistance, parse } from "date-fns"
const { utcToZonedTime } = require("date-fns-timezone")

export const timeAgoInWords = (date: Date) =>
  formatDistance(date, new Date(), { addSuffix: true })

export const mysqlToDate = (date: string, timezone: string | null = null) => {
  const d = parse(date, "yyyy-MM-dd HH:mm:ss", new Date())
  if (timezone) {
    return utcToZonedTime(d, timezone)
  }
  return d
}
