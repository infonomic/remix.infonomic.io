import * as React from 'react'

import { twMerge } from 'tailwind-merge'

const NAME = 'TableFooter'

type TableFooterProps = JSX.IntrinsicElements['tfoot']

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = twMerge(
      'text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-400',
      className
    )

    return (
      <tfoot ref={ref} className={classes} {...rest}>
        {children}
      </tfoot>
    )
  }
)

TableFooter.displayName = NAME

export { TableFooter }

export type { TableFooterProps }
