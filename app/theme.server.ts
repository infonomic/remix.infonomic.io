import { createCookieSessionStorage } from '@remix-run/node'

import invariant from 'tiny-invariant'

import { DEFAULT_THEME, isTheme, ThemeSource } from '~/ui/theme/theme-provider'
import type { Theme } from '~/ui/theme/theme-provider'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: '__app_theme',
    sameSite: 'lax',
    path: '/',
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    // expires: new Date(Date.now() + 60_000),
    maxAge: 34560000, // 400 days - https://chromestatus.com/feature/4887741241229312
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'))
  return {
    getTheme: () => {
      const themeValue = session.get('theme')
      return isTheme(themeValue) ? themeValue : null
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  }
}

// Helper to extract theme from session or header; returns the theme value and
// its source.  TODO:  Move this elsewhere?  Better typing?
async function getTheme(request: Request): Promise<{
  theme: Theme
  source: ThemeSource
}> {
  // First, try to get the theme from the session.
  const themeSession = await getThemeSession(request)
  const theme = themeSession.getTheme()
  if (theme) {
    return {
      theme: theme,
      source: ThemeSource.SESSION,
    }
  }

  // If there's no theme in the session, look for the prefers-color-scheme
  // header.
  const headerVal = request.headers.get('sec-ch-prefers-color-scheme')
  if (isTheme(headerVal)) {
    return {
      theme: headerVal,
      source: ThemeSource.HEADER,
    }
  }

  // Fall back to the default theme.
  return {
    theme: DEFAULT_THEME,
    source: ThemeSource.DEFAULT,
  }
}

export { getThemeSession, getTheme }
