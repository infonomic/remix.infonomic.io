/* eslint-disable @typescript-eslint/no-throw-literal */

import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useCatch, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import { deleteNote, getNote } from '~/models/note.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { truncate } from '~/utils/helpers'
import { mergeMeta } from '~/utils/utils'

import type { NoteProps } from '~/modules/notes'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Alert } from '~/ui/components/notifications'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns V2_MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ data, matches }: any) => {
  const title = `Delete Note - ${truncate(
    data?.note?.title,
    50,
    true
  )} Infonomic Remix Workbench App`
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'Expected params.noteId')

  const note = await getNote({ userId, id: params.noteId })
  if (!note) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ note })
}

/**
 * action
 * @param param0
 * @returns
 */
export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request)
  const session = await getSession(request)

  invariant(params.noteId, 'Expected params.noteId')

  const note = await getNote({ userId, id: params.noteId })
  const message = `Note with title: '${note?.title}' was successfully deleted.`
  await deleteNote({ userId, id: params.noteId })

  session.flash('success', message)
  return redirect('/notes', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
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
        {
          path: `/notes/${params.noteId}/delete`,
          label: 'Delete',
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

  return (
    <div className="mx-auto mt-[1vh] flex w-full max-w-[560px] flex-col sm:mt-[4vh]">
      <Alert intent="warning">Warning: This action cannot be undone.</Alert>
      <h3 className="my-2 text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <div className="form-actions flex flex-row justify-end gap-3">
          <Button type="submit" intent="danger">
            Delete
          </Button>
          <Button asChild intent="secondary">
            <Link to={`/notes/${data.note.id}`}>Cancel</Link>
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
