import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'
import * as LabelPrimitive from '@radix-ui/react-label'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string
  name: string
  label: string
  checked?: boolean
}

export const Checkbox = React.forwardRef<HTMLButtonElement, Props>(
  ({ id, name, label, className, checked = false, ...rest }, ref) => {
    const classes = twMerge(
      cx(
        'flex h-4 w-4 items-center justify-center rounded outline-none focus:outline-none',
        'radix-state-checked:bg-amber-500 radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-700',
        'focus:ring-amber-600 ring-1 ring-offset-2 ring-gray-400 focus:ring-1 focus:ring-offset-2 dark:ring-gray-600 dark:ring-offset-slate-900'
      ),
      className
    )

    return (
      <div className="flex items-center">
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          name={name}
          defaultChecked={checked}
          className={classes}
          {...rest}
        >
          <CheckboxPrimitive.Indicator>
            <CheckIcon className="h-4 w-4 self-center text-white" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        <LabelPrimitive.Label
          htmlFor={id}
          className="ml-3 select-none font-medium text-gray-600 dark:text-gray-400"
        >
          {label}
        </LabelPrimitive.Label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
