import { Outlet } from '@remix-run/react'

import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import PublicLayout from '~/ui/layouts/public-layout'

export default function Session() {
  return (
    <PublicLayout>
      <Section className="flex-1">
        <Container>
          <Outlet />
        </Container>
      </Section>
    </PublicLayout>
  )
}
