import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { logout } from '~/session.server'

/**
 * loader
 * @returns
 */
export async function loader() {
  return redirect('/')
}

/**
 * action
 * @param param0
 * @returns
 */
export async function action({ request }: ActionArgs) {
  return logout(request)
}
