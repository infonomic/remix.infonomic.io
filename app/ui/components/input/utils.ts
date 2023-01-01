import type { z } from 'zod'
import type { ZodType } from 'zod'

type FormattedErrors = z.inferFormattedError<ZodType<any, any, any>>

export const hasErrors = (name: string, clientErrors: any, serverErrors: any) => {
  return Boolean(serverErrors?.[name as keyof typeof serverErrors] || clientErrors[name])
}

export const getErrorText = (name: string, clientErrors: any, serverErrors: any) => {
  const message = clientErrors && clientErrors[name]?.message
  if (message) return message

  const error = serverErrors && (serverErrors[name as keyof typeof serverErrors] as FormattedErrors)
  if (error && error._errors) return error._errors.join(' ')
}
