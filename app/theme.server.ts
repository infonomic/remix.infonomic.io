import { createCookieSessionStorage } from '@remix-run/node'

import invariant from 'tiny-invariant'

import { isTheme } from '~/ui/theme/theme-provider'
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

export { getThemeSession }