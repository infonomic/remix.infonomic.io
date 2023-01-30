import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type {
  LoaderArgs,
  ActionArgs,
  V2_MetaFunction,
  V2_HtmlMetaDescriptor,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import {
  Form,
  useCatch,
  useActionData,
  useLoaderData,
  useSubmit,
  useNavigation,
} from '@remix-run/react'

import { zodResolver } from '@hookform/resolvers/zod'
import Loader from 'react-spinners/BeatLoader'
import invariant from 'tiny-invariant'
import { updateUserEmail, getUserById } from '~/models/user.server'
import { requireUserId, getSession, commitSession } from '~/session.server'
import { mergeMeta, isBusy } from '~/utils/utils'

import { emailSchema } from '~/modules/account'

import type { BreadcrumbHandle } from '~/ui/components/breadcrumbs/types/breadcrumbs'
import { Button } from '~/ui/components/button'
import { Input, hasErrors, getErrorText } from '~/ui/components/input'
import { Alert } from '~/ui/components/notifications'
import ErrorLayout from '~/ui/layouts/error-layout'

/**
 * meta
 * @returns {V2_MetaFunction}
 */
export const meta: V2_MetaFunction = ({ matches }): V2_HtmlMetaDescriptor[] => {
  const title = 'Update Email - Infonomic Remix Workbench'
  return mergeMeta(matches, [{ title }, { property: 'og:title', content: title }])
}

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

  const parseResult = emailSchema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  const user = await updateUserEmail(userId, parseResult.data.email)

  if (!user) {
    return json(
      {
        errors: {
          general: {
            _errors: [
              'Error updating email address. The address you have entered may already be in use.',
            ],
          },
        },
      },
      { status: 400 }
    )
  }

  session.flash('success', `User with email: '${user?.email}' was successfully updated.`)
  return redirect('/account', {
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
        path: '/account',
        label: 'Account',
      },
      {
        path: '/account/email',
        label: 'Update Email',
      },
    ]
  },
}

const fields = ['email']

/**
 * UserEmailEditPage
 * @returns
 */
export default function UserEmailEditPage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const serverErrors = actionData?.errors
  const submit = useSubmit()
  const navigation = useNavigation()
  const resolver = zodResolver(emailSchema)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({ resolver })

  const busy = isBusy(navigation)

  useEffect(() => {
    if (serverErrors) {
      const field = fields.find(name => serverErrors[name as keyof typeof serverErrors])
      if (field) setFocus(field)
    }
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
        className="flex w-full flex-col"
      >
        <Input
          id="email"
          required
          disabled={busy}
          defaultValue={data.user.email}
          label="Email"
          placeHolder="Email"
          helpText="Please enter an updated email address."
          error={hasErrors('email', errors, serverErrors)}
          errorText={getErrorText('email', errors, serverErrors)}
          {...register('email')}
        />

        <div className="form-actions flex flex-row justify-end gap-3">
          <Button disabled={busy} type="submit">
            {busy ? (
              <Loader
                loading={busy}
                color="var(--loader-color)"
                size={8}
                margin={2}
                aria-label="Processing sign in"
                data-testid="loader"
              />
            ) : (
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
