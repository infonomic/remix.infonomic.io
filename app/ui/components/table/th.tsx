import * as React from 'react'

const NAME = 'TableHeadingCell'

type TableHeadingCellProps = JSX.IntrinsicElements['th']

const TableHeadingCell = React.forwardRef<HTMLTableCellElement, TableHeadingCellProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <th ref={ref} className={className} {...rest}>
        {children}
      </th>
    )
  }
)

TableHeadingCell.displayName = NAME

export { TableHeadingCell }

export type { TableHeadingCellProps }
