import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { todayKey } from '../utils/dateHelpers'

const DEFAULT_HABITS = [
  { id: '1', name: 'Wake up before 6am', emoji: '⏰', active: true, sort_order: 0 },
  { id: '2', name: 'Drink warm water', emoji: '💧', active: true, sort_order: 1 },
  { id: '3', name: 'Stretching', emoji: '🧘', active: true, sort_order: 2 },
]

export function useHabits(profileId) {
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState({})
  const [syncing, setSyncing] = useState(true)
  const seeded = useRef(false)

  useEffect(() => {
    if (!profileId) return
    let cancelled = false
    seeded.current = false

    const load = async () => {
      setSyncing(true)

      const [{ data: habitsData }, { data: logsData }] = await Promise.all([
        supabase.from('habits').select('*').eq('profile_id', profileId).order('sort_order'),
        supabase.from('logs').select('*').eq('profile_id', profileId),
      ])

      if (cancelled) return

      if (habitsData && habitsData.length === 0 && !seeded.current) {
        seeded.current = true
        const defaults = DEFAULT_HABITS.map(h => ({ ...h, profile_id: profileId }))
        await supabase.from('habits').insert(defaults)
        setHabits(DEFAULT_HABITS)
      } else {
        setHabits(habitsData || [])
      }

      const logsMap = {}
      if (logsData) logsData.forEach(row => { logsMap[row.date] = row.habit_ids || [] })
      setLogs(logsMap)
      setSyncing(false)
    }

    load()
    return () => { cancelled = true }
  }, [profileId])

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
      { date: today, profile_id: profileId, habit_ids: updated, updated_at: new Date().toISOString() },
      { onConflict: 'date,profile_id' }
    )
  }, [today, logs, profileId])

  const addHabit = useCallback(async (name, emoji) => {
    const newHabit = {
      id: Date.now().toString(),
      profile_id: profileId,
      name,
      emoji: emoji || '✅',
      active: true,
      sort_order: habits.length,
    }
    setHabits(prev => [...prev, newHabit])
    await supabase.from('habits').insert(newHabit)
  }, [habits.length, profileId])

  const updateHabit = useCallback(async (id, changes) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h))
    await supabase.from('habits').update(changes).eq('id', id).eq('profile_id', profileId)
  }, [profileId])

  const deleteHabit = useCallback(async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    await supabase.from('habits').delete().eq('id', id).eq('profile_id', profileId)
  }, [profileId])

  const resetToday = useCallback(async () => {
    setLogs(prev => ({ ...prev, [today]: [] }))
    await supabase.from('logs').upsert(
      { date: today, profile_id: profileId, habit_ids: [], updated_at: new Date().toISOString() },
      { onConflict: 'date,profile_id' }
    )
  }, [today, profileId])

  return { habits, activeHabits, logs, todayLog, syncing, toggle, addHabit, updateHabit, deleteHabit, resetToday }
}
