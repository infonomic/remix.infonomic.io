import * as React from 'react'

import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getNoteListItems } from '~/models/note.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { truncate } from '~/utils/helpers'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Card } from '~/ui/components/card'
import { Toast } from '~/ui/components/notifications'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction = () => ({
  title: 'Notes - Infonomic Remix Workbench',
})

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  const [userId, session] = await Promise.all([requireUserId(request), getSession(request)])

  const noteListItems = await getNoteListItems({ userId })
  const message = session.get('success') || null

  return json(
    { noteListItems, message },
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
      path: '/notes',
      label: 'Notes',
    }
  },
}

/**
 * NoteIndexPage
 * @returns
 */
export default function NoteIndexPage() {
  const data = useLoaderData<typeof loader>()

  const [toast, setToast] = React.useState(!!data.message)

  return (
    <>
      <Toast title="Notes" description={data.message} open={toast} onOpenChange={setToast} />
      <div className="mt-1 mb-3">
        <Button asChild>
          <Link to="/notes/new">New Note</Link>
        </Button>
      </div>
      {data.noteListItems.length === 0
? (
        <p className="p-4">No notes yet</p>
      )
: (
        <div className="grid grid-cols-auto-fit-320 gap-4">
          {data.noteListItems.map(note => (
            <Card asChild key={note.id}>
              <Link to={note.id}>
                <h5 className="mb-2 w-full text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {note.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {truncate(note.body, 200, true)}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
