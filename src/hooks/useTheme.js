import { useState, useEffect } from 'react'
import { getTheme, saveTheme } from '../utils/localStorage'

export function useTheme() {
  const [theme, setTheme] = useState(() => getTheme())

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    saveTheme(theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return { theme, toggle }
}
