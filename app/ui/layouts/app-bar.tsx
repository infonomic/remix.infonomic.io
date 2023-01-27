import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

interface AppBarProps {
  children?: ReactNode
  className?: string
}
export type Ref = HTMLDivElement

export const AppBar = forwardRef<Ref, AppBarProps>(({ children, className, ...other }, ref) => {
  return (
    <header
      className={cx(
        'app-bar fixed z-[1100] flex w-full bg-[#f2b21d] shadow-md dark:bg-slate-800',
        className
      )}
      ref={ref}
      {...other}
    >
      <div className="flex min-h-[60px] w-full items-center py-2.5 pr-[18px] pl-[6px] text-black dark:text-white sm:pl-[18px]">
        {children}
      </div>
    </header>
  )
})

AppBar.displayName = 'AppBar'

export default AppBar
