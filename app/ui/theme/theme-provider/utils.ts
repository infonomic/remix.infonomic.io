// Based on Matt Stobbs' excellent article https://www.mattstobbs.com/remix-dark-mode/

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const prefersDarkMQ = '(prefers-color-scheme: dark)'
const defaultTheme = Theme.LIGHT
const defaultColorScheme = 'light dark'

function getPrefers() {
  if (typeof document !== 'undefined') {
    const prefers = window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT
    if (prefers) {
      return prefers 
    } else {
      return defaultTheme
    }
  } else {
    return defaultTheme
  }
}

function getPrefersTheme(theme: string | null) {
  if (theme) {
    return theme
  } else {
    return getPrefers()
  }
}

function setPrefersTheme(theme: string | null) {
  const prefers = getPrefersTheme(theme)
  if (typeof document !== 'undefined') {
    const head = document.documentElement
    head.classList.toggle('dark', prefers === 'dark')
    head.classList.toggle('light', prefers === 'light')
  }
  return prefers
}

function getPrefersColorScheme(theme: string | null) {
  let prefers
  if (theme) {
    prefers = theme
  } else {
    prefers = getPrefers()
  }
  return prefers === 'dark' ? 'dark light' : 'light dark'
}

function setPrefersColorScheme(theme: string | null) {
  let prefers
  if (theme) {
    prefers = theme
  } else {
    prefers = getPrefers()
  }
  if (typeof document !== 'undefined') {
    const meta: any = document.querySelector('meta[name=color-scheme]')
      if (meta) {
        if (prefers === 'dark') {
          meta.content = 'dark light'
        } else if (prefers === 'light') {
          meta.content = 'light dark'
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('meta tag name="color-scheme" not found')
      }
  }
}


function setPrefersSystem() {
  if (typeof document !== 'undefined') {
    const head = document.documentElement
    if (head.dataset.themeNoprefs === 'true') {
      const prefers = getPrefers()
      head.classList.toggle('dark', prefers === Theme.DARK)
      head.classList.toggle('light', prefers === Theme.LIGHT)

      const meta: any = document.querySelector('meta[name=color-scheme]')
      if (meta) {
        if (prefers === 'dark') {
          meta.content = 'dark light'
        } else if (prefers === 'light') {
          meta.content = 'light dark'
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('meta tag name="color-scheme" not found')
      }
    }
  }
}

// Helper to type check Theme value
const themes: Array<Theme> = Object.values(Theme)
function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}


export { 
  Theme, 
  defaultTheme, 
  defaultColorScheme, 
  prefersDarkMQ, 
  getPrefers,
  getPrefersTheme, 
  setPrefersTheme,
  getPrefersColorScheme,
  setPrefersColorScheme,
  setPrefersSystem,
  isTheme
 }