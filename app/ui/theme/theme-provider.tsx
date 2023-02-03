// https://www.mattstobbs.com/remix-dark-mode/
import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { useFetcher } from '@remix-run/react'

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

// Helper to find system preference
const prefersDarkMQ = '(prefers-color-scheme: dark)'
const getSystemPrefersTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT

// Helper to type check Theme value
const themes: Array<Theme> = Object.values(Theme)
function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}

// ThemeContext
type ThemeContextType = {
  theme: Theme | null
  setTheme: Dispatch<SetStateAction<Theme | null>>
}
// type ThemeContextType = (Theme | Dispatch<SetStateAction<Theme | null>> | null)[]
// type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ThemeProvider
function ThemeProvider({ children, theme }: { children: ReactNode; theme: Theme | null }) {
  const [themeInState, setThemeInState] = useState<Theme | null>(() => {
    if (theme) {
      if (themes.includes(theme)) {
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
    return getSystemPrefersTheme()
  })

  const persistTheme = useFetcher()
  // TODO: remove this when useFetcher/persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme)
  useEffect(() => {
    persistThemeRef.current = persistTheme
  }, [persistTheme])

  const mountRun = useRef(false)

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      return
    }
    if (!themeInState) {
      return
    }
    persistThemeRef.current.submit(
      { theme: themeInState },
      { action: 'actions/set-theme', method: 'post' }
    )
  }, [themeInState])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ)
    const handleChange = () => {
      setThemeInState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const contextValue = useMemo(
    () => ({ theme: themeInState, setTheme: setThemeInState }),
    [themeInState, setThemeInState]
  )

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

// JavaScript - needs to be run BEFORE React. See root.tsx
// Sets initial class for theme on <html class="theme"> based
// on system preference.
const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    console.warn(
      "Theme already applied (this should not happen).",
    );
  } else {
    cl.add(theme);
  }

  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn(
      "meta tag name='color-scheme' not found",
    );
  }
})();
`

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const tcx = useTheme()
  return (
    <>
      <meta name="color-scheme" content={tcx.theme === 'light' ? 'light dark' : 'dark light'} />
      {ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}
    </>
  )
}

export { Theme, ThemeProvider, useTheme, NonFlashOfWrongThemeEls, isTheme }
