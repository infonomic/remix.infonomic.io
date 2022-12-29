import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

interface FrontLayoutProps {
  children?: ReactNode;
  className?: string;
}

export type Ref = HTMLDivElement;

const FrontLayout = forwardRef<Ref, FrontLayoutProps>(({ children, className, ...other }, ref) => {

  return (
    <div
      className={cx('layout-container flex flex-col min-h-screen', className)}
      ref={ref}
      {...other} >
      <a href="#main-content">Skip to main content</a>
      <main id="main-content" className="bg-amber-500 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  )
})

FrontLayout.displayName = 'FrontLayout'

export default FrontLayout
