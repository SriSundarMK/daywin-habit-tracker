import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { todayKey } from '../utils/dateHelpers'

const DEFAULT_HABITS = [
  { id: '1', name: 'Wake up before 6am', emoji: '⏰', active: true, sort_order: 0 },
  { id: '2', name: 'Drink warm water', emoji: '💧', active: true, sort_order: 1 },
  { id: '3', name: 'Stretching', emoji: '🧘', active: true, sort_order: 2 },
]

export function useHabits(userId) {
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState({})
  const [syncing, setSyncing] = useState(true)
  const seeded = useRef(false)

  // Load habits and logs from Supabase
  useEffect(() => {
    if (!userId) return
    let cancelled = false

    const load = async () => {
      setSyncing(true)

      const [{ data: habitsData }, { data: logsData }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('logs').select('*').eq('user_id', userId),
      ])

      if (cancelled) return

      // Seed default habits on first use
      if (habitsData && habitsData.length === 0 && !seeded.current) {
        seeded.current = true
        const defaults = DEFAULT_HABITS.map(h => ({ ...h, user_id: userId }))
        await supabase.from('habits').insert(defaults)
        setHabits(DEFAULT_HABITS)
      } else {
        setHabits(habitsData || [])
      }

      const logsMap = {}
      if (logsData) {
        logsData.forEach(row => { logsMap[row.date] = row.habit_ids || [] })
      }
      setLogs(logsMap)
      setSyncing(false)
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  const today = todayKey()
  const todayLog = logs[today] || []
  const activeHabits = habits.filter(h => h.active)

  const toggle = useCallback(async (habitId) => {
    const existing = logs[today] || []
    const updated = existing.includes(habitId)
      ? existing.filter(id => id !== habitId)
      : [...existing, habitId]

    setLogs(prev => ({ ...prev, [today]: updated }))

    await supabase.from('logs').upsert(
      { date: today, user_id: userId, habit_ids: updated, updated_at: new Date().toISOString() },
      { onConflict: 'date,user_id' }
    )
  }, [today, logs, userId])

  const addHabit = useCallback(async (name, emoji) => {
    const newHabit = {
      id: Date.now().toString(),
      user_id: userId,
      name,
      emoji: emoji || '✅',
      active: true,
      sort_order: habits.length,
    }
    setHabits(prev => [...prev, newHabit])
    await supabase.from('habits').insert(newHabit)
  }, [habits.length, userId])

  const updateHabit = useCallback(async (id, changes) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h))
    await supabase.from('habits').update(changes).eq('id', id).eq('user_id', userId)
  }, [userId])

  const deleteHabit = useCallback(async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    await supabase.from('habits').delete().eq('id', id).eq('user_id', userId)
  }, [userId])

  const resetToday = useCallback(async () => {
    setLogs(prev => ({ ...prev, [today]: [] }))
    await supabase.from('logs').upsert(
      { date: today, user_id: userId, habit_ids: [], updated_at: new Date().toISOString() },
      { onConflict: 'date,user_id' }
    )
  }, [today, userId])

  return { habits, activeHabits, logs, todayLog, syncing, toggle, addHabit, updateHabit, deleteHabit, resetToday }
}
