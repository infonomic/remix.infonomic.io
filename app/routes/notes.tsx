import { Outlet } from '@remix-run/react'

import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import MainLayout from '~/ui/layouts/main-layout'

/**
 * NotesPage template route
 * @returns
 */
export default function NotesPage() {
  return (
    <MainLayout>
      <Section className="flex flex-1 flex-col py-4">
        <Container className="prose dark:prose-invert">
          <Outlet />
        </Container>
      </Section>
    </MainLayout>
  )
}
