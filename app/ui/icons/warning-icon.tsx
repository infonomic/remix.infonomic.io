import React from 'react'

import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import IconElement from './icon-element'

import type { IconProps } from './types/icon'

const svgStylesDefault = 'fill-amber-500'

export const WarningIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, svgClassName, ...rest }, ref) => {
    const applied = twMerge(cx(svgStylesDefault, svgClassName))

    return (
      <IconElement className={cx('warning-icon', className)} ref={ref} {...rest}>
        <svg className={applied} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path>
        </svg>
      </IconElement>
    )
  }
)

WarningIcon.displayName = 'WarningIcon'

export default WarningIcon
