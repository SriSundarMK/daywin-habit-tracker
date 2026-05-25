export function calcDayScore(habitIds, completedIds) {
  if (!habitIds.length) return 0
  return Math.round((completedIds.length / habitIds.length) * 100)
}

export function calcStreak(habitId, logs) {
  let streak = 0
  const today = new Date()
  const d = new Date(today)

  while (true) {
    const key = d.toISOString().split('T')[0]
    const dayLog = logs[key]
    if (!dayLog || !dayLog.includes(habitId)) {
      if (streak === 0 && key === today.toISOString().split('T')[0]) {
        d.setDate(d.getDate() - 1)
        continue
      }
      break
    }
    streak++
    d.setDate(d.getDate() - 1)
    if (streak > 3650) break
  }
  return streak
}

export function calcBestStreak(habitId, logs) {
  const keys = Object.keys(logs).sort()
  let best = 0
  let current = 0

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (logs[key]?.includes(habitId)) {
      if (i === 0) {
        current = 1
      } else {
        const prev = new Date(keys[i - 1])
        const curr = new Date(key)
        const diff = (curr - prev) / (1000 * 60 * 60 * 24)
        current = diff === 1 ? current + 1 : 1
      }
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

export function getStreakBadge(streak) {
  if (streak >= 30) return { label: '+30 pts', color: 'text-yellow-400', bg: 'bg-yellow-400/20' }
  if (streak >= 7) return { label: '+10 pts', color: 'text-blue-400', bg: 'bg-blue-400/20' }
  return null
}
