import * as React from 'react'
import { useForm } from 'react-hook-form'

import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Form, useCatch, useActionData, useSubmit, useTransition } from '@remix-run/react'

import { zodResolver } from '@hookform/resolvers/zod'
import Loader from 'react-spinners/BeatLoader'
import invariant from 'tiny-invariant'
import { updateUserPassword, getUserById } from '~/models/user.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { isBusy } from '~/utils/helpers'

import { passwordSchema } from '~/modules/account'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Input } from '~/ui/components/input'
import { hasErrors, getErrorText } from '~/ui/components/input/utils'
import { Alert } from '~/ui/components/notifications'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction<typeof loader> = () => ({
  title: 'Update Password - Infonomic - Remix Workbench',
})

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.userId, 'Expected params.userId')

  const user = await getUserById(userId)
  if (!user) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response('Not Found', { status: 404 })
  }
  return json({ user })
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

  invariant(params.userId, 'Expected params.userId')

  const parseResult = passwordSchema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  const user = await updateUserPassword(
    userId,
    parseResult.data.currentPassword,
    parseResult.data.password
  )

  if (user) {
    session.flash(
      'success',
      `Password for user with email: '${user?.email}' was successfully updated.`
    )
    return redirect('/account', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } else {
    return json({ errors: { general: { _errors: ['Error updating password'] } } }, { status: 400 })
  }
}

/**
 * handle
 */
export const handle: BreadcrumbHandle = {
  breadcrumb: () => {
    return [
      {
        path: '/account',
        label: 'Account',
      },
      {
        path: '/account/email',
        label: 'Update Password',
      },
    ]
  },
}

const fields = ['email']

/**
 * UserPasswordEditPage
 * @returns
 */
export default function UserPasswordEditPage() {
  const actionData = useActionData<typeof action>()
  const serverErrors = actionData?.errors
  const submit = useSubmit()
  const transition = useTransition()
  const resolver = zodResolver(passwordSchema)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({ resolver })
  const busy = isBusy(transition)

  React.useEffect(() => {
    if (!serverErrors) return
    const field = fields.find(name => serverErrors[name as keyof typeof serverErrors])
    if (field) setFocus(field)
  }, [serverErrors, setFocus])

  return (
    <div className="m-auto w-full max-w-[560px] md:mt-8">
      {hasErrors('general', errors, serverErrors) && (
        <Alert intent="danger">{getErrorText('general', errors, serverErrors)}</Alert>
      )}
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
          required
          id="currentPassword"
          type="password"
          label="Current Password"
          placeHolder="Current Password"
          autoComplete="current-password"
          disabled={busy}
          helpText="Please enter your current password."
          error={hasErrors('currentPassword', errors, serverErrors)}
          errorText={getErrorText('currentPassword', errors, serverErrors)}
          {...register('currentPassword')}
        />

        <Input
          required
          id="password"
          type="password"
          label="New Password"
          placeHolder="New Password"
          autoComplete="current-password"
          disabled={busy}
          helpText="Please enter a new password."
          error={hasErrors('password', errors, serverErrors)}
          errorText={getErrorText('password', errors, serverErrors)}
          {...register('password')}
        />

        <Input
          required
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeHolder="Confirm Password"
          disabled={busy}
          helpText="Please confirm your new password."
          error={hasErrors('confirmPassword', errors, serverErrors)}
          errorText={getErrorText('confirmPassword', errors, serverErrors)}
          {...register('confirmPassword')}
        />

        <div className="form-actions flex flex-row justify-end gap-3">
          <Button disabled={busy} type="submit">
            {busy
              ? (
                <Loader
                  loading={busy}
                  color="var(--loader-color)"
                  size={8}
                  margin={2}
                  aria-label="Processing sign in"
                  data-testid="loader"
                />
              )
              : (
                'Save'
              )}
          </Button>
          <Button asChild intent="secondary">
            <Link to="/account">Cancel</Link>
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
          <p>Oops. User not found.</p>
        </div>
      </ErrorLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
