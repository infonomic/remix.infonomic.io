import * as React from 'react'
import { useForm } from 'react-hook-form'

import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useCatch,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from '@remix-run/react'
import { Link } from '@remix-run/react'

import { zodResolver } from '@hookform/resolvers/zod'
import invariant from 'tiny-invariant'
import { editNote, getNote } from '~/models/note.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { truncate } from '~/utils/helpers'
import { mergeMeta } from '~/utils/utils'

import { schema } from '~/modules/notes'
import type { NoteProps } from '~/modules/notes'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Input, TextArea } from '~/ui/components/input'
import { hasErrors, getErrorText } from '~/ui/components/input/utils'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns MetaFunction
 * TODO: ts type for meta
 * New v2 meta api
 * https://github.com/remix-run/remix/releases/tag/remix%401.8.0
 * https://github.com/remix-run/remix/discussions/4462 
 * V2_MetaFunction interface is currently in v1.10.0-pre.5
 */
export const meta = ({ data, matches }: any) => {
  const title = `Edit Note - ${truncate(data?.note?.title, 50, true)} Infonomic Remix Workbench App`
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
export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'Expected params.noteId')

  const note = await getNote({ userId, id: params.noteId })
  if (!note) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
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
  const [userId, session, formData] = await Promise.all([
    requireUserId(request),
    getSession(request),
    request.formData(),
  ])

  invariant(params.noteId, 'Expected params.noteId')

  const parseResult = schema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  await editNote({
    id: params.noteId,
    title: parseResult.data.title,
    body: parseResult.data.body,
    userId,
  })

  const note = await getNote({ userId, id: params.noteId })

  session.flash('success', `Note with title: '${note?.title}' was successfully updated.`)
  return redirect(`/notes/${note?.id}`, {
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
          path: `/notes/${params.noteId}/edit`,
          label: 'Edit',
        },
      ]
    } else {
      return { path: '/notes/', label: 'Not Found' }
    }
  },
}

const fields = ['title', 'body']

/**
 * NoteEditPage
 * @returns
 */
export default function NoteEditPage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const serverErrors = actionData?.errors
  const submit = useSubmit()
  const transition = useTransition()
  const submitting = Boolean(transition.submission)
  const resolver = zodResolver(schema)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({ resolver })

  React.useEffect(() => {
    if (serverErrors) {
      const field = fields.find(name => serverErrors[name as keyof typeof serverErrors])
      if (field) setFocus(field)
    }
  }, [serverErrors, setFocus])

  return (
    <div className="m-auto w-full max-w-[560px] md:mt-8">
      <Form
        method="post"
        onSubmit={(event: any) => {
          handleSubmit(() => submit(event.target))(event)
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Input
          id="title"
          required
          defaultValue={data.note.title}
          label="Title"
          placeHolder="Title"
          helpText="Please enter a title."
          error={hasErrors('title', errors, serverErrors)}
          errorText={getErrorText('title', errors, serverErrors)}
          {...register('title')}
        />

        <TextArea
          id="body"
          required
          defaultValue={data.note.body}
          rows={8}
          label="Body"
          helpText="Please enter a body."
          error={hasErrors('body', errors, serverErrors)}
          errorText={getErrorText('body', errors, serverErrors)}
          {...register('body')}
        />

        <div className="form-actions flex flex-row justify-end gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? '...' : 'Save'}
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
