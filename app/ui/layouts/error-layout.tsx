import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

import { Container } from '~/ui/components/container'

interface FrontLayoutProps {
  children?: ReactNode
  className?: string
}

export type Ref = HTMLDivElement

const ErrorLayout = forwardRef<Ref, FrontLayoutProps>(({ children, className, ...other }, ref) => {
  return (
    <div
      className={cx('layout-container flex min-h-screen flex-col', className)}
      ref={ref}
      {...other}
    >
      <a href="#main-content">Skip to main content</a>
      <main id="main-content" className="flex flex-1 flex-col pt-[58px]">
        <Container className="prose flex flex-1 flex-col pt-[24vh] dark:prose-invert">
          {children}
        </Container>
      </main>
    </div>
  )
})

ErrorLayout.displayName = 'ErrorLayout'

export default ErrorLayout
