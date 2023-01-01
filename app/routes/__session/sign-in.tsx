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
import { verifyLogin } from '~/models/user.server'
import { createUserSession, getUserId } from '~/session.server'
import { isBusy } from '~/utils/helpers'
import { safeRedirect } from '~/utils/utils'

import { signInSchema } from '~/modules/session'

import { Button } from '~/ui/components/button'
import { Checkbox, Input } from '~/ui/components/input'
import { hasErrors, getErrorText } from '~/ui/components/input/utils'
import { Alert } from '~/ui/components/notifications'

/**
 * meta
 * @returns
 */
export const meta: MetaFunction = () => {
  return {
    title: 'Sign In - Infonomic Remix Workbench',
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
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/notes')
  const remember = formData.get('remember')
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
        return json(
          { errors: { general: { _errors: ['Error signing in. Error calling reCAPTCHA.'] } } },
          { status: 500 }
        )
      }
    }
  }

  const parseResult = signInSchema.safeParse(formData)
  if (!parseResult.success) {
    return json({ errors: parseResult.error.format() }, { status: 400 })
  }

  const user = await verifyLogin(parseResult.data.email, parseResult.data.password)

  if (!user) {
    return json({ errors: { general: { _errors: ['Error signing in.'] } } }, { status: 400 })
  }

  return createUserSession({
    request,
    userId: user.id,
    isAdmin: user.isAdmin,
    remember: remember === 'on' ? true : false,
    redirectTo,
  })
}

const fields = ['email', 'password']

/**
 * SignInPage
 * @returns
 */
export default function SignInPage() {
  useReCaptcha()
  const actionData = useActionData<typeof action>()
  const serverErrors = actionData?.errors
  const submit = useSubmit()
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const resolver = zodResolver(signInSchema)
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
    const gtoken = await reCaptchaExecute('sign_in')
    if (gtoken) formData.set('gtoken', gtoken)
    handleSubmit(() => submit(formData, { method: 'post', action: '/sign-in', replace: true }))(
      event
    )
  }

  React.useEffect(() => {
    if (!serverErrors) return
    const field = fields.find(name => serverErrors[name as keyof object])
    if (field) setFocus(field)
  }, [serverErrors, setFocus])

  return (
    <div className="form mx-auto mt-[10vh] max-w-[460px] rounded-lg border border-gray-400 p-5 dark:border-gray-700 sm:mt-[14vh] md:p-7">
      <div className="form-header prose dark:prose-invert">
        <h1 className="mb-5 text-[2.25rem]">Sign In</h1>
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
                    aria-label="Processing sign in"
                    data-testid="loader"
                  />
                )
: (
                  'Sign in'
                )}
              </Button>
              <Checkbox
                id="remember"
                name="remember"
                label="Remember me"
                disabled={busy}
                checked={false}
              />
            </div>
          </fieldset>
        </Form>
      </div>
      <div className="form-footer prose dark:prose-invert">
        <div style={{ fontSize: '0.95rem', marginTop: '1rem' }}>
          Don&apos;t have an account?&nbsp;{' '}
          <Link
            to={{
              pathname: '/sign-up',
              search: searchParams.toString(),
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
