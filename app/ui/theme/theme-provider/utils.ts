// Based on Matt Stobbs' excellent article https://www.mattstobbs.com/remix-dark-mode/

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const PREFERS_DARK_MQ = '(prefers-color-scheme: dark)'
const DEFAULT_THEME = Theme.LIGHT
const DEFAULT_COLOR_SCHEME = 'light dark'

function getPrefers() {
  if (typeof document !== 'undefined') {
    const prefers = window.matchMedia(PREFERS_DARK_MQ).matches ? Theme.DARK : Theme.LIGHT
    if (prefers) {
      return prefers 
    } else {
      return DEFAULT_THEME
    }
  } else {
    return DEFAULT_THEME
  }
}

function getPrefersTheme(theme: Theme | null) {
  if (theme) {
    return theme
  } else {
    return getPrefers()
  }
}

function setPrefersTheme(theme: Theme | null) {
  const prefers = getPrefersTheme(theme)
  if (typeof document !== 'undefined') {
    const head = document.documentElement
    head.classList.toggle('dark', prefers === 'dark')
    head.classList.toggle('light', prefers === 'light')
  }
  return prefers
}

function getPrefersColorScheme(theme: Theme | null) {
  let prefers
  if (theme) {
    prefers = theme
  } else {
    prefers = getPrefers()
  }
  return prefers === 'dark' ? 'dark light' : 'light dark'
}

function setPrefersColorScheme(theme: Theme | null) {
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
  DEFAULT_THEME, 
  DEFAULT_COLOR_SCHEME, 
  PREFERS_DARK_MQ, 
  getPrefers,
  getPrefersTheme, 
  setPrefersTheme,
  getPrefersColorScheme,
  setPrefersColorScheme,
  setPrefersSystem,
  isTheme
 }