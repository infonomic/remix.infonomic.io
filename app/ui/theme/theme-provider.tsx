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

function setHeadAndMeta() {
  const head = document.documentElement
  if (head.dataset.themeNoprefs === 'true') {
    const theme = window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT

    head.classList.toggle('dark', theme === Theme.DARK)
    head.classList.toggle('light', theme === Theme.LIGHT)

    const meta: any = document.querySelector('meta[name=color-scheme]')
    if (meta) {
      if (theme === 'dark') {
        meta.content = 'dark light'
      } else if (theme === 'light') {
        meta.content = 'light dark'
      }
    } else {
      console.warn('meta tag name="color-scheme" not found')
    }
  }
}

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
    } else {
      return null
    }
    // // there's no way for us to know what the theme should be in this context
    // // the client will have to figure it out before hydration.
    // if (typeof window !== 'object') {
    //   return null
    // }
    // return getSystemPrefersTheme()
  })

  const persistTheme = useFetcher()
  // TODO: remove this when useFetcher/persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme)
  // useEffect(() => {
  //   persistThemeRef.current = persistTheme
  // }, [persistTheme])

  // const mountRun = useRef(false)

  // useEffect(() => {
  //   if (!mountRun.current) {
  //     mountRun.current = true
  //     return
  //   }
  //   if (!themeInState) {
  //     return
  //   }
  //   persistThemeRef.current.submit(
  //     { theme: themeInState },
  //     { action: 'actions/set-theme', method: 'post' }
  //   )
  // }, [themeInState])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ)
    const handleChange = () => {
      setThemeInState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT)
      setHeadAndMeta()
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
// Sets the system preference theme if no SSR theme / cookie
// has been set. Note that this will only execute once - before
// entry.client.tsx hydrate - and so will only execute on a
// first or full page reload.
const clientThemeCode = `
;(() => {
  console.log('clientThemCode executed');
  const head = document.documentElement;
  if(head.dataset.themeNoprefs === "true") {
    const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
      ? 'dark'
      : 'light';
    
    head.classList.toggle('dark', theme === 'dark');
    head.classList.toggle('light', theme === 'light');

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
  }
})();
`

function ThemeMetaAndPrefs({ ssrTheme }: { ssrTheme: string | null }) {
  // Fallback or default colorScheme - must match
  // the fallback theme in root.tsx
  let colorScheme = 'light dark'
  if (ssrTheme && ssrTheme === 'dark') {
    colorScheme = 'dark light'
  } else {
    let preferredTheme
    if (typeof window === 'object') {
      preferredTheme = window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT
      const head = document.documentElement
      head.classList.toggle('dark', preferredTheme === 'dark')
      head.classList.toggle('light', preferredTheme === 'light')
      colorScheme = preferredTheme === 'dark' ? 'dark light' : 'light dark'
      console.log(preferredTheme)
    }
  }
  return (
    <>
      <meta name="color-scheme" content={colorScheme} />
      {ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}
    </>
  )
}

export { Theme, ThemeProvider, useTheme, ThemeMetaAndPrefs, isTheme }
