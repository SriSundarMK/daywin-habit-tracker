import { motion } from 'framer-motion'

export default function ScoreRing({ score, completed, total }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1E293B" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-white dark:text-white"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}%
          </motion.span>
          <span className="text-xs text-slate-400">{completed}/{total} done</span>
        </div>
      </div>
      <p className="text-sm text-slate-400">
        {score === 100 ? '🎉 Perfect day!' : score >= 80 ? '🔥 Great going!' : score >= 40 ? '💪 Keep it up!' : '🌅 Let\'s go!'}
      </p>
    </div>
  )
}
