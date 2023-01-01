import * as React from 'react'
import { useForm } from 'react-hook-form'

import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useSubmit,
  useTransition,
} from '@remix-run/react'

import { zodResolver } from '@hookform/resolvers/zod'
import Loader from 'react-spinners/BeatLoader'
import { useReCaptcha, reCaptchaExecute } from '~/hooks/useReCaptcha'
import { reCaptchaCheck, RECAPTCHA_VALIDATION_ERROR } from '~/lib.node.server'
import { createUser, getUserByEmail } from '~/models/user.server'
import { getUserId, createUserSession } from '~/session.server'
import { isBusy } from '~/utils/helpers'
import { safeRedirect } from '~/utils/utils'

import { signUpSchema } from '~/modules/session'

import { Button } from '~/ui/components/button'
import { Input } from '~/ui/components/input'
import { hasErrors, getErrorText } from '~/ui/components/input/utils'
import { Alert } from '~/ui/components/notifications'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up - Infonomic Remix Workbench',
  }
}

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

/**
 * action
 * @param param0
 * @returns
 */
export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const gtoken = formData.get('gtoken') as string

  if (gtoken || process.env.RECAPTCHA_MANDATORY === 'true') {
    try {
      reCaptchaCheck(process.env.RECAPTCHA_SECRET_KEY || '', gtoken)
    } catch (error) {
      if (error instanceof RECAPTCHA_VALIDATION_ERROR) {
        return json(
          { errors: { general: { _errors: ['Error signing in. reCAPTCHA failed.'] } } },
          { status: 400 }
        )
      } else {
        return json({ errors: null }, { status: 500 })
      }
    }
  }

  const parseResult = signUpSchema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  const existingUser = await getUserByEmail(parseResult.data.email)
  if (existingUser) {
    return json(
      {
        errors: {
          email: {
            _errors: ['This email address is already in use.'],
          },
        },
      },
      { status: 400 }
    )
  }

  const user = await createUser(parseResult.data.email, parseResult.data.password)

  return createUserSession({
    request,
    userId: user.id,
    isAdmin: false,
    remember: false,
    redirectTo,
  })
}

const fields = ['email', 'password']

/**
 * SignUpPage
 * @returns
 */
export default function SignUpPage() {
  useReCaptcha()
  const actionData = useActionData<typeof action>()
  const serverErrors = actionData?.errors
  const submit = useSubmit()
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const resolver = zodResolver(signUpSchema)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({ resolver })
  const busy = isBusy(transition)

  /**
   * handleOnSubmit - js submission of form so that we can create a
   * reCaptcha token.
   * @param event
   */
  const handleOnSubmit = async (event: any) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const gtoken = await reCaptchaExecute('sign_up')
    if (gtoken) formData.set('gtoken', gtoken)
    handleSubmit(() => submit(formData, { method: 'post', action: '/sign-up', replace: true }))(
      event
    )
  }

  React.useEffect(() => {
    if (!serverErrors) return
    const field = fields.find(name => serverErrors[name as keyof typeof serverErrors])
    if (field) setFocus(field)
  }, [serverErrors, setFocus])

  return (
    <div className="form mx-auto mt-[10vh] max-w-[460px] rounded-lg border border-gray-400 p-5 dark:border-gray-700 sm:mt-[14vh] md:p-7">
      <div className="form-header prose dark:prose-invert">
        <h1 className="mb-5 text-[2.25rem]">Sign Up</h1>
      </div>
      {hasErrors('general', errors, serverErrors) && (
        <Alert intent="danger">{getErrorText('general', errors, serverErrors)}</Alert>
      )}
      <div className="form-content mb-7">
        <Form method="post" onSubmit={handleOnSubmit} className="space-y-6">
          <fieldset disabled={busy}>
            <div className="form-controls mb-6">
              <Input
                required
                id="email"
                type="email"
                label="Email"
                placeHolder="Email"
                autoComplete="email"
                disabled={busy}
                helpText="Please enter your email address."
                error={hasErrors('email', errors, serverErrors)}
                errorText={getErrorText('email', errors, serverErrors)}
                {...register('email')}
              />

              <Input
                required
                id="password"
                type="password"
                label="Password"
                placeHolder="Password"
                autoComplete="current-password"
                disabled={busy}
                helpText="Please enter your password."
                error={hasErrors('password', errors, serverErrors)}
                errorText={getErrorText('password', errors, serverErrors)}
                {...register('password')}
              />
              <input type="hidden" name="redirectTo" value={redirectTo} />
            </div>
            <div className="form-actions flex flex-col gap-4 md:flex-row">
              <Button disabled={busy} type="submit" className="min-w-[150px]">
                {busy
? (
                  <Loader
                    loading={busy}
                    color="var(--loader-color)"
                    size={8}
                    margin={2}
                    aria-label="Processing sign up"
                    data-testid="loader"
                  />
                )
: (
                  'Sign Up'
                )}
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
      <div className="form-footer prose dark:prose-invert">
        <div style={{ fontSize: '0.95rem', marginTop: '1rem' }}>
          Already have an account?&nbsp;{' '}
          <Link
            to={{
              pathname: '/sign-in',
              search: searchParams.toString(),
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
