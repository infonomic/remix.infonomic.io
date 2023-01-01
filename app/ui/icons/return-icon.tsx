import React from 'react'

import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

import IconElement from './icon-element'

import type { IconProps } from './types/icon'

const svgStylesDefault = 'fill-amber-500 dark:fill-white'

export const ReturnIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, svgClassName, ...rest }, ref) => {
    const applied = twMerge(cx(svgStylesDefault, svgClassName))

    return (
      <IconElement className={cx('return-icon', className)} ref={ref} {...rest}>
        <svg
          className={applied}
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 14 14"
        >
          <path
            d="M5.46,1.43,2,4.36,5.46,7.79"
            fill="none"
            strokeLinecap="square"
            strokeWidth="1"
          />
          <path
            d="M2.59,4.45H9.12a4.06,4.06,0,1,1,0,8.12H3.81"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeWidth="1"
          />
        </svg>
      </IconElement>
    )
  }
)

ReturnIcon.displayName = 'ReturnIcon'

export default ReturnIcon
