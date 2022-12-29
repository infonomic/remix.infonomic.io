import React from 'react'

import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import IconElement from './icon-element'

import type { IconProps } from './types/icon'

const svgStylesDefault = 'fill-red-500/80'

export const DangerIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({
    className,
    svgClassName,
    ...rest
  }, ref) => {

    const applied = twMerge(cx(svgStylesDefault, svgClassName))

    return (
      <IconElement
        className={cx('danger-icon', className)}
        ref={ref}
        {...rest}
      >
        <svg className={applied} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </svg>
      </IconElement>
    )
  }
)

DangerIcon.displayName = 'DangerIcon'

export default DangerIcon
