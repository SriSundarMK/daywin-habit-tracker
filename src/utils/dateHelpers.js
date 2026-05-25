export function todayKey() {
  return new Date().toISOString().split('T')[0]
}

export function dateKey(date) {
  return new Date(date).toISOString().split('T')[0]
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function getWeekDays(offsetWeeks = 0) {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7) + offsetWeeks * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return dateKey(d)
  })
}

export function getMonthDays(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = (first.getDay() + 6) % 7
  const days = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(dateKey(new Date(year, month, d)))
  }
  return days
}

export function isToday(dateStr) {
  return dateStr === todayKey()
}

export function isFuture(dateStr) {
  return dateStr > todayKey()
}

export function getDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

export function getMonthLabel(year, month) {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
