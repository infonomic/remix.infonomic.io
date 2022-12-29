import React from 'react'

import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import IconElement from './icon-element'

import type { IconProps } from './types/icon'

const svgStylesDefault = 'fill-blue-500'

export const InfoIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({
    className,
    svgClassName,
    ...rest
  }, ref) => {

    const applied = twMerge(cx(svgStylesDefault, svgClassName))

    return (
      <IconElement
        className={cx('info-icon', className)}
        ref={ref}
        {...rest}
      >
        <svg className={applied} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path>
        </svg>
      </IconElement>
    )
  }
)

InfoIcon.displayName = 'InfoIcon'

export default InfoIcon
