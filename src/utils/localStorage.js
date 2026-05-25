const KEYS = {
  HABITS: 'daywin_habits',
  LOGS: 'daywin_logs',
  THEME: 'daywin_theme',
}

const DEFAULT_HABITS = [
  { id: '1', name: 'Wake up before 6am', emoji: '⏰', active: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Drink warm water', emoji: '💧', active: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Stretching', emoji: '🧘', active: true, createdAt: new Date().toISOString() },
]

export function getHabits() {
  try {
    const raw = localStorage.getItem(KEYS.HABITS)
    if (!raw) {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(DEFAULT_HABITS))
      return DEFAULT_HABITS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_HABITS
  }
}

export function saveHabits(habits) {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits))
}

export function getLogs() {
  try {
    const raw = localStorage.getItem(KEYS.LOGS)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveLogs(logs) {
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs))
}

export function getTheme() {
  return localStorage.getItem(KEYS.THEME) || 'dark'
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme)
}

export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

export function exportData() {
  return {
    habits: getHabits(),
    logs: getLogs(),
    exportedAt: new Date().toISOString(),
  }
}
