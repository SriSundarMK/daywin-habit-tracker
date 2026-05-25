import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthDays, isToday, isFuture, getMonthLabel, todayKey, formatDate } from '../utils/dateHelpers'
import { calcDayScore } from '../utils/scoreCalculator'

function getDayColor(score, isCurrentDay, future) {
  if (future) return 'bg-slate-800/30 text-slate-700'
  if (score === null) return 'bg-transparent'
  if (isCurrentDay && score === 0) return 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500'
  if (score >= 80) return 'bg-green-500/30 text-green-400'
  if (score >= 40) return 'bg-amber-500/30 text-amber-400'
  if (score > 0) return 'bg-red-500/20 text-red-400'
  return 'bg-slate-700/30 text-slate-500'
}

export default function History({ activeHabits, logs }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(null)

  const days = useMemo(() => getMonthDays(year, month), [year, month])
  const habitIds = activeHabits.map(h => h.id)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const selectedLog = selected ? (logs[selected] || []) : []
  const selectedHabits = selected
    ? activeHabits.map(h => ({ ...h, done: selectedLog.includes(h.id) }))
    : []

  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-2xl font-bold text-white mb-1">History</h1>
      <p className="text-sm text-slate-400 mb-6">Your daily record</p>

      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <p className="font-semibold text-white">{getMonthLabel(year, month)}</p>
        <button
          onClick={nextMonth}
          disabled={year === now.getFullYear() && month === now.getMonth()}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-slate-300 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <div key={d} className="text-center text-xs text-slate-500 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((dateStr, i) => {
          if (!dateStr) return <div key={`empty-${i}`} />
          const dayLog = logs[dateStr] || []
          const score = isFuture(dateStr) ? null : calcDayScore(habitIds, dayLog)
          const today = isToday(dateStr)
          const future = isFuture(dateStr)
          const dayNum = parseInt(dateStr.split('-')[2])
          const isSelected = selected === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => !future && setSelected(isSelected ? null : dateStr)}
              disabled={future}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                ${getDayColor(score, today, future)}
                ${isSelected ? 'ring-2 ring-blue-400 scale-110' : 'hover:scale-105'}
                ${future ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              {dayNum}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {[
          { color: 'bg-green-500/30', label: '80–100%' },
          { color: 'bg-amber-500/30', label: '40–79%' },
          { color: 'bg-red-500/20', label: '1–39%' },
          { color: 'bg-slate-700/30', label: '0%' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-sm font-medium text-slate-300 mb-3">{formatDate(selected)}</p>
          {selectedHabits.length === 0 ? (
            <p className="text-slate-500 text-sm">No habits tracked</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedHabits.map(h => (
                <div key={h.id} className="flex items-center gap-3">
                  <span className={`text-base ${h.done ? '' : 'grayscale opacity-40'}`}>{h.emoji}</span>
                  <span className={`text-sm ${h.done ? 'text-white' : 'text-slate-500 line-through'}`}>{h.name}</span>
                  {h.done && <span className="ml-auto text-green-400 text-xs">Done</span>}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <span className="text-sm text-slate-400">
              Score: <span className="font-bold text-white">{calcDayScore(habitIds, selectedLog)}%</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
