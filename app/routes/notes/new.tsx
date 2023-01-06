import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSubmit, useTransition } from '@remix-run/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createNote } from '~/models/note.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { mergeMeta } from '~/utils/utils'

import { schema } from '~/modules/notes'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Input, TextArea } from '~/ui/components/input'
import { hasErrors, getErrorText } from '~/ui/components/input/utils'

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
  const title = 'New Note - Infonomic Remix Workbench App'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

/**
 * action
 * @param param0
 * @returns
 */
export async function action({ request }: ActionArgs) {
  const [userId, session, formData] = await Promise.all([
    requireUserId(request),
    getSession(request),
    request.formData(),
  ])

  const parseResult = schema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  const note = await createNote({
    title: parseResult.data.title,
    body: parseResult.data.body,
    userId,
  })

  session.flash('success', `Note with title: '${note?.title}' was successfully created.`)
  return redirect('/notes', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

/**
 * handle
 */
export const handle: BreadcrumbHandle = {
  breadcrumb: () => {
    return [
      {
        path: '/notes',
        label: 'Notes',
      },
      {
        path: '/notes/new',
        label: 'New Note',
      },
    ]
  },
}

const fields = ['title', 'body']

/**
 * NewNotePage
 * @returns
 */
export default function NewNotePage() {
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

  useEffect(() => {
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
        className="flex w-full flex-col"
      >
        <Input
          required
          id="title"
          label="Title"
          placeHolder="Title"
          helpText="Please enter a title."
          error={hasErrors('title', errors, serverErrors)}
          errorText={getErrorText('title', errors, serverErrors)}
          {...register('title')}
        />
        <TextArea
          required
          id="body"
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
            <Link to={'/notes'}>Cancel</Link>
          </Button>
        </div>
      </Form>
    </div>
  )
}
