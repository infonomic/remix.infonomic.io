import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import cx from 'classnames'

import { Container } from '~/ui/components/container'


interface FrontLayoutProps {
  children?: ReactNode;
  className?: string;
}

export type Ref = HTMLDivElement;

const ErrorLayout = forwardRef<Ref, FrontLayoutProps>(({ children, className, ...other }, ref) => {

  return (
    <div
      className={cx('layout-container flex flex-col min-h-screen', className)}
      ref={ref}
      {...other} >
      <a href="#main-content">Skip to main content</a>
      <main id="main-content" className="flex flex-col flex-1 pt-[58px]">
        <Container className="flex flex-col flex-1 pt-[24vh] prose dark:prose-invert">
          {children}
        </Container>
      </main>
    </div>
  )
})

ErrorLayout.displayName = 'ErrorLayout'

export default ErrorLayout
