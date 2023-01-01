import * as React from 'react'

const NAME = 'TableBody'

type TableBodyProps = JSX.IntrinsicElements['tbody']

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <tbody ref={ref} className={className} {...rest}>
        {children}
      </tbody>
    )
  }
)

TableBody.displayName = NAME

export { TableBody }

export type { TableBodyProps }
