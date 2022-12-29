import type { ReactNode } from 'react'
import React from 'react'

import cx from 'classnames'

export interface IconElementProps extends React.ComponentProps<'div'> {
  width?: string
  height?: string,
  menuItem?: boolean,
  children: ReactNode;
  className?: string;
}

export const IconElement = React.forwardRef<HTMLDivElement, IconElementProps>(
  ({
    width = '22px',
    height = '22px',
    menuItem = false,
    className,
    children,
    ...rest
  }, ref) => {

    return (
      <div
        ref={ref}
        style={{ width, height, flex: `0 0 ${width}`, alignItems: 'center', marginRight: menuItem ? '1.2rem' : '0' }}
        className={cx('icon-element-root', className)}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

IconElement.displayName = 'icon-element'

export default IconElement
