import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import { Link } from '@remix-run/react'

import cx from 'classnames'

import { ScrollToTop } from '~/ui/components/scroll-to-top'
import { ThemeSwitch } from '~/ui/components/theme-switch'
import AppBar from '~/ui/layouts/app-bar'
import { PublicFooter } from '~/ui/layouts/public-footer'

interface PublicLayoutProps {
  children?: ReactNode
  className?: string
}

export type Ref = HTMLDivElement

const PublicLayout = forwardRef<Ref, PublicLayoutProps>(
  ({ children, className, ...other }, ref) => {
    return (
      <div
        className={cx('layout-container flex min-h-screen flex-col', className)}
        ref={ref}
        {...other}
      >
        <a href="#main-content">Skip to main content</a>
        <AppBar>
          <Link to={{ pathname: '/' }} className="font-medium">
            Home
          </Link>
          <Link to={{ pathname: '/about' }} className="font-medium">
            About
          </Link>
          <ThemeSwitch style={{ marginLeft: 'auto' }} />
        </AppBar>
        <main id="main-content" className="flex flex-1 flex-col pt-[52px]">
          {children}
        </main>
        <PublicFooter />
        <ScrollToTop />
      </div>
    )
  }
)

PublicLayout.displayName = 'PublicLayout'

export default PublicLayout
