import * as React from 'react'

import { twMerge } from 'tailwind-merge'


const NAME = 'TableCell'

type TableCellProps = JSX.IntrinsicElements['td'];

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...rest }, ref) => {

    const classes = twMerge(
      'py-4 px-6',
      className
    )

    return (
      <td ref={ref} className={classes} {...rest}>
        {children}
      </td>
    )
  }
)

TableCell.displayName = NAME

export { TableCell }

export type { TableCellProps }