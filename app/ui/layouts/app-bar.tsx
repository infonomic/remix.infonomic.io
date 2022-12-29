import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

interface AppBarProps {
  children?: ReactNode;
  className?: string;
}
export type Ref = HTMLDivElement;

export const AppBar = forwardRef<Ref, AppBarProps>(({ children, className, ...other }, ref) => {

  return (
    <header
      className={cx(
        'app-bar shadow-md w-full flex fixed z-[1100] bg-amber-500 dark:bg-slate-800',
        className
      )}
      ref={ref}
      {...other} >
      <div className="px-[18px] py-2.5 flex items-center w-full text-black dark:text-white">
        {children}
      </div>
    </header>
  )
})

AppBar.displayName = 'AppBar'

export default AppBar
