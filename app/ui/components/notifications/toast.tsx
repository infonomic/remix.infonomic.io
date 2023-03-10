import React from 'react'

import * as ToastPrimitive from '@radix-ui/react-toast'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { CloseButton } from './close'
import { toastStyles } from './styles'

import { Button } from '~/ui/components/button'
import DangerIcon from '~/ui/icons/danger-icon'
import InfoIcon from '~/ui/icons/info-icon'
import SuccessIcon from '~/ui/icons/success-icon'
import WarningIcon from '~/ui/icons/warning-icon'
import objectsToString from '~/ui/utils/objectsToString'

import type {
  intent,
  position,
  className,
  title,
  description,
  icon,
  iconType,
  close,
  open,
  onOpenChange,
} from './types/toast'

const toastIcons = {
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  danger: DangerIcon,
}

const NAME = 'Toast'

interface ToastProps extends React.InputHTMLAttributes<HTMLLIElement> {
  intent?: intent
  position?: position
  title: title
  description: description
  icon?: icon
  iconType?: iconType
  close?: close
  open: open
  onOpenChange: onOpenChange
  className?: className
}

// Important!: see comments in app/ui/components/notifications/styles/toast.ts regarding toast position

const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  (
    { intent, position, title, description, icon, iconType, close, open, onOpenChange, className },
    ref
  ) => {
    // 1. init
    const { defaultProps, styles } = toastStyles
    const { base, intents, positions } = styles

    // 2. set default props
    intent = intent ?? defaultProps.intent
    position = position ?? defaultProps.position
    icon = icon ?? defaultProps.icon
    iconType = iconType ?? defaultProps.iconType
    close = close ?? defaultProps.close
    className = className ?? defaultProps.className

    // 3. set styles
    const toastBase = objectsToString(base.initial)
    const toastIntent = objectsToString(intents[intent as keyof typeof intents])
    const toastPosition = objectsToString(positions[position as keyof typeof positions])
    const classes = twMerge(cx(toastBase, toastIntent, toastPosition), className)
    const Icon = toastIcons[iconType as keyof typeof toastIcons]

    const handleClose = () => {
      if (onOpenChange) onOpenChange(false)
    }

    return (
      <ToastPrimitive.Root open={open} ref={ref} onOpenChange={onOpenChange} className={classes}>
        <focus-trap trapped="true">
          <button className="sr-only" tabIndex={0}></button>
          <div className="toast-header flex justify-between gap-3 px-4 pt-2">
            <div className="block pt-[4px] pl-[4px] text-sm">
              {new Intl.DateTimeFormat('default', {
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
              }).format(new Date())}
            </div>
            {close && (
              <ToastPrimitive.Close aria-label="Close" asChild>
                <div>
                  <CloseButton intent={intent} onClick={handleClose} />
                </div>
              </ToastPrimitive.Close>
            )}
          </div>

          <div className="flex gap-3 px-4 pt-2 pb-4">
            <div className="toast-content radix flex w-full flex-1 flex-col">
              <ToastPrimitive.Title className="mb-2 flex items-center gap-2 text-base font-medium">
                {icon && <Icon />}
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="ml-1 text-sm">
                {description}
              </ToastPrimitive.Description>
            </div>
            <div className="toast-actions flex flex-col gap-2 pt-4">
              <Button
                intent="secondary"
                variant="outlined"
                size="sm"
                className="border-gray-700 text-gray-800 dark:border-gray-100 dark:bg-transparent dark:text-white"
                onClick={e => {
                  e.preventDefault()
                  window.open('https://github.com/infonomic')
                }}
              >
                Review
              </Button>
            </div>
          </div>
        </focus-trap>
      </ToastPrimitive.Root>
    )
  }
)

Toast.displayName = NAME

export { Toast }

export type { ToastProps }
