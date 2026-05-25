import { useState, useCallback } from 'react'
import { getHabits, saveHabits, getLogs, saveLogs } from '../utils/localStorage'
import { todayKey } from '../utils/dateHelpers'

export function useHabits() {
  const [habits, setHabits] = useState(() => getHabits())
  const [logs, setLogs] = useState(() => getLogs())

  const today = todayKey()
  const todayLog = logs[today] || []
  const activeHabits = habits.filter(h => h.active)

  const toggle = useCallback((habitId) => {
    setLogs(prev => {
      const existing = prev[today] || []
      const updated = existing.includes(habitId)
        ? existing.filter(id => id !== habitId)
        : [...existing, habitId]
      const next = { ...prev, [today]: updated }
      saveLogs(next)
      return next
    })
  }, [today])

  const addHabit = useCallback((name, emoji) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      emoji: emoji || '✅',
      active: true,
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => {
      const next = [...prev, newHabit]
      saveHabits(next)
      return next
    })
  }, [])

  const updateHabit = useCallback((id, changes) => {
    setHabits(prev => {
      const next = prev.map(h => h.id === id ? { ...h, ...changes } : h)
      saveHabits(next)
      return next
    })
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => {
      const next = prev.filter(h => h.id !== id)
      saveHabits(next)
      return next
    })
  }, [])

  const resetToday = useCallback(() => {
    setLogs(prev => {
      const next = { ...prev, [today]: [] }
      saveLogs(next)
      return next
    })
  }, [today])

  return {
    habits,
    activeHabits,
    logs,
    todayLog,
    toggle,
    addHabit,
    updateHabit,
    deleteHabit,
    resetToday,
  }
}
