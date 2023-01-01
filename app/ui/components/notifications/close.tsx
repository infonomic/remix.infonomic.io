import React from 'react'

import { Cross2Icon } from '@radix-ui/react-icons'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { closeButtonStyles } from './styles'

import type { intent } from '~/ui/components/types/shared'
import objectsToString from '~/ui/utils/objectsToString'

const NAME = 'CloseButton'

type ButtonProps = JSX.IntrinsicElements['button']
interface CloseButtonProps extends ButtonProps {
  intent: intent
  onClick: (event: React.SyntheticEvent) => void
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ intent, onClick, className, children, ...rest }, ref) => {
    const closeButtonStyle = objectsToString(
      closeButtonStyles[intent as keyof typeof closeButtonStyles]
    )
    const classes = twMerge(
      cx('outline-none p-1 rounded-full transition-hover duration-300', closeButtonStyle),
      className
    )

    return (
      <button
        ref={ref}
        aria-label="Close"
        className={classes}
        type="button"
        onClick={onClick}
        {...rest}
      >
        <Cross2Icon />
      </button>
    )
  }
)

CloseButton.displayName = NAME

export { CloseButton }

export type { CloseButtonProps }
