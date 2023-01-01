import * as React from 'react'

import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getSession, commitSession } from '~/session.server'
import { useUser } from '~/utils/utils'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Card } from '~/ui/components/card'
import { Toast } from '~/ui/components/notifications'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction = () => ({
  title: 'Account - Infonomic - Remix Workbench',
})

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  const [session] = await Promise.all([getSession(request)])

  const message = session.get('success') || null

  return json(
    { message },
    {
      headers: {
        // only necessary with cookieSessionStorage
        'Set-Cookie': await commitSession(session),
      },
    }
  )
}

/**
 * handle
 */
export const handle: BreadcrumbHandle = {
  breadcrumb: () => {
    return {
      path: '/account',
      label: 'Account',
    }
  },
}

/**
 * AccountIndexPage
 * @returns
 */
export default function AccountIndexPage() {
  const user = useUser()
  const data = useLoaderData<typeof loader>()
  const [toast, setToast] = React.useState(!!data.message)

  return (
    <>
      <Toast title="Account" description={data.message} open={toast} onOpenChange={setToast} />
      <div className="grid grid-cols-auto-fit-320 gap-4">
        <Card asChild className="text-center">
          <Link to={`/account/${user.id}/email`}>Email</Link>
        </Card>
        <Card asChild className="text-center">
          <Link to={`/account/${user.id}/password`}>Password</Link>
        </Card>
      </div>
    </>
  )
}
