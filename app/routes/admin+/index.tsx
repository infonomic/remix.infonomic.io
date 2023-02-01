import * as React from 'react'

import type { LoaderArgs, V2_MetaFunction, V2_HtmlMetaDescriptor } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getSession, commitSession } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Card } from '~/ui/components/card'
import { Toast } from '~/ui/components/notifications'

/**
 * meta
 * @returns {V2_HtmlMetaDescriptor[]}
 */
export const meta: V2_MetaFunction = ({ matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'Admin - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
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
      path: '/admin',
      label: 'Admin',
    }
  },
}

/**
 * AdminIndexPage
 * @returns
 */
export default function AdminIndexPage() {
  const data = useLoaderData<typeof loader>()
  const [toast, setToast] = React.useState(!!data.message)

  return (
    <>
      <Toast title="Notes" description={data.message} open={toast} onOpenChange={setToast} />
      <div className="grid grid-cols-auto-fit-320 gap-4">
        <Card asChild className="prose text-center dark:prose-invert">
          <Link to="/admin/users">Users</Link>
        </Card>
      </div>
    </>
  )
}
