import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import History from './pages/History'
import Weekly from './pages/Weekly'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'
import { useHabits } from './hooks/useHabits'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function App() {
  const [tab, setTab] = useState('home')
  const { theme, toggle: toggleTheme } = useTheme()
  const { profileId, importProfile } = useAuth()
  const {
    habits, activeHabits, logs, todayLog, syncing,
    toggle, addHabit, updateHabit, deleteHabit, resetToday,
  } = useHabits(profileId)

  if (!profileId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🏆</div>
      </div>
    )
  }

  const pendingCount = activeHabits.filter(h => !todayLog.includes(h.id)).length

  const pages = {
    home: <Home habits={habits} activeHabits={activeHabits} logs={logs} todayLog={todayLog} toggle={toggle} addHabit={addHabit} syncing={syncing} />,
    history: <History activeHabits={activeHabits} logs={logs} />,
    weekly: <Weekly activeHabits={activeHabits} logs={logs} />,
    settings: <Settings habits={habits} activeHabits={activeHabits} logs={logs} updateHabit={updateHabit} deleteHabit={deleteHabit} resetToday={resetToday} theme={theme} toggleTheme={toggleTheme} profileId={profileId} importProfile={importProfile} />,
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18 }}
          >
            {pages[tab]}
          </motion.div>
        </AnimatePresence>
        <BottomNav active={tab} onChange={setTab} pendingCount={pendingCount} />
      </div>
    </div>
  )
}
