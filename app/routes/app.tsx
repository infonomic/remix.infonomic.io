import type { LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { useCatch } from '@remix-run/react'

import { requireUserId } from '~/session.server'

import { Container } from '~/ui/components/container'
import { Section } from '~/ui/components/section'
import ErrorLayout from '~/ui/layouts/error-layout'
import MainLayout from '~/ui/layouts/main-layout'

/**
 * loader
 * @param param0
 * @returns
 */
export async function loader({ request }: LoaderArgs) {
  await requireUserId(request)
  return null
}

/**
 * Index
 * @returns
 */
export default function Account() {
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

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 403) {
    return (
      <ErrorLayout>
        <div>
          <h1>Unauthorized</h1>
          <p>Oops. You don&apos;t have permission to view this page.</p>
        </div>
      </ErrorLayout>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
