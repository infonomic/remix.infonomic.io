import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import { Link } from '@remix-run/react'

import cx from 'classnames'
import { useUser } from '~/utils/utils'

import { BreadcrumbTrail } from '~/ui/components/breadcrumbs/breadcrumb-trail'
import { Container } from '~/ui/components/container'
import { ScrollToTop } from '~/ui/components/scroll-to-top'
import { Section } from '~/ui/components/section'
import { ThemeSwitch } from '~/ui/components/theme-switch'
import { AppBar } from '~/ui/layouts/app-bar'
import { Footer } from '~/ui/layouts/footer'
import { MainMenu } from '~/ui/layouts/main-menu'

interface MainLayoutProps {
  children?: ReactNode
  className?: string
}
export type Ref = HTMLDivElement

const MainLayout = forwardRef<Ref, MainLayoutProps>(({ children, className, ...other }, ref) => {
  const user = useUser()

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
        <span className="ml-auto mr-8 inline-block w-[90px] overflow-hidden overflow-ellipsis sm:w-auto">
          {user.email}
        </span>
        <ThemeSwitch style={{ marginRight: '1rem' }} />
        <MainMenu />
      </AppBar>
      <main id="main-content" className="flex flex-1 flex-col pt-[58px]">
        <Section className="breadcrumb-trail pt-4">
          <Container className="prose dark:prose-invert">
            <BreadcrumbTrail />
          </Container>
        </Section>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
})

MainLayout.displayName = 'MainLayout'

export default MainLayout
