/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from 'react'
import { useState } from 'react'

import { Transition } from '@headlessui/react'
import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import { CloseButton } from './close'
import { alertStyles } from './styles'

import DangerIcon from '~/ui/icons/danger-icon'
import InfoIcon from '~/ui/icons/info-icon'
import SuccessIcon from '~/ui/icons/success-icon'
import WarningIcon from '~/ui/icons/warning-icon'
import objectsToString from '~/ui/utils/objectsToString'

import type { intent, icon, close, className, children } from './types/alert'
import type * as Radix from '@radix-ui/react-primitive'

const alertIcons = {
  primary: WarningIcon,
  secondary: InfoIcon,
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  danger: DangerIcon,
}

const NAME = 'Alert'

type AlertElement = React.ElementRef<typeof Primitive.div>
type PrimitiveCardProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>
interface AlertProps extends PrimitiveCardProps {
  intent?: intent
  icon?: icon
  close?: close
  className?: className
  children: children
}

const Alert = React.forwardRef<AlertElement, AlertProps>(
  ({ intent, icon, close, className, children, ...rest }, ref) => {
    const [show, setShow] = useState(false)

    // 1. init
    const { defaultProps, styles } = alertStyles
    const { base, intents } = styles

    // 2. set default props
    intent = intent ?? defaultProps.intent
    icon = icon ?? defaultProps.icon
    close = close ?? defaultProps.close
    className = className ?? defaultProps.className

    // 3. set styles
    const alertBase = objectsToString(base.initial)
    const alertIntent = objectsToString(intents[intent as keyof typeof intents])
    const classes = twMerge(cx(alertBase, alertIntent), className)

    const Icon = alertIcons[intent as keyof typeof alertIcons]

    const handleClose = () => {
      setShow(false)
    }

    useEffect(() => {
      setShow(true)
    }, [])

    return (
      <Transition
        show={show}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Primitive.div ref={ref} className={classes} {...rest}>
          {icon && (
            <div className="alert-icon">
              <Icon />
            </div>
          )}

          <div className="alert-content">{children}</div>

          {close && (
            <div className="alert-close ml-auto">
              <CloseButton intent={intent} onClick={handleClose} />
            </div>
          )}
        </Primitive.div>
      </Transition>
    )
  }
)

Alert.displayName = NAME

export { Alert }

export type { AlertProps }
