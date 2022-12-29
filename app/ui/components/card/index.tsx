/* eslint-disable react/jsx-pascal-case */
import * as React from 'react'

import { Primitive } from '@radix-ui/react-primitive'
import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import type * as Radix from '@radix-ui/react-primitive'

const NAME = 'Card'

type CardElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveCardProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface CardProps extends PrimitiveCardProps { }

const Card = React.forwardRef<CardElement, CardProps>((props, ref) => {
  const { className, children, ...rest } = props

  const classes = twMerge(
    cx(
      'flex flex-col min-w-full no-underline max-w-sm p-6 prose dark:prose-invert',
      'bg-white border border-slate-200 rounded-lg shadow-md',
      'hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'
    ),
    className
  )

  return (
    <Primitive.div
      ref={ref}
      className={classes}
      {...rest}
    >
      {children}
    </Primitive.div>
  )
})

Card.displayName = NAME

export { Card }

export type { CardProps }
