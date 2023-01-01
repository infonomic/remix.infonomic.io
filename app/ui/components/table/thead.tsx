import * as React from 'react'

import { twMerge } from 'tailwind-merge'

const NAME = 'TableHead'

type TableHeaderProps = JSX.IntrinsicElements['thead']

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = twMerge(
      'text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
      className
    )

    return (
      <thead ref={ref} className={classes} {...rest}>
        {children}
      </thead>
    )
  }
)

TableHeader.displayName = NAME

export { TableHeader }

export type { TableHeaderProps }
