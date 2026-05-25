import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getWeekDays, getDayLabel } from '../utils/dateHelpers'
import { calcDayScore } from '../utils/scoreCalculator'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 rounded-xl px-3 py-2 text-sm">
        <p className="text-slate-300">{label}</p>
        <p className="text-blue-400 font-bold">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function Weekly({ activeHabits, logs }) {
  const weekDays = getWeekDays(0)

  const chartData = useMemo(() => {
    return weekDays.map(day => {
      const dayLog = logs[day] || []
      const score = calcDayScore(activeHabits.map(h => h.id), dayLog)
      return { day: getDayLabel(day), score, date: day }
    })
  }, [weekDays, logs, activeHabits])

  const habitStats = useMemo(() => {
    return activeHabits.map(habit => {
      const done = weekDays.filter(day => (logs[day] || []).includes(habit.id)).length
      return { ...habit, done, pct: Math.round((done / 7) * 100) }
    }).sort((a, b) => b.pct - a.pct)
  }, [activeHabits, logs, weekDays])

  const weekAvg = Math.round(chartData.reduce((s, d) => s + d.score, 0) / 7)
  const best = habitStats[0]
  const worst = habitStats[habitStats.length - 1]

  const totalCompletions = weekDays.reduce((sum, day) => {
    return sum + (logs[day] || []).length
  }, 0)
  const totalPossible = activeHabits.length * 7

  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-2xl font-bold text-white mb-1">Weekly Report</h1>
      <p className="text-sm text-slate-400 mb-6">This week's performance</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Week Score" value={`${weekAvg}%`} sub="Daily average" color="text-blue-400" />
        <StatCard
          label="Completion"
          value={`${totalPossible ? Math.round((totalCompletions / totalPossible) * 100) : 0}%`}
          sub={`${totalCompletions}/${totalPossible} habits`}
          color="text-green-400"
        />
      </div>

      {/* Bar chart */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 mb-6">
        <p className="text-sm font-medium text-slate-300 mb-4">Daily Score</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score >= 80 ? '#22C55E' : entry.score >= 40 ? '#F59E0B' : entry.score > 0 ? '#EF4444' : '#334155'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-habit breakdown */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 mb-6">
        <p className="text-sm font-medium text-slate-300 mb-4">Habit Breakdown</p>
        <div className="flex flex-col gap-3">
          {habitStats.map(habit => (
            <div key={habit.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white flex items-center gap-2">
                  <span>{habit.emoji}</span> {habit.name}
                </span>
                <span className="text-sm font-medium text-slate-300">{habit.pct}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${habit.pct}%`,
                    background: habit.pct >= 80 ? '#22C55E' : habit.pct >= 40 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </div>
            </div>
          ))}
          {habitStats.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">No habits to report</p>
          )}
        </div>
      </div>

      {/* Highlights */}
      {best && (
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
            <p className="text-xs text-green-400 mb-1">⭐ Best habit this week</p>
            <p className="text-white font-medium">{best.emoji} {best.name}</p>
            <p className="text-green-400 text-sm">{best.done}/7 days completed</p>
          </div>
          {worst && worst.id !== best.id && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
              <p className="text-xs text-amber-400 mb-1">⚠️ Needs attention</p>
              <p className="text-white font-medium">{worst.emoji} {worst.name}</p>
              <p className="text-amber-400 text-sm">{worst.done}/7 days completed</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
