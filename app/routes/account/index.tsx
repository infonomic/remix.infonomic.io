import * as React from 'react'

import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getSession, commitSession } from '~/session.server'
import { useUser, mergeMeta } from '~/utils/utils'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Card } from '~/ui/components/card'
import { Toast } from '~/ui/components/notifications'

/**
 * meta
 * @returns V2_MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ matches }: any) => {
  const title = 'Account - Infonomic Remix Workbench'
  return mergeMeta(matches,
    [
      { title },
      { property: 'og:title', content: title },
    ]
  )
}

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
      {/* Important!: see comments in app/ui/components/notifications/styles/toast.ts regarding toast position */}
      <Toast title="Account" intent="secondary" position="top-right" description={data.message} open={toast} onOpenChange={setToast} />
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
