import * as React from 'react'

const NAME = 'TableRow'

type TableRowProps = JSX.IntrinsicElements['tr']

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <tr ref={ref} className={className} {...rest}>
        {children}
      </tr>
    )
  }
)

TableRow.displayName = NAME

export { TableRow }

export type { TableRowProps }
