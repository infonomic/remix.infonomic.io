// Based on Matt Stobbs' excellent article https://www.mattstobbs.com/remix-dark-mode/
import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

import type { FetcherWithComponents } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'

import { Theme, PREFERS_DARK_MQ, getPrefers, setPrefersTheme, setPrefersColorScheme } from './utils'

// ThemeContext
type ThemeContextType = {
  theme: Theme | null
  setTheme: (theme: Theme) => void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ThemeProvider
function ThemeProvider({ children, theme }: { children: ReactNode; theme: Theme }) {
  const persistTheme: FetcherWithComponents<any> = useFetcher()
  const [themeInState, setThemeInState] = useState<Theme>(theme)

  useEffect(() => {
    const mediaQuery = window.matchMedia(PREFERS_DARK_MQ)
    const handleChange = () => {
      const prefers = getPrefers()
      // Optimistically set here so there is no delay in theme change
      setPrefersTheme(prefers)
      setPrefersColorScheme(prefers)
      // Then trigger the state change and theme session cookie change via fetcher
      setThemeInState(prefers)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // useEffect(() => {
  //   // get server theme
  //   // does equal current theme? no,
  //   // setThemeInState(theme)
  // })

  const contextValue = useMemo(() => {
    const setTheme = (prefers: Theme) => {
      persistTheme.submit({ theme: prefers }, { action: 'actions/set-theme', method: 'post' })
      // Optimistically set here so there is no delay in theme change
      setPrefersTheme(prefers)
      // Then trigger the state change and theme session cookie change via fetcher
      setThemeInState(prefers)
    }
    return { theme: themeInState, setTheme }
  }, [themeInState, persistTheme])

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// Hook helper useTheme
function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { Theme, ThemeProvider, useTheme }
