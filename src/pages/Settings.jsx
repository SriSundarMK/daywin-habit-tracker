import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, Sun, Moon, Download, RotateCcw, Check, X, LogOut } from 'lucide-react'
import { exportData } from '../utils/localStorage'
import { calcBestStreak, calcStreak } from '../utils/scoreCalculator'

const EMOJIS = ['✅', '💪', '📚', '🏃', '🥗', '😴', '🧠', '🎯', '💧', '🌿', '⏰', '🧘', '🚶', '🍎', '☀️', '🔥', '🌙', '⚡', '🎵', '🌊']

export default function Settings({ habits, activeHabits, logs, updateHabit, deleteHabit, resetToday, theme, toggleTheme, signOut, user }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmoji, setEditEmoji] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const startEdit = (habit) => {
    setEditingId(habit.id)
    setEditName(habit.name)
    setEditEmoji(habit.emoji)
    setShowEmojiPicker(false)
  }

  const saveEdit = () => {
    if (!editName.trim()) return
    updateHabit(editingId, { name: editName.trim(), emoji: editEmoji })
    setEditingId(null)
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daywin-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    clearAllData()
    window.location.reload()
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-sm text-slate-400 mb-6">Manage your habits & preferences</p>

      {/* Theme toggle */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Appearance</p>
            <p className="text-xs text-slate-400 mt-0.5">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Habits list */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <p className="font-medium text-white">My Habits</p>
        </div>
        <div className="divide-y divide-slate-700/30">
          {habits.map(habit => {
            const streak = calcStreak(habit.id, logs)
            const best = calcBestStreak(habit.id, logs)
            const isEditing = editingId === habit.id

            return (
              <div key={habit.id} className="px-4 py-3">
                {isEditing ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setShowEmojiPicker(p => !p)}
                        className="w-10 h-10 rounded-lg bg-slate-700 text-xl flex items-center justify-center"
                      >
                        {editEmoji}
                      </button>
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null) }}
                        className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={saveEdit} className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="w-9 h-9 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-600">
                        <X size={16} />
                      </button>
                    </div>
                    {showEmojiPicker && (
                      <div className="grid grid-cols-8 gap-1.5 bg-slate-700/50 rounded-xl p-3">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => { setEditEmoji(e); setShowEmojiPicker(false) }}
                            className={`text-lg p-1 rounded-lg hover:bg-slate-600 ${editEmoji === e ? 'bg-blue-500/30' : ''}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{habit.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${habit.active ? 'text-white' : 'text-slate-500 line-through'}`}>{habit.name}</p>
                      <p className="text-xs text-slate-500">Streak: {streak} · Best: {best}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateHabit(habit.id, { active: !habit.active })}
                        className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                          habit.active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                        }`}
                      >
                        {habit.active ? 'Active' : 'Paused'}
                      </button>
                      <button onClick={() => startEdit(habit)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteHabit(habit.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-slate-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {habits.length === 0 && (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">No habits added yet</div>
          )}
        </div>
      </div>

      {/* Data actions */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <p className="font-medium text-white">Data</p>
        </div>
        <div className="divide-y divide-slate-700/30">
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/30 transition-colors text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Download size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Export Data</p>
              <p className="text-xs text-slate-400">Download as JSON</p>
            </div>
          </button>

          <div>
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/30 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <RotateCcw size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Reset Today</p>
                  <p className="text-xs text-slate-400">Clear today's completions</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3">
                <p className="text-sm text-amber-400 flex-1">Reset today's progress?</p>
                <button onClick={() => { resetToday(); setConfirmReset(false) }} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium">Yes</button>
                <button onClick={() => setConfirmReset(false)} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs">No</button>
              </div>
            )}
          </div>

          <div>
            {!confirmClear ? (
              <button onClick={() => setConfirmClear(true)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/30 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={16} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-red-400 font-medium">Clear All Data</p>
                  <p className="text-xs text-slate-400">Cannot be undone</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3">
                <p className="text-sm text-red-400 flex-1">Delete everything?</p>
                <button onClick={handleClearAll} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium">Delete</button>
                <button onClick={() => setConfirmClear(false)} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <p className="font-medium text-white">Account</p>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Signed in as</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">DayWin v1.0 · Data syncs across devices</p>
    </div>
  )
}
