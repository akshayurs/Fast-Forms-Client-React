const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

exports.toLocale = (timeStamp) => {
  return new Date(timeStamp).toLocaleString()
}
exports.toCorrectUTC = (timeStamp) => {
  const time = new Date(timeStamp)
  time.setMinutes(time.getMinutes() - time.getTimezoneOffset())
  return time.toISOString().slice(0, 16)
}
exports.toExactTime = (timeStamp) => {
  if (!timeStamp) {
    return ''
  }
  const today = new Date()
  const yesterday = new Date()
  const tomorrow = new Date()
  yesterday.setDate(today.getDate() - 1)
  tomorrow.setDate(today.getDate() + 1)
  const date = new Date(timeStamp)
  const temp = date.toLocaleString().split(',')[1].split(':')
  const time = temp[0] + ':' + temp[1] + ' ' + temp[2].slice(-2)
  let day = date.toLocaleString().split(',')[0].trim()
  if (datesAreOnSameDay(date, today)) day = 'Today'
  if (datesAreOnSameDay(date, tomorrow)) day = 'Tomorrow'
  if (datesAreOnSameDay(date, yesterday)) day = 'Yesterday'

  return day + ' ' + time
}
