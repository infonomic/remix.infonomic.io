import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

interface FrontLayoutProps {
  children?: ReactNode
  className?: string
}

export type Ref = HTMLDivElement

const FrontLayout = forwardRef<Ref, FrontLayoutProps>(({ children, className, ...other }, ref) => {
  return (
    <div
      className={cx('layout-container flex min-h-screen flex-col', className)}
      ref={ref}
      {...other}
    >
      <a href="#main-content">Skip to main content</a>
      <main id="main-content" className="flex min-h-screen flex-col bg-amber-500">
        {children}
      </main>
    </div>
  )
})

FrontLayout.displayName = 'FrontLayout'

export default FrontLayout
