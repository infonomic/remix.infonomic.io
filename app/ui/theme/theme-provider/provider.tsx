// Based initially on https://www.mattstobbs.com/remix-dark-mode/
import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { FetcherWithComponents } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'

import { Theme, prefersDarkMQ, getPrefers, setPrefersSystem, isTheme } from './utils'

// ThemeContext
type ThemeContextType = {
  theme: Theme | null
  setTheme: Function
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ThemeProvider
function ThemeProvider({ children, theme }: { children: ReactNode; theme: Theme | null }) {
  const [themeInState, setThemeInState] = useState<Theme | null>(() => {
    if (theme) {
      if (isTheme(theme)) {
        return theme
      } else {
        return null
      }
    }
    // there's no way for us to know what the theme should be in this context
    // the client will have to figure it out before hydration.
    if (typeof window !== 'object') {
      return null
    }
    return getPrefers()
  })

  // const persistTheme = useFetcher()
  // TODO: remove this when useFetcher/persistTheme is memoized properly
  // const persistThemeRef = useRef(persistTheme)
  // useEffect(() => {
  //   persistThemeRef.current = persistTheme
  // }, [persistTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ)
    const handleChange = () => {
      setPrefersSystem()
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const persistTheme: FetcherWithComponents<any> = useFetcher()
  const contextValue = useMemo(() => {
    function setTheme(newTheme: Theme) {
      persistTheme.submit({ theme: newTheme }, { action: 'actions/set-theme', method: 'post' })
      setThemeInState(newTheme)
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
