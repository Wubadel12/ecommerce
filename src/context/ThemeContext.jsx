import { useEffect, useMemo, useState } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'
import { ThemeContext } from './themeContext'

function validTheme(value) {
  return value === 'light' || value === 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, 'light', validTheme))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    writeStorage(STORAGE_KEYS.theme, theme)
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme() { setTheme((current) => current === 'light' ? 'dark' : 'light') },
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
