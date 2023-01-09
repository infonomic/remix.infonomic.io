import { json } from '@remix-run/node'
import type { ActionFunction, ActionArgs } from '@remix-run/node'

import { getThemeSession } from '~/theme.server'

import { isTheme } from '~/ui/theme/theme-provider'

/**
 * action
 * @param param0
 * @returns
 */
export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const themeSession = await getThemeSession(request)
  const requestText = await request.text()
  const form = new URLSearchParams(requestText)
  const theme = form.get('theme')

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    })
  }

  themeSession.setTheme(theme)
  return json({ success: true }, { headers: { 'Set-Cookie': await themeSession.commit() } })
}
