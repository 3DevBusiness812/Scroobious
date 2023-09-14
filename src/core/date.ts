import dayjs from 'dayjs'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export class DateFormatter {
  // https://day.js.org/docs/en/parse/string-format
  static format(date: string | Date, format: string = '') {
    const dateFormat = date instanceof Date ? date.toISOString() : date

    return dayjs(dateFormat).format(format)
  }

  // https://github.com/catamphetamine/javascript-time-ago
  static timeAgo(date: Date | string) {
    date = date instanceof Date ? date : new Date(date)
    const timeSince = new TimeAgo('en-US')

    return timeSince.format(date)
  }
}
