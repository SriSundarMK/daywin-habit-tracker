import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle } from 'lucide-react'

export default function Login({ sendMagicLink }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await sendMagicLink(email.trim())
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-white">DayWin</h1>
          <p className="text-slate-400 mt-2 text-sm">Track habits. Win every day.</p>
        </div>

        {sent ? (
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-green-500/30 text-center">
            <CheckCircle className="text-green-400 mx-auto mb-3" size={40} />
            <p className="text-white font-medium mb-1">Check your email!</p>
            <p className="text-slate-400 text-sm">We sent a magic link to <span className="text-white">{email}</span>. Click it to sign in on any device.</p>
          </div>
        ) : (
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-4 text-center">Enter your email to sign in or create an account. No password needed.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-700 rounded-xl px-3">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-white py-3 text-sm outline-none placeholder:text-slate-500"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-xs px-1">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                <Send size={15} />
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-slate-600 mt-6">Your data syncs across all devices</p>
      </motion.div>
    </div>
  )
}
