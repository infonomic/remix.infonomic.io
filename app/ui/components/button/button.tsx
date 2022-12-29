/** 
  Note: Styles and types for the button component have been
  adapted from  the button component at 
  https://github.com/creativetimofficial/material-tailwind 
  The material-tailwind project is a great effort, but its theming 
  configuration adds another layer to the project. The goal of this 
  project is to take only headless, or lightly css- or tailwind-styled 
  components, and build a base-level UI-kit that can be used here and
  on other projects with minimum dependencies (optionally built 
    using https://www.radix-ui.com/ primitives).
*/
import React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
/* eslint-disable */
// @ts-ignore
import Ripple from "material-ripple-effects";
/* eslint-enable */
import { twMerge } from 'tailwind-merge'

import { button } from './styles'

import objectsToString from '~/ui/utils/objectsToString'

// types
import type {
  variant,
  size,
  intent,
  fullWidth,
  ripple,
  className,
  children,
} from './types/button'
import type * as Radix from '@radix-ui/react-primitive'

const NAME = 'Button'

type ButtonElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>
interface ButtonProps extends PrimitiveButtonProps {
  variant?: variant;
  size?: size;
  intent?: intent;
  fullWidth?: fullWidth;
  ripple?: ripple;
  className?: className;
  children: children;
}

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  ({ variant, size, intent, fullWidth, ripple, className, children, ...rest }, ref) => {
    // 1. init
    const { defaultProps, styles } = button
    const { base, variants, sizes } = styles

    // 2. set default props
    variant = variant ?? defaultProps.variant
    size = size ?? defaultProps.size
    intent = intent ?? defaultProps.intent
    fullWidth = fullWidth ?? defaultProps.fullWidth
    ripple = ripple ?? defaultProps.ripple
    className = className ?? defaultProps.className

    // 3. set ripple effect instance
    const rippleEffect = ripple !== undefined && new Ripple()

    // 4. set styles
    const buttonBase = objectsToString(base.initial)
    const buttonVariant = objectsToString(variants[variant as keyof object][intent])
    const buttonSize = objectsToString(sizes[size as keyof object])
    const classes = twMerge(
      cx(buttonBase, buttonSize, buttonVariant, {
        [objectsToString(base.fullWidth)]: fullWidth,
      }),
      className
    )

    // 5. return
    return (
      // eslint-disable-next-line react/jsx-pascal-case
      <Primitive.button
        ref={ref}
        className={classes}
        type={rest.type || 'button'}
        onMouseDown={e => {
          const onMouseDown: React.MouseEventHandler<HTMLButtonElement> | undefined = rest?.onMouseDown

          if (ripple) {
            rippleEffect.create(
              e,
              variant === 'filled' || variant === 'gradient' ? 'light' : 'dark'
            )
          }

          return typeof onMouseDown === 'function' && onMouseDown(e)
        }}
        {...rest}
      >
        {children}
      </Primitive.button>
    )
  }
)

Button.displayName = NAME

export { Button }

export type { ButtonProps }
