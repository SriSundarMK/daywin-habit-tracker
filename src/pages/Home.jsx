import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import ScoreRing from '../components/ScoreRing'
import HabitCard from '../components/HabitCard'
import NotificationBanner from '../components/NotificationBanner'
import { calcDayScore } from '../utils/scoreCalculator'
import { formatDate, todayKey } from '../utils/dateHelpers'

const EMOJIS = ['✅', '💪', '📚', '🏃', '🥗', '😴', '🧠', '🎯', '💧', '🌿', '⏰', '🧘', '🚶', '🍎', '☀️']

export default function Home({ habits, activeHabits, logs, todayLog, toggle, addHabit }) {
  const [banner, setBanner] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('✅')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const score = calcDayScore(activeHabits.map(h => h.id), todayLog)
  const pending = activeHabits.filter(h => !todayLog.includes(h.id))

  useEffect(() => {
    if (pending.length > 0) {
      const hour = new Date().getHours()
      if (hour >= 20) {
        setBanner({ msg: `⏰ You still have ${pending.length} habit${pending.length !== 1 ? 's' : ''} to complete today!`, type: 'warning' })
      } else if (pending.length === activeHabits.length) {
        setBanner({ msg: `🌅 Good morning! ${pending.length} habits waiting for you.`, type: 'info' })
      }
    } else if (activeHabits.length > 0) {
      setBanner({ msg: '🎉 All habits done! Perfect day!', type: 'success' })
    }
  }, [])

  const handleAdd = () => {
    if (!newName.trim()) return
    addHabit(newName.trim(), newEmoji)
    setNewName('')
    setNewEmoji('✅')
    setShowAdd(false)
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Today</h1>
          <p className="text-sm text-slate-400">{formatDate(todayKey())}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center text-white"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <ScoreRing score={score} completed={todayLog.length} total={activeHabits.length} />
      </div>

      {banner && (
        <NotificationBanner
          message={banner.msg}
          type={banner.type}
          onDismiss={() => setBanner(null)}
        />
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {activeHabits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-500"
            >
              <p className="text-4xl mb-3">🌱</p>
              <p className="font-medium">No habits yet</p>
              <p className="text-sm mt-1">Tap + to add your first habit</p>
            </motion.div>
          ) : (
            activeHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                done={todayLog.includes(habit.id)}
                onToggle={toggle}
                logs={logs}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-800 rounded-t-3xl z-50 p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">New Habit</h2>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowEmojiPicker(p => !p)}
                  className="w-12 h-12 rounded-xl bg-slate-700 text-2xl flex items-center justify-center hover:bg-slate-600 transition-colors"
                >
                  {newEmoji}
                </button>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder="Habit name..."
                  className="flex-1 bg-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {showEmojiPicker && (
                <div className="grid grid-cols-8 gap-2 mb-4 bg-slate-700/50 rounded-xl p-3">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => { setNewEmoji(e); setShowEmojiPicker(false) }}
                      className={`text-xl p-1 rounded-lg hover:bg-slate-600 transition-colors ${newEmoji === e ? 'bg-blue-500/30' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                Add Habit
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
