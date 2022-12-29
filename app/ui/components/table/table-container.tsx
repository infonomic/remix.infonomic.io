import * as React from 'react'

import { twMerge } from 'tailwind-merge'


const NAME = 'TableContainer'

type TableContainerProps = JSX.IntrinsicElements['div'];

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, children, ...rest }, ref) => {

    const classes = twMerge(
      'overflow-x-auto relative shadow-md rounded-md',
      className
    )

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    )
  }
)

TableContainer.displayName = NAME

export { TableContainer }

export type { TableContainerProps }