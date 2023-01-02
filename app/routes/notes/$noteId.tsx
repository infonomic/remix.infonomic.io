/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react'

import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useCatch, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import { getNote } from '~/models/note.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { truncate } from '~/utils/helpers'

import type { NoteProps } from '~/modules/notes'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types'
import { Button } from '~/ui/components/button'
import { Toast } from '~/ui/components/notifications'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `Note - ${truncate(data?.note?.body, 50, true)} Infonomic - Remix Workbench`,
})

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  const session = await getSession(request)
  invariant(params.noteId, 'Expected params.noteId')

  const note = await getNote({ userId, id: params.noteId })
  if (!note) {
    throw new Response('Not Found', { status: 404 })
  }

  const message = session.get('success') || null

  return json(
    { note, message },
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
export const handle: BreadcrumbHandle<NoteProps> = {
  breadcrumb: ({ data, params }) => {
    if (data?.note) {
      return [
        {
          path: '/notes',
          label: 'Notes',
        },
        {
          path: `/notes/${params.noteId}`,
          label: data.note.title || 'Title Not Found',
        },
      ]
    } else {
      return { path: '/notes/', label: 'Not Found' }
    }
  },
}

/**
 * NoteDetailsPage
 * @returns
 */
export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>()

  const [toast, setToast] = React.useState(!!data.message)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      {/* Important!: see comments in app/ui/components/notifications/styles/toast.ts regarding toast position */}
      <Toast title="Notes" iconType="success" intent="secondary" position="top-right" description={data.message} open={toast} onOpenChange={setToast} />
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <div className="form-actions flex flex-row justify-end gap-3">
          <Button asChild intent="secondary">
            <Link to={`/notes/${data.note.id}/delete`}>Delete</Link>
          </Button>
          <Button asChild intent="secondary">
            <Link to={`/notes/${data.note.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild intent="secondary">
            <Link to={'/notes'}>Close</Link>
          </Button>
        </div>
      </Form>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  // eslint-disable-next-line no-console
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <ErrorLayout>
        <div>
          <h1>Not Found</h1>
          <p>Oops. Note not found.</p>
        </div>
      </ErrorLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
