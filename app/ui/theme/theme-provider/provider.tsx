// Based on Matt Stobbs' excellent article https://www.mattstobbs.com/remix-dark-mode/
import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { FetcherWithComponents } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'

import {
  Theme,
  PREFERS_DARK_MQ,
  setPrefersTheme,
  setPrefersColorScheme,
  ThemeSource,
} from './utils'

// ThemeContext
type ThemeContextType = {
  theme: Theme | null
  setTheme: (theme: Theme) => void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
  theme: Theme
  themeSource?: ThemeSource
}

// ThemeProvider
function ThemeProvider({ children, theme, themeSource = ThemeSource.DEFAULT }: ThemeProviderProps) {
  const persistTheme: FetcherWithComponents<any> = useFetcher()
  const [themeInState, setThemeInState] = useState<Theme>(theme)

  // This effect will install an event listener to react to browser
  // prefers-color-scheme changes, but only if the current theme is based on the
  // browser having sent the sec-ch-prefers-color-scheme header.  If the theme
  // is based on session (i.e. the user selected the theme manually) we don't
  // change themes here (when the theme is set manually, and stored in the session,
  // we don't base the theme on prefers-color-scheme at all, so we shouldn't update
  // the theme when it changes).  TBH this is probably overkill, and can safely
  // be deleted.
  useEffect(() => {
    if (themeSource === ThemeSource.HEADER) {
      const mediaQuery = window.matchMedia(PREFERS_DARK_MQ)
      const handleChange = (ev: MediaQueryListEvent) => {
        const prefers = ev.matches ? Theme.DARK : Theme.LIGHT
        setPrefersTheme(prefers)
        setPrefersColorScheme(prefers)
        setThemeInState(prefers)
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, themeSource])

  const contextValue = useMemo(() => {
    const setTheme = (prefers: Theme) => {
      persistTheme.submit({ theme: prefers }, { action: 'actions/set-theme', method: 'post' })
      // Optimistically set here so there is no delay in theme change
      setPrefersTheme(prefers)
      setPrefersColorScheme(prefers)
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
