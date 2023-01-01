import * as React from 'react'

import { twMerge } from 'tailwind-merge'

const NAME = 'Table'

type TableProps = JSX.IntrinsicElements['table']

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = twMerge(
      'border-collapse w-full text-sm text-left text-slate-700 dark:text-slate-400',
      className
    )

    return (
      <table ref={ref} className={classes} {...rest}>
        {children}
      </table>
    )
  }
)

Table.displayName = NAME

export { Table }

export type { TableProps }
