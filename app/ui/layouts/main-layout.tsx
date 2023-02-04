import { forwardRef } from 'react'
import type { ReactNode } from 'react'

import { Link } from '@remix-run/react'

import cx from 'classnames'
import { useUser } from '~/utils/utils'

import { BreadcrumbTrail } from '~/ui/components/breadcrumbs/breadcrumb-trail'
import { Button } from '~/ui/components/button'
import { Container } from '~/ui/components/container'
import { ScrollToTop } from '~/ui/components/scroll-to-top'
import { Section } from '~/ui/components/section'
import { AppBar } from '~/ui/layouts/app-bar'
import { Footer } from '~/ui/layouts/footer'
import { MainMenu } from '~/ui/layouts/main-menu'
import { ThemeSwitch } from '~/ui/theme/theme-provider'

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
        <Button
          asChild
          variant="text"
          intent="secondary"
          className="text-base hover:bg-amber-400/50 dark:hover:bg-gray-500/20"
        >
          <Link to={{ pathname: '/' }}>Home</Link>
        </Button>

        <Button
          asChild
          variant="text"
          intent="secondary"
          className="text-base hover:bg-amber-400/50 dark:hover:bg-gray-500/20"
        >
          <Link to={{ pathname: '/about' }}>About</Link>
        </Button>
        <span className="ml-auto mr-8 hidden w-[90px] overflow-hidden overflow-ellipsis sm:inline-block sm:w-auto">
          {user.email}
        </span>
        <ThemeSwitch className="mr-6 ml-auto sm:ml-0" />
        <MainMenu />
      </AppBar>
      <main id="main-content" className="flex flex-1 flex-col pt-[63px]">
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
