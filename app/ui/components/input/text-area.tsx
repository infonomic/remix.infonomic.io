import * as React from 'react'

import cx from 'classnames'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  name: string
  label: string
  required?: boolean
  rows: number
  placeHolder?: string
  autoComplete?: string
  error?: boolean
  helpText?: string
  errorText?: string
  className?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      name,
      label,
      rows = 4,
      required = false,
      placeHolder = '',
      autoComplete = '',
      error = false,
      helpText = '',
      errorText = '',
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <fieldset className="mb-3">
        <label
          id={`label-for-${id}`}
          htmlFor={id}
          className="m-0 p-0 font-medium text-gray-700 dark:text-gray-400"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          name={name}
          required={required}
          rows={rows}
          autoComplete={autoComplete}
          placeholder={placeHolder}
          aria-labelledby={`label-for-${id}`}
          aria-invalid={error}
          aria-required={required}
          aria-errormessage={errorText}
          aria-describedby={error ? `error-for-${id}` : undefined}
          className={cx(
            'block w-full rounded-md',
            'text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600',
            'border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800',
            'focus-visible:ring-opacity-85 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500',
            className
          )}
          {...rest}
        />
        {error ? (
          <p id={`error-for-${id}`} className="mt-1 text-sm text-red-700">
            {errorText || helpText}
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">{helpText}</p>
        )}
      </fieldset>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
