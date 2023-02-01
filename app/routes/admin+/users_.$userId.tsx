/* eslint-disable @typescript-eslint/no-throw-literal */
import type { LoaderArgs, V2_MetaFunction, V2_HtmlMetaDescriptor } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import invariant from 'tiny-invariant'
import { getUserWithNotes } from '~/models/user.server'
import { requireUserId } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import type { UserProps } from '~/modules/admin'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns {V2_HtmlMetaDescriptor[]}
 */
export const meta: V2_MetaFunction = ({ matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'Admin - User - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request)
  invariant(params.userId, 'Expected params.userId')

  const user = await getUserWithNotes(params.userId)
  if (!user) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ user })
}

/**
 * handle
 */
export const handle: BreadcrumbHandle<UserProps> = {
  breadcrumb: ({ data, params }) => {
    if (data?.user) {
      return [
        {
          path: '/admin',
          label: 'Admin',
        },
        {
          path: '/admin/users',
          label: 'Users',
        },
        {
          path: `/admin/users/${params.userId}`,
          label: data.user?.email || 'User Not Found',
        },
      ]
    } else {
      return { path: '/admin/users', label: 'Not Found' }
    }
  },
}

/**
 * UserDetailsPage
 * @returns
 */
export default function UserDetailsPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <h3 className="text-2xl font-bold">{data?.user?.email}</h3>
      <p>
        Account created:{' '}
        {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(
          new Date(data?.user.createdAt)
        )}
      </p>
      <hr className="my-4" />
      <p>Table of notes here...</p>
      {data?.user?.notes && data?.user?.notes.map(note => <p key={note.id}>{note.title}</p>)}
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
          <p>Oops. User not found.</p>
        </div>
      </ErrorLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
