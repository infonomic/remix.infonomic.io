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
        'app-bar fixed z-[1100] flex w-full bg-amber-500 shadow-md dark:bg-slate-800',
        className
      )}
      ref={ref}
      {...other}
    >
      <div className="flex w-full items-center px-[18px] py-2.5 text-black dark:text-white">
        {children}
      </div>
    </header>
  )
})

AppBar.displayName = 'AppBar'

export default AppBar
