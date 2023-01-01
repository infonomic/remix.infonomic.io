import * as React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import cx from 'classnames'

const TOOLTIP_NAME = 'Tooltip'

type TooltipIntrinsicProps = JSX.IntrinsicElements['div']
interface TooltipProps extends TooltipIntrinsicProps {
  text: string
  delay?: number
  side?: 'bottom' | 'top' | 'right' | 'left' | undefined
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ text, delay = 600, side = 'top', children }: TooltipProps, ref) => {
    return (
      <TooltipPrimitive.Provider delayDuration={delay}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content
            ref={ref}
            side={side}
            sideOffset={4}
            className={cx(
              'radix-side-top:animate-slide-down-fade',
              'radix-side-right:animate-slide-left-fade',
              'radix-side-bottom:animate-slide-up-fade',
              'radix-side-left:animate-slide-right-fade',
              'inline-flex items-center rounded-md px-4 py-2.5',
              'bg-slate-200/70 dark:bg-slate-800'
            )}
          >
            <TooltipPrimitive.Arrow className="fill-slate-200/70 text-white dark:fill-slate-800 dark:text-gray-800" />
            <span className="block text-xs leading-none text-gray-700 dark:text-gray-100">
              {text}
            </span>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }
)

Tooltip.displayName = TOOLTIP_NAME

export { Tooltip }

export type { TooltipProps }
