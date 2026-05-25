import { motion, AnimatePresence } from 'framer-motion'
import { calcStreak, getStreakBadge } from '../utils/scoreCalculator'

export default function HabitCard({ habit, done, onToggle, logs }) {
  const streak = calcStreak(habit.id, logs)
  const badge = getStreakBadge(streak)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center gap-4 rounded-2xl p-4 border transition-colors duration-200 ${
        done
          ? 'bg-green-500/10 border-green-500/40'
          : 'bg-slate-800/60 border-slate-700/50 dark:bg-slate-800/60'
      }`}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className="flex-shrink-0 relative"
        aria-label={done ? 'Unmark habit' : 'Mark habit done'}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
          done ? 'scale-110' : 'hover:scale-105 active:scale-95'
        }`}>
          {habit.emoji}
        </div>
        <AnimatePresence>
          {done && (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${done ? 'text-green-400' : 'text-white'}`}>
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {streak > 0 && (
            <span className="text-xs text-orange-400 flex items-center gap-0.5">
              🔥 {streak} day{streak !== 1 ? 's' : ''}
            </span>
          )}
          {badge && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.color} ${badge.bg}`}>
              {badge.label}
            </span>
          )}
          {streak === 0 && (
            <span className="text-xs text-slate-500">No streak yet</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onToggle(habit.id)}
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
          done
            ? 'bg-green-500 border-green-500'
            : 'border-slate-600 hover:border-blue-400'
        }`}
      >
        {done && (
          <svg viewBox="0 0 10 8" className="w-3.5 h-3.5" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </motion.div>
  )
}
