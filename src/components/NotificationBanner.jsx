import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function NotificationBanner({ message, type = 'info', onDismiss }) {
  const colors = {
    info: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    warning: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    success: 'bg-green-500/20 border-green-500/40 text-green-300',
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border text-sm mb-3 ${colors[type]}`}
        >
          <span>{message}</span>
          {onDismiss && (
            <button onClick={onDismiss} className="flex-shrink-0 opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
