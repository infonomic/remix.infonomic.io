/**
 * NOTE: Not currently used
 * Adapted from https://remix-forms.seasoned.cc/conf/07
 */

import type { z } from 'zod'
import type { ZodType } from 'zod'

type FormattedErrors = z.inferFormattedError<ZodType<any, any, any>>;

export function Error(props: JSX.IntrinsicElements['div']) {
  return <div {...props} className="mt-1 text-red-700" role="alert" />
}

export function ServerError({ name, errors }: { name: string; errors: any }) {
  if (errors) {
    const error = errors[name as keyof typeof errors] as FormattedErrors
    return (
      error && error._errors
        ? (
          <Error id={`error-for-${name}`}>{error._errors.join(' ')}</Error>
        ) :
        null
    )
  } else return null
}

export function FieldError({ name, errors }: { name: string; errors: any }) {
  const message = errors[name]?.message
  if (message) {
    return <Error id={`error-for-${name}`}>{message}</Error>
  }
  return <ServerError name={name} errors={errors} />
}